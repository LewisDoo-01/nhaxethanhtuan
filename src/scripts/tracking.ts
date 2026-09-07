/**
 * Minimal internal event layer for CTA tracking (calls, Zalo, form submits).
 * No third-party analytics (GA4/FB Pixel/GTM) per docs/PRD.md §4.4 — this
 * stub is the seam Phase 2's dashboard will plug into.
 */
export type TrackedEvent = "call" | "zalo" | "form_submit";

export function trackEvent(event: TrackedEvent, detail?: Record<string, unknown>) {
  // Phase 1: no backend to send to yet. Log only, keep the call sites wired.
  console.info(`[track] ${event}`, detail ?? {});
}

export function initTrackedClicks(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("a[data-track]").forEach((el) => {
    el.addEventListener("click", () => {
      const event = el.dataset.track as TrackedEvent;
      trackEvent(event, { href: el.getAttribute("href") ?? undefined });
    });
  });
}

/**
 * No backend exists yet in Phase 1 (see docs/PRD.md §1.4), so lead-capture
 * forms can't actually submit anywhere. This tracks the attempt and shows an
 * inline confirmation asking the visitor to call/Zalo instead, rather than
 * silently reloading the page.
 */
export function initTrackedForms(root: ParentNode = document) {
  root.querySelectorAll<HTMLFormElement>("form[data-track='form_submit']").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      trackEvent("form_submit", { formId: form.id || undefined });

      let note = form.querySelector<HTMLElement>(".form-submitted-note");
      if (!note) {
        note = document.createElement("p");
        note.className = "form-submitted-note col-span-full text-sm font-medium text-primary";
        form.appendChild(note);
      }
      note.textContent =
        "Đã ghi nhận yêu cầu! Vui lòng gọi Hotline hoặc chat Zalo để được tư vấn ngay.";
    });
  });
}
