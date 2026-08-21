/* KriptoDanik AI — feature upgrades
   Loaded by brand-fallback.js after App is available.
   Adds: Vision Scanner bridge, structured Psychology analysis, safe demo dataset.
*/
(function () {
  'use strict';

  const esc = (value) => {
    if (window.App && typeof window.App.escapeHtml === 'function') return window.App.escapeHtml(String(value ?? ''));
    return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  };

  const getJson = async (url, payload) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || `HTTP ${response.status}`);
    return data;
  };

  function addStyles() {
    if (document.getElementById('kd-ai-upgrades-style')) return;
    const style = document.createElement('style');
    style.id = 'kd-ai-upgrades-style';
    style.textContent = `
      .kd-upgrade-panel{margin:14px 0;padding:18px;border:1px solid rgba(138,92,255,.28);border-radius:18px;background:linear-gradient(135deg,rgba(138,92,255,.10),rgba(15,15,24,.78));box-shadow:0 12px 36px rgba(0,0,0,.18)}
      .kd-upgrade-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}
      .kd-upgrade-card{padding:14px;border-radius:14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07)}
      .kd-upgrade-card b{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-secondary);margin-bottom:7px}
      .kd-upgrade-card strong{font-size:16px;line-height:1.35}
      .kd-upgrade-list{margin:8px 0 0;padding-left:18px}.kd-upgrade-list li{margin:7px 0;color:var(--text-secondary);line-height:1.45}
      .kd-upgrade-muted{color:var(--text-secondary);font-size:12px}.kd-upgrade-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
      .kd-demo-panel{margin-top:16px}.kd-demo-status{font-size:12px;color:var(--text-secondary);margin-top:8px}
      .kd-scanner-ai-badge{display:inline-flex;align-items:center;gap:6px;margin-left:8px;padding:4px 8px;border-radius:999px;background:rgba(124,92,252,.14);border:1px solid rgba(124,92,252,.25);font-size:11px}
      @media(max-width:700px){.kd-upgrade-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function renderPsychologyResult(result) {
    const app = window.App;
    if (!app?.aiMessages) return;
    const actions = Array.isArray(result.actionable_advice) ? result.actionable_advice : [];
    const metrics = result.metrics || {};
    const html = `
      <div class="ai-msg-wrapper ai">
        <div class="ai-msg-avatar">AI</div>
        <div class="ai-msg-bubble kd-upgrade-panel">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;"><strong>🧠 AI-анализ психологии</strong><span class="kd-scanner-ai-badge">${result.local ? 'LOCAL' : 'VISION / LLM'}</span></div>
          <div class="kd-upgrade-grid">
            <div class="kd-upgrade-card"><b>Критическая утечка</b><strong>${esc(result.critical_psychology_leak || '—')}</strong></div>
            <div class="kd-upgrade-card"><b>Сильная сторона</b><strong>${esc(result.strong_side || '—')}</strong></div>
            <div class="kd-upgrade-card"><b>Скрытая корреляция</b><strong>${esc(result.hidden_correlation || '—')}</strong></div>
            <div class="kd-upgrade-card"><b>Win Rate / риск</b><strong>${Number(metrics.winRate || 0).toFixed(0)}% · ${Number(metrics.avgRisk || 0).toFixed(2)}%</strong></div>
          </div>
          <div style="margin-top:14px"><b>Что делать</b><ul class="kd-upgrade-list">${actions.map(a => `<li>${esc(a)}</li>`).join('')}</ul></div>
          <div class="kd-upgrade-muted">Проанализировано сделок: ${Number(metrics.total || 0)} · реванш-маркеров: ${Number(metrics.revengeFlags || 0)} · тревожных: ${Number(metrics.fearFlags || 0)} · жадности: ${Number(metrics.greedFlags || 0)}</div>
        </div>
      </div>`;
    app.aiMessages.insertAdjacentHTML('beforeend', html);
    if (typeof app.scrollToBottom === 'function') app.scrollToBottom();
  }

  async function runPsychology() {
    const app = window.App;
    if (!app) return;
    const trades = Array.isArray(app.trades) ? app.trades : [];
    const status = app.showToast ? (message) => app.showToast(message) : () => {};
    try {
      status('🧠 Анализирую психологию по Journal…');
      const result = await getJson('/api/psychology', { trades });
      renderPsychologyResult(result);
    } catch (error) {
      console.error('Psychology analysis failed:', error);
      status('Не удалось запустить AI-анализ психологии.');
    }
  }

  function injectPsychologyButton() {
    const box = document.getElementById('aiSuggestions');
    if (!box || document.getElementById('kdPsychologyBtn')) return;
    const button = document.createElement('button');
    button.className = 'ai-chip';
    button.id = 'kdPsychologyBtn';
    button.innerHTML = '<span class="chip-icon">🧠</span> AI-анализ психологии';
    button.addEventListener('click', runPsychology);
    box.appendChild(button);
  }

  function makeDemoTrades() {
    const assets = ['BTCUSDT','ETHUSDT','XAUUSD','SOLUSDT','EURUSD'];
    const sessions = ['london','ny','asia'];
    const strategies = ['FVG + confirmation','Range breakout','Pin Bar + FVG','Liquidity sweep','Pullback'];
    const emotions = [
      ['calm','calm'],['confident','calm'],['anxious','calm'],['greed','confident'],['revenge','anxious'],
      ['calm','confident'],['calm','calm'],['fear','calm'],['confident','confident'],['revenge','calm'],
      ['calm','calm'],['anxious','calm'],['calm','confident'],['greed','calm'],['calm','calm']
    ];
    const pnlR = [2.0,-1.0,1.5,2.4,-1.2,2.0,1.1,-1.0,2.7,-1.0,1.8,-1.0,2.2,-1.0,1.4];
    const today = new Date();
    return pnlR.map((rr, index) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (14 - index));
      const asset = assets[index % assets.length];
      const entry = asset === 'BTCUSDT' ? 105000 + index * 310 : asset === 'ETHUSDT' ? 3800 + index * 18 : asset === 'XAUUSD' ? 3300 + index * 4 : asset === 'SOLUSDT' ? 185 + index * 1.2 : 1.15 + index * .002;
      const riskPercent = index === 4 || index === 9 ? 1.5 : (index === 13 ? 1.25 : 1);
      const pnl = rr * 100;
      const status = rr > 0 ? 'win' : rr < 0 ? 'loss' : 'breakeven';
      const [emotionBefore, emotionAfter] = emotions[index];
      return {
        id: Date.now() + index,
        date: d.toISOString().slice(0,10), asset,
        side: index % 3 === 0 ? 'SELL' : 'BUY', entry: Number(entry.toFixed(5)),
        exit: Number((entry * (index % 3 === 0 ? 0.998 : 1.002)).toFixed(5)),
        size: 1, riskPercent, rr, pnl, result: `${rr >= 0 ? '+' : ''}${rr.toFixed(1)}R`, status,
        session: sessions[index % sessions.length], strategy: strategies[index % strategies.length],
        emotionBefore, emotionAfter,
        notes: index === 4 || index === 9 ? 'Демо: после убытка появилась попытка отыграться.' : (index === 13 ? 'Демо: риск немного увеличен после серии побед.' : 'Демо-сделка для тестирования аналитики и психологии.')
      };
    });
  }

  function demoPanel() {
    const app = window.App;
    const section = document.getElementById('section-dashboard');
    if (!app || !section || document.getElementById('kdDemoPanel')) return;
    const host = section.querySelector('.brand-side-stack') || section.querySelector('.brand-hero-grid') || section;
    const panel = document.createElement('div');
    panel.id = 'kdDemoPanel';
    panel.className = 'kd-upgrade-panel kd-demo-panel glass-panel';
    panel.innerHTML = `<div><strong>🧪 Демо-режим</strong><p class="kd-upgrade-muted">Добавит 15 синтетических сделок за последние 15 дней. Они помечены как демо и нужны только для проверки графиков, Guardian и AI-психологии.</p></div><div class="kd-demo-actions kd-upgrade-actions"><button class="btn-secondary" id="kdDemoGenerate">Сгенерировать 15 демо-сделок</button><button class="btn-secondary" id="kdDemoRemove" style="display:none;">Удалить демо-данные</button></div><div class="kd-demo-status" id="kdDemoStatus"></div>`;
    host.appendChild(panel);

    const generate = document.getElementById('kdDemoGenerate');
    const remove = document.getElementById('kdDemoRemove');
    const status = document.getElementById('kdDemoStatus');

    const update = () => {
      const hasDemo = (app.trades || []).some(t => t.__kdDemo === true);
      if (generate) generate.style.display = hasDemo || app.trades.length ? 'none' : '';
      if (remove) remove.style.display = hasDemo ? '' : 'none';
      if (status) status.textContent = hasDemo ? 'Демо-данные активны. Нажми «Удалить демо-данные», чтобы вернуть пустой Journal.' : (app.trades.length ? 'В Journal уже есть реальные данные — демо намеренно не смешиваем с ними.' : '');
    };

    generate?.addEventListener('click', () => {
      if (app.trades.length) return;
      const demo = makeDemoTrades().map(t => ({ ...t, __kdDemo: true }));
      app.trades = demo;
      app.filteredTrades = [...demo];
      app.syncAfterTradeChange();
      update();
      app.showToast?.('15 демо-сделок добавлено.');
    });

    remove?.addEventListener('click', () => {
      app.trades = (app.trades || []).filter(t => !t.__kdDemo);
      app.filteredTrades = [...app.trades];
      app.syncAfterTradeChange();
      update();
      app.showToast?.('Демо-данные удалены.');
    });

    update();
  }

  async function analyzeWithVision() {
    const app = window.App;
    if (!app?.scannerScreenshot) return;
    const en = app.currentLang === 'en';
    const status = (text) => { if (app.scannerAnalysisStatus) app.scannerAnalysisStatus.textContent = text; };
    if (app.scannerAnalyzeBtn) app.scannerAnalyzeBtn.disabled = true;
    status(en ? 'AI Vision is reading the chart…' : 'AI Vision распознаёт график…');
    try {
      const result = await getJson('/api/scanner', { image: app.scannerScreenshot });
      if (result.local) {
        status(en ? 'Vision gateway unavailable — falling back to OCR/manual review.' : 'Vision-шлюз недоступен — использую OCR и ручную проверку.');
        if (typeof app.__kdOriginalAnalyzeScannerImage === 'function') await app.__kdOriginalAnalyzeScannerImage();
        return;
      }

      if (app.scannerAsset && result.asset) app.scannerAsset.value = result.asset;
      if (app.scannerTimeframe && result.timeframe) app.scannerTimeframe.value = result.timeframe;
      if (app.scannerEntry && result.entry !== null && result.entry !== undefined) app.scannerEntry.value = result.entry;
      if (app.scannerStopLoss && result.stop_loss !== null && result.stop_loss !== undefined) app.scannerStopLoss.value = result.stop_loss;
      if (app.scannerTakeProfit && result.take_profit !== null && result.take_profit !== undefined) app.scannerTakeProfit.value = result.take_profit;
      if (result.direction && typeof app.setScannerDirection === 'function') app.setScannerDirection(result.direction);
      if (app.scannerSetup) app.scannerSetup.value = result.setup || '';
      if (app.scannerOcrText) app.scannerOcrText.textContent = (result.warnings || []).join(' · ') || 'AI Vision не нашёл дополнительных неоднозначностей.';
      if (app.scannerConfidenceNote) app.scannerConfidenceNote.innerHTML = `<span class="scanner-confidence-badge">AI Vision · ${Math.round(Number(result.confidence) || 0)}% уверенности распознавания</span>`;
      if (app.scannerAnalysisStatus) app.scannerAnalysisStatus.textContent = `Vision-анализ завершён. Проверь поля перед добавлением в Journal.`;

      const labelMap = app.scannerStructureLabels || {};
      const structureText = (result.structures || []).map(s => String(s).toLowerCase());
      Object.entries(labelMap).forEach(([key, label]) => {
        const hay = `${label} ${key}`.toLowerCase();
        const cb = app.scannerStructuresGrid?.querySelector(`[data-structure-cb="${key}"]`);
        if (!cb) return;
        if (structureText.some(s => hay.includes(s) || s.includes(key) || s.includes(String(label).toLowerCase()))) {
          cb.checked = true;
          cb.closest('.scanner-structure-chip')?.classList.add('checked');
        }
      });
    } catch (error) {
      console.error('Vision scanner failed:', error);
      status(en ? 'AI Vision failed — falling back to OCR/manual review.' : 'AI Vision не ответил — перехожу к OCR/ручной проверке.');
      if (typeof app.__kdOriginalAnalyzeScannerImage === 'function') await app.__kdOriginalAnalyzeScannerImage();
    } finally {
      if (app.scannerAnalyzeBtn) app.scannerAnalyzeBtn.disabled = false;
    }
  }

  function patchScanner() {
    const app = window.App;
    if (!app || typeof app.analyzeScannerImage !== 'function' || app.__kdScannerPatched) return;
    app.__kdScannerPatched = true;
    app.__kdOriginalAnalyzeScannerImage = app.analyzeScannerImage.bind(app);
    app.analyzeScannerImage = analyzeWithVision;
  }

  function boot() {
    if (!window.App) return;
    addStyles();
    injectPsychologyButton();
    demoPanel();
    patchScanner();
    window.KDRefreshAIUpgrades = () => { injectPsychologyButton(); demoPanel(); patchScanner(); };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 0));
  else setTimeout(boot, 0);
  window.addEventListener('load', () => setTimeout(boot, 0));
})();
