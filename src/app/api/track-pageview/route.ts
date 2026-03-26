import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function getDeviceType(ua: string): string {
  if (/Mobile|Android.*Mobile|iPhone|iPod/i.test(ua)) return "mobile";
  if (/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)) return "tablet";
  return "desktop";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const path = typeof body?.path === "string" ? body.path.slice(0, 500) : "/";
    const referrer = typeof body?.referrer === "string" ? body.referrer.slice(0, 500) : "";

    const geoCity = req.headers.get("x-vercel-ip-city") || null;
    const geoRegion = req.headers.get("x-vercel-ip-country-region") || null;
    const geoCountry = req.headers.get("x-vercel-ip-country") || null;
    const ua = req.headers.get("user-agent") || "";

    if (SUPABASE_URL && SUPABASE_KEY) {
      await fetch(`${SUPABASE_URL}/rest/v1/pageviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          site_id: "briefmynews",
          path,
          referrer: referrer || null,
          geo_city: geoCity ? decodeURIComponent(geoCity) : null,
          geo_region: geoRegion,
          geo_country: geoCountry,
          device_type: getDeviceType(ua),
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
