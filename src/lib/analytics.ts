export type AnalyticsEvent =
  | "account_created"
  | "onboarding_completed"
  | "tour_cta_clicked"
  | "tour_requested"
  | "checklist_task_completed"
  | "budget_item_added"
  | "guest_added"
  | "vendor_added"
  | "planning_completion_milestone"
  | "support_request_submitted";

type EventProperties = Record<string, string | number | boolean | undefined>;

/**
 * Vendor-neutral analytics boundary. It intentionally emits no network
 * requests until an approved adapter is configured.
 */
export function track(event: AnalyticsEvent, properties: EventProperties = {}) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("padua:analytics", { detail: { event, properties } }),
  );

  if (process.env.NODE_ENV === "development") {
    console.info("[Padua analytics]", event, properties);
  }
}
