"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PortfolioData } from "@/types/operator";
import AppraisalOverview from "@/components/operator/AppraisalOverview";
import EngagementFunnel from "@/components/operator/EngagementFunnel";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { AMAuction } from "@/types/auction";
import { ChevronRight, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [auctions, setAuctions] = useState<AMAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/operator/appraisal?scope=portfolio");
      if (res.ok) {
        const data = await res.json();
        setPortfolioData(data);
      }
    } catch {}

    const supabase = createClient();
    const { data: auctionsData } = await supabase
      .from("am_auctions")
      .select("*")
      .eq("published", true)
      .order("end_time", { ascending: false })
      .limit(10);

    setAuctions((auctionsData as AMAuction[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSyncNow = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/sync/trigger", { method: "POST" });
      const text = await res.text();
      let data: { success?: boolean; auctions?: number; items?: number; error?: string; errors?: string[] } = {};
      try {
        data = JSON.parse(text);
      } catch {
        setSyncResult("Server returned an error. Check Vercel logs.");
        return;
      }

      if (res.ok && data.success) {
        setSyncResult(
          `Synced ${data.auctions} auctions, ${data.items} items. ${data.errors?.length ? `Errors: ${data.errors.length}` : ""}`
        );
        fetchData();
      } else {
        setSyncResult(data.error || JSON.stringify(data));
      }
    } catch (err) {
      setSyncResult(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#F1F1F5]">
            Appraisal Intelligence
          </h1>
          <p className="text-[#8888A0] mt-1">
            Crowd-sourced valuation data across your inventory
          </p>
        </div>
        <Button
          onClick={handleSyncNow}
          disabled={syncing}
          variant="secondary"
          className="shrink-0"
        >
          <RefreshCw size={16} className={syncing ? "animate-spin mr-2" : "mr-2"} />
          {syncing ? "Syncing…" : "Sync Now"}
        </Button>
      </div>

      {syncResult && (
        <div
          className={`p-4 rounded-lg text-sm ${
            syncResult.includes("Synced")
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
          }`}
        >
          {syncResult}
        </div>
      )}

      <AppraisalOverview data={portfolioData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EngagementFunnel
          data={portfolioData?.engagement_funnel || null}
        />

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#F1F1F5]">
              Recent Auctions
            </h3>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-[#1E1E30] rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : auctions.length === 0 ? (
              <p className="text-sm text-[#555570] text-center py-6">
                No auctions synced yet
              </p>
            ) : (
              <div className="space-y-2">
                {auctions.map((auction) => (
                  <Link
                    key={auction.am_auction_id}
                    href={`/auction/${auction.am_auction_id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1E1E30] transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#F1F1F5]">
                        {auction.title}
                      </p>
                      <p className="text-xs text-[#555570]">
                        {auction.city && `${auction.city}, ${auction.state}`}
                        {auction.end_time &&
                          ` — ${new Date(auction.end_time).toLocaleDateString()}`}
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-[#2A2A40] group-hover:text-[#8888A0] transition-colors"
                    />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
