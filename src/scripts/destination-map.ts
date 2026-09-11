/**
 * Shows a Google Maps preview of the "to" (destination) field so the
 * customer can visually confirm the location themselves before submitting.
 * Pure client-side (no API key, no server geocoding) and intentionally not
 * tracked anywhere — see docs/PRD.md §4.2.
 */
const DEBOUNCE_MS = 400;

function mapsEmbedSrc(address: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

export function initDestinationMaps(root: ParentNode = document) {
  root.querySelectorAll<HTMLInputElement>("[data-destination-map-input]").forEach((input) => {
    const wrapper = input
      .closest("form")
      ?.querySelector<HTMLElement>("[data-destination-map-preview]");
    const iframe = wrapper?.querySelector<HTMLIFrameElement>("iframe");
    if (!wrapper || !iframe) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    input.addEventListener("input", () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const address = input.value.trim();
        if (!address) {
          wrapper.hidden = true;
          iframe.removeAttribute("src");
          return;
        }
        iframe.src = mapsEmbedSrc(address);
        wrapper.hidden = false;
      }, DEBOUNCE_MS);
    });
  });
}
