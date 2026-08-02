import { usePostHog } from "posthog-js/react";

export function useTrackEvent() {
  const posthog = usePostHog();
  return (name: string, properties?: Record<string, unknown>) => {
    posthog?.capture(name, properties);
  };
}
