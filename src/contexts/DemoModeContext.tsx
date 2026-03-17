"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "bidiq_demo";
const PREDICTIONS_KEY = "bidiq_demo_predictions";

export interface DemoPrediction {
  predictedPrice: number;
  lockedAt: string;
  amAuctionId: number;
}

interface DemoModeContextValue {
  isDemoMode: boolean;
  demoParam: string;
  setDemoMode: (value: boolean) => void;
  demoPredictions: Map<number, DemoPrediction>;
  addDemoPrediction: (itemId: number, predictedPrice: number, amAuctionId: number) => void;
  getDemoPrediction: (itemId: number) => DemoPrediction | undefined;
  demoHref: (href: string) => string;
}

const DemoModeContext = createContext<DemoModeContextValue | null>(null);

function loadStoredPredictions(): Map<number, DemoPrediction> {
  if (typeof window === "undefined") return new Map();
  try {
    const raw = sessionStorage.getItem(PREDICTIONS_KEY);
    if (!raw) return new Map();
    const arr = JSON.parse(raw) as Array<[number, DemoPrediction]>;
    return new Map(arr);
  } catch {
    return new Map();
  }
}

function savePredictions(map: Map<number, DemoPrediction>) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      PREDICTIONS_KEY,
      JSON.stringify(Array.from(map.entries()))
    );
  } catch {}
}

function getUrlDemo(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("demo") === "true";
}

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [isDemoMode, setIsDemoModeState] = useState(false);
  const [demoPredictions, setDemoPredictions] = useState<Map<number, DemoPrediction>>(
    () => new Map()
  );

  useEffect(() => {
    const urlDemo = getUrlDemo();
    if (urlDemo) {
      setIsDemoModeState(true);
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    } else {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        setIsDemoModeState(stored === "1");
      } catch {
        setIsDemoModeState(false);
      }
    }
  }, [pathname]);

  useEffect(() => {
    setDemoPredictions(loadStoredPredictions());
  }, [isDemoMode]);

  const setDemoMode = useCallback((value: boolean) => {
    setIsDemoModeState(value);
    try {
      if (value) {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(PREDICTIONS_KEY);
      }
    } catch {}
  }, []);

  const addDemoPrediction = useCallback(
    (itemId: number, predictedPrice: number, amAuctionId: number) => {
      const pred: DemoPrediction = {
        predictedPrice,
        lockedAt: new Date().toISOString(),
        amAuctionId,
      };
      setDemoPredictions((prev) => {
        const next = new Map(prev);
        next.set(itemId, pred);
        savePredictions(next);
        return next;
      });
    },
    []
  );

  const getDemoPrediction = useCallback(
    (itemId: number) => demoPredictions.get(itemId),
    [demoPredictions]
  );

  const demoParam = isDemoMode ? "&demo=true" : "";

  const demoHref = useCallback(
    (href: string) => {
      if (!isDemoMode) return href;
      try {
        const [path, query] = href.split("?");
        const params = new URLSearchParams(query || "");
        params.set("demo", "true");
        return `${path}?${params.toString()}`;
      } catch {
        return href + (href.includes("?") ? "&" : "?") + "demo=true";
      }
    },
    [isDemoMode]
  );

  const value = useMemo<DemoModeContextValue>(
    () => ({
      isDemoMode,
      demoParam,
      setDemoMode,
      demoPredictions,
      addDemoPrediction,
      getDemoPrediction,
      demoHref,
    }),
    [
      isDemoMode,
      demoParam,
      setDemoMode,
      demoPredictions,
      addDemoPrediction,
      getDemoPrediction,
      demoHref,
    ]
  );

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const ctx = useContext(DemoModeContext);
  return ctx;
}
