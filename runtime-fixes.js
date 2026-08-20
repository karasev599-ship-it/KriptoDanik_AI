/* KriptoDanik AI — runtime fixes v1.0.3 */
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

  function fixAICoachWorkspace() {
    const app = window.App;
    const messages = document.getElementById('aiMessages');
    const section = document.getElementById('section-intelligence');

    if (!app || !messages || !section) return;

    // The AI Coach already has a complete renderer in app.js. Re-run it when
    // the workspace was mounted empty (this is what caused the giant blank
    // area seen after navigation in some builds).
    if (!messages.children.length) {
      try {
        if (Array.isArray(app.aiHistory) && app.aiHistory.length) {
          if (typeof app.renderAIHistory === 'function') app.renderAIHistory();
        } else if (typeof app.renderAIWelcome === 'function') {
          app.renderAIWelcome();
        }
      } catch (error) {
        console.warn('KriptoDanik AI Coach render fix:', error);
      }
    }

    // Last-resort visual fallback: never leave the Coach completely empty.
    if (!messages.children.length) {
      const name = app.userData && app.userData.name ? app.userData.name : 'Трейдер';
      const safeName = String(name).replace(/[&<>"']/g, function (c) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
      });
      messages.innerHTML = `
        <div class="ai-msg-wrapper ai-coach-fallback" style="opacity:1;transform:none;">
          <div class="ai-msg-avatar">AI</div>
          <div class="ai-msg-bubble">
            <div class="ai-welcome-card">
              <h2>Добро пожаловать, <strong>${safeName}</strong> 👋</h2>
              <p style="color:var(--text-secondary);font-size:14px;">Ваш персональный AI-коуч готов помочь.</p>
              <div class="stats-grid">
                <div class="stat-line"><span>📊 Сделок сегодня</span><span>${Array.isArray(app.trades) ? app.trades.filter(t => t.date === new Date().toISOString().slice(0,10)).length : 0}</span></div>
                <div class="stat-line"><span>🎯 Win Rate</span><span class="highlight">—</span></div>
                <div class="stat-line"><span>⚡ Дисциплина</span><span style="color:var(--text-secondary);">Пока нет данных</span></div>
                <div class="stat-line"><span>🚀 Последняя сделка</span><span class="highlight">—</span></div>
              </div>
              <p style="color:var(--text-secondary);font-size:13px;margin-top:12px;">Выберите действие ниже или задайте вопрос.</p>
            </div>
          </div>
        </div>`;
    }

    messages.querySelectorAll('.ai-msg-wrapper').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });

    try {
      if (typeof app.scrollToBottom === 'function') app.scrollToBottom();
    } catch (_) {}
  }

  function bindAICoachFix() {
    fixAICoachWorkspace();

    document.querySelectorAll('.nav-item[data-section="intelligence"]').forEach(function (button) {
      button.addEventListener('click', function () {
        window.setTimeout(fixAICoachWorkspace, 30);
        window.setTimeout(fixAICoachWorkspace, 250);
      });
    });

    const section = document.getElementById('section-intelligence');
    if (section && window.MutationObserver) {
      const observer = new MutationObserver(function () {
        if (section.classList.contains('active')) fixAICoachWorkspace();
      });
      observer.observe(section, { attributes: true, attributeFilter: ['class'] });
    }
  }

  function run() {
    fixDashboardBalance();

    if (typeof window.KDRefreshBrandDashboard === 'function') {
      window.KDRefreshBrandDashboard();

      // Старый sync снова мог поставить $0.00.
      // Поэтому восстанавливаем реальный баланс ещё раз.
      fixDashboardBalance();
    }

    bindAICoachFix();
    window.setTimeout(fixAICoachWorkspace, 150);
    window.setTimeout(fixAICoachWorkspace, 700);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }

  window.addEventListener('load', run);
})();
