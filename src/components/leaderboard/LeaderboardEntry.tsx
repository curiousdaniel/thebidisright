import { cn, formatNumber } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { LeaderboardEntry as EntryType } from "@/types/player";
import { Trophy, ChevronUp, ChevronDown, Minus } from "lucide-react";

interface LeaderboardEntryProps {
  entry: EntryType;
  delta?: number;
}

export default function LeaderboardEntryRow({
  entry,
  delta = 0,
}: LeaderboardEntryProps) {
  const isTop3 = entry.rank <= 3;
  const medalColors = ["", "text-[#F0D78C]", "text-[#C0C0C0]", "text-[#CD7F32]"];

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors",
        isTop3
          ? "bg-[#D4A843]/5 border border-[#D4A843]/20"
          : "hover:bg-[#1E1E30]"
      )}
    >
      {/* Rank */}
      <div className="w-10 text-center">
        {isTop3 ? (
          <Trophy size={20} className={medalColors[entry.rank]} />
        ) : (
          <span className="text-sm font-mono text-[#555570]">
            {entry.rank}
          </span>
        )}
      </div>

      {/* Delta */}
      <div className="w-6 flex justify-center">
        {delta > 0 && <ChevronUp size={14} className="text-emerald-400" />}
        {delta < 0 && <ChevronDown size={14} className="text-red-400" />}
        {delta === 0 && <Minus size={14} className="text-[#2A2A40]" />}
      </div>

      {/* Avatar + name */}
      <Avatar src={entry.avatar_url} name={entry.display_name} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#F1F1F5] truncate">
            {entry.display_name}
          </span>
          <span className="text-xs text-[#555570]">{entry.rank_icon}</span>
        </div>
        <span className="text-xs text-[#555570]">{entry.rank_title}</span>
      </div>

      {/* Badges */}
      <div className="hidden sm:flex gap-1">
        {entry.top_badges.slice(0, 3).map((badge, i) => (
          <span key={i} className="text-sm">
            {badge}
          </span>
        ))}
      </div>

      {/* Stat */}
      <div className="text-right">
        <span className="font-mono text-sm font-bold text-[#D4A843]">
          {formatNumber(entry.stat_value)}
        </span>
        <p className="text-[10px] text-[#555570]">{entry.stat_label}</p>
      </div>
    </div>
  );
}
