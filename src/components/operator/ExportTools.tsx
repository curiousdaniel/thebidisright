"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Download, FileText, File } from "lucide-react";

interface ExportToolsProps {
  auctionId?: number;
  onExportCSV: (scope: string) => Promise<string>;
}

export default function ExportTools({ auctionId, onExportCSV }: ExportToolsProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (scope: string) => {
    setExporting(scope);
    try {
      const csv = await onExportCSV(scope);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bidiq-${scope}-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-[#F1F1F5]">
          Export & Reports
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {auctionId && (
            <ExportOption
              title="Auction Lot Report"
              description="All lots with crowd predictions for this auction"
              icon={<FileText size={20} />}
              loading={exporting === "auction"}
              onClick={() => handleExport("auction")}
            />
          )}
          <ExportOption
            title="All Lots CSV"
            description="Complete lot-level prediction data"
            icon={<File size={20} />}
            loading={exporting === "all-lots"}
            onClick={() => handleExport("all-lots")}
          />
          <ExportOption
            title="Player Stats CSV"
            description="All player stats and rankings"
            icon={<File size={20} />}
            loading={exporting === "players"}
            onClick={() => handleExport("players")}
          />
          <ExportOption
            title="Aggregate Summary"
            description="Portfolio-level appraisal summary"
            icon={<FileText size={20} />}
            loading={exporting === "summary"}
            onClick={() => handleExport("summary")}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ExportOption({
  title,
  description,
  icon,
  loading,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#0A0A0F] rounded-xl border border-[#2A2A40]">
      <div className="flex items-center gap-3">
        <span className="text-[#D4A843]">{icon}</span>
        <div>
          <p className="text-sm font-medium text-[#F1F1F5]">{title}</p>
          <p className="text-xs text-[#555570]">{description}</p>
        </div>
      </div>
      <Button
        size="sm"
        variant="secondary"
        onClick={onClick}
        disabled={loading}
      >
        <Download size={14} className="mr-1" />
        {loading ? "..." : "Export"}
      </Button>
    </div>
  );
}
