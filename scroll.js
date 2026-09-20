(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const bar = document.createElement('div');
  bar.className = 'reading-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  const links = [...document.querySelectorAll('.report-toc a')];
  const headings = links.map(link => document.getElementById(link.hash.slice(1)));
  let pending = false;
  const update = () => {
    pending = false;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 1;
    bar.style.transform = `scaleX(${progress})`;
    let active = -1;
    headings.forEach((heading, index) => {
      if (heading && heading.getBoundingClientRect().top <= 140) active = index;
    });
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const schedule = () => {
    if (!pending) {
      pending = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  document.addEventListener('load', schedule, true);
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.body);
  schedule();

  // Animate on arrival without hiding content while images or scripts load.
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const animations = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (motion.matches) return;
      const animation = entry.target.animate([
        { opacity: 0.15, transform: 'translateY(32px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 850, easing: 'cubic-bezier(.22,1,.36,1)' });
      animations.add(animation);
      animation.onfinish = animation.oncancel = () => animations.delete(animation);
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.reveal:not(.rack), .unit, .report-intro, .lab-report article > h2, .lab-report figure, .lab-report .table-scroll')
    .forEach(element => observer.observe(element));
  motion.addEventListener('change', () => {
    if (motion.matches) animations.forEach(animation => animation.cancel());
  });
})();
