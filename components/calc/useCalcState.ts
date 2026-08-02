"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";

type UseCalcStateOptions<T> = {
  key: string;
  initial: T;
};

type UseCalcStateReturn<T> = {
  state: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
  reset: () => void;
  encoded: string;
  copyLink: () => Promise<void>;
  exportJson: () => string;
};

function restoreState<T>(key: string, initial: T): T {
  if (typeof window === "undefined") return initial;
  const urlParams = new URLSearchParams(window.location.search);
  const encoded = urlParams.get("p");
  if (encoded) {
    try {
      const decoded = decompressFromEncodedURIComponent(encoded);
      if (decoded) {
        const parsed = JSON.parse(decoded) as Partial<T>;
        return { ...initial, ...parsed };
      }
    } catch {
      // Ignore corrupted URL state and fall back to defaults.
    }
  }
  const saved = window.localStorage.getItem(key);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Partial<T>;
      return { ...initial, ...parsed };
    } catch {
      // Ignore corrupted localStorage and fall back to defaults.
    }
  }
  return initial;
}

export function useCalcState<T extends Record<string, unknown>>({
  key,
  initial,
}: UseCalcStateOptions<T>): UseCalcStateReturn<T> {
  const [state, setState] = useState<T>(() => restoreState(key, initial));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(key, JSON.stringify(state));
      const encoded = compressToEncodedURIComponent(JSON.stringify(state));
      const url = new URL(window.location.href);
      url.searchParams.set("p", encoded);
      window.history.replaceState(null, "", url.toString());
    }, 200);
    return () => window.clearTimeout(timer);
  }, [key, state]);

  const reset = useCallback(() => setState(initial), [initial]);

  const encoded = useMemo(() => compressToEncodedURIComponent(JSON.stringify(state)), [state]);

  const copyLink = useCallback(async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("p", encoded);
    await navigator.clipboard.writeText(url.toString());
  }, [encoded]);

  const exportJson = useCallback(() => JSON.stringify(state, null, 2), [state]);

  return { state, setState, reset, encoded, copyLink, exportJson };
}
