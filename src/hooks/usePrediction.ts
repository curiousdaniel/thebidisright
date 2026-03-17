"use client";

import { useState } from "react";
import { useDemoMode } from "@/contexts/DemoModeContext";

interface UsePredictionOptions {
  onSuccess?: (action: string) => void;
  onError?: (error: string) => void;
}

export function usePrediction(options?: UsePredictionOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const demo = useDemoMode();

  const submitPrediction = async (
    itemId: number,
    predictedPrice: number,
    amAuctionId?: number
  ) => {
    setLoading(true);
    setError(null);

    if (demo?.isDemoMode) {
      demo.addDemoPrediction(itemId, predictedPrice, amAuctionId ?? 0);
      setLoading(false);
      options?.onSuccess?.("created");
      return true;
    }

    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, predictedPrice }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.error || "Failed to submit prediction";
        setError(msg);
        options?.onError?.(msg);
        return false;
      }

      options?.onSuccess?.(data.action);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      setError(msg);
      options?.onError?.(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitPrediction, loading, error };
}
