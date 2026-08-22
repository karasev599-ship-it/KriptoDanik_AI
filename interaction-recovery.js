/* KD Intelligence — interaction recovery layer
   Prevents stale/transparent overlays from swallowing clicks and provides
   a safe navigation fallback when a non-critical script fails early. */
(() => {
  'use strict';

  const isViewportOverlay = (el) => {
    if (!(el instanceof HTMLElement)) return false;
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed') return false;
    const r = el.getBoundingClientRect();
    return r.width >= window.innerWidth * 0.98 && r.height >= window.innerHeight * 0.98;
  };

  function cleanDeadOverlays() {
    const ids = ['onboardingOverlay', 'coachTourOverlay', 'kdAuthOverlay', 'mobileNavScrim', 'tradeModalOverlay'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const hiddenByState = el.hidden || el.getAttribute('aria-hidden') === 'true' || !el.classList.contains('active');
      if (hiddenByState) {
        el.style.pointerEvents = 'none';
      }
    });

    document.querySelectorAll('body *').forEach(el => {
      if (!isViewportOverlay(el)) return;
      const cs = getComputedStyle(el);
      const opacity = Number.parseFloat(cs.opacity || '1');
      const hidden = cs.display === 'none' || cs.visibility === 'hidden' || opacity <= 0.01;
      if (hidden) el.style.pointerEvents = 'none';
    });
  }

  function bindFallbackNavigation() {
    const nav = document.querySelectorAll('.nav-item[data-section]');
    nav.forEach(btn => {
      if (btn.dataset.kdRecoveryBound === '1') return;
      btn.dataset.kdRecoveryBound = '1';
      btn.addEventListener('click', () => {
        const app = window.App;
        const section = btn.dataset.section;
        if (!app || !section) return;
        try {
          app.navItems?.forEach(n => n.classList.remove('active'));
          btn.classList.add('active');
          if (typeof app.showSection === 'function') app.showSection(section);
          if (typeof app.closeMobileNav === 'function') app.closeMobileNav();
        } catch (e) {
          console.warn('KD navigation recovery:', e);
        }
      }, false);
    });
  }

  function run() {
    cleanDeadOverlays();
    bindFallbackNavigation();
    setTimeout(cleanDeadOverlays, 250);
    setTimeout(cleanDeadOverlays, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
  window.addEventListener('load', run);
  window.addEventListener('resize', cleanDeadOverlays);
})();
