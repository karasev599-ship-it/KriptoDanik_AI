/* KriptoDanik AI — brand fallback helpers. AI Coach rendering is owned by app.js. */
(function () {
  'use strict';
  function boot() {
    try {
      if (window.App && typeof window.App.initAIChat === 'function') window.App.initAIChat();
    } catch (error) {
      console.warn('KriptoDanik AI Coach init:', error);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', boot);
})();
