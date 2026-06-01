import { getSupabaseServer } from "@/lib/supabase";
import { getUserById } from "@/lib/admin";
import { topicLimit, allowedFrequency } from "@/lib/limits";

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServer();
    const body = await request.json();
    const { user_id, topics } = body;

    if (!user_id || !Array.isArray(topics)) {
      return Response.json(
        { error: "user_id and topics array are required" },
        { status: 400 }
      );
    }

    const user = await getUserById(user_id);
    const tier = user?.tier === "pro" ? "pro" : "free";
    const limit = topicLimit(tier);

    if (topics.length > limit) {
      return Response.json(
        {
          error: `Your plan allows up to ${limit} topics. Upgrade to Pro for unlimited topics.`,
          code: "topic_limit",
          limit,
        },
        { status: 403 }
      );
    }

    // Delete existing topics and re-insert
    await supabase.from("bmn_user_topics").delete().eq("user_id", user_id);

    if (topics.length > 0) {
      const rows = topics.map((t: { topic: string; frequency: string }) => ({
        user_id,
        topic: t.topic,
        frequency: allowedFrequency(tier, t.frequency || "weekly"),
      }));

      const { error } = await supabase.from("bmn_user_topics").insert(rows);
      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
