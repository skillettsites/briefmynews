"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { SOURCES, CATEGORIES, BIAS_LABELS } from "@/lib/sources-data";
import type { User } from "@supabase/supabase-js";

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

  // Sources state
  const [enabledSources, setEnabledSources] = useState<Set<string>>(new Set());

  // Settings state
  const [displayName, setDisplayName] = useState("");
  const [politicalLean, setPoliticalLean] = useState("centre");

  const loadUserData = useCallback(async (userId: string) => {
    // Load topics
    const { data: topicData } = await supabase
      .from("user_topics")
      .select("topic, frequency")
      .eq("user_id", userId);
    if (topicData) setTopics(topicData);

    // Load source preferences
    const { data: sourceData } = await supabase
      .from("user_sources")
      .select("source_id, enabled")
      .eq("user_id", userId);
    if (sourceData) {
      const enabled = new Set<string>();
      sourceData.forEach((s: { source_id: number; enabled: boolean }) => {
        if (s.enabled) enabled.add(String(s.source_id));
      });
      setEnabledSources(enabled);
    }

    // Load profile
    const { data: profile } = await supabase
      .from("profiles")
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
    await fetch("/api/user/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, topics }),
    });
  }

  function toggleSource(slug: string) {
    const updated = new Set(enabledSources);
    if (updated.has(slug)) {
      updated.delete(slug);
    } else {
      updated.add(slug);
    }
    setEnabledSources(updated);
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
                        onChange={(e) => updateTopicFrequency(i, e.target.value)}
                        className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
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
          {CATEGORIES.map((category) => {
            const categorySources = SOURCES.filter(
              (s) => s.category === category.id
            );
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
                    onChange={(e) => updateTopicFrequency(i, e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
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
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Political Lean
            </h2>
            <p className="text-sm text-muted mb-4">
              This helps us understand your preferred editorial perspective. It
              does not filter out sources; it simply helps prioritise content
              that aligns with your interests.
            </p>
            <div className="flex gap-2 flex-wrap">
              {LEAN_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPoliticalLean(option.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    politicalLean === option.value
                      ? "bg-primary text-white"
                      : "border border-border text-muted hover:text-foreground"
                  }`}
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
