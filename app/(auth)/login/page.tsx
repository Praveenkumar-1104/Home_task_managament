import AuthForm from "@/components/auth/AuthForm";
import SetupBanner from "@/components/common/SetupBanner";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default function LoginPage() {
  return <main className="w-full">{isSupabaseConfigured ? <AuthForm /> : <SetupBanner />}</main>;
}
