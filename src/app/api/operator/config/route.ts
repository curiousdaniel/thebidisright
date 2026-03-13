import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("game_config")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json(
      {
        id: 0,
        site_domain: "default",
        show_current_bid: false,
        lockout_minutes: 30,
        crowd_stats_visibility: "after_lockin",
        quick_play_enabled: true,
        season_mode: "off",
        max_predictions_per_day: null,
        require_registration: true,
        share_cards_enabled: true,
        operator_logo_url: null,
        operator_accent_color: null,
      }
    );
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("game_config")
    .select("id")
    .limit(1)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from("game_config")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  }

  const { data, error } = await supabase
    .from("game_config")
    .insert({ site_domain: "default", ...body })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
