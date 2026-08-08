import AuthForm from "@/components/auth/AuthForm";
import SetupBanner from "@/components/common/SetupBanner";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default function HomePage() {
  return <main className="w-full">{isSupabaseConfigured ? <AuthForm /> : <SetupBanner />}</main>;
}
