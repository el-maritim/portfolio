(() => {
  const header = document.querySelector('header.site');
  const nav = header?.querySelector('nav.links');
  if (!nav) return;
  nav.id = 'site-navigation';
  nav.setAttribute('aria-label', 'Main navigation');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'nav-toggle';
  button.textContent = 'Menu +';
  button.setAttribute('aria-controls', nav.id);
  button.setAttribute('aria-expanded', 'false');
  nav.before(button);
  header.classList.add('nav-ready');
  const mobile = matchMedia('(max-width: 760px)');
  const setOpen = open => {
    header.classList.toggle('nav-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'Close −' : 'Menu +';
  };
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => {
    if (!event.target.closest('a')) return;
    setOpen(false);
    if (mobile.matches) button.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('nav-open')) {
      setOpen(false);
      button.focus();
    }
  });
  document.addEventListener('click', event => { if (!header.contains(event.target)) setOpen(false); });
  header.addEventListener('focusout', event => {
    if (!header.contains(event.relatedTarget)) setOpen(false);
  });
  mobile.addEventListener('change', () => {
    if (mobile.matches && nav.contains(document.activeElement)) button.focus();
    if (!mobile.matches && document.activeElement === button) nav.querySelector('a')?.focus();
    setOpen(false);
  });

  document.querySelectorAll('.lab-report figure').forEach(figure => {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'capture-toggle';
    toggle.textContent = 'View original size';
    toggle.setAttribute('aria-pressed', 'false');
    toggle.addEventListener('click', () => {
      const expanded = figure.classList.toggle('original-size');
      toggle.setAttribute('aria-pressed', String(expanded));
      toggle.textContent = expanded ? 'Fit to screen' : 'View original size';
    });
    figure.appendChild(toggle);
  });
})();
