// Maps a source bias_rating to an AllSides-style dot colour + readable label.
// Used in the digest email to show each article's leaning at a glance.

export type Bias =
  | "left"
  | "centre-left"
  | "centre"
  | "centre-right"
  | "right";

const MAP: Record<string, { colour: string; label: string }> = {
  left: { colour: "#3B82F6", label: "Left" },
  "centre-left": { colour: "#60A5FA", label: "Centre-left" },
  "lean-left": { colour: "#60A5FA", label: "Centre-left" },
  centre: { colour: "#9CA3AF", label: "Centre" },
  center: { colour: "#9CA3AF", label: "Centre" },
  "centre-right": { colour: "#F59E0B", label: "Centre-right" },
  "lean-right": { colour: "#F59E0B", label: "Centre-right" },
  right: { colour: "#EF4444", label: "Right" },
};

export function biasStyle(rating?: string | null): { colour: string; label: string } {
  const key = (rating || "centre").toLowerCase().trim();
  return MAP[key] || MAP.centre;
}

// Political-lean weighting for ranking. Boost articles that match the user's
// preferred lean; gently de-prioritise the opposite end. Returns a multiplier.
export function leanWeight(userLean: string, articleBias?: string | null): number {
  const order = ["left", "centre-left", "centre", "centre-right", "right"];
  const norm = (b?: string | null) => {
    const k = (b || "centre").toLowerCase().replace("center", "centre").replace("lean-", "centre-");
    return order.indexOf(k) === -1 ? 2 : order.indexOf(k);
  };
  const u = norm(userLean);
  const a = norm(articleBias);
  const distance = Math.abs(u - a); // 0..4
  // 1.15 for exact match down to 0.9 for opposite end.
  return 1.15 - distance * 0.0625;
}
