import { getSupabaseServer } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source } = body;

    if (!email || typeof email !== "string") {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email address" }, { status: 400 });
    }

    const geo_city = request.headers.get('x-vercel-ip-city') || null;
    const geo_region = request.headers.get('x-vercel-ip-country-region') || null;
    const geo_country = request.headers.get('x-vercel-ip-country') || null;

    const supabase = getSupabaseServer();

    const { error } = await supabase.from("bmn_waitlist").upsert(
      {
        email: email.toLowerCase().trim(),
        source: source || "website",
        geo_city,
        geo_region,
        geo_country,
      },
      { onConflict: "email" }
    );

    if (error) {
      console.error("Waitlist insert error:", error);
      return Response.json(
        { error: "Failed to join waitlist. Please try again." },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
