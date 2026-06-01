import { NextRequest, NextResponse } from "next/server";
import { verifyUnsubToken } from "@/lib/unsubscribe";
import { setUserMeta } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One-click unsubscribe (RFC 8058). Gmail/Yahoo POST here; humans clicking the
// footer link hit GET. Both flip app_metadata.unsubscribed = true.
async function unsubscribe(token: string | null): Promise<boolean> {
  if (!token) return false;
  const userId = verifyUnsubToken(token);
  if (!userId) return false;
  try {
    await setUserMeta(userId, { unsubscribed: true });
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const ok = await unsubscribe(token);
  return NextResponse.json({ ok }, { status: ok ? 200 : 400 });
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const ok = await unsubscribe(token);
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribe</title></head>
  <body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f3f4f6;margin:0;padding:48px 20px;text-align:center;color:#1a1a2e;">
    <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;">
      <div style="font-size:22px;font-weight:800;margin-bottom:16px;">Brief<span style="color:#60a5fa;">My</span>News</div>
      ${ok
        ? `<h1 style="font-size:20px;">You're unsubscribed</h1><p style="color:#4b5563;">You won't receive any more digest emails. Changed your mind? <a href="https://briefmynews.com/dashboard" style="color:#2563eb;">Re-enable in your dashboard</a>.</p>`
        : `<h1 style="font-size:20px;">Link not valid</h1><p style="color:#4b5563;">This unsubscribe link is invalid or expired. You can manage email preferences in your <a href="https://briefmynews.com/dashboard" style="color:#2563eb;">dashboard</a>.</p>`}
    </div>
  </body></html>`;
  return new NextResponse(html, { status: ok ? 200 : 400, headers: { "Content-Type": "text/html" } });
}
