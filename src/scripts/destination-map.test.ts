import { beforeEach, describe, expect, it, vi } from "vitest";
import { initDestinationMaps } from "./destination-map";

function setupForm() {
  document.body.innerHTML = `
    <form>
      <input data-destination-map-input value="" />
      <div data-destination-map-preview hidden>
        <iframe></iframe>
      </div>
    </form>
  `;
}

describe("initDestinationMaps", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.useFakeTimers();
  });

  it("shows the map with a Google Maps embed src after typing, debounced", () => {
    setupForm();
    initDestinationMaps();

    const input = document.querySelector<HTMLInputElement>("[data-destination-map-input]")!;
    const wrapper = document.querySelector<HTMLElement>("[data-destination-map-preview]")!;
    const iframe = wrapper.querySelector("iframe")!;

    input.value = "Vũng Tàu";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    // Not yet applied before debounce elapses.
    expect(wrapper.hidden).toBe(true);

    vi.advanceTimersByTime(400);

    expect(wrapper.hidden).toBe(false);
    expect(iframe.getAttribute("src")).toBe(
      "https://maps.google.com/maps?q=V%C5%A9ng%20T%C3%A0u&output=embed",
    );
  });

  it("only applies the last value when typed quickly (debounce coalesces)", () => {
    setupForm();
    initDestinationMaps();

    const input = document.querySelector<HTMLInputElement>("[data-destination-map-input]")!;
    const iframe = document.querySelector("iframe")!;

    input.value = "V";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    vi.advanceTimersByTime(100);
    input.value = "Vũng Tàu";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    vi.advanceTimersByTime(400);

    expect(iframe.getAttribute("src")).toContain(encodeURIComponent("Vũng Tàu"));
  });

  it("hides the map and clears src when the field is cleared", () => {
    setupForm();
    initDestinationMaps();

    const input = document.querySelector<HTMLInputElement>("[data-destination-map-input]")!;
    const wrapper = document.querySelector<HTMLElement>("[data-destination-map-preview]")!;
    const iframe = wrapper.querySelector("iframe")!;

    input.value = "Cần Thơ";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    vi.advanceTimersByTime(400);
    expect(wrapper.hidden).toBe(false);

    input.value = "   ";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    vi.advanceTimersByTime(400);

    expect(wrapper.hidden).toBe(true);
    expect(iframe.hasAttribute("src")).toBe(false);
  });

  it("does nothing when the form has no preview element", () => {
    document.body.innerHTML = `<form><input data-destination-map-input /></form>`;
    expect(() => initDestinationMaps()).not.toThrow();

    const input = document.querySelector<HTMLInputElement>("[data-destination-map-input]")!;
    expect(() => {
      input.value = "abc";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      vi.advanceTimersByTime(400);
    }).not.toThrow();
  });
});
