import { getSupabaseServer } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServer();
    const body = await request.json();
    const { user_id, display_name, political_lean } = body;

    if (!user_id) {
      return Response.json({ error: "user_id is required" }, { status: 400 });
    }

    const validLeans = ["left", "centre-left", "centre", "centre-right", "right"];
    if (political_lean && !validLeans.includes(political_lean)) {
      return Response.json(
        { error: "Invalid political lean value" },
        { status: 400 }
      );
    }

    const updates: Record<string, string> = { updated_at: new Date().toISOString() };
    if (display_name !== undefined) updates.display_name = display_name;
    if (political_lean !== undefined) updates.political_lean = political_lean;

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user_id, ...updates }, { onConflict: "id" });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
