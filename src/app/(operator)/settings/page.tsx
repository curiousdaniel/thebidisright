"use client";

import { useState, useEffect } from "react";
import { GameConfig } from "@/types/operator";
import ConfigPanel from "@/components/operator/ConfigPanel";
import { Settings } from "lucide-react";

const defaultConfig: GameConfig = {
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
  created_at: "",
  updated_at: "",
};

export default function SettingsPage() {
  const [config, setConfig] = useState<GameConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/operator/config");
        if (res.ok) {
          const data = await res.json();
          setConfig({ ...defaultConfig, ...data });
        }
      } catch {}
      setLoading(false);
    };

    fetchConfig();
  }, []);

  const handleSave = async (updates: Partial<GameConfig>) => {
    try {
      const res = await fetch("/api/operator/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const data = await res.json();
        setConfig({ ...defaultConfig, ...data });
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-[#1E1E30] rounded w-1/3" />
        <div className="h-64 bg-[#141420] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Settings className="text-[#D4A843]" size={24} />
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#F1F1F5]">
            Game Settings
          </h1>
          <p className="text-sm text-[#8888A0]">
            Configure game behavior for your platform
          </p>
        </div>
      </div>

      <ConfigPanel config={config} onSave={handleSave} />
    </div>
  );
}
