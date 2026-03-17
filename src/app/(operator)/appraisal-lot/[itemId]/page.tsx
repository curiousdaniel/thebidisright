"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import LotAppraisalComponent from "@/components/operator/LotAppraisal";
import PredictionChart from "@/components/operator/PredictionChart";
import { LotAppraisalData } from "@/types/operator";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { ArrowLeft } from "lucide-react";

export default function OperatorLotPage() {
  const params = useParams();
  const itemId = params.itemId as string;
  const demo = useDemoMode();
  const [data, setData] = useState<(LotAppraisalData & { predictions: number[] }) | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/operator/appraisal?scope=lot&itemId=${itemId}${demo?.demoParam ?? ""}`
        );
        if (res.ok) {
          setData(await res.json());
        }
      } catch {}
    };

    fetchData();
  }, [itemId, demo?.demoParam]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={demo?.demoHref("/dashboard") ?? "/dashboard"}
          className="text-[#8888A0] hover:text-[#F1F1F5] transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#F1F1F5]">
            Lot Prediction Detail
          </h1>
        </div>
      </div>

      <LotAppraisalComponent data={data} />

      {data && data.predictions.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#F1F1F5]">
              Prediction Distribution
            </h3>
          </CardHeader>
          <CardContent>
            <PredictionChart
              predictions={data.predictions}
              hammerPrice={data.hammer_price}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
