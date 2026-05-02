export function initNav(el) {
  const toggle = el.querySelector('.nav-toggle');
  const menu = el.querySelector('[id]');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = el.hasAttribute('data-open');
    el.toggleAttribute('data-open', !open);
    toggle.setAttribute('aria-expanded', String(!open));
  });

  document.addEventListener('click', (e) => {
    if (!el.contains(e.target)) {
      el.removeAttribute('data-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}
