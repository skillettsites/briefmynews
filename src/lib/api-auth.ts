import { getSupabaseServer } from "@/lib/supabase";

/**
 * Resolve the calling user from their Supabase access token.
 * The user-preference APIs must never trust a user_id in the request body;
 * any caller could pass any id. The bearer token is the only identity proof.
 */
export async function getAuthedUserId(request: Request): Promise<string | null> {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return null;
  try {
    const { data, error } = await getSupabaseServer().auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user.id;
  } catch {
    return null;
  }
}
