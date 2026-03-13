"use client";

import { useState } from "react";

interface UsePredictionOptions {
  onSuccess?: (action: string) => void;
  onError?: (error: string) => void;
}

export function usePrediction(options?: UsePredictionOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitPrediction = async (itemId: number, predictedPrice: number) => {
    setLoading(true);
    setError(null);

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
