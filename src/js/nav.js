export function initNav(el) {
  const toggle = el.querySelector('.nav-toggle');
  const menu = el.querySelector('[id]');
  if (!toggle || !menu) return;

  const nav = toggle.closest('.site-nav') ?? el;

  toggle.addEventListener('click', () => {
    const open = nav.hasAttribute('data-open');
    nav.toggleAttribute('data-open', !open);
    toggle.setAttribute('aria-expanded', String(!open));
  });

  document.addEventListener('click', (e) => {
    if (!el.contains(e.target)) {
      nav.removeAttribute('data-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}
