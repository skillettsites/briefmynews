// Free vs Pro plan limits. Single source of truth, used by the dashboard API
// routes (to block over-limit changes) and the digest builder (to clamp).

export const FREE_TOPIC_LIMIT = 3;
export const FREE_SOURCE_LIMIT = 5;
export const FREE_FREQUENCIES = ["weekly"] as const;
export const PRO_FREQUENCIES = ["daily", "weekly", "monthly"] as const;

export function topicLimit(tier: "free" | "pro"): number {
  return tier === "pro" ? Infinity : FREE_TOPIC_LIMIT;
}

export function sourceLimit(tier: "free" | "pro"): number {
  return tier === "pro" ? Infinity : FREE_SOURCE_LIMIT;
}

export function allowedFrequency(tier: "free" | "pro", freq: string): string {
  if (tier === "pro") {
    return (PRO_FREQUENCIES as readonly string[]).includes(freq) ? freq : "weekly";
  }
  return "weekly";
}
