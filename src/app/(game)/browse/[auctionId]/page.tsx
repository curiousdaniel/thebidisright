"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AMItem, AMAuction } from "@/types/auction";
import LotGrid from "@/components/game/LotGrid";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuctionPage() {
  const params = useParams();
  const auctionId = Number(params.auctionId);
  const [auction, setAuction] = useState<AMAuction | null>(null);
  const [items, setItems] = useState<AMItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data: auctionData } = await supabase
        .from("am_auctions")
        .select("*")
        .eq("am_auction_id", auctionId)
        .single();

      setAuction(auctionData as AMAuction | null);

      const { data: itemsData } = await supabase
        .from("am_items")
        .select("*")
        .eq("am_auction_id", auctionId)
        .order("lot_number", { ascending: true });

      setItems((itemsData as AMItem[]) || []);
      setLoading(false);
    };

    fetchData();
  }, [auctionId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/browse"
          className="text-[#8888A0] hover:text-[#F1F1F5] transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#F1F1F5]">
            {auction?.title || "Auction"}
          </h1>
          {auction && (
            <p className="text-sm text-[#8888A0]">
              {auction.city && `${auction.city}, ${auction.state}`}
              {auction.end_time &&
                ` — Ends ${new Date(auction.end_time).toLocaleDateString()}`}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-[#8888A0]">
        <span>{items.length} lots</span>
        <span>{items.filter((i) => i.status === "open").length} open</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#141420] border border-[#2A2A40] rounded-xl overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] bg-[#1E1E30]" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-[#1E1E30] rounded w-3/4" />
                <div className="h-3 bg-[#1E1E30] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <LotGrid items={items} auctionTitle={auction?.title} />
      )}
    </div>
  );
}
