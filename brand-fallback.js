/* KriptoDanik AI — brand fallback + feature upgrade loader. */
(function () {
  'use strict';

  function loadScannerFrontendFix() {
    try {
      if (window.KDScannerFrontendFixLoaded) return;
      if (document.querySelector('script[data-kd-scanner-frontend-fix]')) return;
      const script = document.createElement('script');
      script.src = 'scanner-frontend-fix.js?v=1.9.3';
      script.async = true;
      script.dataset.kdScannerFrontendFix = 'true';
      script.onload = () => { window.KDScannerFrontendFixLoaded = true; };
      script.onerror = (error) => console.warn('AI Scanner frontend fix loader:', error);
      document.head.appendChild(script);
    } catch (error) {
      console.warn('AI Scanner frontend fix:', error);
    }
  }

  function loadUpgrades() {
    try {
      if (window.KDRefreshAIUpgrades) {
        window.KDRefreshAIUpgrades();
        loadScannerFrontendFix();
        return;
      }
      if (document.querySelector('script[data-kd-ai-upgrades]')) {
        loadScannerFrontendFix();
        return;
      }
      const script = document.createElement('script');
      script.src = 'ai-upgrades.js?v=1.9.3';
      script.async = true;
      script.dataset.kdAiUpgrades = 'true';
      script.onload = () => {
        try { if (window.KDRefreshAIUpgrades) window.KDRefreshAIUpgrades(); } catch (error) { console.warn('AI upgrades init:', error); }
        loadScannerFrontendFix();
      };
      script.onerror = (error) => {
        console.warn('AI upgrades loader:', error);
        loadScannerFrontendFix();
      };
      document.head.appendChild(script);
    } catch (error) {
      console.warn('KriptoDanik AI feature loader:', error);
      loadScannerFrontendFix();
    }
  }

  function boot() {
    try {
      if (window.App && typeof window.App.initAIChat === 'function') window.App.initAIChat();
    } catch (error) {
      console.warn('KriptoDanik AI Coach init:', error);
    }
    setTimeout(loadUpgrades, 0);
    setTimeout(loadScannerFrontendFix, 500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', loadUpgrades);
  window.addEventListener('load', loadScannerFrontendFix);
})();
