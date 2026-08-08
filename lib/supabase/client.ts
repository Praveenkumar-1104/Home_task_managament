import { createBrowserClient } from "@supabase/ssr";

// Browser (Client Component) Supabase client.
// Stores the auth session in cookies so the server, proxy, and Server
// Components can all read who is logged in.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
