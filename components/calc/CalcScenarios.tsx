"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type ScenarioMap = Record<string, Record<string, unknown>>;

type CalcScenariosProps<T extends Record<string, unknown>> = {
  slug: string;
  state: T;
  setState: (state: T) => void;
  initial: T;
};

function loadScenarios(storageKey: string): ScenarioMap {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ScenarioMap;
  } catch {
    return {};
  }
}

export function CalcScenarios<T extends Record<string, unknown>>({ slug, state, setState, initial }: CalcScenariosProps<T>) {
  const storageKey = `${slug}-scenarios`;
  const [scenarios, setScenarios] = useState<ScenarioMap>(() => loadScenarios(storageKey));
  const [active, setActive] = useState<string>("baseline");

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(scenarios));
  }, [storageKey, scenarios]);

  const names = ["baseline", "A", "B", "C"];

  const select = (name: string) => {
    if (name === active) {
      if (name === "baseline") {
        setState(initial);
      } else {
        setScenarios({ ...scenarios, [name]: { ...state } });
      }
      return;
    }
    if (name === "baseline") {
      setState(initial);
    } else {
      const saved = scenarios[name];
      if (saved) {
        setState(saved as T);
      } else {
        setScenarios({ ...scenarios, [name]: { ...state } });
      }
    }
    setActive(name);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-text-dim">Scenarios</span>
      {names.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => select(name)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            active === name
              ? "bg-accent text-text"
              : "border border-hairline bg-elevated text-text-muted hover:text-text"
          )}
          aria-pressed={active === name}
        >
          {name === "baseline" ? "Baseline" : name}
        </button>
      ))}
    </div>
  );
}
