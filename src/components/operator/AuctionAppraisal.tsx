"use client";

import { AuctionAppraisalData } from "@/types/operator";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatPrice, formatNumber } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface AuctionAppraisalProps {
  data: AuctionAppraisalData | null;
}

export default function AuctionAppraisal({ data }: AuctionAppraisalProps) {
  if (!data) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6 h-64" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-serif font-bold text-[#F1F1F5]">
            {data.title}
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBlock
              label="Total Predicted Value"
              value={formatPrice(data.total_predicted_value)}
              color="text-[#D4A843]"
            />
            <StatBlock
              label="Total Hammer Value"
              value={
                data.total_hammer_value
                  ? formatPrice(data.total_hammer_value)
                  : "Pending"
              }
              color="text-[#F1F1F5]"
            />
            <StatBlock
              label="Crowd Accuracy"
              value={
                data.crowd_accuracy !== null
                  ? `${data.crowd_accuracy.toFixed(1)}%`
                  : "N/A"
              }
              color="text-emerald-400"
            />
            <StatBlock
              label="Engagement"
              value={`${formatNumber(data.total_predictions)} predictions`}
              sub={`${data.unique_players} players`}
              color="text-[#60A5FA]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Hottest lots */}
      {data.hottest_lots.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-[#F1F1F5]">
                Hottest Lots
              </h3>
              <Badge variant="red" size="sm">Most Predictions</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <LotTable lots={data.hottest_lots} />
          </CardContent>
        </Card>
      )}

      {/* Controversial lots */}
      {data.controversial_lots.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-[#F1F1F5]">
                Most Controversial
              </h3>
              <Badge variant="amber" size="sm">High Disagreement</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <LotTable lots={data.controversial_lots} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatBlock({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div>
      <p className="text-xs text-[#555570] mb-1">{label}</p>
      <p className={`text-xl font-mono font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-[#555570] mt-0.5">{sub}</p>}
    </div>
  );
}

function LotTable({
  lots,
}: {
  lots: Array<{
    am_item_id: number;
    title: string;
    lot_number: string | null;
    crowd_median: number;
    prediction_count: number;
    confidence_score: number;
  }>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[#555570] text-xs">
            <th className="text-left py-2 font-medium">Lot</th>
            <th className="text-right py-2 font-medium">Median</th>
            <th className="text-right py-2 font-medium">Predictions</th>
            <th className="text-right py-2 font-medium">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {lots.map((lot) => (
            <tr
              key={lot.am_item_id}
              className="border-t border-[#2A2A40]"
            >
              <td className="py-2 text-[#F1F1F5]">
                {lot.lot_number && (
                  <span className="text-[#555570] mr-2">#{lot.lot_number}</span>
                )}
                {lot.title}
              </td>
              <td className="py-2 text-right font-mono text-[#D4A843]">
                {formatPrice(lot.crowd_median)}
              </td>
              <td className="py-2 text-right text-[#8888A0]">
                {lot.prediction_count}
              </td>
              <td className="py-2 text-right text-[#8888A0]">
                {lot.confidence_score}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
