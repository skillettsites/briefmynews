// Free vs Pro plan limits. Single source of truth, used by the dashboard API
// routes (to block over-limit changes) and the digest builder (to clamp).
// Owner-confirmed 2026-06-02: free = 1 topic, 1 source, weekly only, no
// political-lean weighting. Pro = 5 topics, 10 sources, all frequencies,
// political-lean honoured.

export const FREE_TOPIC_LIMIT = 1;
export const PRO_TOPIC_LIMIT = 5;
export const FREE_SOURCE_LIMIT = 1;
export const PRO_SOURCE_LIMIT = 10;
export const FREE_FREQUENCIES = ["weekly"] as const;
export const PRO_FREQUENCIES = ["daily", "weekly", "monthly"] as const;

export function topicLimit(tier: "free" | "pro"): number {
  return tier === "pro" ? PRO_TOPIC_LIMIT : FREE_TOPIC_LIMIT;
}

export function sourceLimit(tier: "free" | "pro"): number {
  return tier === "pro" ? PRO_SOURCE_LIMIT : FREE_SOURCE_LIMIT;
}

export function allowedFrequency(tier: "free" | "pro", freq: string): string {
  if (tier === "pro") {
    return (PRO_FREQUENCIES as readonly string[]).includes(freq) ? freq : "weekly";
  }
  return "weekly";
}

export function politicalLeanAllowed(tier: "free" | "pro"): boolean {
  return tier === "pro";
}
