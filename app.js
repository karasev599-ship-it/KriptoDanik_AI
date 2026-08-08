"use strict";

/* ============================================================
   KRIPTODANIK AI — RELEASE CANDIDATE (SPRINT 9)
   ============================================================ */

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
            ai_disclaimer: 'KriptoDanik AI не является финансовым советником, не даёт торговых сигналов и не предсказывает направление рынка. Он помогает вам соблюдать собственную торговую стратегию, правила и дисциплину.'
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
            ai_disclaimer: 'KriptoDanik AI is not a financial advisor, does not give trading signals, and does not predict market direction. It helps you follow your own trading strategy, rules, and discipline.'
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
        }
        console.log('KriptoDanik AI Release Candidate initialized.');
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
                aiHistory: this.aiHistory
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
        return start + pnlSum;
    },

    updateBalanceDisplay() {
        if (this.balanceDisplay) this.balanceDisplay.textContent = '$ ' + this.getCurrentBalance().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    // ===== CACHE =====
    cacheElements() {
        this.navItems = document.querySelectorAll('.nav-item');
        this.sections = {
            dashboard: document.getElementById('section-dashboard'),
            journal: document.getElementById('section-journal'),
            analytics: document.getElementById('section-analytics'),
            calendar: document.getElementById('section-calendar'),
            performance: document.getElementById('section-performance'),
            guardian: document.getElementById('section-guardian'),
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

        // Avatar upload
        this.avatarEditBtn = document.getElementById('avatarEditBtn');
        this.avatarFileInput = document.getElementById('avatarFileInput');
        this.headerAvatar = document.getElementById('headerAvatar');
        this.settingsAvatar = document.getElementById('settingsAvatar');

        this.langButtons = document.querySelectorAll('.lang-selector button');
    },

    // ===== BIND EVENTS =====
    bindEvents() {
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                const section = item.dataset.section;
                this.showSection(section);
            });
        });

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
        this.updatePageTitle();
        if (this.trades.length === 0) this.initEquityChart();
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
            academy: { title: 'Academy', body: 'Академия — это будущий раздел с обучающими материалами по трейдингу, риск-менеджменту и психологии. Раздел находится в разработке и появится в одном из следующих обновлений.' },
            strategy: { title: 'Библиотека стратегий', body: 'Здесь в будущем вы сможете сохранять и оформлять свои торговые стратегии в структурированном виде, чтобы AI Coach мог сверять с ними ваши реальные сделки. Раздел пока в разработке.' },
            marketpulse: { title: 'Market Pulse', body: 'Market Pulse станет разделом с рыночными новостями и контекстом — без сигналов и прогнозов, только фактическая информация для вашего собственного анализа. Раздел пока в разработке.' },
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
            academy: { title: 'Academy', body: 'Academy is a future section with educational material on trading, risk management, and psychology. It\'s still in development and will arrive in a later update.' },
            strategy: { title: 'Strategy Library', body: 'This will let you save and structure your own trading strategies, so the AI Coach can check your real trades against them. Still in development.' },
            marketpulse: { title: 'Market Pulse', body: 'Market Pulse will bring market news and context — no signals, no predictions, just factual information for your own analysis. Still in development.' },
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
        this.coachTourOverlay.classList.add('active');
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
        if (this.coachTourOverlay) this.coachTourOverlay.classList.remove('active');
        this.navItems.forEach(n => n.classList.remove('tour-highlight'));
        // Only now does the Dashboard actually open.
        this.navItems.forEach(n => n.classList.remove('active'));
        const dashNav = Array.from(this.navItems).find(n => n.dataset.section === 'dashboard');
        if (dashNav) dashNav.classList.add('active');
        this.showSection('dashboard');
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
        if (section === 'performance') { this.updatePerformanceStats(); this.initPerfEquityChart(); this.initPerfMonthlyChart(); this.initPerfSessionsChart(); }
        if (section === 'dashboard') { this.initDashboardCharts(); this.updateDashboardStats(); }
        this.applyLanguage();
    },

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
        this.saveState();
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
                            <button class="edit-btn" data-id="${trade.id}" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;transition:0.2s;margin-right:8px;" title="Редактировать">✎</button>
                            <button class="delete-btn" data-id="${trade.id}" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;transition:0.2s;" title="Удалить">✕</button>
                        </td>
                    </tr>`;
        });
        this.journalBody.innerHTML = html;

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

    openTradeModal(tradeId = null) {
        if (!this.tradeModalOverlay) return;
        this.editingTradeId = tradeId;
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

    // Very small keyword-based intent classifier. Order matters — first match wins.
    classifyCoachIntent(question) {
        const q = question.toLowerCase();
        const has = (words) => words.some(w => q.includes(w));
        if (has(['sell', 'buy', 'продавать', 'покупать', 'сигнал', 'signal', 'куда пойдет', 'вырастет', 'упадет', 'прогноз', 'predict'])) return 'signal_request';
        if (has(['ошиб', 'mistake', 'error'])) return 'mistakes';
        if (has(['психолог', 'psycholog', 'эмоц', 'emotion', 'страх', 'fear', 'жадност', 'greed'])) return 'psychology';
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
                return en
                    ? `Here's where you stand: ${s.total} logged trades, ${wrText} win rate, average ${rrText} per trade. ${s.violations.length > 0 ? `Guardian is flagging ${s.violations.length} rule${s.violations.length === 1 ? '' : 's'} right now.` : 'Guardian shows no active rule violations.'} Ask me about your risk management, psychology, or strategy and I'll dig into the specifics.`
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
            this.updateNotifBadge();
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

        this.renderGuardianRules();
        this.renderGuardianTimeline();
        this.renderGuardianRecommendations();
        this.updateNotifBadge();
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