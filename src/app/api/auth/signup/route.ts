import { createClient } from "@supabase/supabase-js";

function clean(v: string | undefined): string {
  return (v || "").replace(/\\n$/, "").trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const { email, password, displayName, topic } = await request.json();

    if (!email || typeof email !== "string") {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return Response.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email address" }, { status: 400 });
    }

    const url = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const serviceKey = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const resendKey = clean(process.env.RESEND_API_KEY);

    if (!url || !serviceKey) {
      return Response.json(
        { error: "Server misconfigured. Try again later." },
        { status: 500 }
      );
    }

    const admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const cleanEmail = email.toLowerCase().trim();
    const origin =
      request.headers.get("origin") ||
      `https://${request.headers.get("host") || "briefmynews.com"}`;

    const { data, error } = await admin.auth.admin.generateLink({
      type: "signup",
      email: cleanEmail,
      password,
      options: {
        data: displayName ? { display_name: displayName } : undefined,
        redirectTo: `${origin}/dashboard`,
      },
    });

    if (error || !data?.properties?.hashed_token) {
      const msg = error?.message || "";
      if (/registered|exists/i.test(msg)) {
        return Response.json(
          {
            error:
              "An account with that email already exists. Try logging in instead.",
          },
          { status: 409 }
        );
      }
      console.error("generateLink error:", error);
      return Response.json(
        { error: msg || "Could not create your account. Please try again." },
        { status: 500 }
      );
    }

    // Build our own confirmation URL so the click flow stays on briefmynews.com
    // (the shared Supabase project has its Site URL pointed at another domain,
    // so action_link would redirect users away).
    const topicParam =
      topic && typeof topic === "string" && topic.trim()
        ? `&topic=${encodeURIComponent(topic.trim().slice(0, 80))}`
        : "";
    const confirmUrl = `${origin}/auth/confirm?token_hash=${encodeURIComponent(
      data.properties.hashed_token
    )}&type=signup${topicParam}`;
    const safeLink = escapeHtml(confirmUrl);
    const safeName = displayName ? escapeHtml(String(displayName)) : "";
    const greeting = safeName ? `Hi ${safeName},` : "Hi,";

    if (resendKey) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "BriefMyNews <hello@briefmynews.com>",
            to: cleanEmail,
            subject: "Confirm your BriefMyNews account",
            html: `
              <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1a1a1a;">
                <h1 style="font-size:22px;margin:0 0 16px;">Confirm your email</h1>
                <p style="font-size:15px;line-height:1.55;color:#444;margin:0 0 20px;">
                  ${greeting} thanks for signing up to BriefMyNews. Click the button below to confirm your email and finish setting up your account.
                </p>
                <p style="margin:0 0 28px;">
                  <a href="${safeLink}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:8px;font-size:15px;">Confirm my email</a>
                </p>
                <p style="font-size:13px;line-height:1.5;color:#666;margin:0 0 8px;">
                  Or paste this link into your browser:
                </p>
                <p style="font-size:12px;line-height:1.5;color:#2563eb;word-break:break-all;margin:0 0 24px;">
                  ${safeLink}
                </p>
                <p style="font-size:12px;color:#888;margin:24px 0 0;border-top:1px solid #eee;padding-top:16px;">
                  If you didn't sign up for BriefMyNews, you can safely ignore this email.
                </p>
              </div>
            `,
          }),
        });
        if (!res.ok) {
          const body = await res.text();
          console.error("Resend confirmation send failed:", res.status, body);
        }
      } catch (err) {
        console.error("Resend confirmation fetch failed:", err);
      }
    } else {
      console.warn("RESEND_API_KEY not set; signup confirmation email skipped");
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("signup route error:", err);
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
