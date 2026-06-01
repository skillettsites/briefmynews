import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Vercel env vars sometimes round-trip with a trailing literal "\n" appended
// (see ~/.claude/projects/.../memory/pcc_hbc_parity_qa_2026-05-28.md). Strip
// it defensively or auth/REST calls fail with "Invalid API key".
function clean(v: string | undefined): string {
  return (v || "").replace(/\\n$/, "").trim();
}

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const key = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    if (!url || !key) {
      return createClient("https://placeholder.supabase.co", "placeholder");
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export function getSupabaseServer(): SupabaseClient {
  const url = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceKey =
    clean(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
    clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!url || !serviceKey) {
    return createClient("https://placeholder.supabase.co", "placeholder");
  }
  return createClient(url, serviceKey);
}
