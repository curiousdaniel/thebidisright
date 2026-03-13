"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AuctionAppraisalData } from "@/types/operator";
import AuctionAppraisal from "@/components/operator/AuctionAppraisal";
import { ArrowLeft } from "lucide-react";

export default function OperatorAuctionPage() {
  const params = useParams();
  const auctionId = params.auctionId as string;
  const [data, setData] = useState<AuctionAppraisalData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/operator/appraisal?scope=auction&auctionId=${auctionId}`
        );
        if (res.ok) {
          setData(await res.json());
        }
      } catch {}
    };

    fetchData();
  }, [auctionId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-[#8888A0] hover:text-[#F1F1F5] transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#F1F1F5]">
            Auction Appraisal Report
          </h1>
          <p className="text-sm text-[#8888A0]">
            Detailed crowd prediction data
          </p>
        </div>
      </div>

      <AuctionAppraisal data={data} />
    </div>
  );
}
