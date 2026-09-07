export function initMobileMenu() {
  const toggle = document.querySelector<HTMLButtonElement>(".mobile-menu-toggle");
  const nav = document.querySelector<HTMLElement>("#mobile-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav-menu--open");
    document.body.classList.toggle("menu-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}
