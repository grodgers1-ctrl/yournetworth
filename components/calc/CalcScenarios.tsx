"use client";

import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTrackEvent } from "@/lib/analytics";

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

export function CalcScenarios<T extends Record<string, unknown>>({
  slug,
  state,
  setState,
  initial,
}: CalcScenariosProps<T>) {
  const storageKey = `${slug}-scenarios`;
  const [scenarios, setScenarios] = useState<ScenarioMap>(() => loadScenarios(storageKey));
  const [active, setActive] = useState<string>("baseline");
  const track = useTrackEvent();

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(scenarios));
  }, [storageKey, scenarios]);

  const stateKey = JSON.stringify(state);
  const initialKey = JSON.stringify(initial);

  const unsaved = useMemo(() => {
    const set = new Set<string>();
    if (stateKey !== initialKey) set.add("baseline");
    for (const name of ["A", "B", "C"]) {
      const saved = scenarios[name] as T | undefined;
      if (saved && JSON.stringify(saved) !== stateKey) set.add(name);
    }
    return set;
  }, [stateKey, initialKey, scenarios]);

  const names = ["baseline", "A", "B", "C"];

  const select = (name: string) => {
    if (name === active) {
      if (name === "baseline") {
        setState(initial);
      } else {
        setScenarios({ ...scenarios, [name]: { ...state } });
      }
      track("scenario_changed", { slug, scenario: name, action: "save" });
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
    track("scenario_changed", { slug, scenario: name, action: "switch" });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-text-dim">Scenarios</span>
      {names.map((name) => {
        const label = name === "baseline" ? "Baseline" : name;
        const saved = name !== "baseline" && scenarios[name] !== undefined;
        const dirty = unsaved.has(name);
        return (
          <button
            key={name}
            type="button"
            onClick={() => select(name)}
            className={cn(
              "relative rounded-full px-3 py-1 text-xs font-medium transition-colors focus-ring",
              active === name
                ? "bg-accent text-text"
                : "border border-hairline bg-elevated text-text-muted hover:text-text"
            )}
            aria-pressed={active === name}
            aria-label={`${label} scenario${saved ? ", saved" : ""}${dirty ? ", unsaved changes" : ""}`}
          >
            {label}
            {dirty && (
              <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
