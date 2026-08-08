import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// Logs a user in purely by matching their email against the `members` table —
// no password, no emailed link. Anyone who knows a member's email can sign in
// as them; this endpoint intentionally has no second verification step.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const normalizedEmail = body?.email?.toString().trim().toLowerCase();

  if (!normalizedEmail) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: member } = await supabase
    .from("members")
    .select("id, name, active")
    .ilike("email", normalizedEmail)
    .maybeSingle();

  if (!member || !member.active) {
    return NextResponse.json(
      { error: "This email isn't part of a household yet. Ask an admin to add you as a member." },
      { status: 403 }
    );
  }

  const admin = getSupabaseAdmin();

  const { data: link, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: normalizedEmail,
    options: { data: { full_name: member.name } },
  });

  const tokenHash = (link as any)?.properties?.hashed_token;
  if (linkError || !tokenHash) {
    return NextResponse.json({ error: linkError?.message ?? "Could not sign in." }, { status: 500 });
  }

  const { error: verifyError } = await supabase.auth.verifyOtp({
    type: "magiclink",
    token_hash: tokenHash,
  });

  if (verifyError) {
    return NextResponse.json({ error: verifyError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
