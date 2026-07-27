import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("boards").select("id").limit(1);

    if (error) {
      return NextResponse.json(
        { success: false, message: "Supabase query failed", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Supabase connection OK", data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Supabase is not configured or connection failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}
