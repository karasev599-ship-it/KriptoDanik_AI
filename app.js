"use strict";

/* ============================================================
   KRIPTODANIK AI — RELEASE CANDIDATE (SPRINT 9)
   ============================================================ */

const KD_BUILD_VERSION = '1.8.2';

const App = {

    // ===== DATA =====
    trades: [],
    filteredTrades: [],
    currentPage: 1,
    pageSize: 10,
    editingTradeId: null,

    currentDate: new Date(),
    selectedDate: new Date(),
    events: [],

    guardianRules: [],
    guardianSummary: { score: null, passed: 0, failed: 0, nodata: 0 },
    guardianViolations: [],

    analyticsCharts: {},
    guardianCharts: {},
    performanceCharts: {},
    equityChartInstance: null,
    dashboardCharts: {},

    currentLang: 'ru',
    userData: {},
    onboardingDone: false,
    accentPalette: ['purple', 'blue', 'green', 'yellow', 'red'],

    aiHistory: [],
    strategies: [],
    builtInStrategy: {
        id: 'builtin_owner_strategy', protected: true, name: 'My Built-in Strategy', market: 'Crypto', timeframe: '4H → 5M',
        tags: ['Built-in','Protected','4H → 5M','Pin Bar','Range','FVG','IFVG'],
        entry: 'На 4H определить максимум и минимум предыдущей сессии. Перенести уровни на 5M и искать ТВХ по Pin Bar, Range, FVG или IFVG. Обязательное условие: должно быть подтверждение.',
        exit: 'Точные правила выхода не заданы в исходном ТЗ.',
        notes: 'Точное определение confirmation владельцем стратегии ещё не задано. Не добавлять самостоятельно дополнительные условия, фильтры или правила.',
        createdAt: '2026-08-13T00:00:00.000Z'
    },
    challenge: {},

    translations: {
        ru: {
            nav_dashboard: 'Дашборд',
            nav_journal: 'Журнал',
            nav_calendar: 'Календарь',
            nav_analytics: 'Аналитика',
            nav_performance: 'Показатели',
            nav_guardian: 'Guardian',
            nav_intelligence: 'AI Коуч',
            nav_settings: 'Настройки',
            nav_academy: 'Академия',
            nav_strategy: 'Библиотека стратегий',
            nav_marketpulse: 'Market Pulse',
            nav_challenge: 'Prop Challenge',
            online: 'AI подключен',
            balance: 'Баланс',
            balance_live: 'Актуальный баланс',
            greeting: 'Добрый день',
            greeting_morning: 'Доброе утро',
            greeting_afternoon: 'Добрый день',
            greeting_evening: 'Добрый вечер',
            welcome: 'Добро пожаловать,',
            equity_curve: 'Кривая доходности',
            total_trades: 'Всего сделок',
            win_rate: 'Win Rate',
            avg_rr: 'Средний RR',
            total_pnl: 'Общий P&L',
            date: 'Дата', asset: 'Актив', side: 'Сторона', entry: 'Вход', exit: 'Выход', rr: 'RR', result: 'Результат', status: 'Статус',
            empty_equity_title: 'Пока нет данных для кривой доходности',
            empty_equity_desc: 'Добавьте первую сделку в Journal — и здесь появится динамика вашего баланса.',
            empty_rdist_title: 'Нет сделок для распределения по R',
            empty_besttime_title: 'Недостаточно истории торговли',
            empty_besttime_desc: 'Как только у вас будет минимум 5 сделок, здесь появится анализ ваших самых результативных торговых сессий.',
            besttime_desc: 'Показывает вашу среднюю доходность (R) по каждой торговой сессии, чтобы вы видели, когда торгуете эффективнее всего.',
            empty_assets_title: 'Нет сделок по активам',
            empty_notifications: 'Уведомлений пока нет.',
            empty_analytics: 'Аналитика пока недоступна.',
            empty_performance: 'Пока недостаточно данных для показателей.',
            empty_guardian: 'Guardian начнёт отслеживать дисциплину после первой сделки.',
            empty_journal: 'Сделок пока нет. Добавьте первую!',
            empty_calendar_events: 'Событий на этот день нет.',
            empty_calendar_trades: 'Сделок в этот день нет.',
            ai_disclaimer: 'KriptoDanik AI не является финансовым советником, не даёт торговых сигналов и не предсказывает направление рынка. Он помогает вам соблюдать собственную торговую стратегию, правила и дисциплину.',

            // ===== v1.0.7 — Smart Dashboard =====
            today_overview: 'Сегодня',
            today_pnl: 'P&L сегодня',
            today_trades: 'Сделок сегодня',
            today_winrate: 'Win Rate сегодня',
            discipline_score: 'Дисциплина',
            no_data_short: '—',
            no_data: 'Нет данных',
            guardian_status: 'Статус Guardian',
            guardian_passed: 'Соблюдено',
            guardian_failed: 'Нарушено',
            guardian_nodata: 'Нет данных',
            guardian_nodata_yet: 'Guardian: нет данных',
            recent_trades: 'Последние сделки',
            no_trades_yet_dash: 'Сделок пока нет',
            add_first_trade: 'Добавить первую сделку',
            quick_actions: 'Быстрые действия',
            qa_add_trade: 'Добавить сделку',
            qa_open_journal: 'Открыть Journal',
            qa_open_guardian: 'Открыть Guardian',
            qa_open_analytics: 'Открыть Analytics',
            dash_welcome_title: 'Добро пожаловать в KriptoDanik AI',
            dash_welcome_no_data: 'Пока нет данных для торговли',
            dash_welcome_cta: 'Начните с записи первой сделки.',
            coach_snapshot: 'AI Coach',
            coach_snapshot_empty: 'Добавьте первую сделку, чтобы получить персональные рекомендации.',
            tour_skip: 'Пропустить тур',

            // ===== v1.0.8 — Academy =====
            academy_header_title: 'Изучите систему. Торгуйте по плану.',
            academy_header_sub: 'Короткие практические уроки про риск, размер позиции, плечо и ликвидацию — плюс настоящий калькулятор.',
            academy_back: 'Назад в Академию',
            nav_scanner: 'AI Scanner',
            scanner_title: 'AI Scanner',
            scanner_sub: 'Загрузите скриншот графика, чтобы начать структурированный разбор сделки — прикрепите его к записи в Journal.',
            scanner_honesty_note: 'В этой сборке пока нет подключённой модели компьютерного зрения, поэтому ничего не определяется автоматически по скриншоту. Вы получите структурированную форму для самостоятельного заполнения, а скриншот прикрепится к сделке для дальнейшего просмотра.',
            scanner_upload_title: 'Загрузите скриншот графика',
            scanner_upload_sub: 'PNG или JPG, до 5МБ',
            scanner_choose_file: 'Выбрать файл',
            scanner_start_over: 'Начать заново',
            scanner_result_title: 'Результат сканирования',
            scanner_asset: 'Актив',
            scanner_direction: 'Направление',
            scanner_timeframe: 'Таймфрейм',
            scanner_entry: 'Вход',
            scanner_stoploss: 'Stop Loss',
            scanner_takeprofit: 'Take Profit',
            scanner_setup: 'Сетап / заметки',
            scanner_structures_title: 'Обнаруженные структуры',
            scanner_structures_note: 'Ничего не определяется автоматически — отметьте структуры, которые вы сами видите на графике.',
            scanner_disclaimer: 'Это не гарантированный сигнал и не обещание прибыли — только структурированный способ зафиксировать то, что вы видите на своём графике. Confidence отражает ручной разбор, а не автоматическую вероятность.',
            scanner_cancel: 'Отмена',
            scanner_confirm: 'Подтвердить → В Journal',
            scanner_not_detected: 'Не определено — требуется подтверждение',
            scanner_confidence_label: 'Confidence: N/A (ручной разбор, без модели компьютерного зрения)',
            scanner_view_screenshot: 'Открыть скриншот',
            scanner_learn_more: 'Подробнее',
            academy_ms_title: 'Структура рынка и Smart Money',
            academy_ms_sub: 'Как читать сам график — гэпы, ордер-блоки, ликвидность, пробои структуры и другое.'
        },
        en: {
            nav_dashboard: 'Dashboard',
            nav_journal: 'Journal',
            nav_calendar: 'Calendar',
            nav_analytics: 'Analytics',
            nav_performance: 'Performance',
            nav_guardian: 'Guardian',
            nav_intelligence: 'AI Coach',
            nav_settings: 'Settings',
            nav_academy: 'Academy',
            nav_strategy: 'Strategy Library',
            nav_marketpulse: 'Market Pulse',
            online: 'AI Connected',
            balance: 'Balance',
            balance_live: 'Live balance',
            greeting: 'Good day',
            greeting_morning: 'Good Morning',
            greeting_afternoon: 'Good Afternoon',
            greeting_evening: 'Good Evening',
            welcome: 'Welcome,',
            equity_curve: 'Equity Curve',
            total_trades: 'Total Trades',
            win_rate: 'Win Rate',
            avg_rr: 'Avg RR',
            total_pnl: 'Total P&L',
            date: 'Date', asset: 'Asset', side: 'Side', entry: 'Entry', exit: 'Exit', rr: 'RR', result: 'Result', status: 'Status',
            empty_equity_title: 'No equity data yet',
            empty_equity_desc: 'Add your first trade in the Journal and your balance history will show up here.',
            empty_rdist_title: 'No trades to build an R-distribution yet',
            empty_besttime_title: 'Not enough trading history',
            empty_besttime_desc: 'Once you have at least 5 trades, this panel will show which trading session tends to work best for you.',
            besttime_desc: 'Shows your average return (R) per trading session, so you can see when you trade most effectively.',
            empty_assets_title: 'No trades by asset yet',
            empty_notifications: 'No notifications yet.',
            empty_analytics: 'No analytics available yet.',
            empty_performance: 'Not enough trading history yet.',
            empty_guardian: 'Guardian will start tracking your discipline after your first trade.',
            empty_journal: 'No trades yet. Add your first one!',
            empty_calendar_events: 'No events on this day.',
            empty_calendar_trades: 'No trades on this day.',
            ai_disclaimer: 'KriptoDanik AI is not a financial advisor, does not give trading signals, and does not predict market direction. It helps you follow your own trading strategy, rules, and discipline.',

            // ===== v1.0.7 — Smart Dashboard =====
            today_overview: 'Today',
            today_pnl: "Today's P&L",
            today_trades: "Today's trades",
            today_winrate: "Today's win rate",
            discipline_score: 'Discipline',
            no_data_short: '—',
            no_data: 'No data',
            guardian_status: 'Guardian Status',
            guardian_passed: 'Passed',
            guardian_failed: 'Failed',
            guardian_nodata: 'No data',
            guardian_nodata_yet: 'Guardian: no data yet',
            recent_trades: 'Recent Trades',
            no_trades_yet_dash: 'No trades yet',
            add_first_trade: 'Add your first trade',
            quick_actions: 'Quick Actions',
            qa_add_trade: 'Add Trade',
            qa_open_journal: 'Open Journal',
            qa_open_guardian: 'Open Guardian',
            qa_open_analytics: 'Open Analytics',
            dash_welcome_title: 'Добро пожаловать в KriptoDanik AI',
            dash_welcome_no_data: 'No trading data yet',
            dash_welcome_cta: 'Start by recording your first trade.',
            coach_snapshot: 'AI Coach',
            coach_snapshot_empty: 'Add your first trade to receive personalized insights.',
            tour_skip: 'Skip tour',

            // ===== v1.0.8 — Academy =====
            academy_header_title: 'Learn the system. Trade with a plan.',
            academy_header_sub: 'Short, practical lessons on risk, position size, leverage, and liquidation — plus a real calculator.',
            academy_back: 'Back to Academy',
            nav_scanner: 'AI Scanner',
            scanner_title: 'AI Scanner',
            scanner_sub: 'Upload a chart screenshot to start a structured trade review — attach it to your Journal entry.',
            scanner_honesty_note: 'This build doesn\'t have a connected vision-AI model yet, so nothing is auto-detected from your screenshot. You\'ll get a structured review form to fill in yourself, with the screenshot attached to the trade for later reference.',
            scanner_upload_title: 'Upload a chart screenshot',
            scanner_upload_sub: 'PNG or JPG, up to 5MB',
            scanner_choose_file: 'Choose file',
            scanner_start_over: 'Start over',
            scanner_result_title: 'Scan Result',
            scanner_asset: 'Asset',
            scanner_direction: 'Direction',
            scanner_timeframe: 'Timeframe',
            scanner_entry: 'Entry',
            scanner_stoploss: 'Stop Loss',
            scanner_takeprofit: 'Take Profit',
            scanner_setup: 'Setup / notes',
            scanner_structures_title: 'Detected Structures',
            scanner_structures_note: 'Nothing is auto-detected — check any structures you identify on this chart yourself.',
            scanner_disclaimer: 'This is not a guaranteed signal or a promise of profit — only a structured way to log what you see on your own chart. Confidence reflects manual review, not an automated probability.',
            scanner_cancel: 'Cancel',
            scanner_confirm: 'Confirm → Add to Journal',
            scanner_not_detected: 'Not detected — needs confirmation',
            scanner_confidence_label: 'Confidence: N/A (manual review, no vision-AI model connected)',
            scanner_view_screenshot: 'View screenshot',
            scanner_learn_more: 'Learn more',
            academy_ms_title: 'Market Structure & Smart Money Concepts',
            academy_ms_sub: 'How to read the chart itself — gaps, order blocks, liquidity, breaks of structure, and more.'
        }
    },

    // Translation lookup helper — falls back to the Russian string, then the key itself.
    t(key) {
        const dict = this.translations[this.currentLang] || this.translations.ru;
        return dict[key] !== undefined ? dict[key] : (this.translations.ru[key] !== undefined ? this.translations.ru[key] : key);
    },

    // ===== INIT =====
    init() {
        this.loadState();
        this.initData();
        this.cacheElements();
        this.bindEvents();
        this.applyTheme();
        this.applyAccent();
        this.renderAll();
        this.updateGreeting();

        if (!this.onboardingDone) {
            this.showOnboarding();
        } else {
            this.applyUserData();
            // v1.0.9 — Returning User UX: a returning user (onboarding already
            // done) previously landed on a blank content area, because no
            // section is marked `.active` by default in the HTML — showSection()
            // is the only thing that ever sets it, and nothing called it here.
            // Reuses the existing showSection()/nav-active logic exactly as the
            // "Open Journal"/"Open Guardian" quick actions already do — no new
            // navigation system, no new state.
            this.navItems.forEach(n => n.classList.remove('active'));
            const dashNav = Array.from(this.navItems).find(n => n.dataset.section === 'dashboard');
            if (dashNav) dashNav.classList.add('active');
            this.showSection('dashboard');
        }
        this.startMarketPulseAutoRefresh();
        console.log(`KriptoDanik AI ${KD_BUILD_VERSION} initialized.`);
    },

    // ===== LOCALSTORAGE =====
    reviveEvents(rawEvents) {
        return (rawEvents || []).map(e => ({ ...e, date: new Date(e.date) })).filter(e => !isNaN(e.date));
    },

    loadState() {
        try {
            const saved = localStorage.getItem('kriptodanik_state');
            if (saved) {
                const state = JSON.parse(saved);
                this.currentLang = state.lang || 'ru';
                this.onboardingDone = state.onboardingDone || false;
                this.userData = state.userData || {};
                this.trades = state.trades || [];
                this.events = this.reviveEvents(state.events);
                this.guardianRules = state.guardianRules || [];
                this.guardianViolations = state.guardianViolations || [];
                this.aiHistory = state.aiHistory || [];
                this.strategies = Array.isArray(state.strategies) ? state.strategies.filter(s => !s.protected) : [];
                this.challenge = state.challenge || {};
            }
        } catch (e) { console.warn('Failed to load state:', e); }
    },

    saveState() {
        try {
            const state = {
                lang: this.currentLang,
                onboardingDone: this.onboardingDone,
                userData: this.userData,
                trades: this.trades,
                events: this.events,
                guardianRules: this.guardianRules,
                guardianViolations: this.guardianViolations,
                aiHistory: this.aiHistory,
                strategies: this.strategies || [],
                challenge: this.challenge || {}
            };
            localStorage.setItem('kriptodanik_state', JSON.stringify(state));
        } catch (e) { console.warn('Failed to save state:', e); }
    },

    // ===== DATA =====
    // NOTE (v1.0.6): brand-new accounts must start completely empty. We never seed
    // trades, events, or Guardian history — only the Guardian RULE DEFINITIONS
    // (the fixed checklist of discipline rules) are initialized, because those are
    // product configuration, not user activity. Their "passed" status is only ever
    // computed from real trades (see updateGuardianStats).
    initData() {
        this.filteredTrades = [...this.trades];
        if (this.guardianRules.length !== 6) this.initGuardianRuleDefinitions();
        this.currentDate = new Date();
        this.selectedDate = new Date();
        if (!Array.isArray(this.strategies)) this.strategies = [];
        if (!this.challenge || typeof this.challenge !== 'object') this.challenge = {};
    },

    initGuardianRuleDefinitions() {
        // Defaults are intentionally NOT "passed: true" — a rule has no
        // business claiming compliance before it has ever been evaluated
        // against real trade data. updateGuardianStats() sets the real
        // state on every call; these are just the safe starting values.
        this.guardianRules = [
            { id: 1, name: 'Риск на сделку ≤ 1%', passed: false, state: 'nodata', icon: '🛡' },
            { id: 2, name: 'Не более 5 сделок в день', passed: false, state: 'nodata', icon: '📊' },
            { id: 3, name: 'Stop Loss всегда установлен', passed: false, state: 'nodata', icon: '🎯' },
            { id: 4, name: 'Дневной лимит не превышен', passed: false, state: 'nodata', icon: '📉' },
            { id: 5, name: 'Нет торговли в эмоциях', passed: false, state: 'nodata', icon: '🧠' },
            { id: 6, name: 'План сделки соблюдён', passed: false, state: 'nodata', icon: '📋' }
        ];
        this.guardianViolations = [];
        this.saveState();
    },

    // ===== ACCOUNT BALANCE (dynamic, always derived from real trades) =====
    getCurrentBalance() {
        const start = parseFloat(this.userData.capital) || 0;
        const pnlSum = this.trades.reduce((sum, t) => sum + (typeof t.pnl === 'number' && !isNaN(t.pnl) ? t.pnl : (parseFloat(t.pnl) || 0)), 0);
        return this.trades.length ? start + pnlSum : 0;
    },

    updateBalanceDisplay() {
        if (this.balanceDisplay) this.balanceDisplay.textContent = '$ ' + this.getCurrentBalance().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    // ===== CACHE =====
    cacheElements() {
        this.navItems = document.querySelectorAll('.nav-item');
        this.sections = {
            strategy: document.getElementById('section-strategy'),
            marketpulse: document.getElementById('section-marketpulse'),
            propintel: document.getElementById('section-propintel'),
            challenge: document.getElementById('section-challenge'),
            dashboard: document.getElementById('section-dashboard'),
            journal: document.getElementById('section-journal'),
            analytics: document.getElementById('section-analytics'),
            calendar: document.getElementById('section-calendar'),
            performance: document.getElementById('section-performance'),
            guardian: document.getElementById('section-guardian'),
            academy: document.getElementById('section-academy'),
            scanner: document.getElementById('section-scanner'),
            intelligence: document.getElementById('section-intelligence'),
            settings: document.getElementById('section-settings')
        };
        this.pageTitle = document.getElementById('pageTitle');
        this.pageGreeting = document.getElementById('pageGreeting');
        this.userNameDisplay = document.getElementById('userNameDisplay');

        // Search & Notifications
        this.searchWrapper = document.getElementById('searchWrapper');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchPopover = document.getElementById('searchPopover');
        this.globalSearchInput = document.getElementById('globalSearchInput');
        this.globalSearchResults = document.getElementById('globalSearchResults');
        this.notifWrapper = document.getElementById('notifWrapper');
        this.notifBtn = document.getElementById('notifBtn');
        this.notifPopover = document.getElementById('notifPopover');
        this.notifResults = document.getElementById('notifResults');
        this.notifBadge = document.getElementById('notifBadge');

        // Dashboard
        this.balanceDisplay = document.getElementById('balanceDisplay');
        this.dailyTargetDisplay = document.getElementById('dailyTargetDisplay');
        this.dailyTargetSub = document.getElementById('dailyTargetSub');
        this.dailyLossDisplay = document.getElementById('dailyLossDisplay');
        this.dailyLossSub = document.getElementById('dailyLossSub');
        this.riskPerTradeDisplay = document.getElementById('riskPerTradeDisplay');
        this.riskPerTradeSub = document.getElementById('riskPerTradeSub');
        this.tpPreferredRR = document.getElementById('tpPreferredRR');
        this.tpSession = document.getElementById('tpSession');
        this.tpTodayProgress = document.getElementById('tpTodayProgress');
        this.tpProgressFill = document.getElementById('tpProgressFill');
        this.winRateDonutChart = document.getElementById('winRateDonutChart');
        this.assetDonutChart = document.getElementById('assetDonutChart');
        this.winRateDisplay = document.getElementById('winRateDisplay');
        this.totalTradesDisplay = document.getElementById('totalTradesDisplay');
        this.winTradesDisplay = document.getElementById('winTradesDisplay');
        this.lossTradesDisplay = document.getElementById('lossTradesDisplay');

        // Journal
        this.journalBody = document.getElementById('journalBody');
        this.filterAsset = document.getElementById('filterAsset');
        this.filterResult = document.getElementById('filterResult');
        this.journalSearch = document.getElementById('journalSearch');
        this.addTradeBtn = document.getElementById('addTradeBtn');
        this.tradeModalOverlay = document.getElementById('tradeModalOverlay');
        this.tradeModalTitle = document.getElementById('tradeModalTitle');
        this.tradeModalCancel = document.getElementById('tradeModalCancel');
        this.tradeModalSave = document.getElementById('tradeModalSave');
        this.tFields = {
            asset: document.getElementById('tAsset'),
            direction: document.getElementById('tDirection'),
            entry: document.getElementById('tEntry'),
            exit: document.getElementById('tExit'),
            size: document.getElementById('tSize'),
            riskPercent: document.getElementById('tRiskPercent'),
            rr: document.getElementById('tRR'),
            pnl: document.getElementById('tPnl'),
            date: document.getElementById('tDate'),
            session: document.getElementById('tSession'),
            strategy: document.getElementById('tStrategy'),
            status: document.getElementById('tStatus'),
            emotionBefore: document.getElementById('tEmotionBefore'),
            emotionAfter: document.getElementById('tEmotionAfter'),
            notes: document.getElementById('tNotes')
        };
        this.tFormError = document.getElementById('tFormError');
        this.journalBadge = document.getElementById('journalBadge');
        this.jTotalTrades = document.getElementById('jTotalTrades');
        this.jWinRate = document.getElementById('jWinRate');
        this.jAvgRR = document.getElementById('jAvgRR');
        this.jTotalPnL = document.getElementById('jTotalPnL');

        // Calendar
        this.calendarGrid = document.getElementById('calendarGrid');
        this.calendarMonth = document.getElementById('calendarMonth');
        this.prevMonthBtn = document.getElementById('prevMonth');
        this.nextMonthBtn = document.getElementById('nextMonth');
        this.selectedDateLabel = document.getElementById('selectedDateLabel');
        this.eventsList = document.getElementById('eventsList');
        this.eventsCount = document.getElementById('eventsCount');
        this.selectedDateTradesLabel = document.getElementById('selectedDateTradesLabel');
        this.dayTradesList = document.getElementById('dayTradesList');
        this.dayTradesCount = document.getElementById('dayTradesCount');
        this.eventInput = document.getElementById('eventInput');
        this.eventType = document.getElementById('eventType');
        this.addEventBtn = document.getElementById('addEventBtn');
        this.calendarBadge = document.getElementById('calendarBadge');

        // Analytics
        this.aTotalPnl = document.getElementById('aTotalPnl');
        this.aWinRate = document.getElementById('aWinRate');
        this.aProfitFactor = document.getElementById('aProfitFactor');
        this.aAvgRR = document.getElementById('aAvgRR');
        this.aTotalTrades = document.getElementById('aTotalTrades');
        this.aWinningTrades = document.getElementById('aWinningTrades');
        this.aLosingTrades = document.getElementById('aLosingTrades');
        this.aAvgWin = document.getElementById('aAvgWin');
        this.aAvgLoss = document.getElementById('aAvgLoss');
        this.aBestDay = document.getElementById('aBestDay');
        this.aWorstDay = document.getElementById('aWorstDay');
        this.aBestTrade = document.getElementById('aBestTrade');
        this.aWorstTrade = document.getElementById('aWorstTrade');
        this.aMaxWinStreak = document.getElementById('aMaxWinStreak');
        this.aMaxLossStreak = document.getElementById('aMaxLossStreak');
        this.analyticsEquityChart = document.getElementById('analyticsEquityChart');
        this.analyticsMonthlyChart = document.getElementById('analyticsMonthlyChart');
        this.analyticsAssetDonutChart = document.getElementById('analyticsAssetDonutChart');

        // Performance
        this.perfTotalReturn = document.getElementById('perfTotalReturn');
        this.perfBestMonth = document.getElementById('perfBestMonth');
        this.perfBestSession = document.getElementById('perfBestSession');
        this.perfTotalTrades = document.getElementById('perfTotalTrades');
        this.perfEquityChart = document.getElementById('perfEquityChart');
        this.perfMonthlyChart = document.getElementById('perfMonthlyChart');
        this.perfSessionsChart = document.getElementById('perfSessionsChart');

        // AI Assistant
        this.aiMessages = document.getElementById('aiMessages');
        this.aiInput = document.getElementById('aiInput');
        this.askBtn = document.getElementById('askBtn');
        this.dashAskBtn = document.getElementById('dashAskBtn');

        // v1.0.7 — Smart Dashboard
        this.dashWelcomeHero = document.getElementById('dashWelcomeHero');
        this.dashWelcomeAddTradeBtn = document.getElementById('dashWelcomeAddTradeBtn');
        this.dashTodayOverview = document.getElementById('dashTodayOverview');
        this.todayPnlDisplay = document.getElementById('todayPnlDisplay');
        this.todayTradesDisplay = document.getElementById('todayTradesDisplay');
        this.todayWinRateDisplay = document.getElementById('todayWinRateDisplay');
        this.todayDisciplineDisplay = document.getElementById('todayDisciplineDisplay');
        this.dashGuardianCard = document.getElementById('dashGuardianCard');
        this.dashRecentTrades = document.getElementById('dashRecentTrades');
        this.qaAddTrade = document.getElementById('qaAddTrade');
        this.qaOpenJournal = document.getElementById('qaOpenJournal');
        this.qaOpenGuardian = document.getElementById('qaOpenGuardian');
        this.qaOpenAnalytics = document.getElementById('qaOpenAnalytics');

        // v1.0.8 — Academy
        this.academyGridView = document.getElementById('academyGridView');
        this.academyLessonView = document.getElementById('academyLessonView');
        this.academyGrid = document.getElementById('academyGrid');
        this.academyLessonBody = document.getElementById('academyLessonBody');
        this.academyBackBtn = document.getElementById('academyBackBtn');
        this.academyGridMS = document.getElementById('academyGridMS');

        // v1.1.0 — AI Scanner
        this.scannerUploadView = document.getElementById('scannerUploadView');
        this.scannerReviewView = document.getElementById('scannerReviewView');
        this.scannerDropzone = document.getElementById('scannerDropzone');
        this.scannerFileInput = document.getElementById('scannerFileInput');
        this.scannerUploadBtn = document.getElementById('scannerUploadBtn');
        this.scannerBackBtn = document.getElementById('scannerBackBtn');
        this.scannerPreviewImg = document.getElementById('scannerPreviewImg');
        this.scannerConfidenceNote = document.getElementById('scannerConfidenceNote');
        this.scannerAsset = document.getElementById('scannerAsset');
        this.scannerTimeframe = document.getElementById('scannerTimeframe');
        this.scannerEntry = document.getElementById('scannerEntry');
        this.scannerStopLoss = document.getElementById('scannerStopLoss');
        this.scannerTakeProfit = document.getElementById('scannerTakeProfit');
        this.scannerSetup = document.getElementById('scannerSetup');
        this.scannerStructuresGrid = document.getElementById('scannerStructuresGrid');
        this.scannerCancelBtn = document.getElementById('scannerCancelBtn');
        this.scannerConfirmBtn = document.getElementById('scannerConfirmBtn');

        this.strategyGrid = document.getElementById('strategyGrid');
        this.strategyEmpty = document.getElementById('strategyEmpty');
        this.strategySearch = document.getElementById('strategySearch');
        this.strategyFilter = document.getElementById('strategyFilter');
        this.strategyAddBtn = document.getElementById('strategyAddBtn');
        this.strategyEmptyBtn = document.getElementById('strategyEmptyBtn');
        this.marketPulseGrid = document.getElementById('marketPulseGrid');
        this.marketRefreshBtn = document.getElementById('marketRefreshBtn');
        this.marketLiveStatus = document.getElementById('marketLiveStatus');
        this.marketLastUpdated = document.getElementById('marketLastUpdated');
        this.marketLatency = document.getElementById('marketLatency');
        this.marketRefreshTimer = null;
        this.challengeSummary = document.getElementById('challengeSummary');
        this.challengeProgressBar = document.getElementById('challengeProgressBar');
        this.challengeStepTitle = document.getElementById('challengeStepTitle');
        this.challengeStatus = document.getElementById('challengeStatus');
        this.challengeProfitText = document.getElementById('challengeProfitText');
        this.challengeTargetText = document.getElementById('challengeTargetText');
        this.challengeRulesList = document.getElementById('challengeRulesList');
        this.challengeChecks = document.getElementById('challengeChecks');
        this.challengeSettingsBtn = document.getElementById('challengeSettingsBtn');
        this.challengeSettingsPanel = document.getElementById('challengeSettingsPanel');
        this.challengeSaveBtn = document.getElementById('challengeSaveBtn');
        this.challengeName = document.getElementById('challengeName');
        this.challengeCapital = document.getElementById('challengeCapital');
        this.challengeTarget1 = document.getElementById('challengeTarget1');
        this.challengeTarget2 = document.getElementById('challengeTarget2');
        this.challengeDaily = document.getElementById('challengeDaily');
        this.challengeMaxDD = document.getElementById('challengeMaxDD');
        this.propIntelRefreshBtn = document.getElementById('propIntelRefreshBtn');
        this.intelOpenChallenge = document.getElementById('intelOpenChallenge');
        this.intelNewsList = document.getElementById('intelNewsList');
        this.intelNewsTabs = document.getElementById('intelNewsTabs');
        this.intelEconomicList = document.getElementById('intelEconomicList');
        this.intelImportantEvents = document.getElementById('intelImportantEvents');
        this.propDirectory = document.getElementById('propDirectory');
        this.propRulesExplained = document.getElementById('propRulesExplained');
        this.propPitfalls = document.getElementById('propPitfalls');
        this.sessionTimeline = document.getElementById('sessionTimeline');
        this.screenshotLightbox = document.getElementById('screenshotLightbox');
        this.lightboxImg = document.getElementById('lightboxImg');
        this.lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
        this.clearChatBtn = document.getElementById('clearChatBtn');
        this.aiSuggestions = document.getElementById('aiSuggestions');

        // Guardian
        this.guardianScore = document.getElementById('guardianScore');
        this.guardianScoreBadge = document.getElementById('guardianScoreBadge');
        this.guardianDayStatus = document.getElementById('guardianDayStatus');
        this.guardianStreak = document.getElementById('guardianStreak');
        this.guardianRulesList = document.getElementById('guardianRulesList');
        this.guardianTimeline = document.getElementById('guardianTimeline');
        this.guardianRecommendations = document.getElementById('guardianRecommendations');
        this.guardianHistoryCount = document.getElementById('guardianHistoryCount');
        this.guardianDisciplineChart = document.getElementById('guardianDisciplineChart');

        // Settings
        this.settingsTabs = document.querySelectorAll('.settings-tab-btn');
        this.settingsContents = document.querySelectorAll('.settings-tab-content');
        this.settingsName = document.getElementById('settingsName');
        this.settingsEmailInput = document.getElementById('settingsEmailInput');
        this.settingsUsernameInput = document.getElementById('settingsUsernameInput');
        this.settingsUsername = document.getElementById('settingsUsername');
        this.settingsEmail = document.getElementById('settingsEmail');
        this.settingsMemberSince = document.getElementById('settingsMemberSince');
        this.settingsPlan = document.getElementById('settingsPlan');
        this.saveProfileBtn = document.getElementById('saveProfileBtn');
        this.settingsCapital = document.getElementById('settingsCapital');
        this.settingsRisk = document.getElementById('settingsRisk');
        this.settingsDailyLoss = document.getElementById('settingsDailyLoss');
        this.settingsDailyTarget = document.getElementById('settingsDailyTarget');
        this.settingsRR = document.getElementById('settingsRR');
        this.settingsTradingStyle = document.getElementById('settingsTradingStyle');
        this.settingsSession = document.getElementById('settingsSession');
        this.saveTradingBtn = document.getElementById('saveTradingBtn');
        this.settingsLang = document.getElementById('settingsLang');
        this.settingsDateFormat = document.getElementById('settingsDateFormat');
        this.settingsCurrency = document.getElementById('settingsCurrency');
        this.themeOptions = document.querySelectorAll('.theme-option');
        this.accentOptions = document.querySelectorAll('.accent-option');
        this.saveAppearanceBtn = document.getElementById('saveAppearanceBtn');
        this.exportTradesBtn = document.getElementById('exportTradesBtn');
        this.exportJournalBtn = document.getElementById('exportJournalBtn');
        this.importDataBtn = document.getElementById('importDataBtn');
        this.clearAllDataBtn = document.getElementById('clearAllDataBtn');

        // Onboarding Wizard
        this.onboardingOverlay = document.getElementById('onboardingOverlay');
        this.onboardingName = document.getElementById('onboardingName');
        this.onboardingCapital = document.getElementById('onboardingCapital');
        this.onboardingRisk = document.getElementById('onboardingRisk');
        this.onboardingDailyTarget = document.getElementById('onboardingDailyTarget');
        this.onboardingDailyLoss = document.getElementById('onboardingDailyLoss');
        this.onboardingRR = document.getElementById('onboardingRR');
        this.onboardingSession = document.getElementById('onboardingSession');
        this.onboardingStrategy = document.getElementById('onboardingStrategy');
        this.onboardingMarkets = document.querySelectorAll('#onboardingMarkets input[type="checkbox"]');
        this.onboardingAssets = document.querySelectorAll('#onboardingAssets input[type="checkbox"]');
        this.wizardProgressBar = document.getElementById('wizardProgressBar');
        this.wizardStepLabel = document.getElementById('wizardStepLabel');
        this.wizardStepTitle = document.getElementById('wizardStepTitle');
        this.wizardStepSubtitle = document.getElementById('wizardStepSubtitle');
        this.wizardStepError = document.getElementById('wizardStepError');
        this.wizardSteps = document.querySelectorAll('.wizard-step');
        this.wizardBackBtn = document.getElementById('wizardBackBtn');
        this.wizardNextBtn = document.getElementById('wizardNextBtn');
        this.resetTradingProfileBtn = document.getElementById('resetTradingProfileBtn');

        // AI Coach product tour
        this.coachTourOverlay = document.getElementById('coachTourOverlay');
        this.tourTitle = document.getElementById('tourTitle');
        this.tourBody = document.getElementById('tourBody');
        this.tourStepLabel = document.getElementById('tourStepLabel');
        this.tourProgressBar = document.getElementById('tourProgressBar');
        this.tourNextBtn = document.getElementById('tourNextBtn');
        this.tourBackBtn = document.getElementById('tourBackBtn');
        this.tourSkipBtn = document.getElementById('tourSkipBtn');

        // Avatar upload
        this.avatarEditBtn = document.getElementById('avatarEditBtn');
        this.avatarFileInput = document.getElementById('avatarFileInput');
        this.headerAvatar = document.getElementById('headerAvatar');
        this.settingsAvatar = document.getElementById('settingsAvatar');

        this.langButtons = document.querySelectorAll('.lang-selector button');

        // v1.0.9.1 — mobile/iPad-portrait nav toggle
        this.mobileNavToggle = document.getElementById('mobileNavToggle');
        this.mobileNavScrim = document.getElementById('mobileNavScrim');
        this.sidebarEl = document.querySelector('.sidebar');
    },

    // ===== BIND EVENTS =====
    bindEvents() {
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                const section = item.dataset.section;
                this.showSection(section);
                this.closeMobileNav();
            });
        });

        // v1.0.9.1 — mobile/iPad-portrait nav toggle (sidebar becomes a
        // slide-in overlay below 768px instead of disappearing with no
        // way to reopen it).
        if (this.mobileNavToggle) this.mobileNavToggle.addEventListener('click', () => this.toggleMobileNav());
        if (this.mobileNavScrim) this.mobileNavScrim.addEventListener('click', () => this.closeMobileNav());

        // Search
        if (this.searchBtn) this.searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closePopover(this.notifPopover);
            this.togglePopover(this.searchPopover);
            if (this.searchPopover.classList.contains('open') && this.globalSearchInput) {
                this.globalSearchInput.focus();
            }
        });
        if (this.globalSearchInput) this.globalSearchInput.addEventListener('input', () => {
            this.renderSearchResults(this.globalSearchInput.value.trim());
        });

        // Notifications
        if (this.notifBtn) this.notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closePopover(this.searchPopover);
            this.togglePopover(this.notifPopover);
            if (this.notifPopover.classList.contains('open')) this.renderNotifications();
        });

        document.addEventListener('click', (e) => {
            if (this.searchWrapper && !this.searchWrapper.contains(e.target)) this.closePopover(this.searchPopover);
            if (this.notifWrapper && !this.notifWrapper.contains(e.target)) this.closePopover(this.notifPopover);
        });

        // Journal
        if (this.addTradeBtn) this.addTradeBtn.addEventListener('click', () => this.openTradeModal());
        if (this.tradeModalCancel) this.tradeModalCancel.addEventListener('click', () => this.closeTradeModal());
        if (this.tradeModalSave) this.tradeModalSave.addEventListener('click', () => this.submitTradeForm());
        if (this.tradeModalOverlay) this.tradeModalOverlay.addEventListener('click', (e) => {
            if (e.target === this.tradeModalOverlay) this.closeTradeModal();
        });
        if (this.filterAsset) this.filterAsset.addEventListener('change', () => this.applyFilters());
        if (this.filterResult) this.filterResult.addEventListener('change', () => this.applyFilters());
        if (this.journalSearch) this.journalSearch.addEventListener('input', () => this.applyFilters());

        // Calendar
        if (this.prevMonthBtn) this.prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
        if (this.nextMonthBtn) this.nextMonthBtn.addEventListener('click', () => this.changeMonth(1));
        if (this.addEventBtn) this.addEventBtn.addEventListener('click', () => this.addEvent());
        if (this.eventInput) this.eventInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.addEvent();
        });

        // AI Assistant
        if (this.askBtn) this.askBtn.addEventListener('click', () => this.handleAIQuery());
        if (this.dashAskBtn) this.dashAskBtn.addEventListener('click', () => {
            this.navItems.forEach(n => n.classList.remove('active'));
            const targetNav = Array.from(this.navItems).find(n => n.dataset.section === 'intelligence');
            if (targetNav) targetNav.classList.add('active');
            this.showSection('intelligence');
        });

        // v1.0.7 — Smart Dashboard: Quick Actions reuse existing
        // navigation (showSection) and the existing trade modal
        // (openTradeModal) — no duplicated logic.
        if (this.dashWelcomeAddTradeBtn) this.dashWelcomeAddTradeBtn.addEventListener('click', () => this.openTradeModal());
        if (this.qaAddTrade) this.qaAddTrade.addEventListener('click', () => this.openTradeModal());
        const goTo = (section) => {
            this.navItems.forEach(n => n.classList.remove('active'));
            const targetNav = Array.from(this.navItems).find(n => n.dataset.section === section);
            if (targetNav) targetNav.classList.add('active');
            this.showSection(section);
            this.closeMobileNav();
        };
        if (this.qaOpenJournal) this.qaOpenJournal.addEventListener('click', () => goTo('journal'));
        if (this.qaOpenGuardian) this.qaOpenGuardian.addEventListener('click', () => goTo('guardian'));
        if (this.qaOpenAnalytics) this.qaOpenAnalytics.addEventListener('click', () => goTo('analytics'));
        if (this.academyBackBtn) this.academyBackBtn.addEventListener('click', () => this.showAcademyGrid());

        // v1.1.0 — AI Scanner
        if (this.scannerUploadBtn) this.scannerUploadBtn.addEventListener('click', () => this.scannerFileInput && this.scannerFileInput.click());
        if (this.scannerDropzone) {
            this.scannerDropzone.addEventListener('click', () => this.scannerFileInput && this.scannerFileInput.click());
            this.scannerDropzone.addEventListener('dragover', (e) => { e.preventDefault(); this.scannerDropzone.classList.add('dragover'); });
            this.scannerDropzone.addEventListener('dragleave', () => this.scannerDropzone.classList.remove('dragover'));
            this.scannerDropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                this.scannerDropzone.classList.remove('dragover');
                if (e.dataTransfer.files && e.dataTransfer.files[0]) this.handleScannerFile(e.dataTransfer.files[0]);
            });
        }
        if (this.scannerFileInput) this.scannerFileInput.addEventListener('change', (e) => this.handleScannerFile(e.target.files[0]));
        if (this.scannerBackBtn) this.scannerBackBtn.addEventListener('click', () => this.showScannerUpload());
        if (this.scannerCancelBtn) this.scannerCancelBtn.addEventListener('click', () => this.showScannerUpload());
        if (this.scannerConfirmBtn) this.scannerConfirmBtn.addEventListener('click', () => this.confirmScannerResult());

        if (this.strategyAddBtn) this.strategyAddBtn.addEventListener('click', () => this.openStrategyModal());
        if (this.strategyEmptyBtn) this.strategyEmptyBtn.addEventListener('click', () => this.openStrategyModal());
        if (this.strategySearch) this.strategySearch.addEventListener('input', () => this.renderStrategyLibrary());
        if (this.strategyFilter) this.strategyFilter.addEventListener('change', () => this.renderStrategyLibrary());
        if (this.marketRefreshBtn) this.marketRefreshBtn.addEventListener('click', () => this.loadMarketPulse());
        if (this.challengeSettingsBtn) this.challengeSettingsBtn.addEventListener('click', () => this.toggleChallengeSettings());
        if (this.challengeSaveBtn) this.challengeSaveBtn.addEventListener('click', () => this.saveChallengeSettings());
        if (this.propIntelRefreshBtn) this.propIntelRefreshBtn.addEventListener('click', () => this.loadPropIntelligence());
        if (this.intelOpenChallenge) this.intelOpenChallenge.addEventListener('click', () => goTo('challenge'));
        if (this.intelNewsTabs) this.intelNewsTabs.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { this.intelNewsTabs.querySelectorAll('button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); this.renderIntelNews(b.dataset.newsCat); }));
        const scannerDirLong = document.getElementById('scannerDirLong');
        const scannerDirShort = document.getElementById('scannerDirShort');
        if (scannerDirLong) scannerDirLong.addEventListener('click', () => { this.scannerDirection = 'long'; scannerDirLong.classList.add('active'); scannerDirShort.classList.remove('active'); });
        if (scannerDirShort) scannerDirShort.addEventListener('click', () => { this.scannerDirection = 'short'; scannerDirShort.classList.add('active'); scannerDirLong.classList.remove('active'); });
        if (this.scannerPreviewImg) this.scannerPreviewImg.addEventListener('click', () => this.openLightbox(this.scannerScreenshot));

        // Screenshot lightbox (Scanner preview + Journal "view screenshot")
        if (this.lightboxCloseBtn) this.lightboxCloseBtn.addEventListener('click', () => this.closeLightbox());
        if (this.screenshotLightbox) this.screenshotLightbox.addEventListener('click', (e) => { if (e.target === this.screenshotLightbox) this.closeLightbox(); });
        if (this.aiInput) this.aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.handleAIQuery();
        });
        if (this.clearChatBtn) this.clearChatBtn.addEventListener('click', () => this.clearChat());
        if (this.aiSuggestions) {
            this.aiSuggestions.querySelectorAll('.ai-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    const query = chip.dataset.query;
                    if (query) {
                        this.aiInput.value = query;
                        this.handleAIQuery();
                    }
                });
            });
        }

        // Settings Tabs & Saves
        this.settingsTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.settingsTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.settingsContents.forEach(c => c.classList.remove('active'));
                const target = document.getElementById('settings-' + tab.dataset.tab);
                if (target) target.classList.add('active');
            });
        });
        if (this.saveProfileBtn) this.saveProfileBtn.addEventListener('click', () => this.saveSettings('profile'));
        if (this.saveTradingBtn) this.saveTradingBtn.addEventListener('click', () => this.saveSettings('trading'));
        if (this.saveAppearanceBtn) this.saveAppearanceBtn.addEventListener('click', () => this.saveSettings('appearance'));

        this.accentOptions.forEach((opt, i) => {
            opt.addEventListener('click', () => {
                this.accentOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                this.userData.accent = this.accentPalette[i] || 'purple';
                this.applyAccent();
                this.saveState();
            });
        });
        this.themeOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                this.themeOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                this.userData.theme = opt.dataset.theme;
                this.applyTheme();
                this.saveState();
            });
        });
        if (this.settingsLang) this.settingsLang.addEventListener('change', () => {
            this.currentLang = this.settingsLang.value;
            this.applyLanguage();
            this.saveState();
            this.langButtons.forEach(b => b.classList.toggle('active', b.dataset.lang === this.currentLang));
        });

        // Data actions
        if (this.exportTradesBtn) this.exportTradesBtn.addEventListener('click', () => this.exportData('trades'));
        if (this.exportJournalBtn) this.exportJournalBtn.addEventListener('click', () => this.exportData('all'));
        if (this.importDataBtn) this.importDataBtn.addEventListener('click', () => this.importData());
        if (this.clearAllDataBtn) this.clearAllDataBtn.addEventListener('click', () => this.clearAllData());

        this.langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentLang = btn.dataset.lang;
                this.applyLanguage();
                this.saveState();
                if (this.settingsLang) this.settingsLang.value = this.currentLang;
            });
        });

        if (this.wizardNextBtn) {
            this.wizardNextBtn.addEventListener('click', () => this.wizardNext());
        }
        if (this.wizardBackBtn) {
            this.wizardBackBtn.addEventListener('click', () => this.wizardBack());
        }
        if (this.resetTradingProfileBtn) {
            this.resetTradingProfileBtn.addEventListener('click', () => this.resetTradingProfile());
        }
        if (this.tourNextBtn) this.tourNextBtn.addEventListener('click', () => this.tourNext());
        if (this.tourBackBtn) this.tourBackBtn.addEventListener('click', () => this.tourBack());
        if (this.tourSkipBtn) this.tourSkipBtn.addEventListener('click', () => this.finishCoachTour());
        // v1.0.7 — keyboard navigation for the tour, only while it's open.
        document.addEventListener('keydown', (e) => {
            if (!this.coachTourOverlay || !this.coachTourOverlay.classList.contains('active')) return;
            if (e.key === 'Escape') { e.preventDefault(); this.finishCoachTour(); }
            else if (e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); this.tourNext(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); this.tourBack(); }
        });
        if (this.avatarEditBtn) this.avatarEditBtn.addEventListener('click', () => this.avatarFileInput && this.avatarFileInput.click());
        if (this.avatarFileInput) this.avatarFileInput.addEventListener('change', (e) => this.handleAvatarUpload(e));
        this.applyLanguage();

        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (typeof window.reinitCharts === 'function') window.reinitCharts();
            }, 250);
        });
    },

    // ===== LANGUAGE =====
    applyLanguage() {
        document.documentElement.lang = this.currentLang;
        const t = this.translations[this.currentLang] || this.translations.ru;
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.dataset.key;
            if (t[key] !== undefined) el.textContent = t[key];
        });
        // Re-render the pieces of the UI whose text is generated dynamically in JS
        // (empty states, notifications, dashboard extras) so a language switch
        // applies instantly everywhere, not just to static labels.
        this.renderNotifications();
        this.renderDashboardExtras();
        this.renderDashboardSmartWidgets();
        this.renderDashboardGuardianCard();
        this.updatePageTitle();
        if (this.trades.length === 0) this.initEquityChart();
        // v1.0.8 — Academy content is generated in JS per language, so it
        // needs an explicit re-render on language switch too.
        if (this.sections && this.sections.academy && this.sections.academy.classList.contains('active')) {
            if (this.currentLessonId && this.academyLessonView && this.academyLessonView.style.display !== 'none') {
                this.openAcademyLesson(this.currentLessonId);
            } else {
                this.renderAcademyGrid();
            }
        }
        // v1.1.0 — re-localize the Scanner review screen's dynamically
        // generated text WITHOUT wiping anything the user has already
        // typed or checked (re-running renderScannerReview() would reset
        // every field back to empty, which would be a real data-loss bug,
        // not just a translation refresh).
        if (this.scannerReviewView && this.scannerReviewView.style.display !== 'none') {
            if (this.scannerConfidenceNote) this.scannerConfidenceNote.innerHTML = `<span class="scanner-confidence-badge">${this.t('scanner_confidence_label')}</span>`;
            if (this.scannerStructuresGrid) {
                this.scannerStructuresGrid.querySelectorAll('.ms-learn-link').forEach(link => {
                    link.textContent = this.t('scanner_learn_more') + ' →';
                });
            }
            [this.scannerAsset, this.scannerTimeframe, this.scannerEntry, this.scannerStopLoss, this.scannerTakeProfit].forEach(el => {
                if (el && !el.value) el.placeholder = this.t('scanner_not_detected');
            });
        }
    },

    // v1.0.9.1 — mobile/iPad-portrait nav toggle
    toggleMobileNav() {
        if (!this.sidebarEl) return;
        const isOpen = this.sidebarEl.classList.toggle('mobile-open');
        if (this.mobileNavScrim) this.mobileNavScrim.classList.toggle('active', isOpen);
    },

    closeMobileNav() {
        if (this.sidebarEl) this.sidebarEl.classList.remove('mobile-open');
        if (this.mobileNavScrim) this.mobileNavScrim.classList.remove('active');
    },

    // ===== THEME & ACCENT =====
    applyTheme() {
        const theme = this.userData.theme || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        this.themeOptions.forEach(o => o.classList.toggle('active', o.dataset.theme === theme));
    },

    applyAccent() {
        const accent = this.userData.accent || 'purple';
        document.documentElement.setAttribute('data-accent', accent);
        const idx = this.accentPalette.indexOf(accent);
        this.accentOptions.forEach((o, i) => o.classList.toggle('active', i === idx));
    },

    // ===== ONBOARDING WIZARD =====
    wizardStepMeta: {
        1: { title: 'Добро пожаловать в KriptoDanik AI', subtitle: 'Давайте настроим ваш профиль трейдера' },
        2: { title: 'Ваши торговые параметры', subtitle: 'Это станет основой вашего Trading Profile' },
        3: { title: 'Ваши предпочтения', subtitle: 'Сессия и любимые рынки/активы' },
        4: { title: 'Ваша торговая стратегия', subtitle: 'Опишите её своими словами' }
    },

    showOnboarding() {
        if (!this.onboardingOverlay) return;
        this.wizardStep = 1;
        this.goToWizardStep(1);
        this.onboardingOverlay.classList.add('active');
    },

    goToWizardStep(step) {
        this.wizardStep = step;
        if (this.wizardSteps) {
            this.wizardSteps.forEach(el => {
                el.style.display = parseInt(el.dataset.step) === step ? '' : 'none';
            });
        }
        const meta = this.wizardStepMeta[step];
        if (meta) {
            if (this.wizardStepTitle) this.wizardStepTitle.textContent = meta.title;
            if (this.wizardStepSubtitle) this.wizardStepSubtitle.textContent = meta.subtitle;
        }
        if (this.wizardStepLabel) this.wizardStepLabel.textContent = `Шаг ${step} из 4`;
        if (this.wizardProgressBar) this.wizardProgressBar.style.width = (step / 4 * 100) + '%';
        if (this.wizardBackBtn) this.wizardBackBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
        if (this.wizardNextBtn) this.wizardNextBtn.textContent = step === 4 ? 'Завершить настройку' : 'Далее';
        if (this.wizardStepError) this.wizardStepError.textContent = '';
    },

    validateWizardStep(step) {
        if (step === 1) {
            if (!this.onboardingName.value.trim()) return 'Пожалуйста, введите ваше имя';
        }
        if (step === 2) {
            if (isNaN(parseFloat(this.onboardingCapital.value)) || parseFloat(this.onboardingCapital.value) <= 0) return 'Укажите начальный баланс';
            if (isNaN(parseFloat(this.onboardingRisk.value)) || parseFloat(this.onboardingRisk.value) <= 0) return 'Укажите риск на сделку';
            if (isNaN(parseFloat(this.onboardingDailyTarget.value)) || parseFloat(this.onboardingDailyTarget.value) <= 0) return 'Укажите дневную цель прибыли';
            if (isNaN(parseFloat(this.onboardingDailyLoss.value)) || parseFloat(this.onboardingDailyLoss.value) <= 0) return 'Укажите максимальный дневной убыток';
        }
        if (step === 3) {
            const marketsChecked = Array.from(this.onboardingMarkets).some(cb => cb.checked);
            const assetsChecked = Array.from(this.onboardingAssets).some(cb => cb.checked);
            if (!marketsChecked) return 'Выберите хотя бы один рынок';
            if (!assetsChecked) return 'Выберите хотя бы один актив';
        }
        if (step === 4) {
            if (!this.onboardingStrategy.value.trim()) return 'Опишите вашу торговую стратегию';
        }
        return null;
    },

    wizardNext() {
        const error = this.validateWizardStep(this.wizardStep);
        if (error) {
            if (this.wizardStepError) this.wizardStepError.textContent = error;
            return;
        }
        if (this.wizardStep < 4) {
            this.goToWizardStep(this.wizardStep + 1);
        } else {
            this.completeOnboarding();
        }
    },

    wizardBack() {
        if (this.wizardStep > 1) this.goToWizardStep(this.wizardStep - 1);
    },

    completeOnboarding() {
        const name = this.onboardingName.value.trim() || 'Trader';
        const capital = parseFloat(this.onboardingCapital.value) || 10000;
        const risk = parseFloat(this.onboardingRisk.value) || 1;
        const dailyTarget = parseFloat(this.onboardingDailyTarget.value) || 800;
        const dailyLoss = parseFloat(this.onboardingDailyLoss.value) || 300;
        const rr = this.onboardingRR.value || '1:2';
        const session = this.onboardingSession.value || 'ny';
        const markets = Array.from(this.onboardingMarkets).filter(cb => cb.checked).map(cb => cb.value);
        const assets = Array.from(this.onboardingAssets).filter(cb => cb.checked).map(cb => cb.value);
        const strategy = this.onboardingStrategy.value.trim();

        this.userData = { ...this.userData, name, capital, risk, dailyTarget, dailyLoss, rr, session, markets, assets, strategy };
        this.onboardingDone = true;
        if (this.onboardingOverlay) this.onboardingOverlay.classList.remove('active');
        this.applyUserData();
        this.saveState();
        // Requirement: never drop a user straight onto the Dashboard after onboarding —
        // greet them and walk them through the workspace first.
        this.showCoachTour();
    },

    // ============================================================
    // FIRST USER EXPERIENCE — AI Coach greeting + interactive product tour
    // ============================================================
    tourSteps: [
        { key: 'intro' },
        { key: 'dashboard', nav: 'dashboard' },
        { key: 'journal', nav: 'journal' },
        { key: 'calendar', nav: 'calendar' },
        { key: 'academy', nav: 'academy' },
        { key: 'strategy', nav: 'strategy' },
        { key: 'marketpulse', nav: 'marketpulse' },
        { key: 'challenge', nav: 'challenge' },
        { key: 'analytics', nav: 'analytics' },
        { key: 'performance', nav: 'performance' },
        { key: 'guardian', nav: 'guardian' },
        { key: 'intelligence', nav: 'intelligence' },
        { key: 'settings', nav: 'settings' },
        { key: 'final' }
    ],

    tourCopy: {
        ru: {
            intro: {
                title: 'Знакомство с KriptoDanik AI',
                body: 'Здравствуйте.<br><br>Меня зовут KriptoDanik AI.<br>Я ваш персональный AI Trading Coach.<br><br>Я никогда не скажу вам, когда покупать или продавать.<br>Я не предсказываю рынок.<br><br>Моя задача — помочь вам сохранять дисциплину, следовать <strong>вашей собственной</strong> торговой стратегии, анализировать прогресс и становиться лучше со временем.<br><br>Прежде чем начать, позвольте познакомить вас с вашим рабочим пространством.'
            },
            dashboard: { title: 'Dashboard', body: 'Здесь вы видите общую картину: текущий баланс, дневную цель, лимит убытка и риск на сделку. Вы будете открывать эту страницу каждый раз, когда садитесь торговать — чтобы свериться с планом на день.' },
            journal: { title: 'Journal', body: 'Journal — это единый источник правды для всего приложения. Каждая сделка, которую вы здесь фиксируете, питает Dashboard, Analytics, Performance и Guardian. Записывайте сюда каждую сделку сразу после её закрытия.' },
            calendar: { title: 'Calendar', body: 'Календарь показывает ваши сделки и события по дням. Используйте его, чтобы увидеть, в какие дни вы торговали, и планировать заметки, анализы или перерывы заранее.' },
            academy: { title: 'Academy', body: 'Академия — обучающий раздел про риск-менеджмент, размер позиции, плечо и ликвидацию, с практическим калькулятором позиции. Материалы объясняют концепции — Guardian отдельно проверяет ваши реальные сделки.' },
            strategy: { title: 'Библиотека стратегий', body: 'Здесь хранятся твои торговые системы: правила входа, стопа, выхода и фильтры. AI Coach помогает сверять журнал с заданными правилами.' },
            marketpulse: { title: 'Market Pulse', body: 'Здесь можно посмотреть актуальный контекст по доступным рынкам. Никаких сигналов и прогнозов — только данные для собственного анализа.' },
            challenge: { title: 'Prop Challenge', body: 'Здесь ты ведёшь отдельный контроль челленджа. Правила задаёшь сам, а прогресс считается только по реальным сделкам из Journal.' },
            analytics: { title: 'Analytics', body: 'Здесь ваша статистика раскладывается по полочкам: Win Rate, Profit Factor, лучшие и худшие сделки, серии побед и поражений. Загляните сюда, когда захотите понять, что реально работает в вашей торговле.' },
            performance: { title: 'Performance', body: 'Performance показывает динамику во времени — помесячно и по торговым сессиям. Полезно раз в неделю или в месяц, чтобы увидеть общий тренд, а не отдельную сделку.' },
            guardian: { title: 'Guardian', body: 'Guardian следит за соблюдением ваших собственных правил риск-менеджмента и дисциплины и подсвечивает нарушения. Он начнёт работать, как только появятся первые сделки.' },
            intelligence: { title: 'AI Coach', body: 'Это я. Спрашивайте меня о дисциплине, психологии, риск-менеджменте, вашей стратегии или о том, что видно в журнале. Я не даю торговых сигналов — я помогаю думать яснее.' },
            settings: { title: 'Settings', body: 'В настройках вы можете изменить профиль, торговые параметры, тему оформления, язык и управлять своими данными — экспорт, импорт, полная очистка.' },
            final: {
                title: 'Приятного использования, KriptoDanik AI',
                body: 'Приятного использования, KriptoDanik AI.<br><br><span class="tour-disclaimer">KriptoDanik AI не является финансовым советником, не даёт торговых сигналов и не предсказывает направление рынка. Он помогает вам соблюдать собственную торговую стратегию, правила и дисциплину.</span><br><br>Каждое торговое решение — ваше. Удачи.'
            }
        },
        en: {
            intro: {
                title: 'Meet KriptoDanik AI',
                body: 'Welcome.<br><br>My name is KriptoDanik AI.<br>I\'m your personal AI Trading Coach.<br><br>I will never tell you when to Buy or Sell.<br>I don\'t predict the market.<br><br>My purpose is to help you stay disciplined, follow <strong>your own</strong> trading strategy, analyze your progress and improve over time.<br><br>Before we begin, let me introduce your trading workspace.'
            },
            dashboard: { title: 'Dashboard', body: 'This is your at-a-glance view: current balance, daily profit goal, daily loss limit, and risk per trade. You\'ll open this every time you sit down to trade, to check in against your plan for the day.' },
            journal: { title: 'Journal', body: 'The Journal is the single source of truth for the whole app. Every trade you log here feeds the Dashboard, Analytics, Performance, and Guardian. Log each trade right after you close it.' },
            calendar: { title: 'Calendar', body: 'The Calendar shows your trades and events by day. Use it to see which days you traded, and to plan notes, reviews, or breaks ahead of time.' },
            academy: { title: 'Academy', body: 'Academy is an educational section covering risk management, position size, leverage, and liquidation, with a practical position-size calculator. It teaches the concepts — Guardian separately checks your real trades.' },
            strategy: { title: 'Strategy Library', body: 'Store your trading systems here: entry, stop, exit and filter rules. AI Coach can help compare Journal data with your rules.' },
            marketpulse: { title: 'Market Pulse', body: 'See current context for supported markets. No signals or predictions — only data for your own analysis.' },
            challenge: { title: 'Prop Challenge', body: 'Track your challenge separately. You define the rules; progress is calculated only from real Journal trades.' },
            analytics: { title: 'Analytics', body: 'This breaks your stats down in detail: win rate, profit factor, best and worst trades, winning and losing streaks. Come here when you want to understand what\'s actually working in your trading.' },
            performance: { title: 'Performance', body: 'Performance shows your trend over time — monthly and by trading session. Useful weekly or monthly, to see the bigger picture rather than a single trade.' },
            guardian: { title: 'Guardian', body: 'Guardian watches whether you\'re sticking to your own risk-management and discipline rules, and flags violations. It starts working as soon as you log your first trades.' },
            intelligence: { title: 'AI Coach', body: 'That\'s me. Ask me about discipline, psychology, risk management, your strategy, or what your journal shows. I don\'t give trading signals — I help you think more clearly.' },
            settings: { title: 'Settings', body: 'In Settings you can edit your profile, trading parameters, appearance theme, language, and manage your data — export, import, or a full reset.' },
            final: {
                title: 'Enjoy using KriptoDanik AI',
                body: 'Enjoy using KriptoDanik AI.<br><br><span class="tour-disclaimer">KriptoDanik AI is not a financial advisor, does not give trading signals, and does not predict market direction. It helps you follow your own trading strategy, rules, and discipline.</span><br><br>Every trading decision is yours. Good luck.'
            }
        }
    },

    showCoachTour() {
        if (!this.coachTourOverlay) return;
        this.tourStepIndex = 0;
        this.goToTourStep(0);
        this.coachTourOverlay.classList.add('active'); this.coachTourOverlay.setAttribute('aria-hidden','false');
    },

    goToTourStep(index) {
        this.tourStepIndex = index;
        const step = this.tourSteps[index];
        const copy = (this.tourCopy[this.currentLang] || this.tourCopy.ru)[step.key];
        if (this.tourTitle) this.tourTitle.textContent = copy.title;
        if (this.tourBody) this.tourBody.innerHTML = copy.body;
        if (this.tourStepLabel) this.tourStepLabel.textContent = `${index + 1} / ${this.tourSteps.length}`;
        if (this.tourProgressBar) this.tourProgressBar.style.width = ((index + 1) / this.tourSteps.length * 100) + '%';
        if (this.tourNextBtn) this.tourNextBtn.textContent = index === this.tourSteps.length - 1
            ? (this.currentLang === 'en' ? 'Start trading' : 'Начать торговать')
            : (this.currentLang === 'en' ? 'Next' : 'Далее');
        if (this.tourBackBtn) this.tourBackBtn.style.visibility = index === 0 ? 'hidden' : 'visible';

        // Highlight the matching nav item, if this step corresponds to one.
        this.navItems.forEach(n => n.classList.remove('tour-highlight'));
        if (step.nav) {
            const navBtn = Array.from(this.navItems).find(n => n.dataset.section === step.nav);
            if (navBtn) navBtn.classList.add('tour-highlight');
        }
    },

    tourNext() {
        if (this.tourStepIndex < this.tourSteps.length - 1) {
            this.goToTourStep(this.tourStepIndex + 1);
        } else {
            this.finishCoachTour();
        }
    },

    tourBack() {
        if (this.tourStepIndex > 0) this.goToTourStep(this.tourStepIndex - 1);
    },

    finishCoachTour() {
        if (this.coachTourOverlay) { this.coachTourOverlay.classList.remove('active'); this.coachTourOverlay.setAttribute('aria-hidden','true'); }
        this.navItems.forEach(n => n.classList.remove('tour-highlight'));
        // Only now does the Dashboard actually open.
        this.navItems.forEach(n => n.classList.remove('active'));
        const dashNav = Array.from(this.navItems).find(n => n.dataset.section === 'dashboard');
        if (dashNav) dashNav.classList.add('active');
        this.showSection('dashboard');
    },

    // v1.1.0 — screenshot lightbox
    openLightbox(src) {
        if (!src || !this.screenshotLightbox || !this.lightboxImg) return;
        this.lightboxImg.src = src;
        this.screenshotLightbox.classList.add('active');
    },
    closeLightbox() {
        if (this.screenshotLightbox) this.screenshotLightbox.classList.remove('active');
    },

    // ===== AVATAR =====
    handleAvatarUpload(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { this.showToast(this.currentLang === 'en' ? 'Please choose an image file' : 'Пожалуйста, выберите файл изображения'); return; }
        if (file.size > 2 * 1024 * 1024) { this.showToast(this.currentLang === 'en' ? 'Image must be under 2MB' : 'Изображение должно быть меньше 2МБ'); return; }
        const reader = new FileReader();
        reader.onload = (ev) => {
            this.userData.avatar = ev.target.result;
            this.applyAvatar();
            this.saveState();
            this.showToast(this.currentLang === 'en' ? 'Avatar updated' : 'Аватар обновлён');
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    },

    getInitial() {
        const name = (this.userData.name || '').trim();
        return name ? name.charAt(0).toUpperCase() : 'T';
    },

    applyAvatar() {
        const avatar = this.userData.avatar;
        [this.headerAvatar, this.settingsAvatar].forEach(el => {
            if (!el) return;
            if (avatar) {
                el.style.backgroundImage = `url(${avatar})`;
                el.style.backgroundSize = 'cover';
                el.style.backgroundPosition = 'center';
                el.textContent = '';
            } else {
                el.style.backgroundImage = '';
                el.textContent = this.getInitial();
            }
        });
    },

    resetTradingProfile() {
        if (!confirm('Сбросить торговый профиль? Journal, Calendar, Analytics, Performance и история Guardian сохранятся.')) return;
        this.userData = {};
        this.onboardingDone = false;
        this.saveState();
        this.showOnboarding();
        this.showToast('Торговый профиль сброшен');
    },

    updateGreeting() {
        const hour = new Date().getHours();
        let key = 'greeting_evening';
        if (hour < 12) key = 'greeting_morning';
        else if (hour < 18) key = 'greeting_afternoon';
        if (this.pageGreeting) this.pageGreeting.textContent = this.t(key);
        this.updatePageTitle();
    },

    // "Welcome, {UserName}" — keeps the <span id="userNameDisplay"> node intact
    // while translating only the leading text, so the name never gets clobbered.
    updatePageTitle() {
        if (!this.pageTitle || !this.pageTitle.firstChild) return;
        this.pageTitle.firstChild.textContent = this.t('welcome') + ' ';
    },

    applyUserData() {
        if (!this.userData || !this.onboardingDone) return;
        this.updateBalanceDisplay();
        if (this.userNameDisplay) this.userNameDisplay.textContent = this.userData.name || 'Трейдер';
        this.applyAvatar();
        this.applyTheme();
        this.applyAccent();
        this.updateGreeting();
        this.renderTradingProfileCards();
        this.renderTodaysProgress();
        
        if (this.settingsName) this.settingsName.value = this.userData.name || '';
        if (this.settingsUsername) this.settingsUsername.textContent = this.userData.name || 'Трейдер';
        if (this.settingsEmail) this.settingsEmail.textContent = this.userData.email || 'user@kriptodanik.ai';
        if (this.settingsMemberSince) this.settingsMemberSince.textContent = this.userData.memberSince || new Date().toLocaleDateString();
        if (this.settingsPlan) this.settingsPlan.textContent = this.userData.plan || 'Pro';
        if (this.settingsCapital) this.settingsCapital.value = this.userData.capital || 10000;
        if (this.settingsRisk) this.settingsRisk.value = this.userData.risk || '1.0';
        if (this.settingsDailyLoss) this.settingsDailyLoss.value = this.userData.dailyLoss || 500;
        if (this.settingsDailyTarget) this.settingsDailyTarget.value = this.userData.dailyTarget || 800;
        if (this.settingsRR) this.settingsRR.value = this.userData.rr || '1:2';
        if (this.settingsTradingStyle) this.settingsTradingStyle.value = this.userData.tradingStyle || 'day';
        if (this.settingsSession) this.settingsSession.value = this.userData.session || 'ny';
        if (this.settingsLang) this.settingsLang.value = this.currentLang || 'ru';
        if (this.settingsCurrency) this.settingsCurrency.value = this.userData.currency || 'USD';
        
        this.updateDashboardStats();
        this.initEquityChart();
        this.initDashboardCharts();
        this.renderDashboardExtras();
        this.updateGuardianStats();
        this.initGuardianChart();
        
        if (this.aiHistory.length === 0) {
            this.renderAIWelcome();
        } else {
            this.renderAIHistory();
        }
    },

    renderTradingProfileCards() {
        const dailyTarget = this.userData.dailyTarget || 0;
        const dailyLoss = this.userData.dailyLoss || 0;
        const risk = this.userData.risk || 0;
        const capital = this.userData.capital || 0;

        if (this.dailyTargetDisplay) this.dailyTargetDisplay.textContent = dailyTarget.toFixed(2) + ' $';
        if (this.dailyLossDisplay) this.dailyLossDisplay.textContent = dailyLoss.toFixed(2) + ' $';
        if (this.riskPerTradeDisplay) this.riskPerTradeDisplay.textContent = risk.toFixed(2) + ' %';
        if (this.riskPerTradeSub) this.riskPerTradeSub.textContent = (capital * risk / 100).toFixed(2) + ' $';

        if (this.tpPreferredRR) this.tpPreferredRR.textContent = this.userData.rr || '—';
        const sessionLabels = { london: 'London', ny: 'New York', asia: 'Asian', sydney: 'Sydney' };
        if (this.tpSession) this.tpSession.textContent = sessionLabels[this.userData.session] || '—';
    },

    renderTodaysProgress() {
        const today = new Date().toISOString().slice(0, 10);
        const todayPnl = this.trades
            .filter(t => t.date === today)
            .reduce((sum, t) => sum + (typeof t.pnl === 'number' && !isNaN(t.pnl) ? t.pnl : 0), 0);

        const dailyTarget = this.userData.dailyTarget || 0;
        const dailyLoss = this.userData.dailyLoss || 0;

        if (this.tpTodayProgress) {
            this.tpTodayProgress.textContent = (todayPnl >= 0 ? '+' : '') + todayPnl.toFixed(2) + ' $';
        }
        if (this.dailyTargetSub) {
            const pct = dailyTarget > 0 ? Math.min(Math.max(todayPnl / dailyTarget * 100, 0), 100) : 0;
            this.dailyTargetSub.textContent = (todayPnl >= 0 ? '+' : '') + todayPnl.toFixed(2) + ' $ (' + pct.toFixed(0) + '%)';
        }
        if (this.dailyLossSub) {
            const lossPct = dailyLoss > 0 ? Math.min(Math.max(-todayPnl / dailyLoss * 100, 0), 100) : 0;
            this.dailyLossSub.textContent = (todayPnl < 0 ? todayPnl.toFixed(2) : '0.00') + ' $ (' + lossPct.toFixed(0) + '%)';
        }
        if (this.tpProgressFill) {
            if (todayPnl >= 0) {
                const pct = dailyTarget > 0 ? Math.min(todayPnl / dailyTarget * 100, 100) : 0;
                this.tpProgressFill.style.width = pct + '%';
                this.tpProgressFill.classList.remove('negative');
            } else {
                const pct = dailyLoss > 0 ? Math.min(-todayPnl / dailyLoss * 100, 100) : 0;
                this.tpProgressFill.style.width = pct + '%';
                this.tpProgressFill.classList.add('negative');
            }
        }
    },

    // ===== NAVIGATION =====
    showSection(section) {
        Object.keys(this.sections).forEach(key => {
            if (this.sections[key]) this.sections[key].classList.toggle('active', key === section);
        });
        this.navItems.forEach(n => n.classList.remove('active'));
        this.navItems.forEach(n => {
            if (n.dataset.section === section) n.classList.add('active');
        });

        if (section === 'journal') { this.renderJournal(); this.updateJournalStats(); }
        if (section === 'calendar') { this.renderCalendar(); this.updateCalendarBadge(); }
        if (section === 'analytics') { this.updateAnalytics(); }
        if (section === 'guardian') { this.updateGuardianStats(); this.initGuardianChart(); }
        if (section === 'academy') { this.renderAcademyGrid(); }
        if (section === 'scanner') { this.showScannerUpload(); }
        if (section === 'performance') { this.updatePerformanceStats(); this.initPerfEquityChart(); this.initPerfMonthlyChart(); this.initPerfSessionsChart(); }
        if (section === 'dashboard') { this.initDashboardCharts(); this.updateDashboardStats(); }
        if (section === 'strategy') { this.renderStrategyLibrary(); }
        if (section === 'marketpulse') { this.renderMarketPulseLoading(); this.loadMarketPulse(); }
        if (section === 'propintel') { this.loadPropIntelligence(); }
        if (section === 'challenge') { this.renderChallenge(); }
        this.applyLanguage();
    },

    // ============================================================
    // STRATEGY LIBRARY / MARKET PULSE / PROP CHALLENGE
    // ============================================================
    renderStrategyLibrary() {
        if (!this.strategyGrid || !this.strategyEmpty) return;
        const q=(this.strategySearch?.value||'').trim().toLowerCase(), filter=this.strategyFilter?.value||'all';
        const list=[this.builtInStrategy,...(this.strategies||[]).filter(x=>!x.protected)].filter(x=>{const hay=[x.name,x.market,x.timeframe,x.entry,x.exit,x.notes,...(x.tags||[])].join(' ').toLowerCase(); return (!q||hay.includes(q))&&(filter==='all'||(filter==='active'?!x.archived:!!x.archived));});
        this.strategyEmpty.style.display=list.length?'none':'block';
        this.strategyGrid.innerHTML=list.map(s=>s.protected?`<article class="strategy-card glass-panel strategy-protected"><div class="strategy-card-head"><div><span class="module-eyebrow">BUILT-IN · PROTECTED</span><h3>${this.escapeHtml(s.name)}</h3></div><span class="strategy-protected-badge">🔒 Protected</span></div><div class="strategy-tags">${s.tags.map(t=>`<span>${this.escapeHtml(t)}</span>`).join('')}</div><div class="strategy-rule"><b>Логика</b><p>${this.escapeHtml(s.entry)}</p></div><div class="strategy-rule"><b>Выход</b><p>${this.escapeHtml(s.exit)}</p></div><div class="strategy-rule"><b>Ограничение</b><p>${this.escapeHtml(s.notes)}</p></div><div class="strategy-footer"><span>Оригинальная стратегия владельца продукта</span><span class="strategy-lock-note">Редактирование и удаление недоступны</span></div></article>`:`<article class="strategy-card glass-panel ${s.archived?'is-archived':''}"><div class="strategy-card-head"><div><span class="module-eyebrow">${s.market||'MARKET'} · ${s.timeframe||'—'}</span><h3>${this.escapeHtml(s.name)}</h3></div><button class="icon-btn" data-strategy-action="archive" data-id="${s.id}">${s.archived?'↩':'⌁'}</button></div><div class="strategy-tags">${(s.tags||[]).slice(0,6).map(t=>`<span>${this.escapeHtml(t)}</span>`).join('')}</div><div class="strategy-rule"><b>Вход</b><p>${this.escapeHtml(s.entry||'Не задано')}</p></div><div class="strategy-rule"><b>Выход</b><p>${this.escapeHtml(s.exit||'Не задано')}</p></div><div class="strategy-footer"><span>Пользовательская стратегия · ${new Date(s.createdAt).toLocaleDateString()}</span><div><button class="btn-secondary small" data-strategy-action="edit" data-id="${s.id}">Изменить</button><button class="btn-danger small" data-strategy-action="delete" data-id="${s.id}">Удалить</button></div></div></article>`).join('');
        this.strategyGrid.querySelectorAll('[data-strategy-action]').forEach(btn=>btn.addEventListener('click',()=>this.handleStrategyAction(btn.dataset.strategyAction,btn.dataset.id)));
    },
    openStrategyModal(id=null) {
        const existing=id?(this.strategies||[]).find(s=>s.id===id):null; if(existing?.protected||id===this.builtInStrategy.id){this.showToast('Protected Strategy нельзя редактировать');return;}
        const ask=(label,val='')=>{const v=prompt(label,val);return v===null?null:v.trim()};
        const name=ask('Название стратегии',existing?.name||'');if(name===null)return; const market=ask('Рынок / инструмент',existing?.market||'');if(market===null)return; const timeframe=ask('Таймфрейм',existing?.timeframe||'');if(timeframe===null)return; const entry=ask('Правила входа',existing?.entry||'');if(entry===null)return; const exit=ask('Правила выхода',existing?.exit||'');if(exit===null)return; const tags=ask('Теги через запятую',(existing?.tags||[]).join(', '));if(tags===null)return; const notes=ask('Дополнительные правила / заметки',existing?.notes||'');if(notes===null)return;
        const item={id:existing?.id||('str_'+Date.now()),protected:false,name:name||'Без названия',market,timeframe,entry,exit,tags:tags.split(',').map(x=>x.trim()).filter(Boolean),notes,archived:existing?.archived||false,createdAt:existing?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};
        this.strategies=existing?this.strategies.map(x=>x.id===id?item:x):[item,...(this.strategies||[]).filter(x=>!x.protected)];this.saveState();this.renderStrategyLibrary();
    },
    handleStrategyAction(action,id){const s=(this.strategies||[]).find(x=>x.id===id);if(!s||s.protected||id===this.builtInStrategy.id){if(s?.protected)this.showToast('Protected Strategy нельзя изменять');return;}if(action==='edit')this.openStrategyModal(id);if(action==='archive'){s.archived=!s.archived;s.updatedAt=new Date().toISOString();this.saveState();this.renderStrategyLibrary();}if(action==='delete'&&confirm('Удалить пользовательскую стратегию?')){this.strategies=this.strategies.filter(x=>x.id!==id);this.saveState();this.renderStrategyLibrary();}},

    renderMarketPulseLoading(){if(this.marketPulseGrid)this.marketPulseGrid.innerHTML='<div class="module-loading glass-panel">Загружаю актуальные данные…</div>';if(this.marketLiveStatus)this.marketLiveStatus.textContent='Обновление…';},
    startMarketPulseAutoRefresh(){
        if(this.marketRefreshTimer) clearInterval(this.marketRefreshTimer);
        this.marketRefreshTimer=setInterval(()=>{
            const section=document.getElementById('section-marketpulse');
            if(section?.classList.contains('active')) this.loadMarketPulse(true);
        },60000);
    },
    marketNum(v){const n=Number(v);return Number.isFinite(n)?n:null;},
    marketFmtPrice(v){const n=this.marketNum(v);if(n===null)return '—';return '$'+n.toLocaleString(undefined,{maximumFractionDigits:n<1?6:2});},
    marketFmtPct(v){const n=this.marketNum(v);if(n===null)return '—';return (n>=0?'+':'')+n.toFixed(2)+'%';},
    getMarketSession(date=new Date()){const h=date.getUTCHours()+date.getUTCMinutes()/60;const sessions=[['Азия',0,8],['Европа',7,16],['США',13,22]];const active=sessions.filter(([,start,end])=>h>=start&&h<end).map(([name])=>name);let current=active.length?active.join(' · '):'Межсессионное окно';let prev=h<7?'США':h<13?'Азия':'Европа';if(h>=22)prev='США';return {current,prev,h};},
    renderMarketSession(){const els={current:document.getElementById('marketCurrentSession'),status:document.getElementById('marketSessionStatus'),clock:document.getElementById('marketSessionClock'),prev:document.getElementById('marketPreviousSession')};if(!els.current)return;const d=new Date(),s=this.getMarketSession(d);els.current.textContent=s.current;els.status.textContent='UTC '+String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0');els.clock.textContent=d.toISOString().slice(0,16).replace('T',' ');els.prev.textContent='Предыдущая основная сессия: '+s.prev+' · логика стратегии: H4 → 5M';const strategy=this.builtInStrategy;const ctx=document.getElementById('marketStrategyContext');const tags=document.getElementById('marketStrategyTags');if(ctx){ctx.textContent='4H: максимум и минимум предыдущей сессии → 5M: поиск ТВХ. Market Pulse показывает сессию и фактический рынок, но не определяет вход.';}if(tags){tags.innerHTML=(strategy.tags||[]).map(t=>`<span>${this.escapeHtml(t)}</span>`).join('');}},
    buildMarketAnalysis(results){const box=document.getElementById('marketAiAnalysis');if(!box)return;const rows=results.map(t=>{const pct=+t.priceChangePercent||0,hi=+t.highPrice,lo=+t.lowPrice,last=+t.lastPrice,range=hi-lo,pos=range?((last-lo)/range*100):50;return {name:t.symbol.replace('USDT',''),pct,pos,volume:+t.quoteVolume||0};});const strongest=[...rows].sort((a,b)=>Math.abs(b.pct)-Math.abs(a.pct))[0];box.innerHTML=`<div class="analysis-list"><div><b>Движение</b><p>${strongest.name} показывает наибольшее 24h изменение среди наблюдаемых активов: <strong>${strongest.pct>=0?'+':''}${strongest.pct.toFixed(2)}%</strong>.</p></div><div><b>Позиция в диапазоне</b><p>Цена ${strongest.name} находится примерно на ${strongest.pos.toFixed(0)}% 24h-диапазона от минимума к максимуму.</p></div><div><b>Что учитывать</b><p>Сверяй контекст с собственной стратегией, риском и временем сессии. Эти данные не являются прогнозом направления.</p></div></div>`;},
    async loadMarketPulse(silent=false){
        if(!this.marketPulseGrid)return;
        this.renderMarketSession();
        if(!silent)this.renderMarketPulseLoading();
        const started=performance.now();
        const symbols=['BTCUSDT','ETHUSDT','SOLUSDT'];
        const endpoint=s=>`https://api.binance.com/api/v3/ticker/24hr?symbol=${s}`;
        try{
            const results=await Promise.all(symbols.map(async symbol=>{const r=await fetch(endpoint(symbol),{cache:'no-store'});if(!r.ok)throw new Error(`${symbol}: ${r.status}`);return r.json();}));
            const latency=Math.round(performance.now()-started);
            const now=new Date();
            const cards=results.map(t=>{
                const pct=this.marketNum(t.priceChangePercent)||0,hi=this.marketNum(t.highPrice),lo=this.marketNum(t.lowPrice),last=this.marketNum(t.lastPrice),range=(hi!==null&&lo!==null)?Math.max(hi-lo,0):0,pos=range?Math.max(0,Math.min(100,(last-lo)/range*100)):50;
                const vol=this.marketNum(t.quoteVolume);
                const name=t.symbol.replace('USDT','');
                return `<article class="pulse-card glass-panel"><div class="pulse-top"><span>${name}/USDT</span><em class="${pct>=0?'positive':'negative'}">${this.marketFmtPct(pct)}</em></div><strong>${this.marketFmtPrice(last)}</strong><div class="pulse-range" title="Положение цены внутри 24h диапазона"><i style="width:${pos}%"></i></div><div class="pulse-range-labels"><span>${this.marketFmtPrice(lo)}</span><span>${pos.toFixed(0)}%</span><span>${this.marketFmtPrice(hi)}</span></div><div class="pulse-row"><span>24h high</span><b>${this.marketFmtPrice(hi)}</b></div><div class="pulse-row"><span>24h low</span><b>${this.marketFmtPrice(lo)}</b></div><div class="pulse-row"><span>Объём 24h</span><b>${vol===null?'—':'$'+vol.toLocaleString(undefined,{maximumFractionDigits:0})}</b></div></article>`;
            }).join('');
            this.marketPulseGrid.innerHTML=cards+`<div class="pulse-source glass-panel">Публичные рыночные данные Binance · ${now.toLocaleTimeString()} · ${latency} ms · без торгового сигнала.</div>`;
            if(this.marketLiveStatus)this.marketLiveStatus.textContent='Онлайн';
            if(this.marketLastUpdated)this.marketLastUpdated.textContent=now.toLocaleTimeString();
            if(this.marketLatency)this.marketLatency.textContent=latency+' ms';
            this.buildMarketAnalysis(results);
            localStorage.setItem('kriptodanik_market_cache',JSON.stringify({savedAt:now.toISOString(),results}));
        }catch(e){
            const cached=JSON.parse(localStorage.getItem('kriptodanik_market_cache')||'null');
            if(cached?.results?.length){
                const age=Math.max(0,Date.now()-new Date(cached.savedAt).getTime());
                this.renderCachedMarket(cached.results,cached.savedAt,age);
                if(this.marketLiveStatus)this.marketLiveStatus.textContent='Офлайн · кэш';
            }else{
                this.marketPulseGrid.innerHTML='<div class="module-empty glass-panel"><div class="module-empty-icon">⌁</div><h3>Рынок недоступен</h3><p>Не удалось получить публичные данные Binance. Никаких выдуманных значений не показываем. Проверь интернет и нажми «Обновить».</p><button class="btn-primary" onclick="App.loadMarketPulse()">Повторить</button></div>';
                if(this.marketLiveStatus)this.marketLiveStatus.textContent='Нет соединения';
                if(this.marketLastUpdated)this.marketLastUpdated.textContent='—';
                if(this.marketLatency)this.marketLatency.textContent='—';
            }
            const box=document.getElementById('marketAiAnalysis');if(box)box.innerHTML='<p class="muted">Анализ строится только после получения фактических данных. Кэш помечается отдельно.</p>';
        }
    },
    renderCachedMarket(results,savedAt,age){
        const ageMin=Math.floor(age/60000);
        this.marketPulseGrid.innerHTML=results.map(t=>{const pct=this.marketNum(t.priceChangePercent)||0,hi=this.marketNum(t.highPrice),lo=this.marketNum(t.lowPrice),last=this.marketNum(t.lastPrice),range=(hi!==null&&lo!==null)?Math.max(hi-lo,0):0,pos=range?Math.max(0,Math.min(100,(last-lo)/range*100)):50;return `<article class="pulse-card glass-panel is-cached"><div class="pulse-top"><span>${t.symbol.replace('USDT','')}/USDT</span><em class="${pct>=0?'positive':'negative'}">${this.marketFmtPct(pct)}</em></div><strong>${this.marketFmtPrice(last)}</strong><div class="pulse-range"><i style="width:${pos}%"></i></div><div class="pulse-range-labels"><span>${this.marketFmtPrice(lo)}</span><span>${pos.toFixed(0)}%</span><span>${this.marketFmtPrice(hi)}</span></div><div class="pulse-row"><span>Статус</span><b>Кэш · ${ageMin} мин</b></div></article>`;}).join('')+`<div class="pulse-source glass-panel">Показан последний успешно полученный снимок рынка от ${new Date(savedAt).toLocaleTimeString()}. Обновление с API сейчас недоступно.</div>`;
        this.buildMarketAnalysis(results);
        if(this.marketLastUpdated)this.marketLastUpdated.textContent=new Date(savedAt).toLocaleTimeString();
        if(this.marketLatency)this.marketLatency.textContent='кэш';
    },
    renderIntelSessions(){
        if(!this.sessionTimeline)return;
        const sessions=[
            ['Sydney','22:00','07:00','Asia-Pacific'],['Tokyo','01:00','10:00','Asia'],['London','10:00','19:00','Europe'],['New York','15:00','00:00','US']
        ];
        const now=new Date(); const mins=now.getHours()*60+now.getMinutes();
        const toMin=x=>{const [h,m]=x.split(':').map(Number);return h*60+m};
        const active=sessions.find(x=>{let a=toMin(x[1]),b=toMin(x[2]); if(b<=a)b+=1440; const n=mins<a?mins+1440:mins; return n>=a&&n<b;});
        this.sessionTimeline.innerHTML=sessions.map(x=>{const on=active&&active[0]===x[0]; return `<div class="session-item ${on?'active':''}"><div><b>${x[0]}</b><span>${x[3]}</span></div><strong>${x[1]}–${x[2]} MSK</strong><em>${on?'OPEN':'CLOSED'}</em></div>`}).join('');
    },
    async loadPropIntelligence(){
        this.renderIntelSessions(); this.renderIntelNews('crypto'); this.renderIntelEconomic(); this.renderIntelImportant(); this.renderPropDirectory(); this.renderPropRules(); this.renderPropPitfalls();
        const state=document.getElementById('intelMarketState'), fg=document.getElementById('intelFearGreed'), summary=document.getElementById('intelMarketSummary'), updated=document.getElementById('intelUpdated'), breadth=document.getElementById('intelBreadth'), ai=document.getElementById('intelAiText');
        try{
            const t0=performance.now();
            const [fgRes,prices]=await Promise.all([fetch('https://api.alternative.me/fng/?limit=1').then(r=>r.json()),Promise.all(['BTCUSDT','ETHUSDT','SOLUSDT'].map(s=>fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${s}`).then(r=>r.json()))) ]);
            const fgv=fgRes?.data?.[0]; const score=fgv?Number(fgv.value):null; const label=fgv?.value_classification||'—';
            const changes=prices.map(x=>Number(x.priceChangePercent)||0); const avg=changes.reduce((a,b)=>a+b,0)/changes.length;
            if(fg)fg.textContent=score===null?'—':`${score} · ${label}`; if(breadth)breadth.textContent=`${changes.filter(x=>x>0).length}/3 ↑`; if(updated)updated.textContent=new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
            const stateText=avg>1?'Рынок заметно растёт':avg<-1?'Рынок заметно снижается':'Рынок без выраженного общего импульса'; if(state)state.textContent=stateText;
            if(summary)summary.textContent=`BTC ${changes[0].toFixed(2)}% · ETH ${changes[1].toFixed(2)}% · SOL ${changes[2].toFixed(2)}%. Среднее изменение: ${avg.toFixed(2)}%. Настроение: ${label}.`;
            if(ai)ai.innerHTML=`<p><b>Наблюдение:</b> ${stateText.toLowerCase()}. Fear & Greed: ${score===null?'нет данных':score+' ('+label+')'}.</p><p><b>Для трейдера:</b> учитывай волатильность и активную сессию, но не превращай эти данные в автоматический сигнал.</p><p class="muted">Обновлено за ${Math.round(performance.now()-t0)} мс. Источники: Binance public API + Alternative.me.</p>`;
        }catch(e){ if(state)state.textContent='Данные рынка недоступны'; if(summary)summary.textContent='Не удалось получить актуальный снимок. Никаких выдуманных значений не показываем.'; if(ai)ai.innerHTML='<p>Проверь интернет и официальный источник. Сигналы на основе отсутствующих данных не формируются.</p>'; }
    },
    renderIntelNews(cat='crypto'){
        if(!this.intelNewsList)return;
        const data={crypto:[['Binance Announcements','Обновления листингов, торговых условий и инфраструктуры','https://www.binance.com/en/support/announcement'],['CoinDesk','Крипторынок и индустриальные события','https://www.coindesk.com/']],forex:[['Federal Reserve','Решения и комментарии ФРС','https://www.federalreserve.gov/newsevents/calendar.htm'],['ECB','Решения и публикации ЕЦБ','https://www.ecb.europa.eu/press/calendars/mgcgc/html/index.en.html']],stocks:[['BLS','Макроэкономические релизы США','https://www.bls.gov/schedule/news_release/'],['SEC','Официальные раскрытия компаний','https://www.sec.gov/news']]}[cat]||[];
        this.intelNewsList.innerHTML=data.map(x=>`<a class="intel-news-item" href="${x[2]}" target="_blank" rel="noopener"><div><b>${x[0]}</b><p>${x[1]}</p></div><span>↗</span></a>`).join('')+`<p class="muted intel-source-note">Лента намеренно показывает первоисточники, а не пересказывает неподтверждённые новости.</p>`;
    },
    renderIntelEconomic(){if(!this.intelEconomicList)return; const e=[['FOMC','Решения ФРС','https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm'],['CPI','Инфляция США','https://www.bls.gov/cpi/'],['NFP','Занятость США','https://www.bls.gov/news.release/empsit.htm'],['ECB','Решения ЕЦБ','https://www.ecb.europa.eu/press/calendars/mgcgc/html/index.en.html']]; this.intelEconomicList.innerHTML=e.map(x=>`<a class="event-row" href="${x[2]}" target="_blank" rel="noopener"><b>${x[0]}</b><span>${x[1]}</span><em>Официальный календарь ↗</em></a>`).join('');},
    renderIntelImportant(){if(!this.intelImportantEvents)return; const e=[['FOMC','Ставка и риторика ФРС','Высокое влияние','https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm'],['CPI','Инфляция США','Высокое влияние','https://www.bls.gov/cpi/'],['NFP','Рынок труда США','Высокое влияние','https://www.bls.gov/news.release/empsit.htm'],['ECB','Решения ЕЦБ','Высокое влияние','https://www.ecb.europa.eu/press/calendars/mgcgc/html/index.en.html']]; this.intelImportantEvents.innerHTML=e.map(x=>`<a class="important-event" href="${x[3]}" target="_blank" rel="noopener"><span class="event-dot high"></span><div><b>${x[0]}</b><p>${x[1]}</p></div><em>${x[2]} ↗</em></a>`).join('');},
    renderPropDirectory(){if(!this.propDirectory)return; const firms=[
        {name:'SpiceProp · Sweet Pepper',region:'Доступность по регионам: проверять перед покупкой',vpn:'Только если официально разрешён',lang:'EN',rules:'Step 1 7.5% · Step 2 5% · Daily 5.5% · Max 11% · 3 profitable days · 1:100',checked:'13.08.2026',url:'https://spiceprop.com/'},
        {name:'FTMO · 2-Step',region:'Регион/KYC: проверять по официальной странице',vpn:'Не делать вывод без официального подтверждения',lang:'EN',rules:'Target 10% / 5% · Daily 5% · Max 10% · Min 4 trading days · unlimited period',checked:'13.08.2026',url:'https://ftmo.com/en/trading-objectives/'},
        {name:'The5ers · High Stakes',region:'Регион/KYC: проверять по официальной странице',vpn:'Проверять правила компании',lang:'EN',rules:'Target 10% / 5% · Daily 5% · Max 10% · Min 3 profitable days · unlimited',checked:'13.08.2026',url:'https://www.the5ers.com/high-stakes/'}]; this.propDirectory.innerHTML=firms.map(f=>`<article class="prop-card"><div class="prop-card-head"><div><span class="module-eyebrow">PROP FIRM</span><h3>${f.name}</h3></div><span class="prop-verified">Проверено ${f.checked}</span></div><div class="prop-facts"><span><b>Регион</b>${f.region}</span><span><b>VPN</b>${f.vpn}</span><span><b>Язык</b>${f.lang}</span><span><b>Ключевые правила</b>${f.rules}</span></div><a class="btn-secondary small" href="${f.url}" target="_blank" rel="noopener">Официальные правила ↗</a></article>`).join('');},
    renderPropRules(){if(!this.propRulesExplained)return; const r=[['Daily Loss','Лимит дневного риска. Смотри не только закрытый P&L: конкретная компания может считать equity, комиссии, свопы и плавающий P&L.','Проверяй метод расчёта на официальной странице.'],['Maximum Drawdown','Общий предел просадки за весь период. Он может быть static или trailing/EOD.','Не путай Max Loss и Max Daily Loss.'],['Best Day / Consistency','Некоторые программы требуют распределять прибыль между днями.','Не пытайся закрыть весь target одной сделкой.'],['Overnight / News','Ограничения по новостям и переносу позиций отличаются по компании и программе.','Перед удержанием позиции открой официальные правила.']]; this.propRulesExplained.innerHTML=r.map(x=>`<article class="rule-explainer"><b>${x[0]}</b><p>${x[1]}</p><small>${x[2]}</small></article>`).join('');},
    renderPropPitfalls(){if(!this.propPitfalls)return; const p=['Считать лимит только по закрытым сделкам, хотя фирма использует equity.','Игнорировать reset time и часовой пояс компании.','Путать static drawdown с trailing drawdown.','Держать позицию через запрещённую новость или выходные.','Считать VPN автоматически разрешённым без подтверждения.','Покупать челлендж, не проверив актуальные правила и KYC.']; this.propPitfalls.innerHTML=p.map((x,i)=>`<div class="pitfall-item"><span>${String(i+1).padStart(2,'0')}</span><p>${x}</p></div>`).join('');},
    toggleChallengeSettings(){if(!this.challengeSettingsPanel)return;const open=this.challengeSettingsPanel.style.display!=='none';this.challengeSettingsPanel.style.display=open?'none':'block';if(!open){const c=this.challenge||{};this.challengeName.value=c.name||'';this.challengeCapital.value=c.capital||'';this.challengeTarget1.value=c.target1??'';this.challengeTarget2.value=c.target2??'';this.challengeDaily.value=c.daily??'';this.challengeMaxDD.value=c.maxDD??'';}},
    saveChallengeSettings(){this.challenge={name:this.challengeName.value.trim()||'Prop Challenge',capital:parseFloat(this.challengeCapital.value)||0,target1:parseFloat(this.challengeTarget1.value)||0,target2:parseFloat(this.challengeTarget2.value)||0,daily:parseFloat(this.challengeDaily.value)||0,maxDD:parseFloat(this.challengeMaxDD.value)||0};this.saveState();this.challengeSettingsPanel.style.display='none';this.renderChallenge();},
    maxDailyLossPercent(){const c=this.challenge||{};const base=parseFloat(c.capital)||parseFloat(this.userData.capital)||0;if(!base)return 0;const byDay={};(this.trades||[]).forEach(t=>{const d=String(t.date||'').slice(0,10);byDay[d]=(byDay[d]||0)+(parseFloat(t.pnl)||0);});const worst=Math.min(0,...Object.values(byDay));return Math.abs(worst/base*100);},
    maxDrawdownPercent(){const base=parseFloat((this.challenge||{}).capital)||parseFloat(this.userData.capital)||0;if(!base)return 0;let equity=base,peak=base,maxDd=0;const ordered=[...(this.trades||[])].sort((a,b)=>new Date(a.date||0)-new Date(b.date||0));ordered.forEach(t=>{equity+=parseFloat(t.pnl)||0;peak=Math.max(peak,equity);maxDd=Math.max(maxDd,(peak-equity)/base*100);});return maxDd;},
    renderChallenge(){if(!this.challengeSummary)return;const c=this.challenge||{};const trades=this.trades||[];const base=parseFloat(c.capital)||parseFloat(this.userData.capital)||0;const pnl=trades.reduce((s,t)=>s+(parseFloat(t.pnl)||0),0);const equity=base+pnl;const dd=this.maxDrawdownPercent();const target1=base*((parseFloat(c.target1)||0)/100);const target2=base*((parseFloat(c.target2)||0)/100);const step1Done=target1>0&&pnl>=target1;const step2Done=step1Done&&target2>0&&pnl>=target1+target2;const activeTarget=step1Done?target2:target1;const activeBase=step1Done?target1:0;const progress=activeTarget>0?Math.max(0,Math.min(100,(pnl-activeBase)/activeTarget*100)):0;const dailyBad=c.daily>0&&this.maxDailyLossPercent()>c.daily;const ddBad=c.maxDD>0&&dd>c.maxDD;const status=!base?'Не настроен':(dailyBad||ddBad?'Нарушение лимита':step2Done?'Челлендж пройден':step1Done?'Шаг 1 выполнен · идёт шаг 2':'В процессе');this.challengeStatus.textContent=status;this.challengeStepTitle.textContent=step2Done?'Челлендж завершён':step1Done?'Шаг 2 · '+(c.target2||0)+'%':'Шаг 1 · '+(c.target1||0)+'%';this.challengeProgressBar.style.width=progress+'%';this.challengeProfitText.textContent=(pnl>=0?'+':'')+pnl.toFixed(2)+' $';this.challengeTargetText.textContent=activeTarget>0?'Цель текущего шага '+activeTarget.toFixed(2)+' $':'Цели не заданы';this.challengeSummary.innerHTML=[['Счёт',base?'$'+base.toLocaleString():'—'],['Equity',base?'$'+equity.toFixed(2):'—'],['P&L',(pnl>=0?'+':'')+'$'+pnl.toFixed(2)],['Max DD',base?dd.toFixed(2)+'%':'—']].map(x=>`<div class="challenge-stat glass-panel"><span>${x[0]}</span><b>${x[1]}</b></div>`).join('');this.challengeRulesList.innerHTML=[['Размер счёта',base?'$'+base.toLocaleString():'Не задан'],['Цель шага 1',c.target1?c.target1+'%':'Не задана'],['Цель шага 2',c.target2?c.target2+'%':'Не задана'],['Дневной лимит',c.daily?c.daily+'%':'Не задан'],['Макс. просадка',c.maxDD?c.maxDD+'%':'Не задана']].map(x=>`<div class="challenge-rule"><span>${x[0]}</span><b>${x[1]}</b></div>`).join('');this.challengeChecks.innerHTML=[['Сделки в Journal',trades.length?'OK · '+trades.length:'Нет данных',!!trades.length],['Дневной лимит',c.daily?(dailyBad?'ПРЕВЫШЕН':'В норме'):'Не задан',c.daily?!dailyBad:null],['Макс. просадка',c.maxDD?(ddBad?'ПРЕВЫШЕНА':'В норме'):'Не задана',c.maxDD?!ddBad:null],['Шаг 1',step1Done?'Выполнен':'В процессе',step1Done],['Шаг 2',step2Done?'Выполнен':(step1Done?'В процессе':'Заблокирован'),step2Done?true:null]].map(x=>`<div class="challenge-check"><span>${x[0]}</span><b class="${x[2]===true?'ok':x[2]===false?'bad':'muted'}">${x[1]}</b></div>`).join('');},

    // ============================================================
    // DASHBOARD
    // ============================================================
    updateDashboardStats() {
        const total = this.trades.length;
        const wins = this.trades.filter(t => t.status === 'win').length;
        const losses = this.trades.filter(t => t.status === 'loss').length;
        
        if (this.totalTradesDisplay) this.totalTradesDisplay.textContent = total;
        if (this.winTradesDisplay) this.winTradesDisplay.textContent = wins + ' (' + (total > 0 ? Math.round(wins/total*100) : 0) + '%)';
        if (this.lossTradesDisplay) this.lossTradesDisplay.textContent = losses + ' (' + (total > 0 ? Math.round(losses/total*100) : 0) + '%)';
        if (this.winRateDisplay) this.winRateDisplay.textContent = (total > 0 ? Math.round(wins/total*100) : 0) + '%';
        if (this.journalBadge) this.journalBadge.textContent = total;
        
        this.initDashboardCharts();
        this.renderDashboardSmartWidgets();
        this.renderBrandRecentTrades();
        this.saveState();
    },

    renderBrandRecentTrades() {
        const box = document.getElementById('brandRecentTrades');
        if (!box) return;
        if (!this.trades.length) {
            box.innerHTML = '<div class="brand-empty-trades"><div>Пока нет реальных сделок</div><small>Добавленные тобой сделки появятся здесь автоматически.</small></div>';
            return;
        }
        box.innerHTML = this.trades.slice(0,5).map(t => {
            const cls = t.status === 'win' ? 'win' : (t.status === 'loss' ? 'loss' : '');
            return `<div class="brand-trade-row"><span>${t.asset || '—'}</span><span>${t.side === 'BUY' ? 'LONG' : 'SHORT'}</span><span>${t.entry ?? '—'}</span><span>${t.exit ?? '—'}</span><span class="${cls}">${t.result || '—'}</span><span>${t.rr || '—'}</span><span>${t.date || '—'}</span></div>`;
        }).join('');
    },

    // ============================================================
    // v1.0.7 — SMART DASHBOARD
    // Reads only real stored state (this.trades, this.guardianRules /
    // this.guardianSummary) — no Math.random, no demo data, no separate
    // Guardian re-implementation. Every empty case renders an honest
    // neutral state instead of a fabricated number.
    // ============================================================
    renderDashboardSmartWidgets() {
        const en = this.currentLang === 'en';
        const total = this.trades.length;

        // Welcome hero — visible ONLY for a genuinely empty account.
        if (this.dashWelcomeHero) this.dashWelcomeHero.style.display = total === 0 ? 'block' : 'none';
        if (this.dashTodayOverview) this.dashTodayOverview.style.opacity = total === 0 ? '0.5' : '1';

        // ----- Today Overview -----
        const today = new Date().toISOString().slice(0, 10);
        const todayTrades = this.trades.filter(t => t.date === today);
        const todayPnl = todayTrades.reduce((sum, t) => sum + (parseFloat(t.pnl) || 0), 0);
        const todayWins = todayTrades.filter(t => t.status === 'win').length;

        if (this.todayPnlDisplay) {
            this.todayPnlDisplay.textContent = todayTrades.length === 0 ? this.t('no_data_short')
                : (todayPnl >= 0 ? '+' : '') + todayPnl.toFixed(2) + ' $';
        }
        if (this.todayTradesDisplay) this.todayTradesDisplay.textContent = todayTrades.length;
        if (this.todayWinRateDisplay) {
            this.todayWinRateDisplay.textContent = todayTrades.length === 0 ? this.t('no_data_short')
                : Math.round(todayWins / todayTrades.length * 100) + '%';
        }
        if (this.todayDisciplineDisplay) {
            const s = this.guardianSummary || {};
            this.todayDisciplineDisplay.textContent = (s.score === null || s.score === undefined) ? this.t('no_data_short') : s.score + '%';
        }

        // ----- Recent Trades -----
        if (this.dashRecentTrades) {
            if (total === 0) {
                this.dashRecentTrades.innerHTML = `<div class="panel-empty-state" style="padding:16px 0;"><div class="panel-empty-title">${this.t('no_trades_yet_dash')}</div></div><button class="btn-secondary full-width" id="dashRecentAddTradeBtn">${this.t('add_first_trade')}</button>`;
                const btn = document.getElementById('dashRecentAddTradeBtn');
                if (btn) btn.addEventListener('click', () => this.openTradeModal());
            } else {
                const recent = this.trades.slice(0, 5);
                let html = '';
                recent.forEach(t => {
                    const resultClass = t.status === 'win' ? 'green' : (t.status === 'loss' ? 'red' : '');
                    html += `
                        <div class="dash-recent-trade-row">
                            <div class="dash-recent-trade-main">
                                <span class="dash-recent-trade-asset">${t.asset}</span>
                                <span class="dash-recent-trade-meta">${t.side} · ${t.date || ''}</span>
                            </div>
                            <span class="dash-recent-trade-result ${resultClass}">${t.result || '—'}</span>
                        </div>`;
                });
                this.dashRecentTrades.innerHTML = html;
            }
        }
    },

    // Guardian Status card — reads this.guardianSummary, computed once
    // inside updateGuardianStats(). No second evaluation pass here.
    renderDashboardGuardianCard() {
        if (!this.dashGuardianCard) return;
        const en = this.currentLang === 'en';
        const s = this.guardianSummary || { score: null, passed: 0, failed: 0, nodata: 0 };
        if (this.trades.length === 0) {
            this.dashGuardianCard.innerHTML = `<div class="panel-empty-state" style="padding:12px 0;"><div class="panel-empty-title">${this.t('guardian_nodata_yet')}</div></div>`;
            return;
        }
        this.dashGuardianCard.innerHTML = `
            <div class="dash-guardian-summary">
                <div class="dash-guardian-score-row">
                    <span class="score-num">${s.score === null ? '—' : s.score + '%'}</span>
                </div>
                <div class="dash-guardian-breakdown">
                    <span class="green">✅ ${s.passed} ${this.t('guardian_passed')}</span>
                    <span class="red">⚠️ ${s.failed} ${this.t('guardian_failed')}</span>
                    <span style="color:var(--text-secondary);">— ${s.nodata} ${this.t('guardian_nodata')}</span>
                </div>
            </div>`;
    },

    initDashboardCharts() {
        const total = this.trades.length;
        const wins = this.trades.filter(t => t.status === 'win').length;
        const losses = this.trades.filter(t => t.status === 'loss').length;
        
        if (this.winRateDonutChart) {
            if (this.dashboardCharts.winRate) this.dashboardCharts.winRate.destroy();
            this.dashboardCharts.winRate = new Chart(this.winRateDonutChart, {
                type: 'doughnut',
                data: { labels: ['Побед', 'Поражений'], datasets: [{ data: [wins || 1, losses || 1], backgroundColor: ['#43c6a0', '#ef4444'], borderColor: '#13161c', borderWidth: 3 }] },
                options: { responsive: true, maintainAspectRatio: false, cutout: '78%', plugins: { legend: { display: false } } }
            });
        }

        if (this.assetDonutChart) {
            if (this.dashboardCharts.asset) this.dashboardCharts.asset.destroy();
            const assetsMap = {};
            this.trades.forEach(t => { if(!assetsMap[t.asset]) assetsMap[t.asset] = 0; assetsMap[t.asset]++; });
            const labels = Object.keys(assetsMap);
            const data = Object.values(assetsMap);
            this.dashboardCharts.asset = new Chart(this.assetDonutChart, {
                type: 'doughnut', data: { labels: labels, datasets: [{ data: data.length ? data : [1], backgroundColor: ['#7c5cfc', '#fbbf24', '#43c6a0', '#ef4444', '#f97316'], borderColor: '#13161c', borderWidth: 2 }] },
                options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { display: false } } }
            });
        }
    },

    // ============================================================
    // DASHBOARD — R-distribution, Best Trading Time, Asset list, AI box
    // These panels used to ship as static fake HTML. They now render
    // entirely from real trade data and show honest empty states.
    // ============================================================
    renderDashboardExtras() {
        this.renderRDistribution();
        this.renderBestTradingTime();
        this.renderAssetList();
        this.renderDashAIInsight();
    },

    renderRDistribution() {
        const container = document.getElementById('rDistributionBody');
        if (!container) return;
        if (this.trades.length === 0) {
            container.innerHTML = '';
            this.renderEmptyState(container, this.t('empty_rdist_title'));
            return;
        }
        const buckets = [
            { label: '> 3R', min: 3, max: Infinity },
            { label: '2R – 3R', min: 2, max: 3 },
            { label: '1R – 2R', min: 1, max: 2 },
            { label: '0R – 1R', min: 0, max: 1 },
            { label: '< 0R', min: -Infinity, max: 0 }
        ];
        const rrValues = this.trades.map(t => parseFloat(t.rr)).filter(v => !isNaN(v));
        const total = rrValues.length || 1;
        const counts = buckets.map(b => rrValues.filter(v => v >= b.min && v < b.max).length);
        const maxCount = Math.max(...counts, 1);
        let html = '';
        buckets.forEach((b, i) => {
            const count = counts[i];
            const pct = Math.round(count / total * 100);
            const widthPct = Math.round(count / maxCount * 100);
            html += `<div class="bar-row"><span class="bar-label">${b.label}</span><div class="bar-track"><div class="bar-fill" style="width:${widthPct}%;"></div></div><span class="bar-val">${count} (${pct}%)</span></div>`;
        });
        container.innerHTML = html;
    },

    // "Best Trading Time" is computed per trading SESSION (London/NY/Asian/Sydney),
    // since that's the timing data we actually collect per trade — not a fabricated
    // hour-by-hour heatmap we have no real data to back up.
    renderBestTradingTime() {
        const container = document.getElementById('bestTimeBody');
        if (!container) return;
        const MIN_TRADES = 5;
        if (this.trades.length < MIN_TRADES) {
            container.innerHTML = '';
            this.renderEmptyState(container, this.t('empty_besttime_title'), this.t('empty_besttime_desc'));
            return;
        }
        const sessionLabels = { london: 'London', ny: 'New York', asia: 'Asian', sydney: 'Sydney' };
        const totals = {};
        this.trades.forEach(t => {
            const key = t.session && sessionLabels[t.session] ? t.session : null;
            if (!key) return;
            if (!totals[key]) totals[key] = { rr: 0, count: 0 };
            totals[key].rr += parseFloat(t.rr) || 0;
            totals[key].count++;
        });
        const rows = Object.keys(totals).map(k => ({ label: sessionLabels[k], avgRR: totals[k].rr / totals[k].count, count: totals[k].count }));
        if (rows.length === 0) {
            this.renderEmptyState(container, this.t('empty_besttime_title'), this.t('empty_besttime_desc'));
            return;
        }
        rows.sort((a, b) => b.avgRR - a.avgRR);
        const maxAbs = Math.max(...rows.map(r => Math.abs(r.avgRR)), 0.1);
        let html = `<p class="panel-note">${this.t('besttime_desc')}</p>`;
        rows.forEach(r => {
            const widthPct = Math.max(6, Math.round(Math.abs(r.avgRR) / maxAbs * 100));
            const cls = r.avgRR >= 0 ? 'positive' : 'negative';
            html += `<div class="bar-row"><span class="bar-label">${r.label}</span><div class="bar-track"><div class="bar-fill ${cls}" style="width:${widthPct}%;"></div></div><span class="bar-val">${(r.avgRR >= 0 ? '+' : '')}${r.avgRR.toFixed(1)}R · ${r.count}</span></div>`;
        });
        container.innerHTML = html;
    },

    renderAssetList() {
        const container = document.getElementById('assetListBody');
        if (!container) return;
        if (this.trades.length === 0) {
            container.innerHTML = '';
            this.renderEmptyState(container, this.t('empty_assets_title'));
            return;
        }
        const assetsMap = {};
        this.trades.forEach(t => { assetsMap[t.asset] = (assetsMap[t.asset] || 0) + 1; });
        const total = this.trades.length;
        const colors = ['#7c5cfc', '#fbbf24', '#43c6a0', '#ef4444', '#f97316'];
        const entries = Object.entries(assetsMap).sort((a, b) => b[1] - a[1]);
        let html = '';
        entries.forEach(([asset, count], i) => {
            const pct = Math.round(count / total * 100);
            html += `<div><span class="dot" style="background:${colors[i % colors.length]};"></span> ${asset} <span class="asset-val">${count} (${pct}%)</span></div>`;
        });
        container.innerHTML = html;
    },

    // Dashboard AI box: a short, honest, data-grounded snippet — never a
    // fabricated warning. It only ever references real Guardian violations
    // or real trade counts, and never predicts the market or gives signals.
    renderDashAIInsight() {
        const msgEl = document.getElementById('dashAIMsg');
        const subEl = document.getElementById('dashAIMsgSub');
        if (!msgEl || !subEl) return;
        if (this.trades.length === 0) {
            msgEl.textContent = this.currentLang === 'en'
                ? 'Log your first trade in the Journal and I\'ll start tracking your discipline.'
                : 'Добавьте первую сделку в Journal — и я начну отслеживать вашу дисциплину.';
            subEl.textContent = this.currentLang === 'en'
                ? 'I coach — I never predict the market or send buy/sell signals.'
                : 'Я коуч — я не предсказываю рынок и не даю сигналы Buy/Sell.';
            return;
        }
        const violations = (this.guardianRules || []).filter(r => !r.passed);
        const total = this.trades.length;
        const wins = this.trades.filter(t => t.status === 'win').length;
        const winRate = Math.round(wins / total * 100);
        if (violations.length > 0) {
            msgEl.textContent = this.currentLang === 'en'
                ? `Guardian flagged ${violations.length} rule${violations.length === 1 ? '' : 's'} today: ${violations[0].name}.`
                : `Guardian сегодня отметил нарушений: ${violations.length} (${violations[0].name}).`;
            subEl.textContent = this.currentLang === 'en' ? 'Open Guardian for the full breakdown.' : 'Откройте Guardian для подробностей.';
        } else {
            msgEl.textContent = this.currentLang === 'en'
                ? `You have ${total} logged trades with a ${winRate}% win rate so far.`
                : `У вас ${total} сделок в журнале, Win Rate ${winRate}%.`;
            subEl.textContent = this.currentLang === 'en' ? 'Ask me anything about your journal, discipline, or strategy.' : 'Спросите меня о журнале, дисциплине или стратегии.';
        }
    },

    initEquityChart() {
        const canvas = document.getElementById('equityChart');
        const wrapper = document.getElementById('equityChartWrapper');
        if (!canvas) return;
        if (this.equityChartInstance) { this.equityChartInstance.destroy(); this.equityChartInstance = null; }

        if (this.trades.length === 0) {
            canvas.style.display = 'none';
            this.renderEmptyState(wrapper, this.t('empty_equity_title'), this.t('empty_equity_desc'));
            return;
        }
        canvas.style.display = '';
        this.clearEmptyState(wrapper);

        // Real cumulative balance, ordered chronologically, starting from the user's declared capital.
        const sorted = [...this.trades].sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.id - b.id));
        let running = parseFloat(this.userData.capital) || 0;
        const labels = ['Старт'];
        const data = [running];
        sorted.forEach(t => {
            running += (parseFloat(t.pnl) || 0);
            labels.push(t.date || '');
            data.push(running);
        });

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 180);
        gradient.addColorStop(0, 'rgba(124, 92, 252, 0.3)');
        gradient.addColorStop(1, 'rgba(124, 92, 252, 0)');
        this.equityChartInstance = new Chart(canvas, {
            type: 'line', data: { labels: labels, datasets: [{ label: 'Equity', data, borderColor: '#7c5cfc', backgroundColor: gradient, borderWidth: 3, pointRadius: 3, pointBackgroundColor: '#7c5cfc', pointBorderColor: '#fff', pointBorderWidth: 1, tension: 0.35, fill: true }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#8892a0', maxTicksLimit: 8 } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8892a0' } } } }
        });
    },

    // ===== Reusable empty-state helper =====
    // Every panel that used to ship with fake numbers now renders a real
    // "not enough data yet" message here instead, using a small overlay
    // that sits on top of the panel without destroying its DOM structure.
    renderEmptyState(container, title, desc) {
        if (!container) return;
        this.clearEmptyState(container);
        const el = document.createElement('div');
        el.className = 'panel-empty-state';
        el.innerHTML = `<div class="panel-empty-icon">📭</div><div class="panel-empty-title">${title}</div>${desc ? `<div class="panel-empty-desc">${desc}</div>` : ''}`;
        container.appendChild(el);
    },

    clearEmptyState(container) {
        if (!container) return;
        const existing = container.querySelector('.panel-empty-state');
        if (existing) existing.remove();
    },

    // ============================================================
    // JOURNAL
    // ============================================================
    applyFilters() {
        const asset = this.filterAsset?.value || '';
        const result = this.filterResult?.value || '';
        const search = this.journalSearch?.value?.toLowerCase() || '';
        this.filteredTrades = this.trades.filter(trade => {
            const matchAsset = !asset || trade.asset === asset;
            const matchResult = !result || trade.status === result;
            const matchSearch = !search || trade.asset.toLowerCase().includes(search) || trade.side.toLowerCase().includes(search);
            return matchAsset && matchResult && matchSearch;
        });
        this.currentPage = 1;
        this.renderJournal();
        this.updateJournalStats();
    },

    renderJournal() {
        if (!this.journalBody) return;
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const pageData = this.filteredTrades.slice(start, end);

        if (pageData.length === 0) {
            this.journalBody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:48px 0;color:var(--text-secondary);">${this.t('empty_journal')}</td></tr>`;
            return;
        }

        let html = '';
        pageData.forEach(trade => {
            const statusClass = trade.status;
            const statusLabel = trade.status === 'win' ? 'Прибыль' : (trade.status === 'loss' ? 'Убыток' : 'Без результата');
            const resultClass = trade.status === 'breakeven' ? 'result-neutral' : (trade.result.startsWith('+') ? 'result-positive' : 'result-negative');
            const sideClass = trade.side === 'BUY' ? 'side-buy' : 'side-sell';
            // v1.1.0 — trades saved via the AI Scanner carry a `screenshot`
            // (base64 dataURL) field; existing trades simply don't have
            // one, so this button only renders when it's actually present.
            const screenshotBtn = trade.screenshot
                ? `<button class="journal-screenshot-btn" data-screenshot-id="${trade.id}" title="${this.t('scanner_view_screenshot')}">🖼️</button>`
                : '';
            html += `<tr>
                        <td>${trade.date}</td>
                        <td class="asset-cell">${trade.asset}</td>
                        <td class="${sideClass}">${trade.side}</td>
                        <td>${trade.entry}</td>
                        <td>${trade.exit}</td>
                        <td>${trade.rr}</td>
                        <td class="${resultClass}">${trade.result}</td>
                        <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                        <td>
                            ${screenshotBtn}
                            <button class="edit-btn" data-id="${trade.id}" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;transition:0.2s;margin-right:8px;" title="Редактировать">✎</button>
                            <button class="delete-btn" data-id="${trade.id}" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;transition:0.2s;" title="Удалить">✕</button>
                        </td>
                    </tr>`;
        });
        this.journalBody.innerHTML = html;

        this.journalBody.querySelectorAll('[data-screenshot-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.screenshotId);
                const trade = this.trades.find(t => t.id === id);
                if (trade && trade.screenshot) this.openLightbox(trade.screenshot);
            });
        });

        this.journalBody.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.openTradeModal(id);
            });
        });

        this.journalBody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                if(confirm('Удалить сделку?')) {
                    this.trades = this.trades.filter(t => t.id !== id);
                    this.filteredTrades = [...this.trades];
                    this.syncAfterTradeChange();
                }
            });
        });
    },

    updateJournalStats() {
        const total = this.filteredTrades.length;
        const wins = this.filteredTrades.filter(t => t.status === 'win').length;
        const winRate = total > 0 ? (wins / total * 100) : 0;
        const rrValues = this.filteredTrades.map(t => parseFloat(t.rr)).filter(v => !isNaN(v));
        const avgRR = rrValues.length > 0 ? rrValues.reduce((a, b) => a + b, 0) / rrValues.length : 0;
        const totalPnL = rrValues.reduce((a, b) => a + b, 0);

        if (this.jTotalTrades) this.jTotalTrades.textContent = total;
        if (this.jWinRate) { this.jWinRate.textContent = winRate.toFixed(1) + '%'; this.jWinRate.className = 'stat-number ' + (winRate >= 50 ? 'green' : 'red'); }
        if (this.jAvgRR) this.jAvgRR.textContent = avgRR.toFixed(1);
        if (this.jTotalPnL) { this.jTotalPnL.textContent = (totalPnL >= 0 ? '+' : '') + totalPnL.toFixed(1) + 'R'; this.jTotalPnL.className = 'stat-number ' + (totalPnL >= 0 ? 'green' : 'red'); }
    },

    syncAfterTradeChange() {
        this.renderJournal();
        this.updateJournalStats();
        this.updateDashboardStats();
        this.updateBalanceDisplay();
        this.renderTodaysProgress();
        this.initEquityChart();
        this.renderDashboardExtras();
        this.updateAnalytics();
        this.updateGuardianStats();
        this.initGuardianChart();
        this.renderCalendar();
        this.updateCalendarBadge();
        this.updateNotifBadge();
        if (this.perfEquityChart) { this.updatePerformanceStats(); this.initPerfEquityChart(); this.initPerfMonthlyChart(); this.initPerfSessionsChart(); }
        this.saveState();
    },

    openTradeModal(tradeId = null, fromScanner = false) {
        if (!this.tradeModalOverlay) return;
        this.editingTradeId = tradeId;
        // v1.1.0 — a screenshot pending from the Scanner should only ever
        // attach to the trade the Scanner itself is handing off. Every
        // other way of opening this modal (+ Add Trade, Quick Actions,
        // the empty-state CTA, editing an existing trade) clears it
        // defensively here in one place, rather than at every call site.
        if (!fromScanner) this.pendingScannerScreenshot = null;
        Object.values(this.tFields).forEach(el => { if (el) { el.value = ''; el.classList.remove('input-invalid'); } });
        document.querySelectorAll('#tradeModalOverlay .form-error').forEach(el => el.textContent = '');

        const trade = tradeId ? this.trades.find(t => t.id === tradeId) : null;
        if (this.tradeModalTitle) this.tradeModalTitle.textContent = trade ? 'Редактировать сделку' : 'Новая сделка';
        if (this.tradeModalSave) this.tradeModalSave.textContent = trade ? 'Сохранить изменения' : 'Сохранить сделку';

        if (trade) {
            const f = this.tFields;
            f.asset.value = trade.asset;
            f.direction.value = trade.side === 'BUY' ? 'long' : 'short';
            f.entry.value = trade.entry;
            f.exit.value = trade.exit;
            f.size.value = trade.size != null ? trade.size : '';
            f.riskPercent.value = trade.riskPercent;
            f.rr.value = trade.rr;
            f.pnl.value = trade.pnl;
            f.date.value = trade.date;
            f.session.value = trade.session || '';
            f.strategy.value = trade.strategy || '';
            f.status.value = trade.status;
            f.emotionBefore.value = trade.emotionBefore || 'calm';
            f.emotionAfter.value = trade.emotionAfter || 'calm';
            f.notes.value = trade.notes || '';
        } else {
            if (this.tFields.date) this.tFields.date.value = new Date().toISOString().slice(0, 10);
            if (this.tFields.emotionBefore) this.tFields.emotionBefore.value = 'calm';
            if (this.tFields.emotionAfter) this.tFields.emotionAfter.value = 'calm';
        }

        this.tradeModalOverlay.classList.add('active');
        if (this.tFields.asset) this.tFields.asset.focus();
    },

    closeTradeModal() {
        if (!this.tradeModalOverlay) return;
        this.tradeModalOverlay.classList.remove('active');
        this.editingTradeId = null;
        // v1.1.0 — if the user backs out of the modal (rather than saving),
        // a screenshot pending from the Scanner must not linger and attach
        // itself to some later, unrelated trade.
        this.pendingScannerScreenshot = null;
    },

    validateTradeForm() {
        const f = this.tFields;
        const errors = {};

        const asset = f.asset.value.trim();
        if (!asset) errors.asset = 'Укажите актив';

        const direction = f.direction.value;
        if (!direction) errors.direction = 'Выберите направление';

        const entry = parseFloat(f.entry.value);
        if (isNaN(entry) || entry <= 0) errors.entry = 'Введите цену входа';

        const exit = parseFloat(f.exit.value);
        if (isNaN(exit) || exit <= 0) errors.exit = 'Введите цену выхода';

        const riskPercent = parseFloat(f.riskPercent.value);
        if (isNaN(riskPercent) || riskPercent <= 0) errors.riskPercent = 'Укажите риск в %';

        const rr = parseFloat(f.rr.value);
        if (isNaN(rr)) errors.rr = 'Укажите RR';

        const pnl = parseFloat(f.pnl.value);
        if (isNaN(pnl)) errors.pnl = 'Укажите P&L';

        const date = f.date.value;
        if (!date || isNaN(new Date(date).getTime())) errors.date = 'Укажите дату';

        const session = f.session.value;
        if (!session) errors.session = 'Выберите сессию';

        const strategy = f.strategy.value.trim();
        if (!strategy) errors.strategy = 'Укажите стратегию';

        const status = f.status.value;
        if (!status) errors.status = 'Выберите статус';

        if (!errors.rr && !errors.status) {
            if (status === 'win' && rr <= 0) errors.rr = 'При статусе Win значение RR должно быть положительным';
            else if (status === 'loss' && rr >= 0) errors.rr = 'При статусе Loss значение RR должно быть отрицательным';
            else if (status === 'breakeven' && Math.abs(rr) > 0.05) errors.rr = 'При Break Even значение RR должно быть около 0';
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors,
            values: { asset, direction, entry, exit, riskPercent, rr, pnl, date, session, strategy, status }
        };
    },

    submitTradeForm() {
        const f = this.tFields;
        const { valid, errors, values } = this.validateTradeForm();

        document.querySelectorAll('#tradeModalOverlay .form-error').forEach(el => el.textContent = '');
        Object.values(f).forEach(el => { if (el) el.classList.remove('input-invalid'); });

        if (!valid) {
            Object.keys(errors).forEach(key => {
                const errorEl = document.getElementById('t' + key.charAt(0).toUpperCase() + key.slice(1) + 'Error');
                if (errorEl) errorEl.textContent = errors[key];
                if (f[key]) f[key].classList.add('input-invalid');
            });
            if (this.tFormError) this.tFormError.textContent = 'Пожалуйста, исправьте отмеченные поля';
            return;
        }

        const size = parseFloat(f.size.value);
        const result = (values.rr > 0 ? '+' : (values.rr < 0 ? '-' : '')) + Math.abs(values.rr).toFixed(1) + 'R';
        const tradeFields = {
            date: values.date,
            asset: values.asset,
            side: values.direction === 'long' ? 'BUY' : 'SELL',
            entry: values.entry,
            exit: values.exit,
            size: isNaN(size) ? null : size,
            riskPercent: values.riskPercent,
            rr: values.rr,
            pnl: values.pnl,
            result,
            status: values.status,
            session: values.session,
            strategy: values.strategy,
            emotionBefore: f.emotionBefore.value,
            emotionAfter: f.emotionAfter.value,
            notes: f.notes.value.trim()
        };
        // v1.1.0 — AI Scanner screenshot attachment. Only ever added to
        // tradeFields when a screenshot is actually pending (i.e. this
        // Add Trade flow came from the Scanner's "Confirm" step) — the
        // key is omitted entirely otherwise, so editing an existing trade
        // that already has a screenshot never overwrites or clears it via
        // the {...oldTrade, ...tradeFields} merge below, and a normal
        // manual "+ Add Trade" never attaches a stray leftover screenshot.
        if (this.pendingScannerScreenshot) {
            tradeFields.screenshot = this.pendingScannerScreenshot;
        }

        const isEdit = this.editingTradeId !== null;
        if (isEdit) {
            const idx = this.trades.findIndex(t => t.id === this.editingTradeId);
            if (idx > -1) this.trades[idx] = { ...this.trades[idx], ...tradeFields, id: this.editingTradeId };
        } else {
            const newTrade = { id: Math.max(...this.trades.map(t => t.id), 0) + 1, ...tradeFields };
            this.trades.unshift(newTrade);
        }
        this.filteredTrades = [...this.trades];
        this.currentPage = 1;
        // Consumed — cleared regardless of edit/new so it can never leak
        // into a later, unrelated trade save.
        this.pendingScannerScreenshot = null;

        this.syncAfterTradeChange();
        this.closeTradeModal();

        const violations = (this.guardianRules || []).filter(r => !r.passed).length;
        const baseMsg = isEdit ? 'Сделка обновлена!' : 'Сделка успешно добавлена!';
        this.showToast(violations > 0 ? `${baseMsg} Guardian: ${violations} нарушени${violations === 1 ? 'е' : 'я'} правил` : baseMsg);
    },

    // ============================================================
    // HEADER: SEARCH & NOTIFICATIONS
    // ============================================================
    togglePopover(popover) {
        if (!popover) return;
        popover.classList.toggle('open');
    },

    closePopover(popover) {
        if (!popover) return;
        popover.classList.remove('open');
    },

    renderSearchResults(query) {
        if (!this.globalSearchResults) return;
        if (!query) {
            this.globalSearchResults.innerHTML = `<div class="header-popover-empty">Начните вводить запрос...</div>`;
            return;
        }
        const q = query.toLowerCase();
        const tradeMatches = this.trades.filter(t =>
            t.asset.toLowerCase().includes(q) ||
            t.side.toLowerCase().includes(q) ||
            (t.date || '').includes(q)
        ).slice(0, 5);
        const eventMatches = this.events.filter(e => e.title.toLowerCase().includes(q)).slice(0, 5);

        if (tradeMatches.length === 0 && eventMatches.length === 0) {
            this.globalSearchResults.innerHTML = `<div class="header-popover-empty">Ничего не найдено по запросу «${query}»</div>`;
            return;
        }

        let html = '';
        tradeMatches.forEach(t => {
            html += `
                <button class="header-popover-item" data-kind="trade" data-asset="${t.asset}">
                    <span class="header-popover-item-icon">${t.status === 'win' ? '📈' : '📉'}</span>
                    <span class="header-popover-item-body">
                        <span class="header-popover-item-title">${t.asset} · ${t.side}</span>
                        <span class="header-popover-item-desc">${t.date} · ${t.result}</span>
                    </span>
                </button>`;
        });
        eventMatches.forEach(e => {
            const dateLabel = e.date.toLocaleDateString();
            html += `
                <button class="header-popover-item" data-kind="event" data-timestamp="${e.date.getTime()}">
                    <span class="header-popover-item-icon">📅</span>
                    <span class="header-popover-item-body">
                        <span class="header-popover-item-title">${e.title}</span>
                        <span class="header-popover-item-desc">${dateLabel}</span>
                    </span>
                </button>`;
        });
        this.globalSearchResults.innerHTML = html;

        this.globalSearchResults.querySelectorAll('.header-popover-item[data-kind="trade"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const asset = btn.dataset.asset;
                this.closePopover(this.searchPopover);
                this.navItems.forEach(n => n.classList.remove('active'));
                const nav = Array.from(this.navItems).find(n => n.dataset.section === 'journal');
                if (nav) nav.classList.add('active');
                this.showSection('journal');
                if (this.journalSearch) { this.journalSearch.value = asset; this.applyFilters(); }
            });
        });
        this.globalSearchResults.querySelectorAll('.header-popover-item[data-kind="event"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const ts = parseInt(btn.dataset.timestamp);
                this.closePopover(this.searchPopover);
                this.navItems.forEach(n => n.classList.remove('active'));
                const nav = Array.from(this.navItems).find(n => n.dataset.section === 'calendar');
                if (nav) nav.classList.add('active');
                this.currentDate = new Date(ts);
                this.selectedDate = new Date(ts);
                this.showSection('calendar');
            });
        });
    },

    getNotifications() {
        const notifications = [];
        const en = this.currentLang === 'en';
        const today = new Date().toISOString().slice(0, 10);
        const todayTrades = this.trades.filter(t => t.date === today);
        const lossesToday = todayTrades.filter(t => t.status === 'loss').length;

        (this.guardianRules || []).filter(r => !r.passed).forEach(r => {
            notifications.push({ icon: '⚠️', title: en ? 'Guardian rule violation' : 'Нарушение правила Guardian', desc: r.name, tag: 'warning' });
        });

        if (lossesToday >= 3) {
            notifications.push({ icon: '🛑', title: en ? 'Daily loss limit' : 'Дневной лимит убытков', desc: en ? `${lossesToday} losing trades today` : `${lossesToday} убыточных сделок сегодня`, tag: 'warning' });
        }

        const todayEvents = this.getEventsForDate(new Date());
        if (todayEvents.length > 0) {
            notifications.push({ icon: '📅', title: en ? `Events today (${todayEvents.length})` : `События сегодня (${todayEvents.length})`, desc: todayEvents.map(e => e.title).join(', '), tag: 'info' });
        }

        // No synthetic "all good" notification — an empty list means an
        // empty list. The UI renders the real "No notifications yet" state.
        return notifications;
    },

    renderNotifications() {
        if (!this.notifResults) return;
        const notifications = this.getNotifications();
        if (notifications.length === 0) {
            this.notifResults.innerHTML = `<div class="header-popover-item non-interactive"><span class="header-popover-item-body"><span class="header-popover-item-desc">${this.t('empty_notifications')}</span></span></div>`;
            return;
        }
        let html = '';
        notifications.forEach(n => {
            html += `
                <div class="header-popover-item non-interactive">
                    <span class="header-popover-item-icon">${n.icon}</span>
                    <span class="header-popover-item-body">
                        <span class="header-popover-item-title">${n.title}</span>
                        <span class="header-popover-item-desc">${n.desc}</span>
                    </span>
                </div>`;
        });
        this.notifResults.innerHTML = html;
    },

    updateNotifBadge() {
        if (!this.notifBadge) return;
        const activeCount = this.getNotifications().filter(n => n.tag === 'warning').length;
        if (activeCount > 0) {
            this.notifBadge.textContent = activeCount;
            this.notifBadge.style.display = 'flex';
        } else {
            this.notifBadge.style.display = 'none';
        }
    },

    // ============================================================
    // CALENDAR
    // ============================================================
    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.renderCalendar();
        this.updateCalendarBadge();
    },

    renderCalendar() {
        if (!this.calendarGrid) return;
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.calendarMonth.textContent = monthNames[month] + ' ' + year;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        const today = new Date();

        let html = '';
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(d => { html += `<div class="calendar-weekday">${d}</div>`; });

        for (let i = 0; i < firstDay; i++) {
            const prevDay = daysInPrevMonth - firstDay + i + 1;
            html += `<div class="calendar-day-cell other-month">${prevDay}</div>`;
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(year, month, d);
            const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = d === this.selectedDate.getDate() && month === this.selectedDate.getMonth() && year === this.selectedDate.getFullYear();
            const dayEvents = this.getEventsForDate(dateObj);
            const dayTrades = this.getTradesForDate(dateObj);
            let cls = 'calendar-day-cell';
            if (isToday) cls += ' today';
            if (isSelected) cls += ' selected';
            if (dayEvents.length > 0) cls += ' has-event';
            if (dayTrades.length > 0) cls += ' has-trade';
            html += `<div class="${cls}" data-date="${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}">${d}</div>`;
        }
        this.calendarGrid.innerHTML = html;

        this.calendarGrid.querySelectorAll('.calendar-day-cell:not(.other-month)').forEach(el => {
            el.addEventListener('click', () => {
                const parts = el.dataset.date.split('-');
                this.selectedDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                this.renderCalendar();
                this.renderEvents();
                this.renderDayTrades();
            });
        });
        this.renderEvents();
        this.renderDayTrades();
    },

    getTradesForDate(date) {
        const y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
        return this.trades.filter(t => {
            const td = new Date(t.date);
            return td.getFullYear() === y && td.getMonth() === m && td.getDate() === d;
        });
    },

    renderDayTrades() {
        if (!this.dayTradesList) return;
        const dayTrades = this.getTradesForDate(this.selectedDate);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (this.selectedDateTradesLabel) this.selectedDateTradesLabel.textContent = monthNames[this.selectedDate.getMonth()] + ' ' + this.selectedDate.getDate() + ', ' + this.selectedDate.getFullYear();
        if (this.dayTradesCount) this.dayTradesCount.textContent = dayTrades.length + ' сделок';

        if (dayTrades.length === 0) {
            this.dayTradesList.innerHTML = `<div class="no-events">${this.t('empty_calendar_trades')}</div>`;
            return;
        }
        const statusLabels = { win: 'Win', loss: 'Loss', breakeven: 'BE' };
        let html = '';
        dayTrades.forEach(t => {
            const resultColor = t.status === 'win' ? 'var(--brand-green)' : (t.status === 'loss' ? 'var(--brand-red)' : 'var(--text-secondary)');
            html += `
                <div class="trade-item-modern ${t.status}">
                    <div class="trade-item-top">
                        <span class="trade-item-title">${t.asset} · ${t.side} · ${statusLabels[t.status] || t.status}</span>
                        <span class="trade-item-result" style="color:${resultColor};">${t.result}</span>
                    </div>
                    <span class="trade-item-meta">${t.strategy ? t.strategy + ' · ' : ''}${t.session ? t.session.toUpperCase() : ''}</span>
                    ${t.notes ? `<span class="trade-item-notes">${t.notes}</span>` : ''}
                </div>`;
        });
        this.dayTradesList.innerHTML = html;
    },

    getEventsForDate(date) {
        return this.events.filter(e =>
            e.date.getDate() === date.getDate() &&
            e.date.getMonth() === date.getMonth() &&
            e.date.getFullYear() === date.getFullYear()
        );
    },

    renderEvents() {
        if (!this.eventsList) return;
        const eventsForDate = this.getEventsForDate(this.selectedDate);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.selectedDateLabel.textContent = monthNames[this.selectedDate.getMonth()] + ' ' + this.selectedDate.getDate() + ', ' + this.selectedDate.getFullYear();
        this.eventsCount.textContent = eventsForDate.length + ' событий';

        if (eventsForDate.length === 0) {
            this.eventsList.innerHTML = `<div class="no-events">${this.t('empty_calendar_events')}</div>`;
            return;
        }
        let html = '';
        eventsForDate.forEach(event => {
            const colorMap = { trade: 'green', alert: 'orange', meeting: 'purple', analysis: 'yellow', break: 'secondary' };
            html += `
                    <div class="event-item-modern" style="border-left-color: var(--brand-${colorMap[event.type] || 'purple'});">
                        <span class="event-dot ${event.type}"></span>
                        <span class="event-title">${event.title}</span>
                        <span class="event-type">${event.type}</span>
                        <button class="event-delete" data-id="${event.id}" title="Delete">×</button>
                    </div>
                `;
        });
        this.eventsList.innerHTML = html;
        this.eventsList.querySelectorAll('.event-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                if(confirm('Удалить это событие?')) {
                    this.deleteEvent(id);
                }
            });
        });
    },

    addEvent() {
        const title = this.eventInput?.value?.trim();
        const type = this.eventType?.value || 'trade';
        if (!title) { alert('Пожалуйста, введите название события'); return; }
        const newEvent = { id: Math.max(...this.events.map(e => e.id), 0) + 1, date: new Date(this.selectedDate), title, type };
        this.events.push(newEvent);
        if (this.eventInput) this.eventInput.value = '';
        this.renderCalendar();
        this.updateCalendarBadge();
        this.updateNotifBadge();
        this.saveState();
    },

    deleteEvent(id) {
        this.events = this.events.filter(e => e.id !== id);
        this.renderCalendar();
        this.updateCalendarBadge();
        this.updateNotifBadge();
        this.saveState();
    },

    updateCalendarBadge() {
        if (!this.calendarBadge) return;
        const now = new Date();
        const count = this.events.filter(e =>
            e.date.getMonth() === now.getMonth() &&
            e.date.getFullYear() === now.getFullYear()
        ).length;
        this.calendarBadge.textContent = count;
    },

    // ============================================================
    // ANALYTICS
    // ============================================================
    updateAnalytics() {
        this.initAnalyticsCharts();
        this.updateAnalyticsStats();
    },

    updateAnalyticsStats() {
        const total = this.trades.length;
        const banner = document.getElementById('analyticsEmptyBanner');
        const mainContent = document.getElementById('analyticsMainContent');
        if (banner) {
            banner.style.display = total === 0 ? 'flex' : 'none';
            if (total === 0) banner.innerHTML = `<div class="panel-empty-icon">📭</div><div class="panel-empty-title">${this.t('empty_analytics')}</div>`;
        }
        if (mainContent) mainContent.style.opacity = total === 0 ? '0.35' : '1';
        if (total === 0) {
            const elements = [this.aTotalPnl, this.aWinRate, this.aProfitFactor, this.aAvgRR, this.aTotalTrades, this.aWinningTrades, this.aLosingTrades, this.aAvgWin, this.aAvgLoss, this.aBestDay, this.aWorstDay, this.aBestTrade, this.aWorstTrade, this.aMaxWinStreak, this.aMaxLossStreak];
            elements.forEach(el => { if(el) el.textContent = '—'; });
            if(this.aTotalPnl) this.aTotalPnl.textContent = '+0.0R';
            if(this.aTotalTrades) this.aTotalTrades.textContent = '0';
            return;
        }

        const wins = this.trades.filter(t => t.status === 'win').length;
        const losses = this.trades.filter(t => t.status === 'loss').length;
        const rrValues = this.trades.map(t => parseFloat(t.rr)).filter(v => !isNaN(v));
        const totalPnL = rrValues.reduce((a, b) => a + b, 0);
        const winRate = (wins / total * 100);
        const avgRR = rrValues.reduce((a, b) => a + b, 0) / rrValues.length;
        const profitFactor = rrValues.filter(v => v > 0).reduce((a, b) => a + b, 0) / Math.abs(rrValues.filter(v => v < 0).reduce((a, b) => a + b, 0) || 1);
        const avgWin = rrValues.filter(v => v > 0).length > 0 ? rrValues.filter(v => v > 0).reduce((a, b) => a + b, 0) / rrValues.filter(v => v > 0).length : 0;
        const avgLoss = rrValues.filter(v => v < 0).length > 0 ? rrValues.filter(v => v < 0).reduce((a, b) => a + b, 0) / rrValues.filter(v => v < 0).length : 0;

        const dayMap = {};
        this.trades.forEach(t => {
            if(!dayMap[t.date]) dayMap[t.date] = 0;
            dayMap[t.date] += parseFloat(t.rr) || 0;
        });
        let bestDay = '—', worstDay = '—';
        if(Object.keys(dayMap).length > 0) {
            const sortedDays = Object.keys(dayMap).sort((a,b) => dayMap[b] - dayMap[a]);
            bestDay = sortedDays[0] + ' (' + (dayMap[sortedDays[0]] >= 0 ? '+' : '') + dayMap[sortedDays[0]].toFixed(1) + 'R)';
            worstDay = sortedDays[sortedDays.length-1] + ' (' + (dayMap[sortedDays[sortedDays.length-1]] >= 0 ? '+' : '') + dayMap[sortedDays[sortedDays.length-1]].toFixed(1) + 'R)';
        }

        let bestTrade = 0, worstTrade = 0;
        rrValues.forEach(v => {
            if (v > bestTrade) bestTrade = v;
            if (v < worstTrade) worstTrade = v;
        });

        let maxWinStreak = 0, maxLossStreak = 0, curWin = 0, curLoss = 0;
        this.trades.forEach(t => {
            if(t.status === 'win') { curWin++; curLoss = 0; if(curWin > maxWinStreak) maxWinStreak = curWin; }
            else if(t.status === 'loss') { curLoss++; curWin = 0; if(curLoss > maxLossStreak) maxLossStreak = curLoss; }
            else { curWin = 0; curLoss = 0; }
        });

        if (this.aTotalPnl) { this.aTotalPnl.textContent = (totalPnL >= 0 ? '+' : '') + totalPnL.toFixed(1) + 'R'; }
        if (this.aWinRate) { this.aWinRate.textContent = winRate.toFixed(1) + '%'; }
        if (this.aProfitFactor) { this.aProfitFactor.textContent = profitFactor.toFixed(2); }
        if (this.aAvgRR) { this.aAvgRR.textContent = avgRR.toFixed(1); }
        if (this.aTotalTrades) this.aTotalTrades.textContent = total;
        if (this.aWinningTrades) this.aWinningTrades.textContent = wins;
        if (this.aLosingTrades) this.aLosingTrades.textContent = losses;
        if (this.aAvgWin) { this.aAvgWin.textContent = '+' + avgWin.toFixed(1) + 'R'; }
        if (this.aAvgLoss) { this.aAvgLoss.textContent = '-' + Math.abs(avgLoss).toFixed(1) + 'R'; }
        if (this.aBestDay) this.aBestDay.textContent = bestDay;
        if (this.aWorstDay) this.aWorstDay.textContent = worstDay;
        if (this.aBestTrade) { this.aBestTrade.textContent = '+' + bestTrade.toFixed(1) + 'R'; }
        if (this.aWorstTrade) { this.aWorstTrade.textContent = '-' + Math.abs(worstTrade).toFixed(1) + 'R'; }
        if (this.aMaxWinStreak) this.aMaxWinStreak.textContent = maxWinStreak;
        if (this.aMaxLossStreak) this.aMaxLossStreak.textContent = maxLossStreak;
    },

    initAnalyticsCharts() {
        if (this.analyticsEquityChart) {
            if (this.analyticsCharts.equity) this.analyticsCharts.equity.destroy();
            let cumulative = 0;
            const data = this.trades.map(t => {
                cumulative += parseFloat(t.rr) || 0;
                return cumulative;
            });
            const labels = this.trades.map((_, i) => '#' + (i+1));
            const ctx = this.analyticsEquityChart.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 0, 180);
            gradient.addColorStop(0, 'rgba(124, 92, 252, 0.3)');
            gradient.addColorStop(1, 'rgba(124, 92, 252, 0)');
            this.analyticsCharts.equity = new Chart(this.analyticsEquityChart, {
                type: 'line', data: { labels: labels, datasets: [{ label: 'Equity (R)', data: data, borderColor: '#7c5cfc', backgroundColor: gradient, borderWidth: 3, pointRadius: 2, tension: 0.4, fill: true }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#8892a0', maxTicksLimit: 10 } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8892a0' } } } }
            });
        }

        if (this.analyticsMonthlyChart) {
            if (this.analyticsCharts.monthly) this.analyticsCharts.monthly.destroy();
            const monthly = {};
            this.trades.forEach(t => {
                const month = t.date.slice(0, 7);
                if (!monthly[month]) monthly[month] = 0;
                monthly[month] += parseFloat(t.rr) || 0;
            });
            const sortedKeys = Object.keys(monthly).sort().slice(-6);
            const labels = sortedKeys;
            const data = sortedKeys.map(k => monthly[k]);
            this.analyticsCharts.monthly = new Chart(this.analyticsMonthlyChart, {
                type: 'bar', data: { labels: labels, datasets: [{ label: 'P&L (R)', data: data, backgroundColor: data.map(v => v >= 0 ? 'rgba(67, 198, 160, 0.7)' : 'rgba(239, 68, 68, 0.7)'), borderColor: data.map(v => v >= 0 ? '#43c6a0' : '#ef4444'), borderWidth: 2, borderRadius: 4 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#8892a0' } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8892a0' } } } }
            });
        }

        if (this.analyticsAssetDonutChart) {
            if (this.analyticsCharts.asset) this.analyticsCharts.asset.destroy();
            const assetsMap = {};
            this.trades.forEach(t => { if(!assetsMap[t.asset]) assetsMap[t.asset] = 0; assetsMap[t.asset]++; });
            const labels = Object.keys(assetsMap);
            const data = Object.values(assetsMap);
            const colors = ['#7c5cfc', '#fbbf24', '#43c6a0', '#ef4444', '#f97316'];
            this.analyticsCharts.asset = new Chart(this.analyticsAssetDonutChart, {
                type: 'doughnut', data: { labels: labels, datasets: [{ data: data, backgroundColor: colors.slice(0, data.length), borderColor: '#13161c', borderWidth: 2 }] },
                options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { color: '#8892a0', font: { size: 11, family: 'Inter' }, padding: 12 } } } }
            });
        }
    },

    // ============================================================
    // PERFORMANCE
    // ============================================================
    updatePerformanceStats() {
        const total = this.trades.length;
        const banner = document.getElementById('performanceEmptyBanner');
        const mainContent = document.getElementById('performanceMainContent');
        if (banner) {
            banner.style.display = total === 0 ? 'flex' : 'none';
            if (total === 0) banner.innerHTML = `<div class="panel-empty-icon">📭</div><div class="panel-empty-title">${this.t('empty_performance')}</div>`;
        }
        if (mainContent) mainContent.style.opacity = total === 0 ? '0.35' : '1';
        const rrValues = this.trades.map(t => parseFloat(t.rr)).filter(v => !isNaN(v));
        const totalReturn = rrValues.reduce((a, b) => a + b, 0);

        if (this.perfTotalReturn) this.perfTotalReturn.textContent = (totalReturn >= 0 ? '+' : '') + totalReturn.toFixed(1) + 'R';
        if (this.perfTotalTrades) this.perfTotalTrades.textContent = total;

        const monthly = {};
        this.trades.forEach(t => {
            const month = (t.date || '').slice(0, 7);
            if (!month) return;
            if (!monthly[month]) monthly[month] = 0;
            monthly[month] += parseFloat(t.rr) || 0;
        });
        const monthKeys = Object.keys(monthly);
        if (this.perfBestMonth) {
            this.perfBestMonth.textContent = monthKeys.length > 0
                ? monthKeys.reduce((best, k) => monthly[k] > monthly[best] ? k : best, monthKeys[0])
                : '—';
        }

        const sessionMap = { london: 'London', ny: 'New York', asia: 'Asian', sydney: 'Sydney' };
        const bestSessionKey = this.userData.session && sessionMap[this.userData.session] ? sessionMap[this.userData.session] : '—';
        if (this.perfBestSession) this.perfBestSession.textContent = bestSessionKey;
    },

    initPerfEquityChart() {
        if (!this.perfEquityChart) return;
        if (this.performanceCharts.equity) this.performanceCharts.equity.destroy();
        let cumulative = 0;
        const data = this.trades.map(t => { cumulative += parseFloat(t.rr) || 0; return cumulative; });
        const labels = this.trades.map((_, i) => '#' + (i + 1));
        const ctx = this.perfEquityChart.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 180);
        gradient.addColorStop(0, 'rgba(124, 92, 252, 0.3)');
        gradient.addColorStop(1, 'rgba(124, 92, 252, 0)');
        this.performanceCharts.equity = new Chart(this.perfEquityChart, {
            type: 'line',
            data: { labels: labels, datasets: [{ label: 'Equity (R)', data: data, borderColor: '#7c5cfc', backgroundColor: gradient, borderWidth: 3, pointRadius: 2, tension: 0.4, fill: true }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#8892a0', maxTicksLimit: 10 } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8892a0' } } } }
        });
    },

    initPerfMonthlyChart() {
        if (!this.perfMonthlyChart) return;
        if (this.performanceCharts.monthly) this.performanceCharts.monthly.destroy();
        const monthly = {};
        this.trades.forEach(t => {
            const month = (t.date || '').slice(0, 7);
            if (!month) return;
            if (!monthly[month]) monthly[month] = 0;
            monthly[month] += parseFloat(t.rr) || 0;
        });
        const sortedKeys = Object.keys(monthly).sort().slice(-6);
        const data = sortedKeys.map(k => monthly[k]);
        this.performanceCharts.monthly = new Chart(this.perfMonthlyChart, {
            type: 'bar',
            data: { labels: sortedKeys, datasets: [{ label: 'P&L (R)', data: data, backgroundColor: data.map(v => v >= 0 ? 'rgba(67, 198, 160, 0.7)' : 'rgba(239, 68, 68, 0.7)'), borderColor: data.map(v => v >= 0 ? '#43c6a0' : '#ef4444'), borderWidth: 2, borderRadius: 4 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#8892a0' } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8892a0' } } } }
        });
    },

    initPerfSessionsChart() {
        if (!this.perfSessionsChart) return;
        if (this.performanceCharts.sessions) this.performanceCharts.sessions.destroy();
        // Uses the real `session` field recorded on each trade (London/NY/Asian/Sydney)
        // rather than deriving an hour from a date-only string, which had no reliable
        // time-of-day information to begin with.
        const sessionLabels = { london: 'London', ny: 'New York', asia: 'Asian', sydney: 'Sydney' };
        const sessionTotals = { London: 0, 'New York': 0, Asian: 0, Sydney: 0 };
        this.trades.forEach(t => {
            const label = sessionLabels[t.session];
            if (label) sessionTotals[label] += parseFloat(t.rr) || 0;
        });
        const labels = Object.keys(sessionTotals);
        const data = Object.values(sessionTotals);
        this.performanceCharts.sessions = new Chart(this.perfSessionsChart, {
            type: 'bar',
            data: { labels: labels, datasets: [{ label: 'P&L по сессиям (R)', data: data, backgroundColor: data.map(v => v >= 0 ? 'rgba(124, 92, 252, 0.7)' : 'rgba(239, 68, 68, 0.7)'), borderColor: data.map(v => v >= 0 ? '#7c5cfc' : '#ef4444'), borderWidth: 2, borderRadius: 4 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#8892a0' } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8892a0' } } } }
        });
    },

    // Alias kept for the chart.js reinit helper, which calls initRiskChart() when guardianCharts is populated.
    initRiskChart() {
        this.initGuardianChart();
    },

    // ============================================================
    // AI ASSISTANT
    // ============================================================
    renderAIWelcome() {
        if (!this.aiMessages) return;
        const name = this.userData.name || 'Трейдер';
        const en = this.currentLang === 'en';
        const today = new Date().toISOString().slice(0, 10);
        const todayTrades = this.trades.filter(t => t.date === today);
        const totalToday = todayTrades.length;
        const winsToday = todayTrades.filter(t => t.status === 'win').length;
        const wrToday = totalToday > 0 ? Math.round((winsToday / totalToday) * 100) : 0;
        const lastTrade = this.trades.length > 0 ? this.trades[0].result : '—';
        const violations = (this.guardianRules || []).filter(r => !r.passed).length;
        const disciplineLabel = this.trades.length === 0 ? (en ? 'No data yet' : 'Пока нет данных')
            : (violations === 0 ? (en ? 'Good' : 'Хорошая') : (en ? `${violations} flagged` : `${violations} нарушений`));
        const disciplineColor = this.trades.length === 0 ? 'var(--text-secondary)' : (violations === 0 ? 'var(--brand-green)' : 'var(--brand-red)');

        let html = `
            <div class="ai-msg-wrapper ai">
                <div class="ai-msg-avatar">AI</div>
                <div class="ai-msg-bubble">
                    <div class="ai-welcome-card">
                        <h2>${en ? 'Welcome' : 'Добро пожаловать'}, <strong>${name}</strong> 👋</h2>
                        <p style="color:var(--text-secondary); font-size:14px;">${en ? 'Your personal AI Trading Coach is ready.' : 'Ваш персональный AI-коуч готов помочь.'}</p>
                        <div class="stats-grid">
                            <div class="stat-line"><span>📊 ${en ? 'Trades today' : 'Сделок сегодня'}</span><span>${totalToday}</span></div>
                            <div class="stat-line"><span>🎯 Win Rate</span><span class="highlight">${totalToday > 0 ? wrToday + '%' : '—'}</span></div>
                            <div class="stat-line"><span>⚡ ${en ? 'Discipline' : 'Дисциплина'}</span><span style="color:${disciplineColor};">${disciplineLabel}</span></div>
                            <div class="stat-line"><span>🚀 ${en ? 'Last trade' : 'Последняя сделка'}</span><span class="highlight">${lastTrade}</span></div>
                        </div>
                        <p style="color:var(--text-secondary); font-size:13px; margin-top:12px;">${en ? 'Pick a prompt below or ask me anything.' : 'Выберите действие ниже или задайте вопрос.'}</p>
                    </div>
                </div>
            </div>
        `;
        this.aiMessages.innerHTML = html;
        this.scrollToBottom();
    },

    renderAIHistory() {
        if (!this.aiMessages) return;
        let html = '';
        this.aiHistory.forEach(msg => {
            const cls = msg.role === 'user' ? 'user' : 'ai';
            const avatar = msg.role === 'user' ? (this.currentLang === 'en' ? 'You' : 'Вы') : 'AI';
            html += `
                <div class="ai-msg-wrapper ${cls}">
                    <div class="ai-msg-avatar">${avatar}</div>
                    <div class="ai-msg-bubble">${msg.content}</div>
                </div>
            `;
        });
        this.aiMessages.innerHTML = html;
        this.scrollToBottom();
    },

    // ============================================================
    // AI COACH — response engine
    // ------------------------------------------------------------
    // No external LLM call is wired up yet (this is a static front-end
    // app with no backend), so this is a topic-aware, rule-based coach:
    // it detects intent from keywords, then always grounds its answer
    // in the user's REAL journal data (win rate, RR, Guardian rule
    // status, sessions, streaks) rather than a fixed pool of unrelated
    // canned sentences. It never generates Buy/Sell signals or market
    // predictions — every branch below is either a coaching question,
    // a stats readout, or general risk/psychology education.
    //
    // To upgrade this to a real LLM-backed coach later: swap
    // `this.generateCoachReply(question)` below for an async call to
    // your inference endpoint, passing the same `stats` object as
    // context so responses stay grounded in the user's real journal.
    // ============================================================
    getCoachStats() {
        const total = this.trades.length;
        const wins = this.trades.filter(t => t.status === 'win').length;
        const losses = this.trades.filter(t => t.status === 'loss').length;
        const winRate = total > 0 ? Math.round(wins / total * 100) : null;
        const rrValues = this.trades.map(t => parseFloat(t.rr)).filter(v => !isNaN(v));
        const avgRR = rrValues.length ? (rrValues.reduce((a, b) => a + b, 0) / rrValues.length) : null;
        let curLoss = 0, maxLossStreak = 0, curWin = 0, maxWinStreak = 0;
        this.trades.forEach(t => {
            if (t.status === 'loss') { curLoss++; curWin = 0; maxLossStreak = Math.max(maxLossStreak, curLoss); }
            else if (t.status === 'win') { curWin++; curLoss = 0; maxWinStreak = Math.max(maxWinStreak, curWin); }
            else { curWin = 0; curLoss = 0; }
        });
        // current (most recent) streak, using the natural array order (newest first, per submitTradeForm unshift)
        let recentStreak = 0, recentType = null;
        for (const t of this.trades) {
            if (t.status !== 'win' && t.status !== 'loss') break;
            if (recentType === null) { recentType = t.status; recentStreak = 1; }
            else if (t.status === recentType) recentStreak++;
            else break;
        }
        const violations = (this.guardianRules || []).filter(r => !r.passed);
        const sessionLabels = { london: 'London', ny: 'New York', asia: 'Asian', sydney: 'Sydney' };
        const bestSession = (() => {
            const totals = {};
            this.trades.forEach(t => {
                if (!t.session) return;
                if (!totals[t.session]) totals[t.session] = { rr: 0, count: 0 };
                totals[t.session].rr += parseFloat(t.rr) || 0;
                totals[t.session].count++;
            });
            const entries = Object.entries(totals);
            if (!entries.length) return null;
            entries.sort((a, b) => (b[1].rr / b[1].count) - (a[1].rr / a[1].count));
            return { label: sessionLabels[entries[0][0]] || entries[0][0], avgRR: entries[0][1].rr / entries[0][1].count };
        })();
        return { total, wins, losses, winRate, avgRR, maxWinStreak, maxLossStreak, recentStreak, recentType, violations, bestSession };
    },

    getIntegratedContext() {
        const stats = this.getCoachStats();
        let market = null;
        try {
            const cached = JSON.parse(localStorage.getItem('kriptodanik_market_cache') || 'null');
            if (cached?.results?.length) {
                market = cached.results.map(t => ({
                    symbol: String(t.symbol || '').replace('USDT',''),
                    price: Number(t.lastPrice),
                    change24h: Number(t.priceChangePercent),
                    high24h: Number(t.highPrice),
                    low24h: Number(t.lowPrice),
                    volume24h: Number(t.quoteVolume),
                    savedAt: cached.savedAt
                })).filter(x => Number.isFinite(x.price));
            }
        } catch (_) {}
        const recent = [...this.trades].slice(0, 5).map(t => ({
            asset: t.asset, direction: t.direction, status: t.status,
            pnl: Number(t.pnl) || 0, rr: Number(t.rr) || 0,
            session: t.session || '—', strategy: t.strategy || '—'
        }));
        return { stats, market, recent, challenge: this.challenge || {} };
    },

    renderIntegratedCoachContext() {
        const el = document.getElementById('aiContextSnapshot');
        if (!el) return;
        const c = this.getIntegratedContext();
        if (!c.stats.total) {
            el.innerHTML = '<span class="coach-context-empty">Нет сделок — AI Coach ждёт первую запись в Journal.</span>';
            return;
        }
        const m = c.market?.[0];
        const marketText = m ? `${m.symbol} ${m.change24h >= 0 ? '+' : ''}${m.change24h.toFixed(2)}% 24h` : 'рынок не синхронизирован';
        const dd = this.maxDrawdownPercent();
        el.innerHTML = `<span>Journal: <b>${c.stats.total}</b> сделок</span><span>Win Rate: <b>${c.stats.winRate ?? '—'}%</b></span><span>Avg RR: <b>${c.stats.avgRR === null ? '—' : (c.stats.avgRR >= 0 ? '+' : '') + c.stats.avgRR.toFixed(2) + 'R'}</b></span><span>Max DD: <b>${dd.toFixed(2)}%</b></span><span>Market: <b>${marketText}</b></span>`;
    },

    // Very small keyword-based intent classifier. Order matters — first match wins.
    classifyCoachIntent(question) {
        const q = question.toLowerCase();
        const has = (words) => words.some(w => q.includes(w));
        if (has(['sell', 'buy', 'продавать', 'покупать', 'сигнал', 'signal', 'куда пойдет', 'вырастет', 'упадет', 'прогноз', 'predict'])) return 'signal_request';
        if (has(['ошиб', 'mistake', 'error'])) return 'mistakes';
        if (has(['психолог', 'psycholog', 'эмоц', 'emotion', 'страх', 'fear', 'жадност', 'greed'])) return 'psychology';
        if (has(['плечо', 'leverage', 'маржа', 'margin', 'ликвидац', 'liquidat'])) return 'leverage';
        if (has(['размер позиции', 'position size', 'лот', 'notional', 'номинал'])) return 'position_size';
        if (has(['риск', 'risk', '管理'])) return 'risk';
        if (has(['дисциплин', 'disciplin'])) return 'discipline';
        if (has(['стратег', 'strateg'])) return 'strategy';
        if (has(['журнал', 'journal', 'сегодня', 'today', 'проанализ', 'analy'])) return 'journal_review';
        if (has(['сессия', 'session', 'время', 'best time', 'лучшее время'])) return 'session';
        if (has(['статист', 'stat', 'win rate', 'winrate', 'рекоменд', 'recommend'])) return 'stats';
        return 'general';
    },

    generateCoachReply(question) {
        const en = this.currentLang === 'en';
        const s = this.getCoachStats();
        const intent = this.classifyCoachIntent(question);
        const name = this.userData.name || (en ? 'trader' : 'трейдер');

        if (intent === 'signal_request') {
            return en
                ? "I don't give Buy/Sell signals and I don't predict where the market is going — that's outside what I do. What I <em>can</em> help with: does the setup you're looking at match the rules in your own strategy? Walk me through your entry criteria and I'll help you check it against your plan."
                : "Я не даю сигналы Buy/Sell и не предсказываю движение рынка — это не моя задача. Но я могу помочь с другим: подходит ли сетап, который вы рассматриваете, под правила вашей собственной стратегии? Опишите критерии входа — разберём вместе, соответствует ли он вашему плану.";
        }

        if (s.total === 0) {
            return en
                ? `You haven't logged any trades yet, ${name}, so I don't have anything real to analyze. Once you add a few trades in the Journal, I can talk through your win rate, RR, and discipline patterns with actual numbers instead of guesses.`
                : `Пока в журнале нет сделок, ${name}, поэтому мне не с чем работать по-настоящему. Добавьте несколько сделок в Journal — и я смогу говорить о вашем Win Rate, RR и дисциплине на основе реальных цифр, а не догадок.`;
        }

        switch (intent) {
            case 'mistakes': {
                if (s.maxLossStreak >= 3) {
                    return en
                        ? `Looking at your journal, your longest losing streak is ${s.maxLossStreak} trades in a row. That's usually where discipline slips — revenge sizing, skipping the plan, or forcing a setup. Check your notes on those trades: were the entries actually valid, or did you break your own rules to get in?`
                        : `По вашему журналу самая длинная серия убытков — ${s.maxLossStreak} сделок подряд. Обычно именно в такие моменты дисциплина проседает — увеличение риска "на отыгрыш", пропуск плана, вход без сетапа. Посмотрите заметки по этим сделкам: вход действительно был по правилам, или вы их нарушили?`;
                }
                return en
                    ? `Your loss streaks are short so far (max ${s.maxLossStreak}), which is a good sign for discipline. If you want to find real mistakes, open the Journal and filter by "Loss" — check whether your emotion-before field says calm on those, or something else.`
                    : `Серии убытков у вас пока короткие (максимум ${s.maxLossStreak} подряд) — это хороший знак для дисциплины. Чтобы найти реальные ошибки, откройте Journal и отфильтруйте по "Убыток" — посмотрите, что вы отмечали в поле эмоций перед этими сделками.`;
            }
            case 'psychology': {
                return en
                    ? `Psychology shows up in your data more than people expect. Right now you're on a ${s.recentStreak > 0 ? s.recentStreak + '-trade ' + (s.recentType === 'win' ? 'winning' : 'losing') + ' streak' : 'mixed run'}. ${s.recentType === 'loss' && s.recentStreak >= 2 ? 'After a losing streak, the biggest risk is forcing the next trade to "get it back." Consider taking a short break before your next entry.' : s.recentType === 'win' && s.recentStreak >= 3 ? 'After a winning streak, overconfidence tends to creep in — watch your position sizing on the next trade.' : 'Log how you feel before and after each trade in the Journal so we can spot patterns over time.'}`
                    : `Психология заметнее в данных, чем кажется. Сейчас у вас ${s.recentStreak > 0 ? s.recentStreak + ' сделк' + (s.recentStreak === 1 ? 'а' : 'и') + ' подряд в ' + (s.recentType === 'win' ? 'плюс' : 'минус') : 'смешанная динамика'}. ${s.recentType === 'loss' && s.recentStreak >= 2 ? 'После серии убытков главный риск — форсировать следующую сделку, чтобы "отыграться". Возможно, стоит сделать паузу перед следующим входом.' : s.recentType === 'win' && s.recentStreak >= 3 ? 'После серии побед часто подкрадывается излишняя уверенность — проверьте размер позиции на следующей сделке.' : 'Отмечайте своё состояние до и после каждой сделки в Journal — так мы сможем отследить закономерности со временем.'}`;
            }
            case 'position_size': {
                const capital = this.userData.capital;
                const risk = this.userData.risk;
                return en
                    ? `Position size should come FROM your risk, not the other way around: Max risk ($) = Capital × Risk %, then Position size = Max risk ÷ Stop distance.${(capital && risk) ? ` With your configured capital ($${capital}) and risk (${risk}%), your max planned loss per trade is about $${(capital * risk / 100).toFixed(2)} — before fees, slippage, or funding.` : ' Set your capital and risk % in Settings and I can use your real numbers here.'} There's a full worked example and a live calculator in Academy → Position Size.`
                    : `Размер позиции должен вытекать ИЗ вашего риска, а не наоборот: Максимальный риск ($) = Капитал × Риск %, затем Размер позиции = Максимальный риск ÷ Расстояние до стопа.${(capital && risk) ? ` С вашими текущими настройками (капитал $${capital}, риск ${risk}%) максимальный запланированный убыток на сделку — около $${(capital * risk / 100).toFixed(2)}, до учёта комиссий, проскальзывания и funding.` : ' Укажите капитал и риск % в Настройках — тогда я смогу использовать ваши реальные цифры.'} Полный разбор с примером и живым калькулятором есть в Академии → Размер позиции.`;
            }
            case 'leverage': {
                return en
                    ? `Leverage changes your margin requirement, not your allowed risk. If your risk per trade is set to 1% of capital, that stays true whether you use 2x or 20x leverage — leverage just lets you control the same notional position with less margin locked up. The real danger is using extra leverage to open a BIGGER position than your risk rules allow, which brings liquidation closer. Academy → Leverage has the full breakdown with a worked example.`
                    : `Плечо меняет требование к марже, а не ваш допустимый риск. Если риск на сделку настроен на 1% капитала, это остаётся верным и при плече 2x, и при 20x — плечо просто позволяет контролировать ту же номинальную позицию, заморозив меньше маржи. Реальная опасность — использовать дополнительное плечо, чтобы открыть БОЛЬШУЮ позицию сверх ваших правил риска, что приближает ликвидацию. Полный разбор с примером — в Академии → Плечо.`;
            }
            case 'risk': {
                const risk = this.userData.risk;
                return en
                    ? `Your declared risk per trade is ${risk ? risk + '%' : 'not set yet'}. The core rule most disciplined traders follow: never risk more on one idea than you're willing to lose on ${risk ? Math.round(100 / risk) : '~20-50'} trades in a row going wrong. If you've been sizing up after losses to "catch up," that's the fastest way to blow through a daily loss limit — Guardian is there to flag exactly that.`
                    : `Ваш заявленный риск на сделку — ${risk ? risk + '%' : 'ещё не задан'}. Базовое правило дисциплинированных трейдеров: никогда не рисковать на одной идее больше, чем вы готовы потерять на ${risk ? Math.round(100 / risk) : '~20-50'} подряд неудачных сделках. Если вы увеличивали размер после убытков, чтобы "отыграться" — это самый быстрый способ пробить дневной лимит убытка. Именно это отслеживает Guardian.`;
            }
            case 'discipline': {
                if (s.violations.length > 0) {
                    return en
                        ? `Guardian currently shows ${s.violations.length} rule${s.violations.length === 1 ? '' : 's'} not being met — top one: "${s.violations[0].name}". Discipline isn't about never breaking a rule, it's about noticing fast and correcting course. Want to open Guardian and go through them one by one?`
                        : `Guardian сейчас показывает ${s.violations.length} нарушени${s.violations.length === 1 ? 'е' : 'я'} — первое: "${s.violations[0].name}". Дисциплина — это не про "никогда не нарушать", а про быстро замечать и исправлять. Хотите открыть Guardian и разобрать их по порядку?`;
                }
                return en
                    ? `Guardian isn't flagging any violations right now — that's a solid foundation. Discipline compounds: the goal isn't a perfect day, it's a long streak of "good enough" days.`
                    : `Guardian сейчас не фиксирует нарушений — хорошая база. Дисциплина работает как сложный процент: цель не в идеальном дне, а в длинной серии "достаточно хороших" дней.`;
            }
            case 'strategy': {
                const strat = this.userData.strategy;
                return en
                    ? (strat
                        ? `Here's the strategy you described during onboarding: "${strat.slice(0, 220)}${strat.length > 220 ? '…' : ''}". I can't tell you if a specific trade will work, but I can help you check whether your logged trades actually follow it — want to review your last few Journal entries against these criteria?`
                        : `You haven't described your strategy yet — add it in Settings → Trading Profile, or during onboarding. Once it's written down, I can help you check whether your real trades are actually following it.`)
                    : (strat
                        ? `Вот стратегия, которую вы описали при онбординге: «${strat.slice(0, 220)}${strat.length > 220 ? '…' : ''}». Я не скажу, сработает ли конкретная сделка, но помогу проверить, действительно ли ваши записанные сделки следуют этой стратегии — разберём последние записи в Journal?`
                        : `Вы ещё не описали свою стратегию — добавьте её в Settings → Торговый профиль. Как только она будет зафиксирована, я смогу помочь проверить, действительно ли ваши реальные сделки ей соответствуют.`);
            }
            case 'session': {
                if (!s.bestSession) {
                    return en ? "I don't have enough session data yet — log the session for each trade and I'll be able to compare them." : "Пока недостаточно данных по сессиям — указывайте сессию в каждой сделке, и я смогу их сравнить.";
                }
                return en
                    ? `Based on your journal, your ${s.bestSession.label} session trades average ${(s.bestSession.avgRR >= 0 ? '+' : '')}${s.bestSession.avgRR.toFixed(1)}R — your best so far. That doesn't guarantee anything going forward, but it's worth noticing if that's also where you feel most prepared.`
                    : `По вашему журналу лучше всего пока идёт сессия ${s.bestSession.label} — средний результат ${(s.bestSession.avgRR >= 0 ? '+' : '')}${s.bestSession.avgRR.toFixed(1)}R. Это не гарантия на будущее, но стоит обратить внимание, совпадает ли это с сессией, где вы чувствуете себя увереннее всего.`;
            }
            case 'journal_review':
            case 'stats':
            default: {
                const wrText = s.winRate !== null ? s.winRate + '%' : '—';
                const rrText = s.avgRR !== null ? (s.avgRR >= 0 ? '+' : '') + s.avgRR.toFixed(1) + 'R' : '—';
                const integrated = this.getIntegratedContext();
                const marketText = integrated.market?.length ? ` Current market context: ${integrated.market.map(m => `${m.symbol} ${m.change24h >= 0 ? '+' : ''}${m.change24h.toFixed(2)}% 24h`).join(', ')}. I use that only as context, not as a prediction or signal.` : '';
                return en
                    ? `Here's where you stand: ${s.total} logged trades, ${wrText} win rate, average ${rrText} per trade.${marketText} ${s.violations.length > 0 ? `Guardian is flagging ${s.violations.length} rule${s.violations.length === 1 ? '' : 's'} right now.` : 'Guardian shows no active rule violations.'} Ask me about your risk management, psychology, or strategy and I'll dig into the specifics.`
                    : `Вот ваша текущая картина: ${s.total} сделок в журнале, Win Rate ${wrText}, средний результат ${rrText} на сделку. ${s.violations.length > 0 ? `Guardian сейчас отмечает ${s.violations.length} нарушени${s.violations.length === 1 ? 'е' : 'я'}.` : 'Guardian не фиксирует активных нарушений.'} Спросите меня про риск-менеджмент, психологию или стратегию — разберём подробнее.`;
            }
        }
    },

    handleAIQuery() {
        const question = this.aiInput?.value?.trim();
        if (!question) return;
        this.appendMessage('user', question);
        this.aiInput.value = '';
        this.showTypingIndicator();

        const reply = this.generateCoachReply(question);

        setTimeout(() => {
            this.hideTypingIndicator();
            this.appendMessage('ai', reply);
        }, 700 + Math.random() * 500);
    },

    appendMessage(role, content) {
        const cls = role === 'user' ? 'user' : 'ai';
        const avatar = role === 'user' ? (this.currentLang === 'en' ? 'You' : 'Вы') : 'AI';
        this.aiHistory.push({ role, content });
        this.saveState();
        this.hideTypingIndicator();
        const html = `
            <div class="ai-msg-wrapper ${cls}">
                <div class="ai-msg-avatar">${avatar}</div>
                <div class="ai-msg-bubble">${content}</div>
            </div>
        `;
        this.aiMessages.insertAdjacentHTML('beforeend', html);
        this.scrollToBottom();
    },

    showTypingIndicator() {
        this.hideTypingIndicator();
        const indicator = document.createElement('div');
        indicator.className = 'ai-typing-indicator';
        indicator.id = 'aiTypingIndicator';
        indicator.innerHTML = `
            <div class="ai-msg-avatar">AI</div>
            <div class="ai-typing-dots">
                <span></span><span></span><span></span>
            </div>
        `;
        this.aiMessages.appendChild(indicator);
        this.scrollToBottom();
    },

    hideTypingIndicator() {
        const el = document.getElementById('aiTypingIndicator');
        if (el) el.remove();
    },

    clearChat() {
        if (this.aiHistory.length === 0) return;
        if (!confirm('Очистить историю диалога?')) return;
        this.aiHistory = [];
        this.saveState();
        this.renderAIWelcome();
    },

    scrollToBottom() {
        const area = document.getElementById('aiChatArea');
        if (area) {
            setTimeout(() => {
                area.scrollTop = area.scrollHeight;
            }, 50);
        }
    },

    // ============================================================
    // GUARDIAN
    // ============================================================
    updateGuardianStats() {
        const en = this.currentLang === 'en';
        const total = this.trades.length;
        if (total === 0) {
            if (this.guardianScore) this.guardianScore.textContent = '—';
            if (this.guardianDayStatus) this.guardianDayStatus.textContent = en ? 'No data' : 'Нет данных';
            if (this.guardianStreak) this.guardianStreak.textContent = en ? '0 days' : '0 дней';
            if (this.guardianHistoryCount) this.guardianHistoryCount.textContent = '0';
            // Rules themselves must also reset to a neutral "no data" state — not just
            // the summary numbers — so a subsequent renderGuardianRules() call (e.g.
            // triggered by a language switch) can never re-draw a stale "✅ Passed"
            // rule card from before the trades were cleared. `passed: true` here means
            // "not a proven violation" (mirroring the >0-trades branch's nodata
            // handling below) — it does NOT mean "compliant"; renderGuardianRules()
            // reads `state`, not `passed`, for the actual displayed label.
            this.guardianRules.forEach(r => { r.state = 'nodata'; r.passed = true; });
            if (this.guardianScoreBadge) { this.guardianScoreBadge.textContent = en ? 'No data' : 'Нет данных'; this.guardianScoreBadge.className = 'score-badge neutral'; }
            if (this.guardianRulesList) this.guardianRulesList.innerHTML = `<div class="timeline-empty" style="color:var(--text-secondary); text-align:center; padding:20px 0;">${this.t('empty_guardian')}</div>`;
            if (this.guardianTimeline) this.guardianTimeline.innerHTML = `<div class="timeline-empty" style="color:var(--text-secondary); text-align:center; padding:20px 0;">${this.t('empty_guardian')}</div>`;
            if (this.guardianRecommendations) this.guardianRecommendations.innerHTML = '';
            // Shared summary object — the Smart Dashboard's Guardian Status card
            // (v1.0.7) reads this instead of re-running rule evaluation itself.
            this.guardianSummary = { score: null, passed: 0, failed: 0, nodata: this.guardianRules.length };
            this.updateNotifBadge();
            this.renderDashboardGuardianCard();
            return;
        }

        // ------------------------------------------------------------
        // Rule evaluation — every rule below is graded against a specific
        // real field stored on trades, using the user's OWN configured
        // thresholds (risk %, daily loss limit) where available. A rule
        // is only ever 'passed' or 'failed' when we actually have the
        // data to prove it; otherwise it's 'nodata' — it is NEVER assumed
        // passed just because nothing contradicts it.
        //
        // Evaluated over the most recent day that actually has trades
        // (so the card reflects real trading activity, not an
        // artificially empty "today" for someone who traded yesterday).
        // ------------------------------------------------------------
        const dayKeys = [...new Set(this.trades.map(t => t.date))].filter(Boolean).sort();
        const latestDay = dayKeys[dayKeys.length - 1];
        const latestDayTrades = this.trades.filter(t => t.date === latestDay);
        const lossesLatestDay = latestDayTrades.filter(t => t.status === 'loss').length;
        const negativeEmotions = ['greed', 'fear', 'revenge', 'anxious'];

        // 1. Risk per trade <= configured max (default 1%) — uses the real
        //    riskPercent value entered on each trade.
        const riskLimit = parseFloat(this.userData.risk) || 1;
        const riskValues = this.trades.map(t => parseFloat(t.riskPercent)).filter(v => !isNaN(v));
        if (riskValues.length === 0) {
            this.guardianRules[0].state = 'nodata';
        } else {
            this.guardianRules[0].state = riskValues.every(v => v <= riskLimit) ? 'passed' : 'failed';
        }

        // 2. Max 5 trades on the most recent trading day.
        this.guardianRules[1].state = latestDayTrades.length <= 5 ? 'passed' : 'failed';

        // 3. Stop Loss always set — the trade form has no Stop Loss field,
        //    so this can never be verified from real data yet. Always 'nodata'
        //    rather than a fabricated pass. (See VERSION.md.)
        this.guardianRules[2].state = 'nodata';

        // 4. Daily loss limit not exceeded — compares the real $ P&L lost on
        //    the most recent trading day against the user's own configured
        //    daily loss limit from onboarding/Settings.
        const dailyLossLimit = parseFloat(this.userData.dailyLoss);
        if (!dailyLossLimit) {
            this.guardianRules[3].state = 'nodata';
        } else {
            const lossSumLatestDay = latestDayTrades.filter(t => t.pnl < 0).reduce((sum, t) => sum + Math.abs(t.pnl || 0), 0);
            this.guardianRules[3].state = lossSumLatestDay <= dailyLossLimit ? 'passed' : 'failed';
        }

        // 5. No trading on negative emotions — uses the real emotionBefore
        //    field recorded per trade.
        const emotionValues = latestDayTrades.map(t => t.emotionBefore).filter(Boolean);
        if (emotionValues.length === 0) {
            this.guardianRules[4].state = 'nodata';
        } else {
            this.guardianRules[4].state = emotionValues.every(e => !negativeEmotions.includes(e)) ? 'passed' : 'failed';
        }

        // 6. Trade plan followed — uses whether a strategy/plan label was
        //    actually recorded on each trade (a real, if weak, proxy —
        //    there's no separate "did you follow your plan" field yet).
        const strategyValues = latestDayTrades.map(t => t.strategy);
        if (strategyValues.length === 0) {
            this.guardianRules[5].state = 'nodata';
        } else {
            this.guardianRules[5].state = strategyValues.every(s => s && s.trim().length > 0) ? 'passed' : 'failed';
        }

        // Mirror `.passed` for the small number of places elsewhere that only
        // care about "is this an active violation" — nodata is deliberately
        // NOT a violation, since we have no proof either way.
        this.guardianRules.forEach(r => { r.passed = r.state !== 'failed'; });

        // Score is computed ONLY over rules we could actually evaluate.
        // 'nodata' rules are excluded from both numerator and denominator —
        // including them as "passed" would inflate the score with rules
        // nobody actually verified.
        const evaluated = this.guardianRules.filter(r => r.state !== 'nodata');
        const passedCount = evaluated.filter(r => r.state === 'passed').length;
        const score = evaluated.length > 0 ? Math.round((passedCount / evaluated.length) * 100) : null;

        let badgeText, badgeClass;
        if (score === null) { badgeText = en ? 'No data' : 'Нет данных'; badgeClass = 'neutral'; }
        else if (score >= 80) { badgeText = en ? 'Excellent' : 'Отлично'; badgeClass = ''; }
        else if (score >= 50) { badgeText = en ? 'OK' : 'Нормально'; badgeClass = 'warning'; }
        else { badgeText = en ? 'Needs attention' : 'Требует внимания'; badgeClass = 'danger'; }

        if (this.guardianScore) this.guardianScore.textContent = score === null ? '—' : score + '%';
        if (this.guardianScoreBadge) {
            this.guardianScoreBadge.textContent = badgeText;
            this.guardianScoreBadge.className = 'score-badge ' + badgeClass;
        }

        const failedCount = evaluated.filter(r => r.state === 'failed').length;
        let statusText = en ? '✅ Discipline on track' : '✅ Дисциплина соблюдена';
        if (evaluated.length === 0) statusText = en ? '📋 Not enough data yet' : '📋 Недостаточно данных';
        else if (failedCount > 0) statusText = en ? '⚠️ Watch your limits' : '⚠️ Обратите внимание на лимиты';
        if (this.guardianDayStatus) this.guardianDayStatus.textContent = statusText;

        // Streak: consecutive most-recent days where every EVALUATED rule
        // for that day passed (a day with only 'nodata' rules does not
        // count toward — or break — the streak, since there's nothing to
        // judge it on).
        let streak = 0;
        const uniqueDays = [...dayKeys].reverse();
        for (let day of uniqueDays) {
            const dayTrades = this.trades.filter(t => t.date === day);
            const dayLosses = dayTrades.filter(t => t.status === 'loss').length;
            const dayLossSum = dayTrades.filter(t => t.pnl < 0).reduce((sum, t) => sum + Math.abs(t.pnl || 0), 0);
            const dayHadBadEmotion = dayTrades.some(t => negativeEmotions.includes(t.emotionBefore));
            const dayLimitOk = !dailyLossLimit || dayLossSum <= dailyLossLimit;
            if (dayTrades.length <= 5 && dayLimitOk && !dayHadBadEmotion) {
                streak++;
            } else {
                break;
            }
        }
        if (this.guardianStreak) this.guardianStreak.textContent = streak + (en ? ' days' : ' дней');

        // Shared summary object — reused by the Dashboard's Guardian Status
        // card (v1.0.7) so it never re-implements rule evaluation itself.
        const nodataCount = this.guardianRules.length - evaluated.length;
        this.guardianSummary = { score, passed: passedCount, failed: failedCount, nodata: nodataCount };

        this.renderGuardianRules();
        this.renderGuardianTimeline();
        this.renderGuardianRecommendations();
        this.updateNotifBadge();
        this.renderDashboardGuardianCard();
    },

    renderGuardianRules() {
        if (!this.guardianRulesList) return;
        const en = this.currentLang === 'en';
        let html = '';
        this.guardianRules.forEach(rule => {
            const state = rule.state || (rule.passed ? 'passed' : 'failed');
            const statusClass = state === 'passed' ? 'passed' : (state === 'failed' ? 'failed' : 'nodata');
            const statusText = state === 'passed' ? (en ? '✅ Passed' : '✅ Соблюдено')
                : state === 'failed' ? (en ? '⚠️ Violated' : '⚠️ Нарушение')
                : (en ? '— No data' : '— Нет данных');
            html += `
                <div class="rule-item">
                    <span>${rule.icon} ${rule.name}</span>
                    <span class="rule-status ${statusClass}">${statusText}</span>
                </div>
            `;
        });
        this.guardianRulesList.innerHTML = html;
    },

    renderGuardianTimeline() {
        if (!this.guardianTimeline) return;
        const en = this.currentLang === 'en';
        const total = this.trades.length;
        if (total === 0) {
            this.guardianTimeline.innerHTML = `<div class="timeline-empty" style="color:var(--text-secondary); text-align:center; padding:20px 0;">${this.t('empty_guardian')}</div>`;
            if (this.guardianHistoryCount) this.guardianHistoryCount.textContent = '0';
            return;
        }

        // Every timeline entry is derived directly from a real logged trade —
        // no synthetic padding events, no fabricated "streak" achievements.
        const sortedTrades = [...this.trades].reverse().slice(0, 10);
        const events = sortedTrades.map(t => {
            if (t.status === 'win') {
                return { type: 'achievement', title: en ? '🏆 Disciplined trade' : '🏆 Дисциплинированная сделка', desc: en ? `${t.asset} closed on ${t.date}, result ${t.result || ''}.` : `Сделка по ${t.asset} закрыта ${t.date}, результат ${t.result || ''}.` };
            } else if (t.status === 'loss') {
                return { type: 'warning', title: en ? '⚠️ Loss to review' : '⚠️ Убыток на разбор', desc: en ? `${t.asset} closed on ${t.date} at a loss. Review the entry against your plan.` : `Сделка по ${t.asset} закрыта ${t.date} в минус. Проверьте вход относительно плана.` };
            }
            return { type: 'neutral', title: en ? '📋 Trade logged' : '📋 Сделка записана', desc: `${t.asset} — ${t.date}` };
        });

        if (this.guardianHistoryCount) this.guardianHistoryCount.textContent = events.length;

        let html = '';
        events.slice(0, 8).forEach(e => {
            const icon = e.type === 'achievement' ? '🏆' : (e.type === 'warning' ? '⚠️' : '📋');
            html += `
                <div class="timeline-item">
                    <div class="tl-icon ${e.type}">${icon}</div>
                    <div class="tl-content">
                        <div class="tl-title">${e.title}</div>
                        <div class="tl-desc">${e.desc}</div>
                    </div>
                </div>
            `;
        });
        this.guardianTimeline.innerHTML = html;
    },

    renderGuardianRecommendations() {
        if (!this.guardianRecommendations) return;
        const en = this.currentLang === 'en';
        const total = this.trades.length;
        const MIN_TRADES = 3;
        if (total < MIN_TRADES) {
            const label = en
                ? `Not enough data for recommendations yet (${total}/${MIN_TRADES} trades logged).`
                : `Недостаточно данных для рекомендаций (${total}/${MIN_TRADES} сделок в журнале).`;
            this.guardianRecommendations.innerHTML = `<div class="rec-empty" style="color:var(--text-secondary); text-align:center; padding:20px 0;">${label}</div>`;
            return;
        }

        // Data-driven recommendations first (grounded in the user's real journal),
        // topped up with general coaching guidance only if there's room left.
        const s = this.getCoachStats();
        const recs = [];
        if (s.violations.length > 0) {
            recs.push({ icon: '🛡', text: en
                ? `<strong>Guardian:</strong> ${s.violations.length} rule${s.violations.length === 1 ? ' is' : 's are'} currently flagged — start with "${s.violations[0].name}".`
                : `<strong>Guardian:</strong> сейчас отмечено нарушений: ${s.violations.length} — начните с «${s.violations[0].name}».` });
        }
        if (s.maxLossStreak >= 3) {
            recs.push({ icon: '🧠', text: en
                ? `<strong>Coach tip:</strong> your longest losing streak is ${s.maxLossStreak} trades. Consider a short break after 2-3 losses in a row to reset before the next entry.`
                : `<strong>Совет коуча:</strong> ваша самая длинная серия убытков — ${s.maxLossStreak} сделок. После 2-3 убытков подряд полезно сделать паузу перед следующим входом.` });
        }
        if (s.bestSession) {
            recs.push({ icon: '📈', text: en
                ? `<strong>Pattern:</strong> your ${s.bestSession.label} session trades average ${(s.bestSession.avgRR >= 0 ? '+' : '')}${s.bestSession.avgRR.toFixed(1)}R so far — your strongest session in the journal.`
                : `<strong>Закономерность:</strong> сессия ${s.bestSession.label} пока даёт средний результат ${(s.bestSession.avgRR >= 0 ? '+' : '')}${s.bestSession.avgRR.toFixed(1)}R — ваша сильнейшая сессия по журналу.` });
        }
        if (recs.length === 0 || recs.length < 2) {
            recs.push({ icon: '📋', text: en
                ? '<strong>Keep logging:</strong> the more trades in your journal, the more specific these recommendations get.'
                : '<strong>Продолжайте вести журнал:</strong> чем больше сделок в журнале, тем точнее становятся рекомендации.' });
        }

        let html = '';
        recs.slice(0, 2).forEach(rec => {
            html += `
                <div class="rec-card">
                    <span class="rec-icon">${rec.icon}</span> ${rec.text}
                </div>
            `;
        });
        this.guardianRecommendations.innerHTML = html;
    },

    initGuardianChart() {
        const canvas = this.guardianDisciplineChart;
        if (!canvas) return;
        if (this.guardianCharts.discipline) { this.guardianCharts.discipline.destroy(); this.guardianCharts.discipline = null; }

        const wrapper = canvas.closest('.chart-container') || canvas.parentElement;

        // A brand-new (or fully cleared) account has no trades on ANY day,
        // so there is nothing real to plot. Previously this chart defaulted
        // every day with no trades to a score of 100, which fabricated a
        // full 7-day "perfect discipline" line for users who had never
        // placed a single trade. Now it shows a genuine empty state instead.
        if (this.trades.length === 0) {
            canvas.style.display = 'none';
            this.renderEmptyState(wrapper, this.t('empty_guardian'));
            return;
        }
        canvas.style.display = '';
        this.clearEmptyState(wrapper);

        const days = [];
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().slice(0, 10);
            days.push(dateStr.slice(5, 10));
            const dayTrades = this.trades.filter(t => t.date === dateStr);
            // Days with no real trades are plotted as `null` (a gap in the
            // line) rather than a fabricated 100 — only days with at least
            // one real trade get a real discipline score.
            let score = null;
            if (dayTrades.length > 0) {
                const losses = dayTrades.filter(t => t.status === 'loss').length;
                score = Math.max(0, 100 - (losses * 15));
            }
            data.push(score);
        }

        this.guardianCharts.discipline = new Chart(canvas, {
            type: 'line', data: { labels: days, datasets: [{ label: 'Дисциплина (%)', data: data, borderColor: '#7c5cfc', backgroundColor: 'rgba(124, 92, 252, 0.1)', borderWidth: 2, spanGaps: false, pointRadius: data.map(v => v === null ? 0 : 4), pointBackgroundColor: data.map(v => v === null ? 'transparent' : (v >= 80 ? '#43c6a0' : v >= 50 ? '#fbbf24' : '#ef4444')), tension: 0.4, fill: true }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#8892a0' } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8892a0', min: 0, max: 100 } } } }
        });
    },

    // ============================================================
    // SETTINGS
    // ============================================================
    saveSettings(type) {

        if (type === 'profile') {

            const name = this.settingsName?.value?.trim();
            const email = this.settingsEmailInput?.value?.trim();
            const username = this.settingsUsernameInput?.value?.trim();

            if (name) this.userData.name = name;
            if (email) this.userData.email = email;
            if (username) this.userData.username = username;

            const displayName =
                username ||
                name ||
                "Trader";

            if (this.settingsUsername) {
                this.settingsUsername.textContent = displayName;
            }

            if (this.settingsEmail) {
                this.settingsEmail.textContent =
                    email || "user@kriptodanik.ai";
            }

            if (this.userNameDisplay) {
                this.userNameDisplay.textContent = displayName;
            }

            this.updateGreeting();

        }

        else if (type === 'trading') {

            this.userData.capital =
                parseFloat(this.settingsCapital?.value) || 10000;

            this.userData.risk =
                parseFloat(this.settingsRisk?.value) || 1.0;

            this.userData.dailyLoss =
                parseFloat(this.settingsDailyLoss?.value) || 500;

            this.userData.dailyTarget =
                parseFloat(this.settingsDailyTarget?.value) || 800;

            this.userData.rr =
                this.settingsRR?.value || "1:2";

            this.userData.tradingStyle =
                this.settingsTradingStyle?.value || "day";

            this.userData.session =
                this.settingsSession?.value || "ny";

            if (this.balanceDisplay) {
                this.updateBalanceDisplay();
            }

        }

        else if (type === 'appearance') {

            const lang =
                this.settingsLang?.value || "ru";

            const currency =
                this.settingsCurrency?.value || "USD";

            if (lang !== this.currentLang) {
                this.currentLang = lang;
                this.applyLanguage();
                this.langButtons.forEach(b => b.classList.toggle('active', b.dataset.lang === this.currentLang));
            }

            this.userData.currency = currency;
            this.userData.dateFormat = this.settingsDateFormat?.value || 'DD.MM.YYYY';

            // Theme/accent are already applied instantly when clicked — this just
            // confirms the current DOM state is what gets persisted.
            this.userData.theme =
                document.querySelector(".theme-option.active")?.dataset.theme || "dark";
            const activeAccentIdx = Array.from(this.accentOptions).findIndex(o => o.classList.contains('active'));
            this.userData.accent = this.accentPalette[activeAccentIdx] || this.userData.accent || 'purple';

        }

        this.saveState();

        if (typeof this.applyUserData === "function") {
            this.applyUserData();
        }

        this.updateDashboardStats();

        this.showToast("Настройки сохранены!");

    },

    // ============================================================
    // DATA EXPORT / IMPORT
    // ============================================================
    exportData(type) {
        let data, filename, mime;
        if (type === 'trades') {
            const headers = ['Date', 'Asset', 'Side', 'Entry', 'Exit', 'RR', 'Result', 'Status'];
            const rows = this.trades.map(t => [t.date, t.asset, t.side, t.entry, t.exit, t.rr, t.result, t.status]);
            let csv = headers.join(',') + '\n';
            rows.forEach(row => { csv += row.join(',') + '\n'; });
            data = csv; filename = 'trades_export.csv'; mime = 'text/csv';
        } else {
            const json = JSON.stringify({ trades: this.trades, events: this.events, userData: this.userData }, null, 2);
            data = json; filename = 'kriptodanik_backup.json'; mime = 'application/json';
        }
        const blob = new Blob([data], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        a.click(); URL.revokeObjectURL(url);
        this.showToast('Экспорт завершен!');
    },

    importData() {
        const input = document.createElement('input');
        input.type = 'file'; input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data.trades) {
                        this.trades = data.trades;
                        this.filteredTrades = [...this.trades];
                        this.events = data.events ? this.reviveEvents(data.events) : this.events;
                        this.userData = data.userData || this.userData;
                        this.renderJournal(); this.updateJournalStats();
                        this.updateDashboardStats(); this.updateAnalytics();
                        this.updateGuardianStats(); this.initGuardianChart();
                        this.renderCalendar(); this.updateCalendarBadge();
                        this.saveState(); this.applyUserData();
                        this.showToast('Импорт данных выполнен успешно!');
                    } else {
                        this.showToast('Ошибка импорта: файл не содержит данных о сделках');
                    }
                } catch (err) {
                    this.showToast('Ошибка импорта: неверный формат файла');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },

    clearAllData() {
        if (!confirm('⚠️ Это действие удалит ВСЕ ваши данные (сделки, события, историю). Отменить невозможно!')) return;
        this.trades = []; this.filteredTrades = [];
        this.events = []; this.aiHistory = [];
        this.guardianViolations = [];
        this.renderJournal(); this.updateJournalStats();
        this.updateDashboardStats(); this.updateBalanceDisplay();
        this.initEquityChart(); this.renderDashboardExtras();
        this.updateAnalytics();
        this.updateGuardianStats(); this.initGuardianChart();
        this.renderCalendar(); this.updateCalendarBadge();
        this.renderNotifications(); this.updateNotifBadge();
        this.renderAIWelcome();
        this.saveState();
        this.showToast('Все данные очищены.');
    },

    // ============================================================
    // TOAST NOTIFICATIONS
    // ============================================================
    showToast(message) {
        const old = document.querySelector('.toast');
        if (old) old.remove();
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    },

    // ============================================================
    // RENDER ALL
    // ============================================================
    // ============================================================
    // v1.0.8 — ACADEMY
    // Purely educational content + a standalone calculator. Never reads
    // or writes this.trades/this.userData for its lesson content — the
    // only place real user data appears is the calculator, and only
    // because the user typed it into the calculator's own inputs, which
    // are never saved to the account and never mixed into Guardian/
    // Dashboard/Analytics. Guardian logic itself is not duplicated here;
    // lessons only describe concepts and link out to the real sections.
    // ============================================================
    academyLessons: {
        position_size: {
            icon: '📐', difficulty: { ru: 'Начальный', en: 'Beginner' }, minutes: 4,
            title: { ru: 'Размер позиции', en: 'Position Size' },
            desc: {
                ru: 'Как рассчитать размер позиции исходя из капитала, риска и Stop Loss.',
                en: 'Learn how to calculate the right position size from your capital, risk and Stop Loss.'
            },
            intro: {
                ru: 'В крипте нет единого «лота», как на форексе. Разные биржи используют разный минимальный шаг контракта. Поэтому трейдеры обычно думают в терминах размера позиции, количества актива и номинальной стоимости позиции — а не «лотов».',
                en: 'Crypto has no single universal "lot" the way forex does — every exchange has its own minimum contract step. Traders instead think in terms of position size, quantity of the asset, and notional position value — not "lots".'
            },
            body: {
                ru: `<p><strong>Размер позиции</strong> — это количество актива, которое вы покупаете или продаёте (например, 0.02 BTC).</p>
                     <p><strong>Номинальная стоимость (notional)</strong> — это размер позиции в долларах: количество × цена входа.</p>
                     <p>Размер позиции должен подбираться так, чтобы срабатывание Stop Loss примерно соответствовало вашему запланированному риску в долларах — а не наоборот.</p>`,
                en: `<p><strong>Position size</strong> is the quantity of the asset you buy or sell (e.g. 0.02 BTC).</p>
                     <p><strong>Notional value</strong> is that position size in dollars: quantity × entry price.</p>
                     <p>Position size should be chosen so that hitting your Stop Loss roughly matches your planned dollar risk — not the other way around.</p>`
            },
            formula: { ru: 'Размер позиции = Максимальный риск ($) ÷ Расстояние до стопа ($ за единицу актива)', en: 'Position Size = Max Risk ($) ÷ Stop Distance ($ per unit of asset)' },
            example: {
                ru: 'ОБРАЗОВАТЕЛЬНЫЙ ПРИМЕР (не ваши реальные данные): Капитал $1,000, риск 1% → максимальный риск $10. Вход $50,000, Stop Loss $49,500 → расстояние до стопа $500. Размер позиции = $10 ÷ $500 = 0.02 BTC. Номинал ≈ $1,000.',
                en: 'EDUCATIONAL EXAMPLE (not your real data): Capital $1,000, risk 1% → max risk $10. Entry $50,000, Stop Loss $49,500 → stop distance $500. Position size = $10 ÷ $500 = 0.02 BTC. Notional ≈ $1,000.'
            },
            mistakes: {
                ru: ['Выбирать размер позиции «на глаз», а не по расчёту', 'Путать размер позиции с номинальной стоимостью', 'Игнорировать расстояние до стопа при расчёте размера'],
                en: ['Picking position size by feel instead of calculating it', 'Confusing position size with notional value', 'Ignoring stop distance when sizing the position']
            },
            warning: {
                ru: 'Это образовательный пример, а не расчёт по вашему счёту. Используйте калькулятор ниже для собственных чисел.',
                en: 'This is an educational example, not a calculation against your account. Use the calculator below for your own numbers.'
            },
            hasCalculator: true,
            askCoach: { ru: 'Как рассчитать размер позиции для моей сделки?', en: 'How do I calculate position size for my trade?' }
        },
        risk_per_trade: {
            icon: '🎯', difficulty: { ru: 'Начальный', en: 'Beginner' }, minutes: 3,
            title: { ru: 'Риск на сделку', en: 'Risk Per Trade' },
            desc: {
                ru: 'Сколько вы можете позволить себе потерять до входа в сделку.',
                en: 'Understand how much you can afford to lose before entering a trade.'
            },
            intro: {
                ru: 'Риск на сделку — это доля капитала, которой вы готовы рискнуть в одной сделке, если сработает Stop Loss.',
                en: 'Risk per trade is the share of your capital you are willing to risk on a single trade if the Stop Loss is hit.'
            },
            body: {
                ru: `<p>Цепочка расчёта: <strong>Капитал → Риск % → Максимальный убыток ($) → Расстояние до стопа → Размер позиции</strong>.</p>
                     <p>Сначала решите, сколько процентов капитала вы готовы потерять — обычно 0.5–2%. Затем считайте размер позиции от этой суммы, а не наоборот.</p>`,
                en: `<p>The chain is: <strong>Capital → Risk % → Maximum loss ($) → Stop distance → Position size</strong>.</p>
                     <p>Decide your risk percentage first — typically 0.5–2% — then size the position from that dollar amount, never the other way around.</p>`
            },
            formula: { ru: 'Максимальный убыток ($) = Капитал × Риск %', en: 'Maximum Loss ($) = Capital × Risk %' },
            example: {
                ru: 'ОБРАЗОВАТЕЛЬНЫЙ ПРИМЕР: Капитал $1,000, риск 1% → максимальный запланированный убыток $10. Реальное исполнение может отличаться из-за комиссий, проскальзывания, funding, спреда и цены исполнения — расчёт не может быть абсолютно точным.',
                en: 'EDUCATIONAL EXAMPLE: Capital $1,000, risk 1% → maximum planned loss $10. Real execution can differ due to fees, slippage, funding, spread, and execution price — the calculation can never be perfectly exact.'
            },
            mistakes: {
                ru: ['Рисковать разным % на разных сделках без причины', 'Увеличивать риск после серии убытков, пытаясь отыграться', 'Забывать про комиссии и funding при оценке реального риска'],
                en: ['Risking a different % on different trades with no reason', 'Increasing risk after a losing streak to "catch up"', 'Forgetting fees and funding when estimating real risk']
            },
            warning: { ru: 'Guardian проверяет реальный riskPercent по вашим сделкам — но только если вы его указываете при добавлении сделки.', en: 'Guardian checks your real riskPercent field on trades — but only if you fill it in when logging a trade.' },
            askCoach: { ru: 'Как определить правильный риск на сделку?', en: 'How do I determine the right risk per trade?' }
        },
        stop_loss: {
            icon: '🛑', difficulty: { ru: 'Начальный', en: 'Beginner' }, minutes: 3,
            title: { ru: 'Stop Loss', en: 'Stop Loss' },
            desc: { ru: 'Зачем нужен Stop Loss и как он определяет размер позиции.', en: 'Why a Stop Loss matters and how it drives position size.' },
            intro: { ru: 'Stop Loss — это цена, при которой вы закрываете сделку с убытком, чтобы ограничить дальнейшие потери.', en: 'A Stop Loss is the price at which you close a losing trade to limit further losses.' },
            body: {
                ru: `<p>Расстояние от входа до Stop Loss (в $ или %) — ключевая переменная в расчёте размера позиции: чем дальше стоп, тем меньше должна быть позиция при том же риске в долларах.</p>
                     <p>Stop Loss ставится ДО входа в сделку, на основе логики сетапа — а не после, «на глаз».</p>`,
                en: `<p>The distance from entry to Stop Loss (in $ or %) is the key variable in position sizing: the wider the stop, the smaller the position needs to be for the same dollar risk.</p>
                     <p>Stop Loss is set BEFORE entering the trade, based on the setup's logic — not adjusted afterward by feel.</p>`
            },
            formula: { ru: 'Расстояние до стопа % = (Вход − Stop Loss) ÷ Вход × 100', en: 'Stop Distance % = (Entry − Stop Loss) ÷ Entry × 100' },
            example: { ru: 'ОБРАЗОВАТЕЛЬНЫЙ ПРИМЕР: Вход $50,000, Stop Loss $49,500 → расстояние $500, то есть 1% от цены входа.', en: 'EDUCATIONAL EXAMPLE: Entry $50,000, Stop Loss $49,500 → distance $500, i.e. 1% of entry price.' },
            mistakes: { ru: ['Двигать стоп дальше после того, как цена пошла против вас', 'Не ставить стоп вообще', 'Ставить стоп слишком близко без учёта волатильности актива'], en: ['Moving the stop further away after price goes against you', 'Not setting a stop at all', 'Setting a stop too tight relative to the asset\'s volatility'] },
            warning: { ru: 'В приложении пока нет отдельного поля Stop Loss на сделке — Guardian не может проверить, действительно ли стоп был выставлен.', en: 'The app does not yet have a dedicated Stop Loss field on trades — Guardian cannot verify whether a stop was actually set.' },
            askCoach: { ru: 'Как правильно ставить Stop Loss?', en: 'How should I set my Stop Loss?' }
        },
        leverage: {
            icon: '⚖️', difficulty: { ru: 'Средний', en: 'Intermediate' }, minutes: 5,
            title: { ru: 'Плечо (Leverage)', en: 'Leverage' },
            desc: { ru: 'Экспозиция, маржа и почему большее плечо не значит больший допустимый риск.', en: 'Understand exposure, margin and why higher leverage does not mean higher allowed risk.' },
            intro: { ru: 'Плечо позволяет контролировать более крупную номинальную позицию, используя меньше маржи (залога).', en: 'Leverage lets you control a larger notional position while using less margin (collateral).' },
            body: {
                ru: `<p>Плечо НЕ создаёт прибыль само по себе — оно увеличивает экспозицию. Позиция на $1,000 остаётся позицией на $1,000, независимо от плеча.</p>
                     <p><strong>Более высокое плечо не означает, что можно рисковать бо́льшим процентом капитала.</strong> Если у вас $1,000 капитала и риск 1%, максимальный риск остаётся ≈$10 — переход с плеча 2x на 10x не превращает допустимый риск в $100.</p>
                     <p>Плечо влияет на маржу, но риск по-прежнему определяется размером позиции и Stop Loss.</p>`,
                en: `<p>Leverage does NOT create profit by itself — it magnifies exposure. A $1,000 position stays a $1,000 position, whatever the leverage.</p>
                     <p><strong>Higher leverage does not mean you can risk a higher percentage of capital.</strong> With $1,000 capital and 1% risk, your max risk stays ≈$10 — going from 2x to 10x leverage does not turn the allowed risk into $100.</p>
                     <p>Leverage changes your margin requirement, but risk is still driven by position size and Stop Loss.</p>`
            },
            formula: { ru: 'Примерная маржа = Номинал ÷ Плечо', en: 'Approx. Margin = Notional ÷ Leverage' },
            example: { ru: 'ОБРАЗОВАТЕЛЬНЫЙ ПРИМЕР: Позиция на $1,000 номинала с плечом 5x требует примерно $200 маржи (до комиссий и других требований биржи). Сама позиция остаётся ≈$1,000.', en: 'EDUCATIONAL EXAMPLE: A $1,000 notional position with 5x leverage requires approximately $200 margin (before fees and other exchange requirements). The position itself stays ≈$1,000.' },
            mistakes: { ru: ['Считать, что высокое плечо = высокая допустимая прибыль/риск', 'Увеличивать размер позиции просто потому что доступно больше плеча', 'Игнорировать, что плечо приближает ликвидацию при плохом размере позиции'], en: ['Assuming high leverage = higher allowed profit/risk', 'Increasing position size just because more leverage is available', 'Ignoring that leverage brings liquidation closer if the position is poorly sized'] },
            warning: { ru: 'Плечо увеличивает экспозицию и может приблизить ликвидацию при плохо рассчитанном размере позиции.', en: 'Leverage magnifies exposure and can make liquidation easier to reach if the position is poorly sized.' },
            askCoach: { ru: 'Объясни, как плечо влияет на мой риск', en: 'Explain how leverage affects my risk' }
        },
        isolated_cross: {
            icon: '🔀', difficulty: { ru: 'Средний', en: 'Intermediate' }, minutes: 4,
            title: { ru: 'Изолированная и кросс-маржа', en: 'Isolated vs Cross Margin' },
            desc: { ru: 'В чём разница между изолированной и кросс-маржой.', en: 'The difference between isolated and cross margin modes.' },
            intro: { ru: 'Большинство бирж дают выбор между изолированной и кросс-маржой для позиций с плечом.', en: 'Most exchanges let you choose between isolated and cross margin for leveraged positions.' },
            body: {
                ru: `<p><strong>Изолированная маржа (Isolated):</strong> маржа позиции отделена от остального счёта; убытки, как правило, ограничены выделенной на эту позицию маржой (с учётом механики биржи); риск легче удерживать под контролем.</p>
                     <p><strong>Кросс-маржа (Cross):</strong> доступный баланс счёта может использоваться совместно между позициями; это может дать больше запаса до ликвидации, но также может подвергнуть риску бо́льшую часть счёта.</p>`,
                en: `<p><strong>Isolated margin:</strong> the position's margin is kept separate from the rest of the account; losses are generally limited to the margin allocated to that position, subject to exchange mechanics; easier to contain risk.</p>
                     <p><strong>Cross margin:</strong> available account/margin balance may be shared across positions; this can provide more room before liquidation, but can also expose more of the account to losses.</p>`
            },
            example: { ru: 'Это общие принципы, а не гарантия поведения конкретной биржи.', en: 'These are general principles, not a guarantee of any specific exchange\'s behavior.' },
            mistakes: { ru: ['Выбирать кросс-маржу не понимая, что весь баланс под риском', 'Считать изолированную маржу «безопасной» без учёта реального размера позиции'], en: ['Choosing cross margin without realizing the whole balance is at risk', 'Assuming isolated margin is "safe" regardless of actual position size'] },
            warning: { ru: 'Точная механика маржи и ликвидации зависит от биржи, типа контракта, комиссий, поддерживающей маржи и других специфичных правил платформы.', en: 'Exact margin and liquidation mechanics depend on the exchange, contract type, fees, maintenance margin, and other platform-specific rules.' },
            askCoach: { ru: 'В чём разница между изолированной и кросс-маржой для меня?', en: 'What\'s the difference between isolated and cross margin for me?' }
        },
        liquidation: {
            icon: '⚠️', difficulty: { ru: 'Средний', en: 'Intermediate' }, minutes: 4,
            title: { ru: 'Ликвидация', en: 'Liquidation' },
            desc: { ru: 'Что такое ликвидация и от чего она зависит.', en: 'What liquidation is and what it depends on.' },
            intro: { ru: 'Ликвидация происходит, когда маржи позиции становится недостаточно для её поддержания по правилам биржи.', en: 'Liquidation happens when the position\'s margin becomes insufficient to maintain the position under the exchange\'s rules.' },
            body: {
                ru: `<p>Цена ликвидации зависит от нескольких факторов вместе: плечо, размер маржи, поддерживающая маржа (maintenance margin) и размер позиции.</p>
                     <p>Чем выше плечо при том же размере позиции — тем меньше запас до ликвидации, потому что маржи выделено меньше.</p>`,
                en: `<p>The liquidation price depends on several factors together: leverage, margin amount, maintenance margin, and position size.</p>
                     <p>Higher leverage on the same position size means less room before liquidation, because less margin is allocated.</p>`
            },
            example: { ru: 'Мы намеренно не приводим здесь «универсальную формулу» цены ликвидации — она различается между биржами и типами контрактов.', en: 'We deliberately do not give a "universal formula" for liquidation price here — it varies between exchanges and contract types.' },
            mistakes: { ru: ['Считать, что цена ликвидации одинаковая на всех биржах', 'Использовать максимальное доступное плечо без расчёта', 'Не учитывать поддерживающую маржу'], en: ['Assuming liquidation price is the same across all exchanges', 'Using the maximum available leverage without calculating anything', 'Ignoring maintenance margin'] },
            warning: { ru: 'Точный расчёт цены ликвидации зависит от конкретной биржи и контракта — уточняйте его на самой бирже.', en: 'The exact liquidation price calculation depends on the specific exchange and contract — check it directly on the exchange.' },
            askCoach: { ru: 'Объясни простыми словами, что такое ликвидация', en: 'Explain liquidation to me in simple terms' }
        },
        risk_management: {
            icon: '🛡', difficulty: { ru: 'Средний', en: 'Intermediate' }, minutes: 5,
            title: { ru: 'Риск-менеджмент', en: 'Risk Management' },
            desc: { ru: 'Комплексный взгляд на управление риском в трейдинге.', en: 'A broader look at managing risk across your trading.' },
            intro: { ru: 'Риск-менеджмент — это не одно правило, а система: риск на сделку, дневной лимит убытка, максимальная экспозиция, размер позиции, Stop Loss, соотношение риск/прибыль и торговая психология.', en: 'Risk management isn\'t one rule — it\'s a system: risk per trade, daily loss limit, maximum exposure, position sizing, Stop Loss, risk/reward, and trading psychology.' },
            body: {
                ru: `<ul>
                        <li>Риск на сделку — фиксированный % капитала на идею.</li>
                        <li>Дневной лимит убытка — точка, где вы останавливаетесь на сегодня.</li>
                        <li>Максимальная экспозиция — сколько открыто одновременно.</li>
                        <li>Risk/Reward — потенциальная прибыль относительно риска.</li>
                        <li>Избегание revenge-трейдинга после убытков.</li>
                        <li>Осторожность с избыточным плечом.</li>
                        <li>Избегание перегрузки коррелирующими позициями (например, несколько альткоинов, движущихся как BTC).</li>
                     </ul>`,
                en: `<ul>
                        <li>Risk per trade — a fixed % of capital per idea.</li>
                        <li>Daily loss limit — the point where you stop for the day.</li>
                        <li>Maximum exposure — how much is open at once.</li>
                        <li>Risk/Reward — potential gain relative to risk.</li>
                        <li>Avoiding revenge trading after losses.</li>
                        <li>Being cautious with excessive leverage.</li>
                        <li>Avoiding overexposure to correlated positions (e.g. several altcoins that move like BTC).</li>
                     </ul>`
            },
            example: { ru: 'Academy объясняет, ЧТО стоит делать. Guardian проверяет, ДЕЙСТВИТЕЛЬНО ЛИ вы это сделали — по вашим реальным сохранённым сделкам, там, где для этого достаточно данных.', en: 'Academy explains WHAT you should do. Guardian checks whether you ACTUALLY did it — using your real stored trades, wherever there is enough data to check.' },
            mistakes: { ru: ['Полагаться только на один элемент риск-менеджмента (например, только Stop Loss)', 'Игнорировать корреляцию между открытыми позициями', 'Продолжать торговать после дневного лимита убытка'], en: ['Relying on only one element of risk management (e.g. only a Stop Loss)', 'Ignoring correlation between open positions', 'Continuing to trade past the daily loss limit'] },
            warning: { ru: 'Откройте Guardian, чтобы увидеть, что из этого реально подтверждается вашими сделками.', en: 'Open Guardian to see what this actually looks like in your own trades.' },
            askCoach: { ru: 'Как выстроить свой риск-менеджмент?', en: 'How should I structure my risk management?' },
            linkGuardian: true
        }
    },

    academyOrder: ['position_size', 'risk_per_trade', 'stop_loss', 'leverage', 'isolated_cross', 'liquidation', 'risk_management'],
    academyOrderMarketStructure: ['fvg', 'ifvg', 'ob', 'liquidity', 'liquidity_sweep', 'bos', 'mss_choch', 'premium_discount', 'pin_bar', 'range'],

    // ============================================================
    // v1.1.0 — Market Structure illustrations
    // Small reusable SVG candle helper so each lesson's diagram is a
    // real (if simplified) labeled chart, not a decorative stock image.
    // Uses CSS custom properties for color so it stays theme/accent-aware
    // since these are inlined into the DOM, not loaded as external files.
    // ============================================================
    svgCandle(x, o, c, h, l, w = 16) {
        const up = c <= o; // SVG y grows downward, so a lower y value = higher price
        const bodyTop = Math.min(o, c);
        const bodyBottom = Math.max(o, c);
        const color = up ? 'var(--brand-green)' : 'var(--brand-red)';
        return `<line x1="${x}" y1="${h}" x2="${x}" y2="${l}" stroke="${color}" stroke-width="2"/>
                <rect x="${x - w / 2}" y="${bodyTop}" width="${w}" height="${Math.max(2, bodyBottom - bodyTop)}" fill="${color}"/>`;
    },

    svgLabel(x, y, text, anchor = 'middle') {
        return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="11" font-weight="600" fill="var(--text-primary)" font-family="var(--font-family)">${text}</text>`;
    },

    marketStructureLessons: {
        fvg: {
            icon: '🕳️', difficulty: { ru: 'Средний', en: 'Intermediate' }, minutes: 4,
            title: { ru: 'FVG (Fair Value Gap)', en: 'FVG (Fair Value Gap)' },
            desc: { ru: 'Ценовой разрыв между свечами, который рынок часто возвращается заполнить.', en: 'A price gap between candles that the market often returns to fill.' },
            intro: { ru: 'FVG — это разрыв между тенью 1-й и тенью 3-й свечи в трёхсвечном движении, где 2-я свеча импульсно прошла цену без перекрытия.', en: 'An FVG is the gap between candle 1\'s wick and candle 3\'s wick in a 3-candle move, where candle 2 moved price impulsively without overlap.' },
            body: {
                ru: `<p>Если минимум 1-й свечи выше максимума 3-й свечи (в бычьем движении), между ними остаётся незаполненная зона — это и есть FVG.</p><p>Трейдеры отмечают такие зоны как потенциальные места, куда цена может вернуться перед продолжением движения.</p>`,
                en: `<p>If candle 1's low sits above candle 3's high (in a bullish move), the zone between them is left unfilled — that's the FVG.</p><p>Traders mark these zones as potential areas price may return to before continuing.</p>`
            },
            svg: () => `<svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
                <rect x="150" y="50" width="70" height="45" fill="var(--accent-a15)" stroke="var(--brand-purple)" stroke-dasharray="3,3"/>
                ${App.svgLabel(185, 45, 'FVG')}
                ${App.svgCandle(90, 90, 70, 60, 100)}
                ${App.svgCandle(140, 70, 40, 30, 75)}
                ${App.svgCandle(190, 45, 30, 20, 50)}
                ${App.svgCandle(240, 35, 55, 25, 65)}
                ${App.svgCandle(290, 55, 45, 40, 70)}
            </svg>`,
            mistakes: { ru: ['Считать, что цена ОБЯЗАНА вернуться в FVG', 'Путать любой промежуток между свечами с настоящим FVG', 'Игнорировать общий контекст тренда'], en: ['Assuming price MUST return to fill the FVG', 'Confusing any gap between candles with a true FVG', 'Ignoring the broader trend context'] },
            warning: { ru: 'FVG — это зона интереса, а не гарантированная разворотная точка.', en: 'An FVG is a zone of interest, not a guaranteed reversal point.' },
            askCoach: { ru: 'Объясни, что такое FVG простыми словами', en: 'Explain FVG to me in simple terms' }
        },
        ifvg: {
            icon: '🔄', difficulty: { ru: 'Средний', en: 'Intermediate' }, minutes: 4,
            title: { ru: 'IFVG (Inverse FVG)', en: 'IFVG (Inverse FVG)' },
            desc: { ru: 'FVG, который был пробит и поменял роль поддержки/сопротивления.', en: 'An FVG that got invalidated and flipped its support/resistance role.' },
            intro: { ru: 'Когда цена полностью проходит через FVG (закрытие свечи за его пределами), зона может "инвертироваться" — бывшая поддержка становится сопротивлением, и наоборот.', en: 'When price fully trades through an FVG (a candle closes beyond it), the zone can "invert" — former support becomes resistance, or vice versa.' },
            body: { ru: `<p>IFVG используют как признак смены баланса спроса/предложения в этой зоне.</p>`, en: `<p>Traders treat an IFVG as a sign that supply/demand balance in that zone has shifted.</p>` },
            svg: () => `<svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
                <rect x="140" y="50" width="70" height="40" fill="none" stroke="var(--text-secondary)" stroke-dasharray="3,3"/>
                ${App.svgLabel(175, 45, 'FVG')}
                ${App.svgCandle(90, 90, 70, 60, 100)}
                ${App.svgCandle(140, 70, 55, 45, 75)}
                ${App.svgCandle(190, 55, 30, 20, 60)}
                ${App.svgCandle(240, 100, 130, 95, 135)}
                ${App.svgLabel(240, 148, 'IFVG →', 'middle')}
                ${App.svgCandle(290, 125, 105, 100, 130)}
            </svg>`,
            mistakes: { ru: ['Считать инверсию гарантированным сигналом', 'Не дожидаться подтверждающего закрытия свечи'], en: ['Treating the inversion as a guaranteed signal', 'Not waiting for a confirming candle close'] },
            warning: { ru: 'Инверсия зоны — это наблюдение за структурой, а не автоматический сигнал входа.', en: 'A zone inversion is a structural observation, not an automatic entry signal.' },
            askCoach: { ru: 'Что такое IFVG и чем он отличается от FVG?', en: 'What is IFVG and how is it different from FVG?' }
        },
        ob: {
            icon: '🧱', difficulty: { ru: 'Средний', en: 'Intermediate' }, minutes: 4,
            title: { ru: 'Order Block (OB)', en: 'Order Block (OB)' },
            desc: { ru: 'Последняя противоположная свеча перед сильным импульсным движением.', en: 'The last opposite-direction candle before a strong impulsive move.' },
            intro: { ru: 'Order Block — это свеча (часто последняя вниз перед сильным ростом), которую трейдеры связывают с зоной, откуда мог произойти вход крупных участников рынка.', en: 'An Order Block is a candle (often the last down candle before a strong rally) that traders associate with a zone where large participants may have entered.' },
            body: { ru: `<p>OB отмечается как зона, к которой цена может вернуться перед продолжением движения в направлении импульса.</p>`, en: `<p>The OB is marked as a zone price may return to before continuing in the direction of the impulse.</p>` },
            svg: () => `<svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
                ${App.svgCandle(80, 60, 55, 50, 90)}
                <rect x="112" y="70" width="36" height="30" fill="var(--accent-a15)" stroke="var(--brand-purple)" stroke-dasharray="3,3"/>
                ${App.svgCandle(130, 70, 100, 65, 105)}
                ${App.svgLabel(130, 130, 'OB')}
                ${App.svgCandle(180, 95, 55, 45, 100)}
                ${App.svgCandle(230, 55, 20, 15, 60)}
                ${App.svgCandle(280, 20, 5, 2, 25)}
            </svg>`,
            mistakes: { ru: ['Отмечать OB на каждой мелкой свече без контекста импульса', 'Игнорировать таймфрейм анализа'], en: ['Marking an OB on every minor candle without impulse context', 'Ignoring the analysis timeframe'] },
            warning: { ru: 'Order Block — предположение о зоне интереса, а не подтверждённый факт о реальных ордерах.', en: 'An Order Block is an inference about a zone of interest, not confirmed knowledge of real orders.' },
            askCoach: { ru: 'Как определить Order Block на графике?', en: 'How do I identify an Order Block on a chart?' }
        },
        liquidity: {
            icon: '💧', difficulty: { ru: 'Начальный', en: 'Beginner' }, minutes: 3,
            title: { ru: 'Ликвидность', en: 'Liquidity' },
            desc: { ru: 'Скопления стоп-ордеров рядом с очевидными уровнями.', en: 'Clusters of stop orders resting near obvious levels.' },
            intro: { ru: 'Ликвидность — это зоны, где, вероятно, скопились стоп-лоссы и отложенные ордера — часто около равных максимумов/минимумов.', en: 'Liquidity refers to zones where stop-losses and pending orders are likely clustered — often around equal highs/lows.' },
            body: { ru: `<p>Равные максимумы (или минимумы) привлекают внимание, потому что многие трейдеры ставят стопы чуть выше/ниже них.</p>`, en: `<p>Equal highs (or lows) draw attention because many traders place stops just above or below them.</p>` },
            svg: () => `<svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
                <line x1="60" y1="50" x2="340" y2="50" stroke="var(--brand-yellow)" stroke-dasharray="4,4" stroke-width="1.5"/>
                ${App.svgLabel(365, 54, 'BSL', 'start')}
                ${App.svgCandle(90, 90, 70, 50, 100)}
                ${App.svgCandle(150, 80, 60, 50, 90)}
                ${App.svgCandle(210, 85, 65, 50, 95)}
                ${App.svgCandle(270, 75, 60, 50, 85)}
            </svg>`,
            mistakes: { ru: ['Считать, что ликвидность = гарантированное движение цены к ней', 'Игнорировать более крупные уровни на старшем таймфрейме'], en: ['Assuming liquidity guarantees price will move toward it', 'Ignoring bigger levels on a higher timeframe'] },
            warning: { ru: 'Ликвидность объясняет, ГДЕ могут быть стопы — а не КОГДА цена туда пойдёт.', en: 'Liquidity explains WHERE stops may sit — not WHEN price will move there.' },
            askCoach: { ru: 'Что такое ликвидность в трейдинге?', en: 'What is liquidity in trading?' }
        },
        liquidity_sweep: {
            icon: '🌊', difficulty: { ru: 'Средний', en: 'Intermediate' }, minutes: 4,
            title: { ru: 'Liquidity Sweep', en: 'Liquidity Sweep' },
            desc: { ru: 'Кратковременный прокол уровня ликвидности с последующим разворотом.', en: 'A brief poke through a liquidity level followed by a reversal.' },
            intro: { ru: 'Sweep — это движение, которое ненадолго проходит за уровень (заберая стопы), а затем закрывается обратно внутри диапазона.', en: 'A sweep is a move that briefly trades through a level (taking out stops), then closes back inside the range.' },
            body: { ru: `<p>Длинная тень за уровнем с закрытием обратно внутри — характерный признак sweep, в отличие от настоящего пробоя с закреплением цены.</p>`, en: `<p>A long wick beyond the level with a close back inside is the signature of a sweep, as opposed to a real breakout that holds.</p>` },
            svg: () => `<svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
                <line x1="60" y1="60" x2="340" y2="60" stroke="var(--brand-yellow)" stroke-dasharray="4,4" stroke-width="1.5"/>
                ${App.svgCandle(90, 95, 75, 60, 100)}
                ${App.svgCandle(150, 85, 65, 60, 90)}
                ${App.svgCandle(210, 78, 90, 40, 95)}
                ${App.svgLabel(210, 30, 'Sweep')}
                ${App.svgCandle(270, 90, 115, 85, 120)}
                ${App.svgCandle(320, 115, 135, 110, 140)}
            </svg>`,
            mistakes: { ru: ['Входить сразу на проколе, не дожидаясь закрытия обратно внутри', 'Путать sweep с настоящим пробоем структуры'], en: ['Entering immediately on the poke, without waiting for a close back inside', 'Confusing a sweep with a real structural breakout'] },
            warning: { ru: 'Не каждый прокол уровня — sweep. Настоящий пробой может просто продолжиться дальше.', en: 'Not every poke through a level is a sweep. A real breakout can simply continue.' },
            askCoach: { ru: 'Как отличить sweep ликвидности от настоящего пробоя?', en: 'How do I tell a liquidity sweep apart from a real breakout?' }
        },
        bos: {
            icon: '📈', difficulty: { ru: 'Средний', en: 'Intermediate' }, minutes: 3,
            title: { ru: 'BOS (Break of Structure)', en: 'BOS (Break of Structure)' },
            desc: { ru: 'Пробой предыдущего значимого максимума/минимума в сторону тренда.', en: 'A break of the previous significant high/low in the direction of the trend.' },
            intro: { ru: 'BOS — это закрытие цены за пределами предыдущего важного свинг-максимума (в восходящем тренде) или минимума (в нисходящем), подтверждающее продолжение тренда.', en: 'A BOS is a close beyond the previous significant swing high (in an uptrend) or low (in a downtrend), confirming trend continuation.' },
            body: { ru: `<p>BOS используется как подтверждение того, что структура рынка остаётся неизменной — тренд продолжается.</p>`, en: `<p>BOS is used to confirm that market structure remains intact — the trend is continuing.</p>` },
            svg: () => `<svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
                <line x1="120" y1="55" x2="240" y2="55" stroke="var(--text-secondary)" stroke-dasharray="4,4"/>
                ${App.svgCandle(80, 100, 80, 60, 110)}
                ${App.svgCandle(130, 78, 60, 55, 85)}
                ${App.svgCandle(180, 90, 70, 60, 95)}
                ${App.svgCandle(230, 65, 40, 30, 70)}
                ${App.svgLabel(255, 25, 'BOS')}
                ${App.svgCandle(280, 45, 20, 15, 50)}
            </svg>`,
            mistakes: { ru: ['Путать BOS с MSS/CHOCH (сменой характера)', 'Игнорировать таймфрейм, на котором отмечена структура'], en: ['Confusing BOS with MSS/CHOCH (a character change)', 'Ignoring which timeframe the structure was marked on'] },
            warning: { ru: 'BOS подтверждает продолжение существующего тренда — это не то же самое, что разворот.', en: 'A BOS confirms continuation of the existing trend — it is not the same thing as a reversal.' },
            askCoach: { ru: 'Что такое BOS и чем он отличается от CHOCH?', en: 'What is BOS and how is it different from CHOCH?' }
        },
        mss_choch: {
            icon: '🔀', difficulty: { ru: 'Средний', en: 'Intermediate' }, minutes: 4,
            title: { ru: 'MSS / CHOCH', en: 'MSS / CHOCH' },
            desc: { ru: 'Смена характера рынка — первый признак возможного разворота тренда.', en: 'A change of character — the first sign of a possible trend reversal.' },
            intro: { ru: 'MSS (Market Structure Shift) / CHOCH (Change of Character) — это пробой структуры ПРОТИВ текущего тренда, в отличие от BOS, который идёт ПО тренду.', en: 'MSS (Market Structure Shift) / CHOCH (Change of Character) is a structure break AGAINST the current trend, unlike BOS which goes WITH the trend.' },
            body: { ru: `<p>Например, в нисходящем тренде цена вдруг закрывается выше последнего значимого минорного максимума — это первый сигнал, что структура может меняться.</p>`, en: `<p>For example, in a downtrend, price suddenly closes above the last minor swing high — that's the first signal structure may be changing.</p>` },
            svg: () => `<svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
                <line x1="150" y1="70" x2="260" y2="70" stroke="var(--text-secondary)" stroke-dasharray="4,4"/>
                ${App.svgCandle(80, 40, 55, 35, 60)}
                ${App.svgCandle(130, 60, 75, 55, 80)}
                ${App.svgCandle(180, 80, 95, 75, 100)}
                ${App.svgCandle(230, 90, 65, 60, 95)}
                ${App.svgLabel(250, 40, 'CHOCH')}
                ${App.svgCandle(280, 60, 35, 25, 65)}
            </svg>`,
            mistakes: { ru: ['Ждать полного разворота тренда сразу после первого CHOCH', 'Принимать любой мелкий откат за смену характера'], en: ['Expecting a full trend reversal immediately after the first CHOCH', 'Treating every minor pullback as a character change'] },
            warning: { ru: 'MSS/CHOCH сигнализирует о ВОЗМОЖНОЙ смене тренда — а не гарантирует её.', en: 'MSS/CHOCH signals a POSSIBLE trend change — it does not guarantee one.' },
            askCoach: { ru: 'Объясни разницу между MSS и CHOCH', en: 'Explain the difference between MSS and CHOCH' }
        },
        premium_discount: {
            icon: '⚖️', difficulty: { ru: 'Средний', en: 'Intermediate' }, minutes: 3,
            title: { ru: 'Premium / Discount', en: 'Premium / Discount' },
            desc: { ru: 'Верхняя и нижняя половина диапазона относительно его середины.', en: 'The upper and lower half of a range relative to its midpoint.' },
            intro: { ru: 'Разделив диапазон между значимым максимумом и минимумом пополам, верхнюю половину называют Premium (дорого), нижнюю — Discount (дёшево).', en: 'Splitting the range between a significant high and low in half, the upper half is called Premium (expensive), the lower half Discount (cheap).' },
            body: { ru: `<p>Покупки чаще ищут в Discount-зоне, продажи — в Premium-зоне, относительно текущего диапазона.</p>`, en: `<p>Buys are more often sought in the Discount zone, sells in the Premium zone, relative to the current range.</p>` },
            svg: () => `<svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
                <rect x="40" y="20" width="320" height="60" fill="rgba(239,68,68,0.08)"/>
                <rect x="40" y="80" width="320" height="60" fill="rgba(67,198,160,0.08)"/>
                <line x1="40" y1="80" x2="360" y2="80" stroke="var(--text-secondary)" stroke-dasharray="4,4"/>
                ${App.svgLabel(60, 35, 'Premium', 'start')}
                ${App.svgLabel(60, 135, 'Discount', 'start')}
                ${App.svgCandle(120, 60, 40, 30, 70)}
                ${App.svgCandle(180, 100, 120, 90, 130)}
                ${App.svgCandle(240, 70, 50, 40, 80)}
                ${App.svgCandle(300, 110, 90, 85, 115)}
            </svg>`,
            mistakes: { ru: ['Использовать неверные точки для определения диапазона', 'Игнорировать общий тренд при оценке premium/discount'], en: ['Using the wrong points to define the range', 'Ignoring the overall trend when judging premium/discount'] },
            warning: { ru: 'Premium/Discount — это относительная зона внутри выбранного диапазона, а не абсолютная оценка "дорого/дёшево".', en: 'Premium/Discount is a relative zone within a chosen range, not an absolute "expensive/cheap" judgment.' },
            askCoach: { ru: 'Что такое Premium и Discount зоны?', en: 'What are Premium and Discount zones?' }
        },
        pin_bar: {
            icon: '📍', difficulty: { ru: 'Начальный', en: 'Beginner' }, minutes: 3,
            title: { ru: 'Pin Bar', en: 'Pin Bar' },
            desc: { ru: 'Свеча с маленьким телом и длинной тенью отказа от цены.', en: 'A candle with a small body and a long rejection wick.' },
            intro: { ru: 'Pin Bar — это свеча с небольшим телом и заметно длинной тенью в одну сторону, показывающая, что цена была отвергнута на этом уровне.', en: 'A Pin Bar is a candle with a small body and a noticeably long wick on one side, showing price was rejected at that level.' },
            body: {
                ru: `<p>Бычий Pin Bar — длинная нижняя тень (отказ от продаж снизу). Медвежий — длинная верхняя тень (отказ от покупок сверху).</p>`,
                en: `<p>A bullish Pin Bar has a long lower wick (rejection of selling below). A bearish Pin Bar has a long upper wick (rejection of buying above).</p>`
            },
            svg: () => `<svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
                ${App.svgCandle(110, 60, 55, 50, 130)}
                ${App.svgLabel(110, 148, 'Bullish')}
                ${App.svgCandle(290, 40, 45, 25, 100)}
                ${App.svgLabel(290, 148, 'Bearish')}
            </svg>`,
            mistakes: { ru: ['Торговать Pin Bar как автоматический сигнал входа без контекста', 'Игнорировать, где именно на графике появился Pin Bar'], en: ['Trading a Pin Bar as an automatic entry signal without context', 'Ignoring where on the chart the Pin Bar appeared'] },
            warning: { ru: 'Pin Bar — это не автоматический сигнал на вход. Контекст (уровень, тренд, структура) решает, имеет ли он значение.', en: 'A Pin Bar is not an automatic entry signal. Context (level, trend, structure) determines whether it matters.' },
            askCoach: { ru: 'Что такое Pin Bar и как его правильно использовать?', en: 'What is a Pin Bar and how should I use it properly?' }
        },
        range: {
            icon: '📏', difficulty: { ru: 'Начальный', en: 'Beginner' }, minutes: 3,
            title: { ru: 'Range (Диапазон)', en: 'Range' },
            desc: { ru: 'Консолидация цены между чётким максимумом и минимумом.', en: 'Price consolidating between a clear high and low.' },
            intro: { ru: 'Range — это период, когда цена движется между относительно стабильными верхней (range high) и нижней (range low) границами.', en: 'A range is a period when price moves between relatively stable upper (range high) and lower (range low) boundaries.' },
            body: {
                ru: `<p>Вокруг границ диапазона часто скапливается ликвидность. Ложный пробой (sweep) одной из границ с возвратом внутрь — частый паттерн перед движением в противоположную сторону.</p>`,
                en: `<p>Liquidity often clusters around the range boundaries. A false breakout (sweep) of one boundary followed by a return inside is a common pattern before a move the other way.</p>`
            },
            svg: () => `<svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
                <line x1="40" y1="40" x2="360" y2="40" stroke="var(--brand-yellow)" stroke-dasharray="4,4"/>
                <line x1="40" y1="120" x2="360" y2="120" stroke="var(--brand-yellow)" stroke-dasharray="4,4"/>
                ${App.svgLabel(60, 33, 'Range High', 'start')}
                ${App.svgLabel(60, 133, 'Range Low', 'start')}
                ${App.svgCandle(90, 60, 45, 40, 65)}
                ${App.svgCandle(140, 100, 115, 95, 120)}
                ${App.svgCandle(190, 70, 90, 60, 95)}
                ${App.svgCandle(240, 55, 30, 20, 60)}
                ${App.svgLabel(240, 12, 'Sweep')}
                ${App.svgCandle(290, 70, 95, 65, 100)}
            </svg>`,
            mistakes: { ru: ['Торговать пробой диапазона сразу, не дожидаясь подтверждения', 'Игнорировать возможность ложного пробоя (sweep) границы'], en: ['Trading a range breakout immediately without waiting for confirmation', 'Ignoring the possibility of a false breakout (sweep) at the boundary'] },
            warning: { ru: 'Не каждый выход за границу диапазона — настоящий пробой. Проверяйте закрытие свечи и объём/контекст.', en: 'Not every move outside the range boundary is a real breakout. Check the candle close and volume/context.' },
            askCoach: { ru: 'Как правильно торговать диапазон?', en: 'How should I approach trading a range?' }
        }
    },

    // ============================================================
    // v1.1.0 — AI SCANNER
    // No vision-AI backend exists in this build, so this never invents
    // detected values — every field starts genuinely empty/"not detected"
    // and is filled in by the user. Confirming hands off to the SAME
    // existing Add Trade modal (openTradeModal → submitTradeForm), so
    // there is exactly one trade-storage path, one validation path, and
    // one save path in the whole app.
    // ============================================================
    scannerStructureList: ['fvg', 'ifvg', 'ob', 'liquidity', 'liquidity_sweep', 'bos', 'mss_choch', 'premium_discount', 'pin_bar', 'range'],
    scannerStructureLabels: {
        fvg: 'FVG', ifvg: 'IFVG', ob: 'OB', liquidity: 'Liquidity',
        liquidity_sweep: 'Liquidity Sweep', bos: 'BOS', mss_choch: 'MSS / CHOCH', premium_discount: 'Premium / Discount', pin_bar: 'Pin Bar', range: 'Range'
    },
    scannerStructureLessonMap: {
        fvg: 'fvg', ifvg: 'ifvg', ob: 'ob', liquidity: 'liquidity', liquidity_sweep: 'liquidity_sweep',
        bos: 'bos', mss_choch: 'mss_choch', premium_discount: 'premium_discount', pin_bar: 'pin_bar', range: 'range'
    },

    showScannerUpload() {
        this.scannerScreenshot = null;
        this.scannerDirection = 'long';
        if (this.scannerUploadView) this.scannerUploadView.style.display = 'block';
        if (this.scannerReviewView) this.scannerReviewView.style.display = 'none';
        if (this.scannerFileInput) this.scannerFileInput.value = '';
    },

    handleScannerFile(file) {
        if (!file) return;
        const en = this.currentLang === 'en';
        if (!file.type.startsWith('image/')) { this.showToast(en ? 'Please choose an image file' : 'Пожалуйста, выберите файл изображения'); return; }
        if (file.size > 5 * 1024 * 1024) { this.showToast(en ? 'Image must be under 5MB' : 'Изображение должно быть меньше 5МБ'); return; }
        const reader = new FileReader();
        reader.onload = (ev) => {
            this.scannerScreenshot = ev.target.result;
            this.renderScannerReview();
        };
        reader.readAsDataURL(file);
    },

    renderScannerReview() {
        const en = this.currentLang === 'en';
        if (this.scannerPreviewImg) this.scannerPreviewImg.src = this.scannerScreenshot;
        if (this.scannerConfidenceNote) this.scannerConfidenceNote.innerHTML = `<span class="scanner-confidence-badge">${this.t('scanner_confidence_label')}</span>`;

        // Reset every field to genuinely empty ("not detected") — nothing
        // here is ever pre-filled with a guessed value.
        [this.scannerAsset, this.scannerTimeframe, this.scannerEntry, this.scannerStopLoss, this.scannerTakeProfit, this.scannerSetup].forEach(el => { if (el) el.value = ''; });
        [this.scannerAsset, this.scannerTimeframe, this.scannerEntry, this.scannerStopLoss, this.scannerTakeProfit].forEach(el => { if (el) el.placeholder = this.t('scanner_not_detected'); });
        this.scannerDirection = 'long';
        if (document.getElementById('scannerDirLong')) { document.getElementById('scannerDirLong').classList.add('active'); document.getElementById('scannerDirShort').classList.remove('active'); }

        if (this.scannerStructuresGrid) {
            let html = '';
            this.scannerStructureList.forEach(key => {
                html += `<label class="scanner-structure-chip" data-structure="${key}"><input type="checkbox" data-structure-cb="${key}"> ${this.scannerStructureLabels[key]} <a href="#" class="ms-learn-link" data-learn="${key}">${this.t('scanner_learn_more')} →</a></label>`;
            });
            this.scannerStructuresGrid.innerHTML = html;
            this.scannerStructuresGrid.querySelectorAll('[data-structure-cb]').forEach(cb => {
                cb.addEventListener('change', () => {
                    cb.closest('.scanner-structure-chip').classList.toggle('checked', cb.checked);
                });
            });
            this.scannerStructuresGrid.querySelectorAll('[data-learn]').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    const lessonId = this.scannerStructureLessonMap[link.dataset.learn];
                    if (lessonId) this.openMarketStructureLessonFromScanner(lessonId);
                });
            });
        }

        if (this.scannerUploadView) this.scannerUploadView.style.display = 'none';
        if (this.scannerReviewView) this.scannerReviewView.style.display = 'block';
    },

    openMarketStructureLessonFromScanner(lessonId) {
        this.navItems.forEach(n => n.classList.remove('active'));
        const targetNav = Array.from(this.navItems).find(n => n.dataset.section === 'academy');
        if (targetNav) targetNav.classList.add('active');
        this.showSection('academy');
        this.openAcademyLesson(lessonId);
    },

    // Confirm never writes to the Journal itself — it hands the user's own
    // manually-entered values to the existing Add Trade modal, so the
    // existing validation and the existing "Save" button are still the
    // only thing that actually creates a trade record.
    confirmScannerResult() {
        const asset = (this.scannerAsset?.value || '').trim();
        const entry = this.scannerEntry?.value || '';
        const stopLoss = this.scannerStopLoss?.value || '';
        const takeProfit = this.scannerTakeProfit?.value || '';
        const timeframe = (this.scannerTimeframe?.value || '').trim();
        const setup = (this.scannerSetup?.value || '').trim();
        const checkedStructures = Array.from(this.scannerStructuresGrid?.querySelectorAll('[data-structure-cb]:checked') || []).map(cb => this.scannerStructureLabels[cb.dataset.structureCb]);

        const en = this.currentLang === 'en';
        let notes = setup;
        if (timeframe) notes = `[${timeframe}] ` + notes;
        if (stopLoss) notes += (notes ? ' | ' : '') + 'SL: ' + stopLoss;
        if (takeProfit) notes += (notes ? ' | ' : '') + 'TP: ' + takeProfit;
        if (checkedStructures.length) notes += (notes ? ' | ' : '') + (en ? 'Structures: ' : 'Структуры: ') + checkedStructures.join(', ');

        // Pending screenshot is picked up by submitTradeForm() and attached
        // to the trade only once the user actually saves it there.
        this.pendingScannerScreenshot = this.scannerScreenshot;

        this.openTradeModal(null, true);
        if (this.tFields.asset) this.tFields.asset.value = asset;
        if (this.tFields.direction) this.tFields.direction.value = this.scannerDirection;
        if (this.tFields.entry) this.tFields.entry.value = entry;
        if (this.tFields.exit) this.tFields.exit.value = takeProfit || '';
        if (this.tFields.notes) this.tFields.notes.value = notes;
    },

    renderAcademyGrid() {
        if (!this.academyGrid) return;
        this.showAcademyGrid();
        const en = this.currentLang === 'en';
        const cardsHtml = (order, source) => order.map(id => {
            const l = source[id];
            return `
                <div class="academy-card">
                    <div class="academy-card-icon">${l.icon}</div>
                    <h4>${l.title[en ? 'en' : 'ru']}</h4>
                    <p>${l.desc[en ? 'en' : 'ru']}</p>
                    <div class="academy-card-meta">
                        <span>${l.difficulty[en ? 'en' : 'ru']}</span>
                        <span>${l.minutes} ${en ? 'min read' : 'мин чтения'}</span>
                    </div>
                    <button class="btn-secondary" data-lesson="${id}">${en ? 'Open lesson' : 'Открыть урок'}</button>
                </div>`;
        }).join('');

        this.academyGrid.innerHTML = cardsHtml(this.academyOrder, this.academyLessons);
        if (this.academyGridMS) this.academyGridMS.innerHTML = cardsHtml(this.academyOrderMarketStructure, this.marketStructureLessons);

        [this.academyGrid, this.academyGridMS].forEach(grid => {
            if (!grid) return;
            grid.querySelectorAll('[data-lesson]').forEach(btn => {
                btn.addEventListener('click', () => this.openAcademyLesson(btn.dataset.lesson));
            });
        });
    },

    showAcademyGrid() {
        if (this.academyGridView) this.academyGridView.style.display = 'block';
        if (this.academyLessonView) this.academyLessonView.style.display = 'none';
    },

    openAcademyLesson(id) {
        const lesson = this.academyLessons[id] || this.marketStructureLessons[id];
        if (!lesson || !this.academyLessonBody) return;
        this.currentLessonId = id;
        const en = this.currentLang === 'en';
        const lang = en ? 'en' : 'ru';

        let html = `
            <h2>${lesson.title[lang]}</h2>
            <p class="lesson-intro">${lesson.intro[lang]}</p>
            <section>${lesson.body[lang]}</section>`;

        if (lesson.svg) {
            html += `<section><div class="lesson-illustration">${lesson.svg()}</div></section>`;
        }
        if (lesson.formula) {
            html += `<section><h5>${en ? 'Formula' : 'Формула'}</h5><div class="lesson-formula">${lesson.formula[lang]}</div></section>`;
        }
        if (lesson.hasCalculator) {
            html += this.renderPositionCalculatorMarkup(lang);
        }
        if (lesson.example) {
            html += `<section><h5>${en ? 'Practical example' : 'Практический пример'}</h5><div class="lesson-example">${lesson.example[lang]}</div></section>`;
        }
        if (lesson.mistakes) {
            html += `<section><h5>${en ? 'Common mistakes' : 'Частые ошибки'}</h5><ul class="lesson-mistakes">${lesson.mistakes[lang].map(m => `<li>${m}</li>`).join('')}</ul></section>`;
        }
        if (lesson.warning) {
            html += `<section><h5>${en ? 'Important' : 'Важно'}</h5><div class="lesson-warning">${lesson.warning[lang]}</div></section>`;
        }
        if (lesson.linkGuardian) {
            html += `<button class="ask-coach-link" id="lessonOpenGuardianBtn" style="margin-right:8px;">🛡 ${en ? 'Open Guardian' : 'Открыть Guardian'}</button>`;
        }
        if (lesson.askCoach) {
            html += `<button class="ask-coach-link" id="lessonAskCoachBtn">💬 ${en ? 'Ask AI Coach about this' : 'Спросить AI Коуча об этом'}</button>`;
        }

        this.academyLessonBody.innerHTML = html;
        if (this.academyGridView) this.academyGridView.style.display = 'none';
        if (this.academyLessonView) this.academyLessonView.style.display = 'block';

        if (lesson.hasCalculator) this.bindPositionCalculator();

        const askBtn = document.getElementById('lessonAskCoachBtn');
        if (askBtn) askBtn.addEventListener('click', () => this.askCoachFromAcademy(lesson.askCoach[lang]));
        const guardBtn = document.getElementById('lessonOpenGuardianBtn');
        if (guardBtn) guardBtn.addEventListener('click', () => {
            this.navItems.forEach(n => n.classList.remove('active'));
            const targetNav = Array.from(this.navItems).find(n => n.dataset.section === 'guardian');
            if (targetNav) targetNav.classList.add('active');
            this.showSection('guardian');
        });
    },

    // Reuses the EXISTING AI Coach engine (handleAIQuery/generateCoachReply)
    // — Academy just navigates to the AI Coach section and submits a
    // pre-filled question through the same input the user would type into.
    askCoachFromAcademy(question) {
        this.navItems.forEach(n => n.classList.remove('active'));
        const targetNav = Array.from(this.navItems).find(n => n.dataset.section === 'intelligence');
        if (targetNav) targetNav.classList.add('active');
        this.showSection('intelligence');
        if (this.aiInput) {
            this.aiInput.value = question;
            this.handleAIQuery();
        }
    },

    // ----- Position Size Calculator -----
    // Standalone: reads only its own form inputs, never this.trades or
    // this.userData. Nothing here is saved to the account.
    renderPositionCalculatorMarkup(lang) {
        const en = lang === 'en';
        return `
            <div class="psc-calculator">
                <h5>${en ? 'Position Size Calculator' : 'Калькулятор размера позиции'}</h5>
                <div class="psc-direction">
                    <button type="button" class="active" data-dir="long" id="pscDirLong">LONG</button>
                    <button type="button" data-dir="short" id="pscDirShort">SHORT</button>
                </div>
                <div class="psc-grid">
                    <div class="psc-field"><label>${en ? 'Account Capital ($)' : 'Капитал счёта ($)'}</label><input type="number" class="form-input" id="pscCapital" value="1000" min="0" step="any"></div>
                    <div class="psc-field"><label>${en ? 'Risk (%)' : 'Риск (%)'}</label><input type="number" class="form-input" id="pscRisk" value="1" min="0" step="any"></div>
                    <div class="psc-field"><label>${en ? 'Entry Price ($)' : 'Цена входа ($)'}</label><input type="number" class="form-input" id="pscEntry" value="50000" min="0" step="any"></div>
                    <div class="psc-field"><label>${en ? 'Stop Loss Price ($)' : 'Цена Stop Loss ($)'}</label><input type="number" class="form-input" id="pscStop" value="49500" min="0" step="any"></div>
                    <div class="psc-field"><label>${en ? 'Leverage (optional)' : 'Плечо (опционально)'}</label><input type="number" class="form-input" id="pscLeverage" placeholder="${en ? 'e.g. 5' : 'напр. 5'}" min="0" step="any"></div>
                </div>
                <div id="pscError"></div>
                <div class="psc-results" id="pscResults" style="display:none;">
                    <div class="psc-result-item"><div class="psc-result-label">${en ? 'Maximum Risk' : 'Максимальный риск'}</div><div class="psc-result-value" id="pscMaxRisk">—</div></div>
                    <div class="psc-result-item"><div class="psc-result-label">${en ? 'Stop Distance' : 'Расстояние до стопа'}</div><div class="psc-result-value" id="pscStopDist">—</div></div>
                    <div class="psc-result-item"><div class="psc-result-label">${en ? 'Suggested Position Size' : 'Размер позиции'}</div><div class="psc-result-value" id="pscPosSize">—</div></div>
                    <div class="psc-result-item"><div class="psc-result-label">${en ? 'Approx. Notional' : 'Примерный номинал'}</div><div class="psc-result-value" id="pscNotional">—</div></div>
                    <div class="psc-result-item" id="pscMarginWrap" style="display:none;"><div class="psc-result-label">${en ? 'Approx. Margin' : 'Примерная маржа'}</div><div class="psc-result-value" id="pscMargin">—</div></div>
                </div>
                <p class="lesson-note" id="pscRiskNote" style="display:none;">${en ? 'Risk remains based on position size and Stop Loss — not simply on leverage.' : 'Риск по-прежнему определяется размером позиции и Stop Loss — а не просто плечом.'}</p>
                <p class="psc-disclaimer">${en ? 'Calculation is an estimate. Actual execution may differ due to fees, slippage, funding, spread, exchange rules and contract specifications.' : 'Расчёт является оценкой. Реальное исполнение может отличаться из-за комиссий, проскальзывания, funding, спреда, правил биржи и спецификации контракта.'}</p>
            </div>`;
    },

    bindPositionCalculator() {
        this.pscDirection = 'long';
        const ids = ['pscCapital', 'pscRisk', 'pscEntry', 'pscStop', 'pscLeverage'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.calcPositionSize());
        });
        const dirLong = document.getElementById('pscDirLong');
        const dirShort = document.getElementById('pscDirShort');
        if (dirLong) dirLong.addEventListener('click', () => { this.pscDirection = 'long'; dirLong.classList.add('active'); dirShort.classList.remove('active'); this.calcPositionSize(); });
        if (dirShort) dirShort.addEventListener('click', () => { this.pscDirection = 'short'; dirShort.classList.add('active'); dirLong.classList.remove('active'); this.calcPositionSize(); });
        this.calcPositionSize();
    },

    calcPositionSize() {
        const en = this.currentLang === 'en';
        const errEl = document.getElementById('pscError');
        const resultsEl = document.getElementById('pscResults');
        if (!errEl || !resultsEl) return;

        const capital = parseFloat(document.getElementById('pscCapital')?.value);
        const riskPct = parseFloat(document.getElementById('pscRisk')?.value);
        const entry = parseFloat(document.getElementById('pscEntry')?.value);
        const stop = parseFloat(document.getElementById('pscStop')?.value);
        const leverageRaw = document.getElementById('pscLeverage')?.value;
        const leverage = leverageRaw ? parseFloat(leverageRaw) : null;
        const dir = this.pscDirection || 'long';

        const showError = (msg) => {
            errEl.innerHTML = `<div class="psc-error">${msg}</div>`;
            resultsEl.style.display = 'none';
            const note = document.getElementById('pscRiskNote'); if (note) note.style.display = 'none';
        };

        if ([capital, riskPct, entry, stop].some(v => isNaN(v))) { showError(en ? 'Please fill in all required fields with valid numbers.' : 'Заполните все обязательные поля корректными числами.'); return; }
        if (capital <= 0) { showError(en ? 'Capital must be greater than 0.' : 'Капитал должен быть больше 0.'); return; }
        if (riskPct <= 0) { showError(en ? 'Risk % must be greater than 0.' : 'Риск % должен быть больше 0.'); return; }
        if (entry <= 0 || stop <= 0) { showError(en ? 'Prices must be greater than 0.' : 'Цены должны быть больше 0.'); return; }
        if (entry === stop) { showError(en ? 'Stop Loss cannot equal Entry price.' : 'Stop Loss не может быть равен цене входа.'); return; }
        if (dir === 'long' && stop >= entry) { showError(en ? 'For LONG, Stop Loss should be below Entry.' : 'Для LONG Stop Loss должен быть ниже цены входа.'); return; }
        if (dir === 'short' && stop <= entry) { showError(en ? 'For SHORT, Stop Loss should be above Entry.' : 'Для SHORT Stop Loss должен быть выше цены входа.'); return; }
        if (leverageRaw && (isNaN(leverage) || leverage <= 0)) { showError(en ? 'Leverage must be a positive number.' : 'Плечо должно быть положительным числом.'); return; }

        errEl.innerHTML = '';
        const maxRisk = capital * (riskPct / 100);
        const stopDistance = Math.abs(entry - stop);
        const stopDistancePct = (stopDistance / entry) * 100;
        const positionSize = maxRisk / stopDistance; // quantity of asset
        const notional = positionSize * entry;

        document.getElementById('pscMaxRisk').textContent = '$' + maxRisk.toFixed(2);
        document.getElementById('pscStopDist').textContent = stopDistancePct.toFixed(2) + '%';
        document.getElementById('pscPosSize').textContent = positionSize.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
        document.getElementById('pscNotional').textContent = '$' + notional.toLocaleString(undefined, { maximumFractionDigits: 2 });

        const marginWrap = document.getElementById('pscMarginWrap');
        const noteEl = document.getElementById('pscRiskNote');
        if (leverage) {
            const margin = notional / leverage;
            document.getElementById('pscMargin').textContent = '$' + margin.toLocaleString(undefined, { maximumFractionDigits: 2 });
            marginWrap.style.display = 'block';
            if (noteEl) noteEl.style.display = 'block';
        } else {
            marginWrap.style.display = 'none';
            if (noteEl) noteEl.style.display = 'none';
        }
        resultsEl.style.display = 'grid';
    },

    renderAll() {
        this.renderJournal();
        this.updateJournalStats();
        this.renderCalendar();
        this.updateCalendarBadge();
        this.updateAnalytics();
        this.updateGuardianStats();
        this.initGuardianChart();
        this.initEquityChart();
        this.initDashboardCharts();
        this.renderDashboardExtras();
        this.renderIntegratedCoachContext();
        this.updateDashboardStats();
        this.updateBalanceDisplay();
        this.renderNotifications();
        this.updateNotifBadge();
    }
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

window.App = App;
// v1.1.3 brand dashboard bindings
(function(){
  function bindBrand(){
    const first=document.getElementById('brandFirstTradeBtn');
    const add=document.getElementById('addTradeBtn');
    if(first && add && !first.dataset.bound){ first.dataset.bound='1'; first.addEventListener('click',()=>add.click()); }
    const coachMap=[['brandCoachAnalyze','dashAskBtn'],['brandCoachSetup','dashAskBtn'],['brandCoachDiscipline','dashAskBtn']];
    coachMap.forEach(([a,b])=>{const x=document.getElementById(a),y=document.getElementById(b); if(x&&y&&!x.dataset.bound){x.dataset.bound='1';x.addEventListener('click',()=>y.click())}});
    const av=document.getElementById('headerAvatar');
    if(av){av.textContent='';av.style.backgroundImage="url('assets/avatar-circle-clean.png')";av.style.backgroundSize='cover';av.style.backgroundPosition='center';av.onerror=null;av.style.border='1px solid rgba(255,211,105,.5)';}
    const sav=document.getElementById('settingsAvatar');
    if(sav){sav.textContent='';sav.style.backgroundImage="url('assets/avatar-circle-clean.png')";sav.style.backgroundSize='cover';sav.style.backgroundPosition='center';}
    const actions={
      brandOpenJournal:'journal',brandQuickJournal:'journal',brandQuickAnalytics:'analytics',brandQuickAcademy:'academy',brandQuickScanner:'scanner'
    };
    Object.entries(actions).forEach(([id,section])=>{const el=document.getElementById(id);if(el&&!el.dataset.bound){el.dataset.bound='1';el.addEventListener('click',()=>window.App&&window.App.showSection(section));}});
  }

  function renderBrandRealData(){
    const trades=(window.App&&Array.isArray(window.App.trades))?window.App.trades:[];
    const total=trades.length;
    const chartWrap=document.getElementById('brandChartWrap');
    const svg=document.querySelector('.brand-equity-svg');
    const line=svg&&svg.querySelector('.brand-line');
    const area=svg&&svg.querySelector('.brand-area');
    const dot=svg&&svg.querySelector('.brand-dot');
    const marker=svg&&svg.querySelector('.brand-marker');
    const tooltip=document.querySelector('.brand-chart-tooltip');
    const donut=document.getElementById('brandDonut');
    const legend=document.getElementById('brandLegend');

    if(!total){
      if(chartWrap) chartWrap.classList.add('is-empty');
      if(donut) donut.classList.add('is-empty');
      if(legend) legend.innerHTML='<div class="brand-empty-distribution">Нет сделок — распределение появится после первой сделки.</div>';
      return;
    }

    if(chartWrap) chartWrap.classList.remove('is-empty');
    if(donut) donut.classList.remove('is-empty');

    // Build an equity curve from real stored P&L values only.
    const values=[0];
    let cumulative=0;
    trades.slice().reverse().forEach(t=>{
      cumulative += parseFloat(t.pnl)||0;
      values.push(cumulative);
    });
    const points=values.length;
    const min=Math.min(...values,0);
    const max=Math.max(...values,0);
    const range=Math.max(max-min,1);
    const x0=40, x1=740, y0=230, y1=35;
    const pts=values.map((v,i)=>{
      const x=x0+(x1-x0)*(i/(points-1||1));
      const y=y0-(v-min)/range*(y0-y1);
      return [x,y];
    });
    const d=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
    const areaD=d+' L '+x1+',250 L '+x0+',250 Z';
    if(line) line.setAttribute('d',d);
    if(area) area.setAttribute('d',areaD);
    const last=pts[pts.length-1];
    if(dot){dot.setAttribute('cx',last[0]);dot.setAttribute('cy',last[1]);}
    if(marker){marker.setAttribute('x1',last[0]);marker.setAttribute('x2',last[0]);marker.setAttribute('y1',last[1]);}
    if(tooltip){
      const pnl=cumulative;
      tooltip.innerHTML='<b>'+(pnl>=0?'+':'')+pnl.toFixed(2)+' $</b><span>Текущий P&L</span>';
      tooltip.style.left=Math.min(Math.max((last[0]/760)*100-10,5),72)+'%';
      tooltip.style.top=Math.max((last[1]/280)*100-6,5)+'%';
    }

    // Real asset distribution.
    const counts={};
    trades.forEach(t=>{const a=t.asset||'Другие'; counts[a]=(counts[a]||0)+1;});
    const rows=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5);
    const totalCount=trades.length;
    const palette=['#ffd369','#f97316','#8a2be2','#4b4a63','#22c55e'];
    if(legend){
      legend.innerHTML=rows.map((r,i)=>'<div><i style="background:'+palette[i%palette.length]+'"></i><span>'+r[0]+'</span><b>'+Math.round(r[1]/totalCount*100)+'%</b></div>').join('');
    }
    if(donut){
      let cursor=0;
      const stops=rows.map((r,i)=>{
        const start=cursor;
        cursor += r[1]/totalCount*100;
        return palette[i%palette.length]+' '+start+'% '+cursor+'%';
      }).join(',');
      donut.style.background='radial-gradient(circle,#0d0a18 0 43%,transparent 44%),conic-gradient('+stops+')';
    }
  }

  function sync(){
    const total=(window.App&&Array.isArray(window.App.trades))?window.App.trades.length:0;
    renderBrandRealData();
    const progressEl=document.getElementById('brandProgress');
    const progressBar=document.getElementById('brandProgressBar');
    const disciplineLabel=document.getElementById('brandDisciplineLabel');
    const disciplineGrade=document.getElementById('brandDisciplineGrade');
    const disciplineGood=document.getElementById('brandDisciplineGood');
    const guardianStatus=document.getElementById('brandGuardianStatus');
    const guardianList=document.getElementById('brandGuardianList');
    const realTrades=(window.App&&Array.isArray(window.App.trades))?window.App.trades:[];
    const completedChallenges=realTrades.length ? Math.min(10, realTrades.filter(t=>t&&t.status!=='open').length) : 0;
    if(progressEl) progressEl.textContent=completedChallenges+' / 10';
    if(progressBar) progressBar.style.width=(completedChallenges*10)+'%';
    if(disciplineLabel) disciplineLabel.textContent=realTrades.length?'Рассчитывается':'Нет данных';
    if(disciplineGrade) disciplineGrade.textContent='—';
    if(disciplineGood) disciplineGood.hidden = true;
    if(guardianStatus){ guardianStatus.textContent='● Нет данных'; guardianStatus.classList.remove('is-good'); guardianStatus.classList.add('is-empty'); }
    if(guardianList){ guardianList.innerHTML='<span>● Добавьте первую сделку</span><span>● Guardian проверит реальные правила</span><span>● Здесь не будет выдуманных оценок</span>'; }
    const balance=document.getElementById('balanceDisplay');
    const b=document.getElementById('brandBalance');
    const t=document.getElementById('brandTrades');
    const w=document.getElementById('brandWinrate');
    const pf=document.getElementById('brandProfitFactor');
    const pfSub=document.getElementById('brandProfitFactorSub');
    const streak=document.getElementById('brandStreak');
    const streakSub=document.getElementById('brandStreakSub');
    const donut=document.getElementById('brandDonut');
    const donutTotal=document.getElementById('brandDonutTotal');
    const legend=document.getElementById('brandLegend');
    const chartWrap=document.getElementById('brandChartWrap');

    if (b) b.textContent = total === 0 ? '$ 0.00' : ((balance && balance.textContent) || '$ 0.00');
    if (t) t.textContent=String(total);
    if (w) w.textContent=total ? ((window.App && window.App.winRateDisplay && window.App.winRateDisplay.textContent) || '—') : '—';
    if (donutTotal) donutTotal.textContent=String(total);

    if(total===0){
      if(pf) pf.textContent='—';
      if(pfSub) pfSub.textContent='Недостаточно данных';
      if(streak) streak.textContent='0 дней';
      if(streakSub) streakSub.textContent='Начните журнал';
      const balanceSub=document.getElementById('brandBalanceSub');
      if(balanceSub) balanceSub.textContent='Пока нет данных';
      if(donut) donut.classList.add('is-empty');
      if(legend) legend.innerHTML='<div class="brand-empty-distribution">Нет сделок — распределение появится после первой сделки.</div>';
      if(chartWrap) chartWrap.classList.add('is-empty');
      return;
    }

    if(donut) donut.classList.remove('is-empty');
    if(chartWrap) chartWrap.classList.remove('is-empty');

    const map=[['balanceDisplay','brandBalance'],['totalTradesDisplay','brandTrades'],['winRateDisplay','brandWinrate']];
    map.forEach(([a,bid])=>{const x=document.getElementById(a),y=document.getElementById(bid);if(x&&y)y.textContent=x.textContent;});

    // Profit factor from real stored trades only.
    const wins=(window.App.trades||[]).filter(x=>x.status==='win').reduce((s,x)=>s+(parseFloat(x.pnl)||0),0);
    const losses=Math.abs((window.App.trades||[]).filter(x=>x.status==='loss').reduce((s,x)=>s+(parseFloat(x.pnl)||0),0));
    if(pf) pf.textContent=losses>0 ? (wins/losses).toFixed(2) : '—';
    if(pfSub) pfSub.textContent=losses>0 ? 'По реальным сделкам' : 'Недостаточно данных';
    const balanceSub=document.getElementById('brandBalanceSub');
    if(balanceSub) balanceSub.textContent='По данным Journal';
    if(guardianStatus){ guardianStatus.textContent='● Отслеживается'; guardianStatus.classList.remove('is-empty'); guardianStatus.classList.add('is-good'); }
    if(guardianList){
      const violations=(window.App.guardianRules||[]).filter(r=>r.state==='fail').length;
      guardianList.innerHTML=violations
        ? `<span>● Нарушений сейчас: ${violations}</span><span>● Проверь Guardian перед следующей сделкой</span><span>● Все показатели основаны на Journal</span>`
        : '<span>● Активных нарушений не найдено</span><span>● Проверка основана на реальных сделках</span><span>● Добавляй сделки — Guardian будет обновляться</span>';
    }

    // Current winning streak from real chronological trades.
    let run=0;
    [...(window.App.trades||[])].reverse().some(x=>{ if(x.status==='win'){run++;return false;} return true; });
    if(streak) streak.textContent=run+' '+(run===1?'день':'дн.');
    if(streakSub) streakSub.textContent=run ? 'Текущая серия' : 'Нет серии';
  }
  document.addEventListener('DOMContentLoaded',()=>{bindBrand();sync();setTimeout(sync,700);setTimeout(sync,1800);});
  window.addEventListener('load',()=>{bindBrand();sync();});
})();
