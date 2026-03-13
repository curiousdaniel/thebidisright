"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { AMItem, AMAuction } from "@/types/auction";
import LotGrid from "@/components/game/LotGrid";
import Tabs from "@/components/ui/Tabs";
import Button from "@/components/ui/Button";
import { Search, Clock, Grid3X3, Flame, RefreshCw } from "lucide-react";

type BrowseTab = "all" | "closing" | "category" | "hot";

const tabs = [
  { id: "all" as const, label: "All Auctions", icon: <Grid3X3 size={14} /> },
  { id: "closing" as const, label: "Closing Soon", icon: <Clock size={14} /> },
  { id: "hot" as const, label: "Hot Lots", icon: <Flame size={14} /> },
];

export default function BrowsePage() {
  const [activeTab, setActiveTab] = useState<BrowseTab>("all");
  const [auctions, setAuctions] = useState<AMAuction[]>([]);
  const [items, setItems] = useState<AMItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuction, setSelectedAuction] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    await fetch("/api/ensure-tables").catch(() => {});
    const supabase = createClient();
    const now = new Date().toISOString();

    const { data: auctionsData } = await supabase
      .from("am_auctions")
      .select("*")
      .eq("published", true)
      .gt("start_time", now)
      .order("start_time", { ascending: true });

    const auctionsList = (auctionsData as AMAuction[]) || [];
    setAuctions(auctionsList);

    const eligibleAuctionIds = auctionsList.map((a) => a.am_auction_id);

    let itemsData: AMItem[] = [];
    const auctionIdsToFetch =
      selectedAuction && eligibleAuctionIds.includes(selectedAuction)
        ? [selectedAuction]
        : eligibleAuctionIds;

    if (auctionIdsToFetch.length > 0) {
      let query = supabase
        .from("am_items")
        .select("*")
        .eq("status", "open")
        .in("am_auction_id", auctionIdsToFetch);

      if (activeTab === "closing") {
        query = query.order("closes_at", { ascending: true }).limit(50);
      } else {
        query = query.order("created_at", { ascending: false }).limit(100);
      }

      const { data } = await query;
      itemsData = (data as AMItem[]) || [];
    }

    setItems(itemsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedAuction]);

  const handleSyncNow = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/sync/trigger", { method: "POST" });
      const text = await res.text();
      let data: { success?: boolean; auctions?: number; items?: number; raw_auctions?: number; error?: string } = {};
      try {
        data = JSON.parse(text);
      } catch {
        setSyncMessage("Server returned an error. Check Vercel logs.");
        return;
      }

      if (res.ok && data.success) {
        const raw = data.raw_auctions ?? data.auctions;
        const msg =
          raw === 0
            ? `API returned 0 auctions. Visit /api/debug/am to inspect the raw response.`
            : `Synced ${data.auctions} auctions, ${data.items} items. Refreshing…`;
        setSyncMessage(msg);
        await fetchData();
      } else {
        setSyncMessage(data.error || JSON.stringify(data));
      }
    } catch (err) {
      setSyncMessage(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const filteredItems = searchQuery
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#F1F1F5]">
            Browse Lots
          </h1>
          <p className="text-[#8888A0] mt-1">
            Find lots to appraise and lock in your predictions
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

      {syncMessage && (
        <p className={`text-sm ${syncMessage.includes("Synced") ? "text-emerald-400" : "text-amber-400"}`}>
          {syncMessage}
        </p>
      )}

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555570]"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search lots by title or category..."
          className="w-full bg-[#141420] border border-[#2A2A40] rounded-xl pl-10 pr-4 py-3 text-[#F1F1F5] placeholder:text-[#555570] focus:outline-none focus:border-[#D4A843] transition-colors"
        />
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        defaultTab={activeTab}
        onTabChange={(id) => setActiveTab(id as BrowseTab)}
      />

      {/* Auction filter chips */}
      {activeTab === "all" && auctions.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedAuction(null)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              !selectedAuction
                ? "bg-[#D4A843] text-[#0A0A0F] font-semibold"
                : "bg-[#1E1E30] text-[#8888A0] hover:text-[#F1F1F5]"
            }`}
          >
            All
          </button>
          {auctions.map((auction) => (
            <button
              key={auction.am_auction_id}
              onClick={() => setSelectedAuction(auction.am_auction_id)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedAuction === auction.am_auction_id
                  ? "bg-[#D4A843] text-[#0A0A0F] font-semibold"
                  : "bg-[#1E1E30] text-[#8888A0] hover:text-[#F1F1F5]"
              }`}
            >
              {auction.title}
            </button>
          ))}
        </div>
      )}

      {/* Items grid */}
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
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">🔍</span>
          <p className="text-lg font-medium text-[#555570]">No lots found</p>
          <p className="text-sm text-[#555570] mt-1">
            Use the Sync Now button above to load auction data from AuctionMethod.
          </p>
        </div>
      ) : (
        <LotGrid items={filteredItems} />
      )}
    </div>
  );
}
