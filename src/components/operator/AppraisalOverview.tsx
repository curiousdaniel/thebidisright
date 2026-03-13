"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatPrice, formatNumber, formatCompact } from "@/lib/utils";
import { PortfolioData } from "@/types/operator";
import { TrendingUp, Users, BarChart3, Target } from "lucide-react";

interface AppraisalOverviewProps {
  data: PortfolioData | null;
}

export default function AppraisalOverview({ data }: AppraisalOverviewProps) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 h-32" />
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Total Appraised Value",
      value: formatPrice(data.total_inventory_value),
      icon: <TrendingUp size={20} />,
      color: "text-[#D4A843]",
    },
    {
      label: "Active Players",
      value: formatNumber(data.engagement_funnel.active),
      icon: <Users size={20} />,
      color: "text-[#60A5FA]",
    },
    {
      label: "Total Predictions",
      value: formatCompact(data.engagement_funnel.predictions_made),
      icon: <BarChart3 size={20} />,
      color: "text-emerald-400",
    },
    {
      label: "Avg Crowd Accuracy",
      value:
        data.historical_accuracy.length > 0
          ? `${data.historical_accuracy[data.historical_accuracy.length - 1].accuracy.toFixed(1)}%`
          : "N/A",
      icon: <Target size={20} />,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className={stat.color}>{stat.icon}</span>
              </div>
              <p className="text-2xl font-bold font-mono text-[#F1F1F5]">
                {stat.value}
              </p>
              <p className="text-xs text-[#555570] mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category breakdown */}
      {data.category_breakdown.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#F1F1F5]">
              Value by Category
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.category_breakdown.map((cat) => {
                const pct =
                  (cat.value / data.total_inventory_value) * 100 || 0;
                return (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#F1F1F5]">{cat.category}</span>
                      <span className="font-mono text-[#8888A0]">
                        {formatPrice(cat.value)} ({cat.count} lots)
                      </span>
                    </div>
                    <div className="h-2 bg-[#1E1E30] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D4A843] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top predictors */}
      {data.top_predictors.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#F1F1F5]">
              Top Predictors
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.top_predictors.map((p, i) => (
                <div
                  key={p.player_id}
                  className="flex items-center justify-between py-2 border-b border-[#2A2A40] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-[#555570] w-6">
                      {i + 1}
                    </span>
                    <span className="text-sm text-[#F1F1F5]">
                      {p.display_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-mono text-emerald-400">
                      {p.accuracy.toFixed(1)}%
                    </span>
                    <span className="text-[#555570]">
                      {p.predictions} predictions
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
