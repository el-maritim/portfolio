(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const mouse = matchMedia('(hover: hover) and (pointer: fine)');
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ring);
  let frame = 0, visible = false, x = 0, y = 0, tx = 0, ty = 0;
  let card = null;
  const enabled = () => mouse.matches && !preference.matches;
  const resetCard = () => {
    if (!card) return;
    card.style.removeProperty('--tilt-x');
    card.style.removeProperty('--tilt-y');
    card.classList.remove('pointer-card');
    card = null;
  };
  const draw = () => {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(draw) : 0;
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    visible = false;
    ring.classList.remove('visible', 'over-link');
    resetCard();
  };
  document.addEventListener('pointermove', event => {
    if (!enabled() || event.pointerType !== 'mouse') { stop(); return; }
    tx = event.clientX;
    ty = event.clientY;
    if (!visible) { x = tx; y = ty; visible = true; }
    ring.classList.add('visible');
    ring.classList.toggle('over-link', !!event.target.closest('a, button, summary, input'));
    if (!frame) frame = requestAnimationFrame(draw);
    const next = event.target.closest('.unit, .module, .report-intro');
    if (card !== next) { resetCard(); card = next; }
    if (card) {
      const rect = card.getBoundingClientRect();
      const px = Math.max(0, Math.min(1, (tx - rect.left) / rect.width));
      const py = Math.max(0, Math.min(1, (ty - rect.top) / rect.height));
      card.classList.add('pointer-card');
      card.style.setProperty('--tilt-x', `${(0.5 - py) * 3}deg`);
      card.style.setProperty('--tilt-y', `${(px - 0.5) * 3}deg`);
    }
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', stop);
  document.addEventListener('pointerdown', event => { if (event.pointerType !== 'mouse') stop(); });
  window.addEventListener('blur', stop);
  window.addEventListener('scroll', resetCard, { passive: true });

  const photo = document.querySelector('.frame .photo img');
  let scrollFrame = 0;
  const parallax = () => {
    scrollFrame = 0;
    if (!photo) return;
    if (!enabled()) { photo.style.removeProperty('transform'); return; }
    const rect = photo.parentElement.getBoundingClientRect();
    const offset = Math.max(-12, Math.min(12, (innerHeight / 2 - rect.top - rect.height / 2) * 0.04));
    photo.style.transform = `translateY(${offset}px) scale(1.08)`;
  };
  const schedule = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(parallax); };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  const refresh = () => { stop(); schedule(); };
  preference.addEventListener('change', refresh);
  mouse.addEventListener('change', refresh);
  schedule();
})();
