// Placeholder analytics wrapper. Replace with PostHog init when keys are ready.
// See https://posthog.com/docs/libraries/next-js for the recommended Next.js 15+ setup.

export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  console.log("[analytics]", name, properties);
}
