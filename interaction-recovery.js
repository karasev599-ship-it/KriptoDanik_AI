/* KD Intelligence — interaction recovery.
 * Keep normal App event handlers authoritative. Only remove stale fullscreen
 * layers when the dashboard is visibly active; never hijack ordinary clicks.
 */
(() => {
  'use strict';

  function hideStaleDashboardLayers() {
    const dashboard = document.getElementById('section-dashboard');
    if (!dashboard?.classList.contains('active')) return;

    const auth = document.getElementById('kdAuthOverlay');
    if (auth && !auth.hidden) auth.hidden = true;

    ['onboardingOverlay', 'tradeModalOverlay', 'screenshotLightbox', 'coachTourOverlay', 'mobileNavScrim']
      .forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('active');
        if (id === 'mobileNavScrim') el.style.display = 'none';
      });

    document.body.classList.remove('kd-auth-open');
  }

  function bind() {
    hideStaleDashboardLayers();

    // Neutralise only genuinely invisible fullscreen layers. We deliberately
    // do NOT install a global capture-phase click interceptor: the app's own
    // event handlers must remain authoritative.
    document.querySelectorAll('body *').forEach(el => {
      if (!(el instanceof HTMLElement)) return;
      const cs = getComputedStyle(el);
      if (cs.position !== 'fixed') return;
      const rect = el.getBoundingClientRect();
      if (rect.width < window.innerWidth * .98 || rect.height < window.innerHeight * .98) return;
      const invisible = cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) <= .01;
      if (invisible) el.style.setProperty('pointer-events', 'none', 'important');
    });

    const style = document.createElement('style');
    style.id = 'kd-interaction-recovery-style';
    style.textContent = `
      #kdAuthOverlay[hidden],
      #onboardingOverlay:not(.active),
      #tradeModalOverlay:not(.active),
      #screenshotLightbox:not(.active),
      #coachTourOverlay:not(.active),
      #mobileNavScrim:not(.active){ pointer-events:none !important; }
      .brand-hero-art,.brand-hero-art img,.brand-hero::before,.brand-hero::after{ pointer-events:none !important; }
      .nav-item, button, a, input, select, textarea, [role="button"]{ pointer-events:auto; }
    `;
    document.head.appendChild(style);

    setTimeout(hideStaleDashboardLayers, 250);
    setTimeout(hideStaleDashboardLayers, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();
})();
