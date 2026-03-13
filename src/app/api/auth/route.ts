import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const { action, email, password, displayName } = body;

  const supabase = await createServerSupabase();

  if (action === "signup") {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      const admin = createAdminClient();
      await admin.from("players").insert({
        supabase_auth_id: data.user.id,
        display_name: displayName || email.split("@")[0],
      });
    }

    return NextResponse.json({ success: true, user: data.user });
  }

  if (action === "login") {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: data.user });
  }

  if (action === "logout") {
    await supabase.auth.signOut();
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
