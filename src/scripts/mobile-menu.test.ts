import { beforeEach, describe, expect, it } from "vitest";
import { initMobileMenu } from "./mobile-menu";

function setupDom() {
  document.body.innerHTML = `
    <button class="mobile-menu-toggle" aria-expanded="false"></button>
    <nav id="mobile-nav"></nav>
  `;
}

describe("initMobileMenu", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.body.classList.remove("menu-open");
  });

  it("opens the nav, sets body.menu-open, and updates aria-expanded on first click", () => {
    setupDom();
    initMobileMenu();

    const toggle = document.querySelector(".mobile-menu-toggle") as HTMLButtonElement;
    toggle.click();

    expect(document.getElementById("mobile-nav")!.classList.contains("nav-menu--open")).toBe(true);
    expect(document.body.classList.contains("menu-open")).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
  });

  it("closes the nav again on a second click", () => {
    setupDom();
    initMobileMenu();

    const toggle = document.querySelector(".mobile-menu-toggle") as HTMLButtonElement;
    toggle.click();
    toggle.click();

    expect(document.getElementById("mobile-nav")!.classList.contains("nav-menu--open")).toBe(false);
    expect(document.body.classList.contains("menu-open")).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("does nothing when the toggle button is missing", () => {
    document.body.innerHTML = `<nav id="mobile-nav"></nav>`;
    expect(() => initMobileMenu()).not.toThrow();
  });

  it("does nothing when the nav panel is missing", () => {
    document.body.innerHTML = `<button class="mobile-menu-toggle"></button>`;
    expect(() => initMobileMenu()).not.toThrow();
  });
});
