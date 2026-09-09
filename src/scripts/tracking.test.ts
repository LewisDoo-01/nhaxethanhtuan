import { beforeEach, describe, expect, it, vi } from "vitest";
import { initTrackedClicks, initTrackedForms, trackEvent } from "./tracking";

describe("trackEvent", () => {
  it("logs the event name and detail", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    trackEvent("call", { href: "tel:123" });
    expect(spy).toHaveBeenCalledWith("[track] call", { href: "tel:123" });
    spy.mockRestore();
  });

  it("defaults detail to an empty object", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    trackEvent("zalo");
    expect(spy).toHaveBeenCalledWith("[track] zalo", {});
    spy.mockRestore();
  });
});

describe("initTrackedClicks", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("tracks a click on a[data-track] with its href", () => {
    document.body.innerHTML = `<a data-track="call" href="tel:0909621297">Call</a>`;
    initTrackedClicks();
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});

    document.querySelector("a")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(spy).toHaveBeenCalledWith("[track] call", { href: "tel:0909621297" });
    spy.mockRestore();
  });

  it("does not attach listeners to links without data-track", () => {
    document.body.innerHTML = `<a href="/lien-he">Liên hệ</a>`;
    initTrackedClicks();
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});

    document.querySelector("a")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("only tracks within the given root", () => {
    document.body.innerHTML = `
      <div id="scope"><a data-track="zalo" href="https://zalo.me/1">In</a></div>
      <a data-track="call" href="tel:1">Out</a>
    `;
    const scope = document.getElementById("scope")!;
    initTrackedClicks(scope);
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});

    document.querySelectorAll("a")[1].dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("initTrackedForms", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
  });

  it("prevents default submission, POSTs to /api/leads, and shows a success note", async () => {
    document.body.innerHTML = `
      <form id="hero-form" data-track="form_submit">
        <input name="phone" value="0909621297" />
        <button type="submit">Send</button>
      </form>
    `;
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchSpy);
    initTrackedForms();
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    const form = document.getElementById("hero-form") as HTMLFormElement;
    const event = new Event("submit", { bubbles: true, cancelable: true });
    form.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(infoSpy).toHaveBeenCalledWith("[track] form_submit", { formId: "hero-form" });
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/leads",
      expect.objectContaining({ method: "POST" }),
    );
    const [, options] = fetchSpy.mock.calls[0];
    expect(JSON.parse(options.body)).toMatchObject({ formId: "hero-form", phone: "0909621297" });

    await vi.waitFor(() => {
      expect(form.querySelector(".form-submitted-note")?.textContent).toMatch(/Đã ghi nhận yêu cầu/);
    });

    infoSpy.mockRestore();
  });

  it("shows a fallback note when the request fails", async () => {
    document.body.innerHTML = `<form id="fail-form" data-track="form_submit"></form>`;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    );
    initTrackedForms();

    const form = document.getElementById("fail-form") as HTMLFormElement;
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    await vi.waitFor(() => {
      expect(form.querySelector(".form-submitted-note")?.textContent).toMatch(
        /Không gửi được yêu cầu/,
      );
    });
  });

  it("reuses the same note element on repeated submits instead of duplicating it", async () => {
    document.body.innerHTML = `<form data-track="form_submit"></form>`;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
    initTrackedForms();

    const form = document.querySelector("form")!;
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(form.querySelector(".form-submitted-note")).toBeTruthy());
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(form.querySelectorAll(".form-submitted-note")).toHaveLength(1));
  });

  it("ignores forms without data-track='form_submit'", () => {
    document.body.innerHTML = `<form id="plain"></form>`;
    initTrackedForms();

    const form = document.getElementById("plain") as HTMLFormElement;
    const event = new Event("submit", { bubbles: true, cancelable: true });
    form.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });
});
