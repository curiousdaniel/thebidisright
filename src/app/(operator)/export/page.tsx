"use client";

import ExportTools from "@/components/operator/ExportTools";
import { Download } from "lucide-react";

export default function ExportPage() {
  const handleExport = async (scope: string) => {
    const res = await fetch(`/api/operator/export?scope=${scope}`);
    if (!res.ok) throw new Error("Export failed");
    return await res.text();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Download className="text-[#D4A843]" size={24} />
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#F1F1F5]">
            Export & Reports
          </h1>
          <p className="text-sm text-[#8888A0]">
            Download appraisal data and player reports
          </p>
        </div>
      </div>

      <ExportTools onExportCSV={handleExport} />
    </div>
  );
}
