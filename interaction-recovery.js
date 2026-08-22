/* KD Intelligence — interaction recovery layer.
 * Restores navigation and click handling when an optional runtime module
 * or a stale fullscreen layer interferes with the normal UI.
 */
(() => {
  'use strict';

  const inactiveSelectors = [
    '#kdAuthOverlay[hidden]',
    '#onboardingOverlay:not(.active)',
    '#tradeModalOverlay:not(.active)',
    '#screenshotLightbox:not(.active)',
    '#coachTourOverlay:not(.active)',
    '#mobileNavScrim:not(.active)'
  ];

  const activeModal = () => document.querySelector(
    '#kdAuthOverlay:not([hidden]), #onboardingOverlay.active, #tradeModalOverlay.active, #screenshotLightbox.active, #coachTourOverlay.active'
  );

  function cleanInactiveLayers() {
    inactiveSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.setProperty('pointer-events', 'none', 'important');
        el.style.setProperty('display', 'none', 'important');
      });
    });

    document.querySelectorAll('body *').forEach(el => {
      if (!(el instanceof HTMLElement)) return;
      const cs = getComputedStyle(el);
      if (cs.position !== 'fixed') return;
      const rect = el.getBoundingClientRect();
      if (rect.width < window.innerWidth * .98 || rect.height < window.innerHeight * .98) return;
      const invisible = cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) <= .01;
      if (invisible) el.style.setProperty('pointer-events', 'none', 'important');
    });
  }

  function navigate(section) {
    const target = document.getElementById(`section-${section}`);
    if (!target) return false;
    const app = window.App;
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
      item.classList.toggle('active', item.dataset.section === section);
    });
    document.querySelectorAll('.section-content').forEach(el => {
      el.classList.toggle('active', el === target);
    });
    try { app?.showSection?.(section); } catch (e) { console.warn('KD showSection recovery:', e); }
    try { app?.closeMobileNav?.(); } catch (_) {}
    return true;
  }

  function bind() {
    cleanInactiveLayers();

    document.addEventListener('click', event => {
      const nav = event.target?.closest?.('.nav-item[data-section]');
      if (!nav) return;
      event.preventDefault();
      event.stopPropagation();
      navigate(nav.dataset.section);
    }, true);

    const quickMap = {
      brandQuickJournal: 'journal', brandQuickAnalytics: 'analytics',
      brandQuickAcademy: 'academy', brandQuickScanner: 'scanner',
      brandOpenJournal: 'journal', qaOpenJournal: 'journal',
      qaOpenGuardian: 'guardian', qaOpenAnalytics: 'analytics'
    };
    document.addEventListener('click', event => {
      const button = event.target?.closest?.('button[id]');
      const section = button && quickMap[button.id];
      if (!section) return;
      event.preventDefault();
      event.stopPropagation();
      navigate(section);
    }, true);

    // Last-resort hit testing: if a stale transparent layer becomes the
    // event target, elementsFromPoint() still exposes the real button under
    // it. Forward the click only when no legitimate modal is open.
    document.addEventListener('click', event => {
      if (activeModal()) return;
      const direct = event.target?.closest?.('button,a,input,select,textarea,[role="button"]');
      if (direct) return;
      const stack = document.elementsFromPoint(event.clientX, event.clientY);
      const hit = stack.find(el => el instanceof HTMLElement && el.matches('button,a,input,select,textarea,[role="button"]'));
      if (!hit) return;
      event.preventDefault();
      event.stopPropagation();
      try { hit.click(); } catch (_) {}
    }, true);

    const style = document.createElement('style');
    style.id = 'kd-interaction-recovery-style';
    style.textContent = `
      [hidden]{display:none !important;}
      #kdAuthOverlay[hidden],#onboardingOverlay:not(.active),#tradeModalOverlay:not(.active),#screenshotLightbox:not(.active),#coachTourOverlay:not(.active),#mobileNavScrim:not(.active){display:none !important;pointer-events:none !important;}
      .brand-hero::before,.brand-hero::after{pointer-events:none !important;}
    `;
    document.head.appendChild(style);

    const observer = new MutationObserver(cleanInactiveLayers);
    observer.observe(document.documentElement, {subtree:true, attributes:true, attributeFilter:['class','hidden','style']});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, {once:true});
  else bind();
})();
