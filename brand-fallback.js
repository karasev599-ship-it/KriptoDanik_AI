/* KriptoDanik AI — compatibility loader. User-facing branding is provided by kd-rebrand.js. */
(function () {
  'use strict';

  function loadScript(src, marker, onload) {
    try {
      if (window[marker]) return onload && onload();
      if (document.querySelector(`script[data-${marker}]`)) return;
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.dataset[marker] = 'true';
      script.onload = () => { try { window[marker] = true; onload && onload(); } catch (e) { console.warn('KD loader init:', e); } };
      script.onerror = error => console.warn('KD loader:', src, error);
      document.head.appendChild(script);
    } catch (error) { console.warn('KD loader:', error); }
  }

  function applyKDFavicon() {
    try {
      const href = 'assets/favicon.svg?v=2';
      let icon = document.querySelector('link[data-kd-favicon]');
      if (!icon) {
        icon = document.createElement('link');
        icon.rel = 'icon';
        icon.type = 'image/svg+xml';
        icon.dataset.kdFavicon = 'true';
        document.head.appendChild(icon);
      }
      icon.href = href;

      let apple = document.querySelector('link[data-kd-apple-icon]');
      if (!apple) {
        apple = document.createElement('link');
        apple.rel = 'apple-touch-icon';
        apple.dataset.kdAppleIcon = 'true';
        document.head.appendChild(apple);
      }
      apple.href = href;
    } catch (error) { console.warn('KD favicon:', error); }
  }

  function loadRebrand() {
    loadScript('kd-rebrand.js?v=1.9.0', 'kdRebrandLoaded');
  }
  function loadScannerFrontendFix() {
    loadScript('scanner-frontend-fix.js?v=1.9.3', 'kdScannerFrontendFixLoaded');
  }
  function loadTradeImport() {
    if (window.KDTradeImport) return window.KDTradeImport.init();
    loadScript('trade-import.js?v=1.0.0', 'kdTradeImportLoaded', () => window.KDTradeImport && window.KDTradeImport.init());
    if (!document.querySelector('link[data-kd-trade-import-css]')) {
      const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'trade-import.css?v=1.0.0'; link.dataset.kdTradeImportCss = 'true'; document.head.appendChild(link);
    }
  }

  function loadUpgrades() {
    try {
      if (window.KDRefreshAIUpgrades) {
        window.KDRefreshAIUpgrades(); loadScannerFrontendFix(); loadTradeImport(); return;
      }
      if (document.querySelector('script[data-kd-ai-upgrades]')) { loadScannerFrontendFix(); loadTradeImport(); return; }
      const script = document.createElement('script');
      script.src = 'ai-upgrades.js?v=1.9.3'; script.async = true; script.dataset.kdAiUpgrades = 'true';
      script.onload = () => { try { window.KDRefreshAIUpgrades && window.KDRefreshAIUpgrades(); } catch (e) { console.warn('AI upgrades init:', e); } loadScannerFrontendFix(); loadTradeImport(); };
      script.onerror = error => { console.warn('AI upgrades loader:', error); loadScannerFrontendFix(); loadTradeImport(); };
      document.head.appendChild(script);
    } catch (error) { console.warn('KD Intelligence feature loader:', error); loadScannerFrontendFix(); loadTradeImport(); }
  }

  function boot() {
    applyKDFavicon();
    loadRebrand();
    try { if (window.App && typeof window.App.initAIChat === 'function') window.App.initAIChat(); } catch (error) { console.warn('AI Coach init:', error); }
    setTimeout(loadUpgrades, 0); setTimeout(loadScannerFrontendFix, 500); setTimeout(loadTradeImport, 700);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('load', applyKDFavicon); window.addEventListener('load', loadRebrand); window.addEventListener('load', loadUpgrades); window.addEventListener('load', loadScannerFrontendFix); window.addEventListener('load', loadTradeImport);
})();
