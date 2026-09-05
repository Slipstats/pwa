import { createBrowserClient } from "@supabase/ssr";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!clientInstance) {
    if (typeof window !== "undefined" && isSupabaseConfigured()) {
      clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
    } else {
      clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    }
  }
  return clientInstance;
}

export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    Boolean(url) &&
    !url?.includes("placeholder-project") &&
    Boolean(key) &&
    !key?.includes("placeholder-anon-key")
  );
};
