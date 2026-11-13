/* Header navigation stays independent of the interactive reading demo. */
(() => {
  const header = document.getElementById('siteNavbar');
  const toggle = header.querySelector('.nav-mobile-toggle');
  const triggers = [...header.querySelectorAll('.nav-trigger')];
  const mobile = window.matchMedia('(max-width: 800px)');
  const closePanels = () => triggers.forEach(button => {
    button.setAttribute('aria-expanded', 'false');
    document.getElementById(button.getAttribute('aria-controls')).hidden = true;
  });
  const closeNavigation = () => {
    closePanels();
    header.classList.remove('nav-mobile-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '打开菜单');
  };
  triggers.forEach(button => {
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      closePanels();
      button.setAttribute('aria-expanded', String(open));
      document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
    });
    button.addEventListener('keydown', event => {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault();
      closePanels();
      button.setAttribute('aria-expanded', 'true');
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      panel.hidden = false;
      panel.querySelector('a, button')?.focus();
    });
  });
  toggle.addEventListener('click', () => {
    const open = !header.classList.contains('nav-mobile-open');
    closeNavigation();
    header.classList.toggle('nav-mobile-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
  });
  header.addEventListener('click', event => {
    const link = event.target.closest('[data-nav-section]');
    if (link) {
      event.preventDefault();
      closeNavigation();
      window.deerlySwitchView?.('overview');
      const target = document.querySelector(link.getAttribute('href'));
      requestAnimationFrame(() => {
        target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      });
    }
    if (event.target.closest('[data-nav-demo]')) {
      closeNavigation();
      window.deerlyGoDemo?.('01');
    }
  });
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeNavigation(); });
  header.addEventListener('focusout', event => {
    if (!header.contains(event.relatedTarget)) closeNavigation();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const active = triggers.find(button => button.getAttribute('aria-expanded') === 'true');
    const wasMobileOpen = header.classList.contains('nav-mobile-open');
    closeNavigation();
    if (active) active.focus();
    else if (wasMobileOpen) toggle.focus();
  });
  mobile.addEventListener('change', closeNavigation);
})();
