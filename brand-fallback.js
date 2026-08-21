/* KriptoDanik AI — brand fallback + feature upgrade loader. */
(function () {
  'use strict';
  function loadUpgrades() {
    try {
      if (window.KDRefreshAIUpgrades) return window.KDRefreshAIUpgrades();
      if (document.querySelector('script[data-kd-ai-upgrades]')) return;
      const script = document.createElement('script');
      script.src = 'ai-upgrades.js?v=1.9.2';
      script.async = true;
      script.dataset.kdAiUpgrades = 'true';
      script.onload = () => {
        try { if (window.KDRefreshAIUpgrades) window.KDRefreshAIUpgrades(); } catch (error) { console.warn('AI upgrades init:', error); }
      };
      script.onerror = (error) => console.warn('AI upgrades loader:', error);
      document.head.appendChild(script);
    } catch (error) {
      console.warn('KriptoDanik AI feature loader:', error);
    }
  }
  function boot() {
    try {
      if (window.App && typeof window.App.initAIChat === 'function') window.App.initAIChat();
    } catch (error) {
      console.warn('KriptoDanik AI Coach init:', error);
    }
    setTimeout(loadUpgrades, 0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', loadUpgrades);
})();
