import { getAdmin } from "@/lib/admin";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(v: string | undefined): string {
  return (v || "").replace(/\\n$/, "").trim();
}

// Sends a 6-digit sign-in code. We mint the code via the admin API and deliver
// it ourselves via Resend (branded, on-domain), instead of Supabase's built-in
// magic-link email — that link routes through the SHARED project's Site URL
// (another domain) and lands users on the wrong site.
export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    email = String(body.email || "").trim().toLowerCase();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    const admin = getAdmin();
    // The user must exist for a code to be minted. Create (auto-confirmed) if new.
    await admin.auth.admin.createUser({ email, email_confirm: true }).catch(() => {});

    const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email });
    const otp = data?.properties?.email_otp;
    if (error || !otp) {
      return Response.json({ error: "Could not start sign in. Try again." }, { status: 500 });
    }

    const resendKey = clean(process.env.RESEND_API_KEY);
    if (resendKey) {
      await new Resend(resendKey).emails.send({
        from: "BriefMyNews <hello@briefmynews.com>",
        to: email,
        subject: `${otp} is your BriefMyNews sign-in code`,
        html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:0 auto;padding:28px 20px;color:#1a1a1a">
          <div style="font-size:20px;font-weight:800;margin-bottom:14px">Brief<span style="color:#2563eb">My</span>News</div>
          <h1 style="font-size:19px;margin:0 0 10px">Your sign-in code</h1>
          <p style="color:#4b5563;margin:0 0 16px;line-height:1.55">Enter this code to sign in. It expires in about an hour.</p>
          <div style="font-size:34px;font-weight:800;letter-spacing:8px;background:#eff6ff;color:#2563eb;border-radius:12px;text-align:center;padding:18px 0">${otp}</div>
          <p style="color:#9ca3af;font-size:13px;margin:18px 0 0">If you didn't request this, you can ignore this email.</p>
        </div>`,
      }).catch((e) => console.error("send-code resend failed:", (e as Error).message));
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("send-code error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
