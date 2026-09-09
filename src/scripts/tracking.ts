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
 * Lead-capture forms POST to /api/leads (server-rendered route, writes to
 * Neon — see docs/db/schema.sql). If that fails (e.g. DATABASE_URL not
 * configured yet, or the visitor is offline), fall back to an inline message
 * asking them to call/Zalo instead, rather than silently losing the lead.
 */
export function initTrackedForms(root: ParentNode = document) {
  root.querySelectorAll<HTMLFormElement>("form[data-track='form_submit']").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const payload = {
        sourcePage: location.pathname,
        formId: form.id || undefined,
        name: data.get("name")?.toString(),
        phone: data.get("phone")?.toString(),
        serviceType: data.get("service-type")?.toString(),
        from: data.get("from")?.toString(),
        to: data.get("to")?.toString(),
        datetime: data.get("datetime")?.toString(),
        note: data.get("note")?.toString(),
      };

      trackEvent("form_submit", { formId: form.id || undefined });

      let ok = false;
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        ok = res.ok;
      } catch {
        ok = false;
      }

      let note = form.querySelector<HTMLElement>(".form-submitted-note");
      if (!note) {
        note = document.createElement("p");
        note.className = "form-submitted-note col-span-full text-sm font-medium text-primary";
        form.appendChild(note);
      }
      note.textContent = ok
        ? "Đã ghi nhận yêu cầu! Chúng tôi sẽ liên hệ lại sớm nhất, hoặc gọi Hotline để được tư vấn ngay."
        : "Không gửi được yêu cầu lúc này. Vui lòng gọi Hotline hoặc chat Zalo để được tư vấn ngay.";
    });
  });
}
