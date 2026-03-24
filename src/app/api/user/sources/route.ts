import { getSupabaseServer } from "@/lib/supabase";

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

    const { error } = await supabase.from("user_sources").upsert(
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
