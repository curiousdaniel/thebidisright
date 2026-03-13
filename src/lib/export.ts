import { LotAppraisalData } from "@/types/operator";

export function generateCSV(
  data: Record<string, unknown>[],
  columns: { key: string; label: string }[]
): string {
  const header = columns.map((c) => `"${c.label}"`).join(",");
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = row[c.key];
        if (val === null || val === undefined) return '""';
        if (typeof val === "string") return `"${val.replace(/"/g, '""')}"`;
        return `"${val}"`;
      })
      .join(",")
  );
  return [header, ...rows].join("\n");
}

export const LOT_APPRAISAL_COLUMNS: { key: string; label: string }[] = [
  { key: "am_item_id", label: "Item ID" },
  { key: "title", label: "Title" },
  { key: "lot_number", label: "Lot #" },
  { key: "category", label: "Category" },
  { key: "starting_bid", label: "Starting Bid" },
  { key: "hammer_price", label: "Hammer Price" },
  { key: "crowd_median", label: "Crowd Median" },
  { key: "crowd_mean", label: "Crowd Mean" },
  { key: "prediction_count", label: "Predictions" },
  { key: "confidence_score", label: "Confidence" },
  { key: "std_deviation", label: "Std Dev" },
];

export function lotAppraisalToCSV(data: LotAppraisalData[]): string {
  return generateCSV(
    data as unknown as Record<string, unknown>[],
    LOT_APPRAISAL_COLUMNS
  );
}
