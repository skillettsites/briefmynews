import { getSupabaseServer } from "@/lib/supabase";
import { getUserById } from "@/lib/admin";
import { sourceLimit } from "@/lib/limits";

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServer();
    const body = await request.json();
    const { user_id, source_id, enabled } = body;

    if (!user_id || source_id === undefined) {
      return Response.json(
        { error: "user_id and source_id are required" },
        { status: 400 }
      );
    }

    // Enforce the free-tier source cap when enabling a new source.
    if (enabled) {
      const user = await getUserById(user_id);
      const tier = user?.tier === "pro" ? "pro" : "free";
      const limit = sourceLimit(tier);
      if (limit !== Infinity) {
        const { data: current } = await supabase
          .from("bmn_user_sources")
          .select("source_id, enabled")
          .eq("user_id", user_id)
          .eq("enabled", true);
        const alreadyEnabled = (current || []).some((r) => r.source_id === source_id);
        if (!alreadyEnabled && (current || []).length >= limit) {
          return Response.json(
            {
              error: `Your plan allows up to ${limit} sources. Upgrade to Pro for unlimited sources.`,
              code: "source_limit",
              limit,
            },
            { status: 403 }
          );
        }
      }
    }

    const { error } = await supabase.from("bmn_user_sources").upsert(
      {
        user_id,
        source_id,
        enabled: enabled ?? true,
      },
      { onConflict: "user_id,source_id" }
    );

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
