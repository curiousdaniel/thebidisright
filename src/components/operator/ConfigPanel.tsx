"use client";

import { useState } from "react";
import { GameConfig } from "@/types/operator";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Save } from "lucide-react";

interface ConfigPanelProps {
  config: GameConfig;
  onSave: (config: Partial<GameConfig>) => void;
}

export default function ConfigPanel({ config, onSave }: ConfigPanelProps) {
  const [form, setForm] = useState(config);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#F1F1F5]">
            Game Settings
          </h3>
        </CardHeader>
        <CardContent className="space-y-5">
          <ToggleField
            label="Show Current High Bid"
            description="Players see the current high bid on lot cards"
            checked={form.show_current_bid}
            onChange={(v) => setForm({ ...form, show_current_bid: v })}
          />

          <SelectField
            label="Prediction Lockout Window"
            value={String(form.lockout_minutes)}
            options={[
              { value: "0", label: "No lockout" },
              { value: "15", label: "15 minutes" },
              { value: "30", label: "30 minutes" },
              { value: "60", label: "60 minutes" },
            ]}
            onChange={(v) => setForm({ ...form, lockout_minutes: Number(v) })}
          />

          <SelectField
            label="Crowd Stats Visibility"
            value={form.crowd_stats_visibility}
            options={[
              { value: "hidden", label: "Hidden" },
              { value: "after_lockin", label: "After Lock-in" },
              { value: "always", label: "Always visible" },
            ]}
            onChange={(v) =>
              setForm({
                ...form,
                crowd_stats_visibility: v as GameConfig["crowd_stats_visibility"],
              })
            }
          />

          <ToggleField
            label="Quick Play Enabled"
            description="Allow Random 5 speed rounds"
            checked={form.quick_play_enabled}
            onChange={(v) => setForm({ ...form, quick_play_enabled: v })}
          />

          <SelectField
            label="Season Mode"
            value={form.season_mode}
            options={[
              { value: "off", label: "Off" },
              { value: "monthly", label: "Monthly" },
              { value: "quarterly", label: "Quarterly" },
            ]}
            onChange={(v) =>
              setForm({
                ...form,
                season_mode: v as GameConfig["season_mode"],
              })
            }
          />

          <ToggleField
            label="Require Registration"
            description="Players must sign in to make predictions"
            checked={form.require_registration}
            onChange={(v) => setForm({ ...form, require_registration: v })}
          />

          <ToggleField
            label="Share Cards Enabled"
            description="Allow players to share result cards"
            checked={form.share_cards_enabled}
            onChange={(v) => setForm({ ...form, share_cards_enabled: v })}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save size={16} className="mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}

function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-[#F1F1F5]">{label}</p>
        {description && (
          <p className="text-xs text-[#555570] mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-[#D4A843]" : "bg-[#2A2A40]"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-[#F1F1F5]">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#0A0A0F] border border-[#2A2A40] rounded-lg px-3 py-1.5 text-sm text-[#F1F1F5] focus:outline-none focus:border-[#D4A843]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
