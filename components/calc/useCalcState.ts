"use client";

import { useState, useEffect } from "react";

// Generic state hook for calculator tools.
// Week 0 placeholder: synchronises state to localStorage only.
// Week 1+ will add lz-string URL encoding for shareable links.

export function useCalcState<T extends Record<string, unknown>>({
  key,
  initial,
}: {
  key: string;
  initial: T;
}) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    const raw = window.localStorage.getItem(key);
    if (!raw) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState] as const;
}
