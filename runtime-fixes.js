/* KriptoDanik AI — runtime fixes v1.0.4 */
(function () {
  'use strict';

  function fixDashboardBalance() {
    if (!window.App) return;
    const app = window.App;
    app.userData = app.userData && typeof app.userData === 'object' ? app.userData : {};
    const capital = Number.parseFloat(app.userData.capital);
    if (!Number.isFinite(capital) || capital <= 0 || capital === 10000) app.userData.capital = 100000;
    try { app.updateBalanceDisplay(); } catch (_) {}
    const balanceDisplay = document.getElementById('balanceDisplay');
    const brandBalance = document.getElementById('brandBalance');
    if (brandBalance) {
      brandBalance.textContent = balanceDisplay?.textContent || '$ ' + Number(app.getCurrentBalance()).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    const brandBalanceSub = document.getElementById('brandBalanceSub');
    if (brandBalanceSub && app.trades.length === 0) brandBalanceSub.textContent = 'Стартовый капитал';
    try { app.saveState(); } catch (_) {}
  }

  function coachMessages() { return document.getElementById('aiMessages'); }
  function coachSection() { return document.getElementById('section-intelligence'); }
  function coachInput() {
    const section = coachSection();
    if (!section) return null;
    return section.querySelector('textarea, input[type="text"]');
  }
  function addCoachMessage(role, text) {
    const box = coachMessages();
    if (!box) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'ai-msg-wrapper ' + (role === 'user' ? 'user' : 'assistant');
    wrapper.style.opacity = '1';
    wrapper.style.transform = 'none';
    const avatar = document.createElement('div');
    avatar.className = 'ai-msg-avatar';
    avatar.textContent = role === 'user' ? 'Я' : 'AI';
    const bubble = document.createElement('div');
    bubble.className = 'ai-msg-bubble';
    bubble.style.whiteSpace = 'pre-wrap';
    bubble.textContent = text;
    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    box.appendChild(wrapper);
    box.scrollTop = box.scrollHeight;
  }

  function buildContext() {
    const app = window.App || {};
    const trades = Array.isArray(app.trades) ? app.trades : [];
    const recent = trades.slice(0, 12).map(t => ({
      date: t?.date, asset: t?.asset, side: t?.side, entry: t?.entry, exit: t?.exit,
      pnl: t?.pnl, rr: t?.rr, status: t?.status, notes: t?.notes
    }));
    return {
      language: app.currentLang || 'ru',
      user: app.userData || {},
      tradeCount: trades.length,
      recentTrades: recent
    };
  }

  async function sendCoachMessage() {
    const input = coachInput();
    const box = coachMessages();
    if (!input || !box) return;
    const message = String(input.value || '').trim();
    if (!message) return;
    input.value = '';
    addCoachMessage('user', message);

    const app = window.App || {};
    if (!Array.isArray(app.aiHistory)) app.aiHistory = [];
    const history = app.aiHistory.slice(-16);
    app.aiHistory.push({ role: 'user', content: message });

    const loading = document.createElement('div');
    loading.className = 'ai-msg-wrapper assistant';
    loading.style.opacity = '1';
    loading.style.transform = 'none';
    loading.innerHTML = '<div class="ai-msg-avatar">AI</div><div class="ai-msg-bubble">Думаю…</div>';
    box.appendChild(loading);
    box.scrollTop = box.scrollHeight;

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, context: buildContext() })
      });
      const data = await response.json().catch(() => ({}));
      loading.remove();
      if (!response.ok) throw new Error(data?.error || `AI Coach: HTTP ${response.status}`);
      const reply = String(data?.reply || '').trim();
      if (!reply) throw new Error('AI Coach вернул пустой ответ.');
      app.aiHistory.push({ role: 'assistant', content: reply });
      addCoachMessage('assistant', reply);
      try { localStorage.setItem('kd_ai_history', JSON.stringify(app.aiHistory.slice(-40))); } catch (_) {}
    } catch (error) {
      loading.remove();
      addCoachMessage('assistant', 'Не удалось получить ответ AI Coach: ' + (error?.message || 'неизвестная ошибка'));
      console.error('KriptoDanik AI Coach:', error);
    }
  }

  function bindCoachChat() {
    if (window.__kdCoachChatBound) return;
    window.__kdCoachChatBound = true;
    document.addEventListener('click', function (event) {
      const button = event.target.closest('button');
      if (!button) return;
      const section = coachSection();
      if (!section || !section.contains(button)) return;
      const label = String(button.textContent || '').trim().toLowerCase();
      if (label.includes('отправ') || label.includes('send') || label === '→' || label.includes('ask')) {
        event.preventDefault();
        sendCoachMessage();
      }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' || event.shiftKey) return;
      const input = event.target;
      const section = coachSection();
      if (!section || !section.contains(input) || !input.matches('textarea, input[type="text"]')) return;
      event.preventDefault();
      sendCoachMessage();
    });
  }

  function fixAICoachWorkspace() {
    const app = window.App;
    const messages = coachMessages();
    const section = coachSection();
    if (!app || !messages || !section) return;
    if (!messages.children.length) {
      try {
        if (Array.isArray(app.aiHistory) && app.aiHistory.length && typeof app.renderAIHistory === 'function') app.renderAIHistory();
        else if (typeof app.renderAIWelcome === 'function') app.renderAIWelcome();
      } catch (error) { console.warn('KriptoDanik AI Coach render fix:', error); }
    }
    if (!messages.children.length) {
      const name = app.userData?.name || 'Трейдер';
      const safeName = String(name).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
      messages.innerHTML = `<div class="ai-msg-wrapper assistant ai-coach-fallback" style="opacity:1;transform:none;"><div class="ai-msg-avatar">AI</div><div class="ai-msg-bubble"><div class="ai-welcome-card"><h2>Добро пожаловать, <strong>${safeName}</strong> 👋</h2><p style="color:var(--text-secondary);font-size:14px;">Ваш персональный AI-коуч готов помочь.</p><div class="stats-grid"><div class="stat-line"><span>📊 Сделок сегодня</span><span>${Array.isArray(app.trades) ? app.trades.filter(t => t.date === new Date().toISOString().slice(0,10)).length : 0}</span></div><div class="stat-line"><span>🎯 Win Rate</span><span class="highlight">—</span></div><div class="stat-line"><span>⚡ Дисциплина</span><span style="color:var(--text-secondary);">Пока нет данных</span></div><div class="stat-line"><span>🚀 Последняя сделка</span><span class="highlight">—</span></div></div><p style="color:var(--text-secondary);font-size:13px;margin-top:12px;">Выберите действие ниже или задайте вопрос.</p></div></div></div>`;
    }
    messages.querySelectorAll('.ai-msg-wrapper').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    try { if (typeof app.scrollToBottom === 'function') app.scrollToBottom(); } catch (_) {}
  }

  function bindAICoachFix() {
    bindCoachChat();
    fixAICoachWorkspace();
    document.querySelectorAll('.nav-item[data-section="intelligence"]').forEach(button => {
      button.addEventListener('click', function () {
        window.setTimeout(fixAICoachWorkspace, 30);
        window.setTimeout(fixAICoachWorkspace, 250);
      });
    });
    const section = coachSection();
    if (section && window.MutationObserver) {
      const observer = new MutationObserver(() => { if (section.classList.contains('active')) fixAICoachWorkspace(); });
      observer.observe(section, { attributes: true, attributeFilter: ['class'] });
    }
  }

  function run() {
    fixDashboardBalance();
    if (typeof window.KDRefreshBrandDashboard === 'function') { window.KDRefreshBrandDashboard(); fixDashboardBalance(); }
    bindAICoachFix();
    window.setTimeout(fixAICoachWorkspace, 150);
    window.setTimeout(fixAICoachWorkspace, 700);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
  window.addEventListener('load', run);
})();
