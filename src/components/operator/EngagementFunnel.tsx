"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatNumber } from "@/lib/utils";

interface EngagementFunnelProps {
  data: {
    registered: number;
    active: number;
    predictions_made: number;
    returned: number;
  } | null;
}

export default function EngagementFunnel({ data }: EngagementFunnelProps) {
  if (!data) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6 h-48" />
      </Card>
    );
  }

  const maxValue = Math.max(data.registered, 1);
  const steps = [
    { label: "Registered", value: data.registered, color: "bg-[#60A5FA]" },
    { label: "Active", value: data.active, color: "bg-[#D4A843]" },
    {
      label: "Made Predictions",
      value: data.predictions_made,
      color: "bg-emerald-400",
    },
    { label: "Returned", value: data.returned, color: "bg-purple-400" },
  ];

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-[#F1F1F5]">
          Player Engagement Funnel
        </h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step, i) => {
          const width = (step.value / maxValue) * 100;
          const conversionRate =
            i > 0 ? ((step.value / steps[i - 1].value) * 100).toFixed(0) : null;

          return (
            <div key={step.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-[#F1F1F5]">{step.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#F1F1F5]">
                    {formatNumber(step.value)}
                  </span>
                  {conversionRate && (
                    <span className="text-xs text-[#555570]">
                      ({conversionRate}%)
                    </span>
                  )}
                </div>
              </div>
              <div className="h-3 bg-[#1E1E30] rounded-full overflow-hidden">
                <div
                  className={`h-full ${step.color} rounded-full transition-all`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
