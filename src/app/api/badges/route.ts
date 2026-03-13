import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: player } = await admin
    .from("players")
    .select("id")
    .eq("supabase_auth_id", user.id)
    .single();

  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  const { data: playerBadges } = await admin
    .from("player_badges")
    .select("*, badges(*)")
    .eq("player_id", player.id)
    .order("earned_at", { ascending: false });

  const { data: allBadges } = await admin
    .from("badges")
    .select("*")
    .order("id");

  return NextResponse.json({
    earned: playerBadges || [],
    all: allBadges || [],
  });
}
