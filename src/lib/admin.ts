import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Admin (service-role) client. Used by cron + webhook routes that must read
// every user and write privileged state. Never import into client components.
let _admin: SupabaseClient | null = null;

export function getAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !key) {
    return createClient("https://placeholder.supabase.co", "placeholder");
  }
  if (!_admin) {
    _admin = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _admin;
}

export interface AppUser {
  id: string;
  email: string;
  tier: "free" | "pro";
  unsubscribed: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

function toAppUser(u: {
  id: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
}): AppUser {
  const meta = u.app_metadata || {};
  return {
    id: u.id,
    email: u.email || "",
    tier: meta.tier === "pro" ? "pro" : "free",
    unsubscribed: meta.unsubscribed === true,
    stripeCustomerId: (meta.stripe_customer_id as string) || undefined,
    stripeSubscriptionId: (meta.stripe_subscription_id as string) || undefined,
  };
}

// We store tier / stripe ids / unsubscribe state in Supabase Auth
// app_metadata so the product needs no schema migration. The Auth admin API
// is the source of truth for these fields.
export async function listAllUsers(): Promise<AppUser[]> {
  const admin = getAdmin();
  const users: AppUser[] = [];
  let page = 1;
  // perPage max is 1000; paginate defensively.
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`listUsers: ${error.message}`);
    const batch = data?.users || [];
    for (const u of batch) users.push(toAppUser(u));
    if (batch.length < 1000) break;
    page += 1;
  }
  return users;
}

export async function getUserById(id: string): Promise<AppUser | null> {
  const { data, error } = await getAdmin().auth.admin.getUserById(id);
  if (error || !data?.user) return null;
  return toAppUser(data.user);
}

export async function findUserByEmail(email: string): Promise<AppUser | null> {
  const target = email.trim().toLowerCase();
  const admin = getAdmin();
  let page = 1;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`findUserByEmail: ${error.message}`);
    const batch = data?.users || [];
    const hit = batch.find((u) => (u.email || "").toLowerCase() === target);
    if (hit) return toAppUser(hit);
    if (batch.length < 1000) return null;
    page += 1;
  }
}

export async function setUserMeta(
  id: string,
  patch: Record<string, unknown>
): Promise<void> {
  const admin = getAdmin();
  const { data } = await admin.auth.admin.getUserById(id);
  const existing = data?.user?.app_metadata || {};
  const { error } = await admin.auth.admin.updateUserById(id, {
    app_metadata: { ...existing, ...patch },
  });
  if (error) throw new Error(`setUserMeta: ${error.message}`);
}
