"use client";

import { formatPrice } from "@/lib/utils";

interface PredictionChartProps {
  predictions: number[];
  hammerPrice?: number | null;
  bins?: number;
}

export default function PredictionChart({
  predictions,
  hammerPrice,
  bins = 10,
}: PredictionChartProps) {
  if (predictions.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-[#555570]">
        No predictions to display
      </div>
    );
  }

  const min = Math.min(...predictions);
  const max = Math.max(...predictions);
  const range = max - min || 1;
  const binWidth = range / bins;

  const histogram = Array.from({ length: bins }, (_, i) => {
    const binMin = min + i * binWidth;
    const binMax = binMin + binWidth;
    const count = predictions.filter(
      (p) => p >= binMin && (i === bins - 1 ? p <= binMax : p < binMax)
    ).length;
    return { binMin, binMax, count };
  });

  const maxCount = Math.max(...histogram.map((b) => b.count));
  const hammerBin = hammerPrice
    ? Math.min(
        bins - 1,
        Math.floor(((hammerPrice - min) / range) * bins)
      )
    : null;

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1 h-32">
        {histogram.map((bin, i) => {
          const height = maxCount > 0 ? (bin.count / maxCount) * 100 : 0;
          const isHammer = hammerBin === i;

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end"
            >
              <span className="text-[9px] text-[#555570] mb-1">
                {bin.count > 0 ? bin.count : ""}
              </span>
              <div
                className={`w-full rounded-t transition-all ${
                  isHammer
                    ? "bg-[#D4A843]"
                    : "bg-[#60A5FA]/40 hover:bg-[#60A5FA]/60"
                }`}
                style={{ height: `${height}%`, minHeight: bin.count > 0 ? 4 : 0 }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-[10px] text-[#555570] font-mono">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>

      {hammerPrice && (
        <p className="text-xs text-center text-[#D4A843]">
          Hammer: {formatPrice(hammerPrice)}
        </p>
      )}
    </div>
  );
}
