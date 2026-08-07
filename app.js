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

    aiHistory: [],

    translations: {
        ru: {
            nav_dashboard: 'Dashboard',
            nav_journal: 'Journal',
            nav_calendar: 'Calendar',
            nav_analytics: 'Analytics',
            nav_performance: 'Performance',
            nav_guardian: 'Guardian',
            nav_intelligence: 'AI Assistant',
            nav_settings: 'Settings'
        },
        en: {
            nav_dashboard: 'Dashboard',
            nav_journal: 'Journal',
            nav_calendar: 'Calendar',
            nav_analytics: 'Analytics',
            nav_performance: 'Performance',
            nav_guardian: 'Guardian',
            nav_intelligence: 'AI Assistant',
            nav_settings: 'Settings'
        }
    },

    // ===== INIT =====
    init() {
        this.loadState();
        this.initData();
        this.cacheElements();
        this.bindEvents();
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
    initData() {
        this.filteredTrades = [...this.trades];
        if (this.trades.length === 0) this.addDemoData();
        if (this.events.length === 0) this.initCalendarEvents();
        if (this.guardianRules.length === 0) this.initGuardianData();
        this.currentDate = new Date();
        this.selectedDate = new Date();
    },

    addDemoData() {
        const now = new Date();
        const formatDate = (d) => d.toISOString().slice(0, 10);
        const demoTrades = [
            { id: 1, date: formatDate(new Date(now.getTime() - 2 * 86400000)), asset: 'BTCUSDT', side: 'BUY', entry: 42300, exit: 43500, rr: 2.8, result: '+2.8R', status: 'win' },
            { id: 2, date: formatDate(new Date(now.getTime() - 3 * 86400000)), asset: 'XAUUSD', side: 'SELL', entry: 1925, exit: 1910, rr: 3.0, result: '+3R', status: 'win' },
            { id: 3, date: formatDate(new Date(now.getTime() - 4 * 86400000)), asset: 'EURUSD', side: 'BUY', entry: 1.0850, exit: 1.0820, rr: -1, result: '-1R', status: 'loss' },
            { id: 4, date: formatDate(new Date(now.getTime() - 5 * 86400000)), asset: 'ETHUSDT', side: 'BUY', entry: 2800, exit: 2920, rr: 2.2, result: '+2.2R', status: 'win' }
        ];
        this.trades = demoTrades;
        this.filteredTrades = [...this.trades];
        this.saveState();
    },

    initCalendarEvents() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        this.events = [
            { id: 1, date: new Date(year, month, 5), title: 'BTC Long Setup', type: 'trade' },
            { id: 2, date: new Date(year, month, 12), title: 'Team Meeting', type: 'meeting' }
        ];
        this.saveState();
    },

    initGuardianData() {
        this.guardianRules = [
            { id: 1, name: 'Риск на сделку ≤ 1%', passed: true, icon: '🛡' },
            { id: 2, name: 'Не более 5 сделок в день', passed: true, icon: '📊' },
            { id: 3, name: 'Stop Loss всегда установлен', passed: true, icon: '🎯' },
            { id: 4, name: 'Дневной лимит не превышен', passed: true, icon: '📉' },
            { id: 5, name: 'Нет торговли в эмоциях', passed: true, icon: '🧠' },
            { id: 6, name: 'План сделки соблюдён', passed: true, icon: '📋' }
        ];
        this.guardianViolations = [];
        this.saveState();
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

        this.accentOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                this.accentOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
            });
        });
        this.themeOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                this.themeOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
            });
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
        const t = this.translations[this.currentLang] || this.translations.ru;
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.dataset.key;
            if (t[key] !== undefined && !el.closest('.dash-panel') && !el.closest('.journal-stats-modern')) {
                el.textContent = t[key];
            }
        });
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

        this.userData = { name, capital, risk, dailyTarget, dailyLoss, rr, session, markets, assets, strategy };
        this.onboardingDone = true;
        if (this.onboardingOverlay) this.onboardingOverlay.classList.remove('active');
        this.applyUserData();
        this.saveState();
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
        let greeting = 'Good Evening';
        if (hour < 12) greeting = 'Good Morning';
        else if (hour < 18) greeting = 'Good Afternoon';
        if (this.pageGreeting) this.pageGreeting.textContent = greeting;
    },

    applyUserData() {
        if (!this.userData || !this.onboardingDone) return;
        if (this.balanceDisplay) this.balanceDisplay.textContent = '$ ' + this.userData.capital.toLocaleString();
        if (this.userNameDisplay) this.userNameDisplay.textContent = this.userData.name || 'Danik';
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
                type: 'doughnut', data: { labels: labels, datasets: [{ data: data, backgroundColor: ['#7c5cfc', '#fbbf24', '#43c6a0', '#ef4444'], borderColor: '#13161c', borderWidth: 2 }] },
                options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { display: false } } }
            });
        }
    },

    initEquityChart() {
        const canvas = document.getElementById('equityChart');
        if (!canvas) return;
        if (this.equityChartInstance) this.equityChartInstance.destroy();
        const data = [82000, 88000, 95000, 102000, 112000, 118000, 125000];
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 180);
        gradient.addColorStop(0, 'rgba(124, 92, 252, 0.3)');
        gradient.addColorStop(1, 'rgba(124, 92, 252, 0)');
        this.equityChartInstance = new Chart(canvas, {
            type: 'line', data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Equity', data, borderColor: '#7c5cfc', backgroundColor: gradient, borderWidth: 3, pointRadius: 4, pointBackgroundColor: '#7c5cfc', pointBorderColor: '#fff', pointBorderWidth: 2, tension: 0.4, fill: true }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#8892a0' } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8892a0' } } } }
        });
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
            this.journalBody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:48px 0;color:var(--text-secondary);">Пока нет сделок. Начните добавлять!</td></tr>`;
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
        this.renderTodaysProgress();
        this.updateAnalytics();
        this.updateGuardianStats();
        this.initGuardianChart();
        this.renderCalendar();
        this.updateCalendarBadge();
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
        const today = new Date().toISOString().slice(0, 10);
        const todayTrades = this.trades.filter(t => t.date === today);
        const lossesToday = todayTrades.filter(t => t.status === 'loss').length;

        (this.guardianRules || []).filter(r => !r.passed).forEach(r => {
            notifications.push({ icon: '⚠️', title: 'Нарушение правила Guardian', desc: r.name, tag: 'warning' });
        });

        if (lossesToday >= 3) {
            notifications.push({ icon: '🛑', title: 'Дневной лимит убытков', desc: `${lossesToday} убыточных сделок сегодня`, tag: 'warning' });
        }

        const todayEvents = this.getEventsForDate(new Date());
        if (todayEvents.length > 0) {
            notifications.push({ icon: '📅', title: `События сегодня (${todayEvents.length})`, desc: todayEvents.map(e => e.title).join(', '), tag: 'info' });
        }

        if (notifications.length === 0) {
            notifications.push({ icon: '✅', title: 'Всё под контролем', desc: 'Нарушений и событий на сегодня не найдено', tag: 'success' });
        }
        return notifications;
    },

    renderNotifications() {
        if (!this.notifResults) return;
        const notifications = this.getNotifications();
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
            this.dayTradesList.innerHTML = `<div class="no-events">Нет сделок в этот день</div>`;
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
            this.eventsList.innerHTML = `<div class="no-events">Нет событий на этот день</div>`;
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
        const sessionRanges = { Asian: [0, 8], London: [8, 13], 'New York': [13, 21], Sydney: [21, 24] };
        const sessionTotals = { Asian: 0, London: 0, 'New York': 0, Sydney: 0 };
        this.trades.forEach(t => {
            const hour = new Date(t.date).getHours() || 0;
            const session = Object.keys(sessionRanges).find(s => hour >= sessionRanges[s][0] && hour < sessionRanges[s][1]) || 'London';
            sessionTotals[session] += parseFloat(t.rr) || 0;
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
        const today = new Date().toISOString().slice(0, 10);
        const todayTrades = this.trades.filter(t => t.date === today);
        const totalToday = todayTrades.length;
        const winsToday = todayTrades.filter(t => t.status === 'win').length;
        const wrToday = totalToday > 0 ? Math.round((winsToday / totalToday) * 100) : 0;
        const lastTrade = this.trades.length > 0 ? this.trades[0].result : '—';

        let html = `
            <div class="ai-msg-wrapper ai">
                <div class="ai-msg-avatar">KD</div>
                <div class="ai-msg-bubble">
                    <div class="ai-welcome-card">
                        <h2>Добро пожаловать обратно, <strong>${name}</strong> 👋</h2>
                        <p style="color:var(--text-secondary); font-size:14px;">Ваш персональный AI-коуч готов помочь.</p>
                        <div class="stats-grid">
                            <div class="stat-line"><span>📊 Сделок сегодня</span><span>${totalToday}</span></div>
                            <div class="stat-line"><span>🎯 Win Rate</span><span class="highlight">${wrToday}%</span></div>
                            <div class="stat-line"><span>⚡ Дисциплина</span><span style="color:var(--brand-green);">Хорошая</span></div>
                            <div class="stat-line"><span>🚀 Последняя сделка</span><span class="highlight">${lastTrade}</span></div>
                        </div>
                        <p style="color:var(--text-secondary); font-size:13px; margin-top:12px;">Выберите действие ниже или задайте вопрос.</p>
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
            const avatar = msg.role === 'user' ? 'Вы' : 'KD';
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

    handleAIQuery() {
        const question = this.aiInput?.value?.trim();
        if (!question) return;
        this.appendMessage('user', question);
        this.aiInput.value = '';
        this.showTypingIndicator();

        const responses = [
            "Отличный вопрос! Давайте разберем. Ваш последний месяц показывает хорошую тенденцию, особенно в активах BTC и XAU. Рекомендую обратить внимание на объемы на H4 таймфрейме. Дисциплина на высоте — продолжайте в том же духе! 📈",
            "Я проанализировал вашу статистику. Средняя прибыль сделки составляет 2.1R, что выше среднего показателя по рынку. Однако ваша серия убытков в начале месяца могла быть связана с нарушением риск-менеджмента. Держите 1% на сделку! 🛡️",
            "Ваш лучший день — это 15 августа, с прибылью +6.2R. Отличная работа! Анализ показывает, что в этот день вы придерживались плана и не переторговывали. Психология — ключ к успеху. 🧠",
            "Ошибки? Давайте посмотрим. Ваша главная ошибка — это вход в рынок без четкого подтверждения (retest) на младших таймфреймах. Это приводило к ложным пробоям. Исправляя это, вы повысите Win Rate до 70%. 💡"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        setTimeout(() => {
            this.hideTypingIndicator();
            this.appendMessage('ai', randomResponse);
        }, 1200 + Math.random() * 600);
    },

    appendMessage(role, content) {
        const cls = role === 'user' ? 'user' : 'ai';
        const avatar = role === 'user' ? 'Вы' : 'KD';
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
            <div class="ai-msg-avatar">KD</div>
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
        const total = this.trades.length;
        if (total === 0) {
            if (this.guardianScore) this.guardianScore.textContent = '—';
            if (this.guardianDayStatus) this.guardianDayStatus.textContent = 'Нет данных';
            if (this.guardianStreak) this.guardianStreak.textContent = '0 дней';
            if (this.guardianHistoryCount) this.guardianHistoryCount.textContent = '0';
            this.updateNotifBadge();
            return;
        }

        let score = 0;
        const today = new Date().toISOString().slice(0, 10);
        const todayTrades = this.trades.filter(t => t.date === today);
        const totalToday = todayTrades.length;
        const lossesToday = todayTrades.filter(t => t.status === 'loss').length;

        this.guardianRules[0].passed = totalToday === 0 || lossesToday < 2; 
        this.guardianRules[1].passed = totalToday <= 5;
        this.guardianRules[2].passed = totalToday === 0 || (totalToday > 0);
        this.guardianRules[3].passed = lossesToday < 3;

        const passedCount = this.guardianRules.filter(r => r.passed).length;
        score = Math.round((passedCount / this.guardianRules.length) * 100);

        let badgeText = 'Отлично';
        let badgeClass = '';
        if (score >= 80) { badgeText = 'Отлично'; badgeClass = ''; }
        else if (score >= 50) { badgeText = 'Нормально'; badgeClass = 'warning'; }
        else { badgeText = 'Требует внимания'; badgeClass = 'danger'; }

        if (this.guardianScore) this.guardianScore.textContent = score + '%';
        if (this.guardianScoreBadge) {
            this.guardianScoreBadge.textContent = badgeText;
            this.guardianScoreBadge.className = 'score-badge ' + badgeClass;
        }

        let statusText = '✅ Дисциплина соблюдена';
        if (totalToday === 0) statusText = '📭 Нет сделок сегодня';
        else if (lossesToday >= 3) statusText = '⚠️ Обратите внимание на лимиты';
        if (this.guardianDayStatus) this.guardianDayStatus.textContent = statusText;

        let streak = 0;
        const uniqueDays = [...new Set(this.trades.map(t => t.date))].sort().reverse();
        for (let day of uniqueDays) {
            const dayTrades = this.trades.filter(t => t.date === day);
            const dayLosses = dayTrades.filter(t => t.status === 'loss').length;
            if (dayLosses < 3) {
                streak++;
            } else {
                break;
            }
        }
        if (this.guardianStreak) this.guardianStreak.textContent = streak + ' дней';

        this.renderGuardianRules();
        this.renderGuardianTimeline();
        this.renderGuardianRecommendations();
        this.updateNotifBadge();
    },

    renderGuardianRules() {
        if (!this.guardianRulesList) return;
        let html = '';
        this.guardianRules.forEach(rule => {
            const statusClass = rule.passed ? 'passed' : 'failed';
            const statusText = rule.passed ? '✅ Соблюдено' : '⚠️ Нарушение';
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
        const total = this.trades.length;
        if (total === 0) {
            this.guardianTimeline.innerHTML = `<div class="timeline-empty" style="color:var(--text-secondary); text-align:center; padding:20px 0;">Начните торговать, чтобы увидеть историю</div>`;
            if (this.guardianHistoryCount) this.guardianHistoryCount.textContent = '0';
            return;
        }

        const events = [];
        const sortedTrades = [...this.trades].reverse();
        sortedTrades.slice(0, 10).forEach((t, index) => {
            if (t.status === 'win' && index % 3 === 0) {
                events.push({ type: 'achievement', title: '🏆 Дисциплинированная сделка', desc: `Сделка по ${t.asset} завершена с соблюдением риск-менеджмента.` });
            } else if (t.status === 'loss' && index % 2 === 0) {
                events.push({ type: 'warning', title: '⚠️ Анализ убытка', desc: `Убыточная сделка по ${t.asset}. Проверьте точки входа.` });
            }
        });

        if (events.length < 3) {
            events.push({ type: 'achievement', title: '🏆 Новая серия дисциплины', desc: 'Зафиксировано 5 дней без нарушений правил.' });
        }

        if (this.guardianHistoryCount) this.guardianHistoryCount.textContent = events.length;

        let html = '';
        events.slice(0, 8).forEach(e => {
            const icon = e.type === 'achievement' ? '🏆' : '⚠️';
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
        const total = this.trades.length;
        if (total < 3) {
            this.guardianRecommendations.innerHTML = `<div class="rec-empty" style="color:var(--text-secondary); text-align:center; padding:20px 0;">Достаточно данных для рекомендаций</div>`;
            return;
        }
        const recommendations = [
            { icon: '📊', text: '<strong>Рекомендация:</strong> Фокусируйтесь на одной стратегии. Частая смена подходов снижает стабильность.' },
            { icon: '🧠', text: '<strong>Совет наставника:</strong> Если серия убытков достигла 3 сделок — сделайте паузу на 30 минут. Это помогает перезагрузить психологию.' },
            { icon: '📈', text: '<strong>Анализ:</strong> Ваша статистика показывает высокую эффективность в первой половине дня. Попробуйте сместить активность.' },
            { icon: '🛡', text: '<strong>Дисциплина:</strong> Продолжайте соблюдать риск 1%. Это ваш фундамент для долгосрочного роста.' }
        ];
        const shuffled = recommendations.sort(() => Math.random() - 0.5).slice(0, 2);
        let html = '';
        shuffled.forEach(rec => {
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
        if (this.guardianCharts.discipline) this.guardianCharts.discipline.destroy();

        const days = [];
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().slice(0, 10);
            days.push(dateStr.slice(5, 10));
            const dayTrades = this.trades.filter(t => t.date === dateStr);
            let score = 100;
            if (dayTrades.length > 0) {
                const losses = dayTrades.filter(t => t.status === 'loss').length;
                score = Math.max(0, 100 - (losses * 15));
            }
            data.push(score);
        }

        this.guardianCharts.discipline = new Chart(canvas, {
            type: 'line', data: { labels: days, datasets: [{ label: 'Дисциплина (%)', data: data, borderColor: '#7c5cfc', backgroundColor: 'rgba(124, 92, 252, 0.1)', borderWidth: 2, pointRadius: 4, pointBackgroundColor: data.map(v => v >= 80 ? '#43c6a0' : v >= 50 ? '#fbbf24' : '#ef4444'), tension: 0.4, fill: true }] },
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
                this.balanceDisplay.textContent =
                    "$ " + Number(this.userData.capital || 0).toLocaleString();
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
            }

            this.userData.currency = currency;

            this.userData.theme =
                document.querySelector(".theme-option.active")?.dataset.theme || "dark";

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
        this.updateDashboardStats(); this.updateAnalytics();
        this.updateGuardianStats(); this.initGuardianChart();
        this.renderCalendar(); this.updateCalendarBadge();
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
        this.updateDashboardStats();
        this.updateNotifBadge();
    }
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

window.App = App;