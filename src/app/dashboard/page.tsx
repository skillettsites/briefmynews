"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, BIAS_LABELS } from "@/lib/sources-data";
import type { User } from "@supabase/supabase-js";

interface DbSource {
  id: number;
  slug: string;
  name: string;
  category: string;
  bias_rating: string;
}

type Tab = "digests" | "topics" | "sources" | "schedule" | "settings";

interface UserTopic {
  topic: string;
  frequency: string;
}

const LEAN_OPTIONS = [
  { value: "left", label: "Left" },
  { value: "centre-left", label: "Centre-Left" },
  { value: "centre", label: "Centre" },
  { value: "centre-right", label: "Centre-Right" },
  { value: "right", label: "Right" },
];

const POPULAR_TOPICS = [
  "UK Politics",
  "US Politics",
  "Climate Change",
  "Artificial Intelligence",
  "Cryptocurrency",
  "Premier League",
  "UK Economy",
  "NHS",
  "Technology Startups",
  "Space Exploration",
  "Renewable Energy",
  "Housing Market",
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("topics");

  // Topics state
  const [topics, setTopics] = useState<UserTopic[]>([]);
  const [newTopic, setNewTopic] = useState("");

  // Sources state. enabledSources keys are source slugs (from bmn_sources).
  // sourceIdBySlug bridges to the DB layer (bmn_user_sources stores source_id).
  const [enabledSources, setEnabledSources] = useState<Set<string>>(new Set());
  const [sourceIdBySlug, setSourceIdBySlug] = useState<Map<string, number>>(new Map());
  const [sourceError, setSourceError] = useState<string>("");
  const [allSources, setAllSources] = useState<DbSource[]>([]);

  // Settings state
  const [displayName, setDisplayName] = useState("");
  const [politicalLean, setPoliticalLean] = useState("centre");

  // Upgrade prompt shown inline when a free user tries to use a Pro-only
  // feature (extra topic/source, daily/monthly schedule, political lean).
  const [upgradePrompt, setUpgradePrompt] = useState<string>("");

  const tier: "free" | "pro" =
    (user?.app_metadata?.tier as "pro" | undefined) === "pro" ? "pro" : "free";
  const isPro = tier === "pro";
  const topicCap = isPro ? 5 : 1;
  const sourceCap = isPro ? 10 : 1;

  const loadUserData = useCallback(async (userId: string) => {
    // Load topics
    const { data: topicData } = await supabase
      .from("bmn_user_topics")
      .select("topic, frequency")
      .eq("user_id", userId);
    if (topicData) setTopics(topicData);

    // Load all sources from DB — used both for rendering the picker (so newly
    // added sources show up without a code change) and for the slug<->id
    // bridge that /api/user/sources requires.
    const { data: srcRows } = await supabase
      .from("bmn_sources")
      .select("id, slug, name, category, bias_rating")
      .order("category", { ascending: true })
      .order("name", { ascending: true });
    const slugById = new Map<number, string>();
    const idBySlug = new Map<string, number>();
    (srcRows || []).forEach((s: DbSource) => {
      slugById.set(s.id, s.slug);
      idBySlug.set(s.slug, s.id);
    });
    setSourceIdBySlug(idBySlug);
    setAllSources((srcRows as DbSource[]) || []);

    // Load source preferences (translate stored source_id -> slug for the UI).
    const { data: sourceData } = await supabase
      .from("bmn_user_sources")
      .select("source_id, enabled")
      .eq("user_id", userId);
    if (sourceData) {
      const enabled = new Set<string>();
      sourceData.forEach((s: { source_id: number; enabled: boolean }) => {
        if (s.enabled) {
          const slug = slugById.get(s.source_id);
          if (slug) enabled.add(slug);
        }
      });
      setEnabledSources(enabled);
    }

    // Load profile
    const { data: profile } = await supabase
      .from("bmn_profiles")
      .select("display_name, political_lean")
      .eq("id", userId)
      .single();
    if (profile) {
      setDisplayName(profile.display_name || "");
      setPoliticalLean(profile.political_lean || "centre");
    }
  }, []);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        window.location.href = "/login";
        return;
      }

      setUser(currentUser);
      await loadUserData(currentUser.id);
      setLoading(false);
    }
    checkAuth();
  }, [loadUserData]);

  function addTopic() {
    if (!newTopic.trim()) return;
    if (topics.length >= topicCap) {
      setUpgradePrompt(
        isPro
          ? `Pro is capped at ${topicCap} topics. Remove one before adding another.`
          : `Free plan is 1 topic. Upgrade to Pro for up to 5 topics.`
      );
      return;
    }
    setUpgradePrompt("");
    setTopics([...topics, { topic: newTopic.trim(), frequency: "weekly" }]);
    setNewTopic("");
  }

  function removeTopic(index: number) {
    setTopics(topics.filter((_, i) => i !== index));
  }

  function updateTopicFrequency(index: number, frequency: string) {
    const updated = [...topics];
    updated[index].frequency = frequency;
    setTopics(updated);
  }

  async function saveTopics() {
    if (!user) return;
    const res = await fetch("/api/user/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, topics }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setUpgradePrompt(data.error || "Could not save your topics.");
    } else {
      setUpgradePrompt("");
    }
  }

  function updateTopicFrequencySafe(index: number, frequency: string) {
    if (!isPro && frequency !== "weekly") {
      setUpgradePrompt(
        "Daily and monthly delivery are Pro features. Upgrade to unlock."
      );
      return;
    }
    setUpgradePrompt("");
    updateTopicFrequency(index, frequency);
  }

  async function toggleSource(slug: string) {
    if (!user) return;
    const sourceId = sourceIdBySlug.get(slug);
    if (!sourceId) {
      setSourceError("Source not recognised. Refresh and try again.");
      return;
    }
    const wasEnabled = enabledSources.has(slug);
    // Client-side guard: free is 1 source, Pro is 10. Server enforces too.
    if (!wasEnabled && enabledSources.size >= sourceCap) {
      setSourceError(
        isPro
          ? `Pro is capped at ${sourceCap} sources. Untick one before adding another.`
          : `Free plan is 1 source. Upgrade to Pro for up to 10 sources.`
      );
      return;
    }
    const optimistic = new Set(enabledSources);
    if (wasEnabled) optimistic.delete(slug);
    else optimistic.add(slug);
    setEnabledSources(optimistic);
    setSourceError("");

    try {
      const res = await fetch("/api/user/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          source_id: sourceId,
          enabled: !wasEnabled,
        }),
      });
      if (!res.ok) {
        // Roll back the optimistic toggle and surface the API error.
        setEnabledSources(enabledSources);
        const data = await res.json().catch(() => ({}));
        setSourceError(data.error || "Could not save that change.");
      }
    } catch {
      setEnabledSources(enabledSources);
      setSourceError("Network error. Please try again.");
    }
  }

  async function saveSettings() {
    if (!user) return;
    await fetch("/api/user/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        display_name: displayName,
        political_lean: politicalLean,
      }),
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function upgradeToPro(plan: "annual" | "monthly") {
    if (!user) return;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Could not start checkout. Please try again shortly.");
      }
    } catch {
      alert("Could not start checkout. Please try again shortly.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "digests", label: "My Digests" },
    { id: "topics", label: "Topics" },
    { id: "sources", label: "Sources" },
    { id: "schedule", label: "Schedule" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted">
            Welcome back{displayName ? `, ${displayName}` : ""}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          Log out
        </button>
      </div>

      {/* Upgrade to Pro — hidden when the user is already Pro */}
      {!isPro && (
        <div className="mb-8 flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Upgrade to BriefMyNews Pro</p>
            <p className="text-sm text-muted">
              Up to 5 topics and 10 sources, daily or monthly digests, and political-lean weighting.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => upgradeToPro("annual")}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              £29.99/yr
            </button>
            <button
              onClick={() => upgradeToPro("monthly")}
              className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              £4.99/mo
            </button>
          </div>
        </div>
      )}
      {isPro && (
        <div className="mb-8 rounded-xl border border-success/30 bg-success/5 px-5 py-3 text-sm text-success">
          You're on BriefMyNews Pro. Thanks for supporting the project.
        </div>
      )}

      {/* Generic upgrade-prompt banner (shown when a free user trips a gate) */}
      {upgradePrompt && !isPro && (
        <div className="mb-6 flex flex-col gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-foreground">{upgradePrompt}</p>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => upgradeToPro("annual")}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
            >
              Upgrade — £29.99/yr
            </button>
            <button
              onClick={() => upgradeToPro("monthly")}
              className="rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
            >
              £4.99/mo
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-border mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Digests Tab */}
      {activeTab === "digests" && (
        <div className="glass-card p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            No digests yet
          </h2>
          <p className="mt-2 text-sm text-muted">
            Add some topics and sources, then your first digest will arrive on
            schedule.
          </p>
        </div>
      )}

      {/* Topics Tab */}
      {activeTab === "topics" && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Your Topics
            </h2>

            {/* Add topic */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="e.g. AI regulation in the EU"
                className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                onKeyDown={(e) => e.key === "Enter" && addTopic()}
              />
              <button
                onClick={addTopic}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
              >
                Add
              </button>
            </div>

            {/* Topic list */}
            {topics.length === 0 ? (
              <p className="text-sm text-muted py-4">
                No topics added yet. Type a topic above or pick from popular
                suggestions below.
              </p>
            ) : (
              <div className="space-y-2">
                {topics.map((topic, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
                  >
                    <span className="text-sm text-foreground font-medium">
                      {topic.topic}
                    </span>
                    <div className="flex items-center gap-3">
                      <select
                        value={topic.frequency}
                        onChange={(e) => updateTopicFrequencySafe(i, e.target.value)}
                        className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
                      >
                        <option value="daily">Daily{isPro ? "" : " — Pro"}</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly{isPro ? "" : " — Pro"}</option>
                      </select>
                      <button
                        onClick={() => removeTopic(i)}
                        className="text-danger hover:text-danger/80 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={saveTopics}
              className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
            >
              Save Topics
            </button>
          </div>

          {/* Popular topics */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Popular Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => {
                    if (!topics.find((t) => t.topic === topic)) {
                      setTopics([...topics, { topic, frequency: "weekly" }]);
                    }
                  }}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                  + {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sources Tab */}
      {activeTab === "sources" && (
        <div className="space-y-6">
          <div className="glass-card p-5">
            <p className="text-sm text-foreground">
              <strong>{enabledSources.size}</strong> of {sourceCap} source
              {sourceCap === 1 ? "" : "s"} selected.{" "}
              {isPro ? (
                <span className="text-muted">Pro plan: up to 10 sources.</span>
              ) : (
                <span className="text-muted">
                  Free plan: 1 source. Upgrade to Pro for up to 10.
                </span>
              )}
            </p>
            {sourceError && (
              <p className="mt-2 text-sm text-danger">{sourceError}</p>
            )}
          </div>
          {CATEGORIES.map((category) => {
            const categorySources = allSources.filter(
              (s) => s.category === category.id
            );
            if (categorySources.length === 0) return null;
            return (
              <div key={category.id} className="glass-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  {category.name}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {categorySources.map((source) => {
                    const bias = BIAS_LABELS[source.bias_rating];
                    const isEnabled = enabledSources.has(source.slug);
                    return (
                      <button
                        key={source.slug}
                        onClick={() => toggleSource(source.slug)}
                        className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-all ${
                          isEnabled
                            ? "border-primary bg-primary/5"
                            : "border-border bg-surface hover:border-border-hover"
                        }`}
                      >
                        <div>
                          <span className="text-sm font-medium text-foreground">
                            {source.name}
                          </span>
                          {bias && (
                            <span
                              className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-medium"
                              style={{
                                backgroundColor: `${bias.colour}20`,
                                color: bias.colour,
                              }}
                            >
                              {bias.label}
                            </span>
                          )}
                        </div>
                        <div
                          className={`h-5 w-5 rounded-full border-2 transition-colors ${
                            isEnabled
                              ? "border-primary bg-primary"
                              : "border-border"
                          }`}
                        >
                          {isEnabled && (
                            <svg
                              className="h-full w-full text-white p-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === "schedule" && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Delivery Schedule
          </h2>
          {topics.length === 0 ? (
            <p className="text-sm text-muted">
              Add some topics first, then configure their delivery schedule here.
            </p>
          ) : (
            <div className="space-y-3">
              {topics.map((topic, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
                >
                  <span className="text-sm font-medium text-foreground">
                    {topic.topic}
                  </span>
                  <select
                    value={topic.frequency}
                    onChange={(e) => updateTopicFrequencySafe(i, e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                  >
                    <option value="daily">Daily{isPro ? "" : " — Pro"}</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly{isPro ? "" : " — Pro"}</option>
                  </select>
                </div>
              ))}
              <button
                onClick={saveTopics}
                className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
              >
                Save Schedule
              </button>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full max-w-sm rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <p className="text-sm text-muted">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">
                Political Lean
              </h2>
              {!isPro && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  Pro
                </span>
              )}
            </div>
            <p className="text-sm text-muted mb-4">
              Weights articles toward your preferred editorial perspective in
              every digest. Doesn&apos;t filter out sources.
            </p>
            <div className="flex gap-2 flex-wrap">
              {LEAN_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    if (!isPro && option.value !== "centre") {
                      setUpgradePrompt(
                        "Political-lean weighting is a Pro feature. Upgrade to unlock."
                      );
                      return;
                    }
                    setUpgradePrompt("");
                    setPoliticalLean(option.value);
                  }}
                  disabled={!isPro && option.value !== "centre"}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    politicalLean === option.value
                      ? "bg-primary text-white"
                      : "border border-border text-muted hover:text-foreground"
                  } ${!isPro && option.value !== "centre" ? "opacity-50 cursor-not-allowed" : ""}`}
                  title={!isPro && option.value !== "centre" ? "Pro only" : undefined}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={saveSettings}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            Save Settings
          </button>
        </div>
      )}
    </div>
  );
}
