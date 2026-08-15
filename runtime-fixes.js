Unsupported Media Type
/* KriptoDanik AI — runtime fixes v1.0.1 */
(function () {
  'use strict';

  function fixDashboardBalance() {
    if (!window.App) return;

    const app = window.App;
    app.userData = app.userData && typeof app.userData === 'object'
      ? app.userData
      : {};

    // Стартовый капитал аккаунта — $100,000.
    // Старый fallback $10,000 мигрируем на $100,000.
    const capital = Number.parseFloat(app.userData.capital);

    if (!Number.isFinite(capital) || capital <= 0 || capital === 10000) {
      app.userData.capital = 100000;
    }

    // Обновляем настоящий баланс приложения.
    try {
      app.updateBalanceDisplay();
    } catch (_) {}

    // Исправляем брендированный KPI.
    // Старый код показывал $0.00 при отсутствии сделок.
    const balanceDisplay = document.getElementById('balanceDisplay');
    const brandBalance = document.getElementById('brandBalance');

    if (brandBalance) {
      const value = balanceDisplay && balanceDisplay.textContent
        ? balanceDisplay.textContent
        : '$ ' + Number(app.getCurrentBalance()).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });

      brandBalance.textContent = value;
    }

    const brandBalanceSub = document.getElementById('brandBalanceSub');

    if (brandBalanceSub && app.trades.length === 0) {
      brandBalanceSub.textContent = 'Стартовый капитал';
    }

    try {
      app.saveState();
    } catch (_) {}
  }

  function run() {
    fixDashboardBalance();

    if (typeof window.KDRefreshBrandDashboard === 'function') {
      window.KDRefreshBrandDashboard();

      // Старый sync снова мог поставить $0.00.
      // Поэтому восстанавливаем реальный баланс ещё раз.
      fixDashboardBalance();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }

  window.addEventListener('load', run);
})();
