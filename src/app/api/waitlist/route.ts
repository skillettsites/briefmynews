import { getSupabaseServer } from "@/lib/supabase";

function cleanEnv(value: string | undefined): string {
  return (value || "").replace(/\\n$/, "").trim();
}

async function sendConfirmation(email: string) {
  const apiKey = cleanEnv(process.env.RESEND_API_KEY);
  if (!apiKey) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BriefMyNews <hello@briefmynews.com>",
        to: email,
        subject: "You're on the list",
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1a1a1a;">
            <h1 style="font-size:22px;margin:0 0 16px;">Thanks for signing up.</h1>
            <p style="font-size:15px;line-height:1.55;color:#444;margin:0 0 16px;">
              You'll be the first to hear when BriefMyNews launches, a personalised news digest delivered to your inbox on your schedule.
            </p>
            <p style="font-size:15px;line-height:1.55;color:#444;margin:0 0 16px;">
              Pick your topics, choose your sources, set your frequency. We'll send you a single email when it's ready.
            </p>
            <p style="font-size:13px;color:#888;margin:24px 0 0;">
              You can unsubscribe any time by replying to this email.
            </p>
          </div>
        `,
      }),
    });
  } catch (err) {
    console.error("Resend confirmation failed:", err);
  }
}

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
    const cleanEmail = email.toLowerCase().trim();

    const { error } = await supabase.from("bmn_waitlist").upsert(
      {
        email: cleanEmail,
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
        { error: "Failed to save your email. Please try again." },
        { status: 500 }
      );
    }

    await sendConfirmation(cleanEmail);

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
