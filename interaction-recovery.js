/* KD Intelligence — interaction recovery layer.
 * Restores basic navigation if an optional runtime module fails and
 * prevents inactive fullscreen layers from swallowing pointer events.
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

  function cleanInactiveLayers() {
    inactiveSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.setProperty('pointer-events', 'none', 'important');
        if (selector.includes('[hidden]') || !el.classList.contains('active')) {
          el.style.setProperty('display', 'none', 'important');
        }
      });
    });

    // Never allow decorative fixed/absolute backdrops with zero visual
    // presence to become click targets.
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

    // Capture navigation so it still works if another optional listener
    // fails during the normal application boot sequence.
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
