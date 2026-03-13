"use client";

import { LotAppraisalData } from "@/types/operator";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface LotAppraisalProps {
  data: LotAppraisalData | null;
}

export default function LotAppraisal({ data }: LotAppraisalProps) {
  if (!data) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6 h-64" />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#F1F1F5]">
              {data.title}
            </h2>
            {data.lot_number && (
              <span className="text-sm text-[#555570]">
                Lot #{data.lot_number}
              </span>
            )}
          </div>
          <Badge
            variant={data.status === "open" ? "green" : "default"}
            size="md"
          >
            {data.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <MetricCard
            label="Crowd Median"
            value={formatPrice(data.crowd_median)}
            color="text-[#60A5FA]"
          />
          <MetricCard
            label="Crowd Mean"
            value={formatPrice(data.crowd_mean)}
            color="text-[#60A5FA]"
          />
          <MetricCard
            label="Prediction Range"
            value={`${formatPrice(data.prediction_min)} — ${formatPrice(data.prediction_max)}`}
            color="text-[#8888A0]"
          />
          <MetricCard
            label="Std Deviation"
            value={formatPrice(data.std_deviation)}
            color="text-[#8888A0]"
          />
          <MetricCard
            label="Predictions"
            value={String(data.prediction_count)}
            color="text-[#F1F1F5]"
          />
          <MetricCard
            label="Confidence Score"
            value={`${data.confidence_score}%`}
            color="text-emerald-400"
          />
          {data.starting_bid && (
            <MetricCard
              label="vs Starting Bid"
              value={
                data.vs_starting_bid
                  ? `${data.vs_starting_bid}×`
                  : "N/A"
              }
              color="text-[#D4A843]"
            />
          )}
          {data.hammer_price && (
            <MetricCard
              label="vs Hammer Price"
              value={
                data.vs_hammer_price !== null
                  ? `${data.vs_hammer_price}% accurate`
                  : "N/A"
              }
              color="text-emerald-400"
            />
          )}
        </div>

        {/* Price comparison bar */}
        {(data.starting_bid || data.hammer_price) && (
          <div className="mt-6 space-y-2">
            <p className="text-xs text-[#555570]">Price Comparison</p>
            <div className="flex gap-3 items-end">
              {data.starting_bid && (
                <PriceBar
                  label="Starting"
                  value={data.starting_bid}
                  maxValue={Math.max(
                    data.starting_bid || 0,
                    data.hammer_price || 0,
                    data.crowd_median
                  )}
                  color="bg-[#2A2A40]"
                />
              )}
              <PriceBar
                label="Crowd"
                value={data.crowd_median}
                maxValue={Math.max(
                  data.starting_bid || 0,
                  data.hammer_price || 0,
                  data.crowd_median
                )}
                color="bg-[#60A5FA]"
              />
              {data.hammer_price && (
                <PriceBar
                  label="Hammer"
                  value={data.hammer_price}
                  maxValue={Math.max(
                    data.starting_bid || 0,
                    data.hammer_price || 0,
                    data.crowd_median
                  )}
                  color="bg-[#D4A843]"
                />
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div>
      <p className="text-[10px] text-[#555570] uppercase tracking-wide">
        {label}
      </p>
      <p className={`text-lg font-mono font-bold ${color} mt-0.5`}>{value}</p>
    </div>
  );
}

function PriceBar({
  label,
  value,
  maxValue,
  color,
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}) {
  const height = maxValue > 0 ? (value / maxValue) * 120 : 0;
  return (
    <div className="flex-1 flex flex-col items-center gap-1">
      <span className="text-xs font-mono text-[#F1F1F5]">
        {formatPrice(value)}
      </span>
      <div
        className={`w-full rounded-t-md ${color} transition-all`}
        style={{ height: `${height}px` }}
      />
      <span className="text-[10px] text-[#555570]">{label}</span>
    </div>
  );
}
