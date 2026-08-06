"use strict";

/* ============================================================
   KRIPTODANIK AI — ПОЛНАЯ ЛОГИКА (ИСПРАВЛЕНАЯ)
   ============================================================ */

const App = {

    trades: [],
    filteredTrades: [],
    currentPage: 1,
    pageSize: 10,
    currentPeriod: '30d',

    currentDate: new Date(),
    selectedDate: new Date(),
    events: [],

    guardianRules: [],
    guardianViolations: [],

    analyticsCharts: {},
    guardianCharts: {},
    performanceCharts: {},
    equityChartInstance: null,

    currentLang: 'ru',

    translations: {
        ru: {
            appName: 'KriptoDanik',
            appSub: 'AI Workspace',
            planName: 'Pro',
            planDetail: 'Management',
            planDate: 'Valid until 25.07.2025',
            nav_dashboard: 'Dashboard',
            nav_journal: 'Journal',
            nav_analytics: 'Analytics',
            nav_calendar: 'Calendar',
            nav_performance: 'Performance',
            nav_guardian: 'Guardian',
            nav_intelligence: 'KD Intelligence',
            nav_settings: 'Settings',
            greeting: 'Good Evening',
            welcome: 'Welcome back, Danik',
            online: 'AI Connected',
            balance: 'Balance',
            today_label: 'today',
            today: 'Today',
            week: 'This Week',
            month: 'This Month',
            drawdown: 'Drawdown',
            score_label: 'Score',
            score_status: 'Excellent',
            market_bias: 'Market',
            confidence: 'Confidence',
            recommendation: 'Recommendation',
            risk: 'Risk',
            qa_analysis: 'Last Trade Analysis',
            qa_add: 'Add Trade',
            qa_review: 'Journal Review',
            qa_risk: 'Risk Check',
            equity_curve: 'Equity Curve',
            guardian: 'Guardian',
            guardian_risk: 'Risk per trade',
            guardian_loss: 'Loss limit',
            guardian_daily: 'Daily limit',
            guardian_plan: 'Trading plan',
            ai_title: 'Ask KD AI about your trades',
            ai_sub: 'Get instant analysis, feedback and recommendations.',
            ask_btn: 'Ask AI',
            add_trade: 'Add Trade',
            date: 'Date',
            asset: 'Asset',
            side: 'Side',
            entry: 'Entry',
            exit: 'Exit',
            rr: 'RR',
            result: 'Result',
            status: 'Status',
            total_trades: 'Total Trades',
            win_rate: 'Win Rate',
            avg_rr: 'Avg RR',
            total_pnl: 'Total P&L',
            win_rate_30d: 'Win Rate (30d)',
            avg_win: 'Avg Win',
            sharpe: 'Sharpe Ratio',
            pnl_distribution: 'P&L Distribution',
            win_rate_by_asset: 'Win Rate by Asset',
            monthly_performance: 'Monthly Performance',
            key_metrics: 'Key Metrics',
            events_for: 'Events for',
            add: 'Add',
            profit_factor: 'Profit Factor',
            session_performance: 'Session Performance',
            session_details: 'Session Details',
            benchmarks: 'Performance vs Benchmarks',
            risk_per_trade: 'Risk Per Trade',
            loss_limit: 'Loss Limit',
            daily_limit: 'Daily Loss Limit',
            trading_plan: 'Trading Plan',
            discipline: 'Discipline Score',
            max_trades: 'Max Daily Trades',
            risk_meter: 'Risk Meter',
            rules_compliance: 'Rules Compliance',
            risk_distribution: 'Risk Distribution by Asset',
            violations: 'Violations History',
            recommendations: 'AI Recommendations',
            current_risk: 'Current Risk',
            risk_budget: 'Risk Budget',
            used: 'Used',
            remaining: 'Remaining',
            profile_info: 'Profile Information',
            full_name: 'Full Name',
            email: 'Email',
            username: 'Username',
            bio: 'Bio',
            update_profile: 'Update Profile',
            account: 'Account',
            plan: 'Plan',
            member_since: 'Member Since',
            trades: 'Trades',
            change_password: 'Change Password',
            trading_preferences: 'Trading Preferences',
            default_risk: 'Default Risk per Trade',
            default_sl: 'Default Stop Loss',
            default_tp: 'Default Take Profit',
            max_trades_setting: 'Max Daily Trades',
            preferred_assets: 'Preferred Assets',
            save_settings: 'Save Trading Settings',
            notif_preferences: 'Notification Preferences',
            trading_alerts: 'Trading Alerts',
            entry_signals: 'Trade Entry Signals',
            sl_alerts: 'Stop Loss Alerts',
            tp_alerts: 'Take Profit Alerts',
            daily_summary: 'Daily Summary',
            system_notifs: 'System Notifications',
            guardian_alerts: 'Guardian Alerts',
            risk_warnings: 'Risk Limit Warnings',
            weekly_report: 'Weekly Performance Report',
            ai_insights: 'AI Insights',
            save_notif: 'Save Notification Settings',
            theme: 'Theme',
            color_scheme: 'Color Scheme',
            accent_color: 'Accent Color',
            font_size: 'Font Size',
            apply_appearance: 'Apply Appearance',
            preview: 'Preview',
            security: 'Security',
            current_password: 'Current Password',
            new_password: 'New Password',
            confirm_password: 'Confirm New Password',
            '2fa': 'Two-Factor Authentication',
            enable_2fa: 'Enable 2FA',
            update_security: 'Update Security',
            active_sessions: 'Active Sessions',
            logout_all: 'Log Out All Devices',
            data_management: 'Data Management',
            export_data: 'Export Data',
            export_trades: 'Export Trades (CSV)',
            export_journal: 'Export Journal (JSON)',
            export_all: 'Export All Data (ZIP)',
            import_data: 'Import Data',
            import_trades: 'Import Trades (CSV)',
            danger_zone: 'Danger Zone',
            clear_all: 'Clear All Data',
            kd_intelligence: 'KD Intelligence',
            market_overview: 'Market Overview',
            recent_activity: 'Recent Activity'
        },
        en: {
            appName: 'KriptoDanik',
            appSub: 'AI Workspace',
            planName: 'Pro',
            planDetail: 'Management',
            planDate: 'Valid until 25.07.2025',
            nav_dashboard: 'Dashboard',
            nav_journal: 'Journal',
            nav_analytics: 'Analytics',
            nav_calendar: 'Calendar',
            nav_performance: 'Performance',
            nav_guardian: 'Guardian',
            nav_intelligence: 'KD Intelligence',
            nav_settings: 'Settings',
            greeting: 'Good Evening',
            welcome: 'Welcome back, Danik',
            online: 'AI Connected',
            balance: 'Balance',
            today_label: 'today',
            today: 'Today',
            week: 'This Week',
            month: 'This Month',
            drawdown: 'Drawdown',
            score_label: 'Score',
            score_status: 'Excellent',
            market_bias: 'Market',
            confidence: 'Confidence',
            recommendation: 'Recommendation',
            risk: 'Risk',
            qa_analysis: 'Last Trade Analysis',
            qa_add: 'Add Trade',
            qa_review: 'Journal Review',
            qa_risk: 'Risk Check',
            equity_curve: 'Equity Curve',
            guardian: 'Guardian',
            guardian_risk: 'Risk per trade',
            guardian_loss: 'Loss limit',
            guardian_daily: 'Daily limit',
            guardian_plan: 'Trading plan',
            ai_title: 'Ask KD AI about your trades',
            ai_sub: 'Get instant analysis, feedback and recommendations.',
            ask_btn: 'Ask AI',
            add_trade: 'Add Trade',
            date: 'Date',
            asset: 'Asset',
            side: 'Side',
            entry: 'Entry',
            exit: 'Exit',
            rr: 'RR',
            result: 'Result',
            status: 'Status',
            total_trades: 'Total Trades',
            win_rate: 'Win Rate',
            avg_rr: 'Avg RR',
            total_pnl: 'Total P&L',
            win_rate_30d: 'Win Rate (30d)',
            avg_win: 'Avg Win',
            sharpe: 'Sharpe Ratio',
            pnl_distribution: 'P&L Distribution',
            win_rate_by_asset: 'Win Rate by Asset',
            monthly_performance: 'Monthly Performance',
            key_metrics: 'Key Metrics',
            events_for: 'Events for',
            add: 'Add',
            profit_factor: 'Profit Factor',
            session_performance: 'Session Performance',
            session_details: 'Session Details',
            benchmarks: 'Performance vs Benchmarks',
            risk_per_trade: 'Risk Per Trade',
            loss_limit: 'Loss Limit',
            daily_limit: 'Daily Loss Limit',
            trading_plan: 'Trading Plan',
            discipline: 'Discipline Score',
            max_trades: 'Max Daily Trades',
            risk_meter: 'Risk Meter',
            rules_compliance: 'Rules Compliance',
            risk_distribution: 'Risk Distribution by Asset',
            violations: 'Violations History',
            recommendations: 'AI Recommendations',
            current_risk: 'Current Risk',
            risk_budget: 'Risk Budget',
            used: 'Used',
            remaining: 'Remaining',
            profile_info: 'Profile Information',
            full_name: 'Full Name',
            email: 'Email',
            username: 'Username',
            bio: 'Bio',
            update_profile: 'Update Profile',
            account: 'Account',
            plan: 'Plan',
            member_since: 'Member Since',
            trades: 'Trades',
            change_password: 'Change Password',
            trading_preferences: 'Trading Preferences',
            default_risk: 'Default Risk per Trade',
            default_sl: 'Default Stop Loss',
            default_tp: 'Default Take Profit',
            max_trades_setting: 'Max Daily Trades',
            preferred_assets: 'Preferred Assets',
            save_settings: 'Save Trading Settings',
            notif_preferences: 'Notification Preferences',
            trading_alerts: 'Trading Alerts',
            entry_signals: 'Trade Entry Signals',
            sl_alerts: 'Stop Loss Alerts',
            tp_alerts: 'Take Profit Alerts',
            daily_summary: 'Daily Summary',
            system_notifs: 'System Notifications',
            guardian_alerts: 'Guardian Alerts',
            risk_warnings: 'Risk Limit Warnings',
            weekly_report: 'Weekly Performance Report',
            ai_insights: 'AI Insights',
            save_notif: 'Save Notification Settings',
            theme: 'Theme',
            color_scheme: 'Color Scheme',
            accent_color: 'Accent Color',
            font_size: 'Font Size',
            apply_appearance: 'Apply Appearance',
            preview: 'Preview',
            security: 'Security',
            current_password: 'Current Password',
            new_password: 'New Password',
            confirm_password: 'Confirm New Password',
            '2fa': 'Two-Factor Authentication',
            enable_2fa: 'Enable 2FA',
            update_security: 'Update Security',
            active_sessions: 'Active Sessions',
            logout_all: 'Log Out All Devices',
            data_management: 'Data Management',
            export_data: 'Export Data',
            export_trades: 'Export Trades (CSV)',
            export_journal: 'Export Journal (JSON)',
            export_all: 'Export All Data (ZIP)',
            import_data: 'Import Data',
            import_trades: 'Import Trades (CSV)',
            danger_zone: 'Danger Zone',
            clear_all: 'Clear All Data',
            kd_intelligence: 'KD Intelligence',
            market_overview: 'Market Overview',
            recent_activity: 'Recent Activity'
        }
    },

    init() {
        this.initData();
        this.cacheElements();
        this.bindEvents();
        this.renderAll();
        console.log('KriptoDanik AI initialized.');
    },

    // ===== DATA =====
    initData() {
        const now = new Date();
        const formatDate = (d) => d.toISOString().slice(0, 10);

        this.trades = [
            { id: 1, date: formatDate(new Date(now.getTime() - 2 * 86400000)), asset: 'BTCUSDT', side: 'BUY', entry: 42300, exit: 43500, rr: 2.8, result: '+2.8R', status: 'win' },
            { id: 2, date: formatDate(new Date(now.getTime() - 3 * 86400000)), asset: 'XAUUSD', side: 'SELL', entry: 1925, exit: 1910, rr: 3.0, result: '+3R', status: 'win' },
            { id: 3, date: formatDate(new Date(now.getTime() - 4 * 86400000)), asset: 'EURUSD', side: 'BUY', entry: 1.0850, exit: 1.0820, rr: -1, result: '-1R', status: 'loss' },
            { id: 4, date: formatDate(new Date(now.getTime() - 5 * 86400000)), asset: 'ETHUSDT', side: 'BUY', entry: 2800, exit: 2920, rr: 2.2, result: '+2.2R', status: 'win' },
            { id: 5, date: formatDate(new Date(now.getTime() - 6 * 86400000)), asset: 'BTCUSDT', side: 'SELL', entry: 41000, exit: 41500, rr: -0.5, result: '-0.5R', status: 'loss' },
            { id: 6, date: formatDate(new Date(now.getTime() - 7 * 86400000)), asset: 'XAUUSD', side: 'BUY', entry: 1900, exit: 1920, rr: 2.0, result: '+2R', status: 'win' },
            { id: 7, date: formatDate(new Date(now.getTime() - 8 * 86400000)), asset: 'EURUSD', side: 'SELL', entry: 1.0900, exit: 1.0880, rr: 1.5, result: '+1.5R', status: 'win' },
            { id: 8, date: formatDate(new Date(now.getTime() - 9 * 86400000)), asset: 'ETHUSDT', side: 'SELL', entry: 2750, exit: 2780, rr: -0.8, result: '-0.8R', status: 'loss' },
            { id: 9, date: formatDate(new Date(now.getTime() - 10 * 86400000)), asset: 'BTCUSDT', side: 'BUY', entry: 39800, exit: 41200, rr: 3.2, result: '+3.2R', status: 'win' },
            { id: 10, date: formatDate(new Date(now.getTime() - 11 * 86400000)), asset: 'XAUUSD', side: 'SELL', entry: 1935, exit: 1930, rr: 0.5, result: '+0.5R', status: 'win' },
            { id: 11, date: formatDate(new Date(now.getTime() - 12 * 86400000)), asset: 'EURUSD', side: 'BUY', entry: 1.0780, exit: 1.0820, rr: 1.8, result: '+1.8R', status: 'win' },
            { id: 12, date: formatDate(new Date(now.getTime() - 13 * 86400000)), asset: 'SOLUSDT', side: 'BUY', entry: 45.50, exit: 43.20, rr: -1.2, result: '-1.2R', status: 'loss' }
        ];

        for (let i = 0; i < 50; i++) {
            const daysAgo = 14 + i;
            const assets = ['BTCUSDT', 'ETHUSDT', 'XAUUSD', 'EURUSD', 'SOLUSDT'];
            const sides = ['BUY', 'SELL'];
            const asset = assets[Math.floor(Math.random() * assets.length)];
            const side = sides[Math.floor(Math.random() * sides.length)];
            const rr = (Math.random() * 6 - 2).toFixed(1);
            const isWin = parseFloat(rr) > 0;
            const result = (isWin ? '+' : '') + rr + 'R';
            const status = isWin ? 'win' : 'loss';
            this.trades.push({
                id: 13 + i,
                date: formatDate(new Date(now.getTime() - daysAgo * 86400000)),
                asset, side,
                entry: Math.round(100 + Math.random() * 50000),
                exit: Math.round(100 + Math.random() * 50000),
                rr: parseFloat(rr),
                result, status
            });
        }
        this.filteredTrades = [...this.trades];

        const year = now.getFullYear();
        const month = now.getMonth();
        this.events = [
            { id: 1, date: new Date(year, month, 5), title: 'BTC Long Setup', type: 'trade' },
            { id: 2, date: new Date(year, month, 7), title: 'XAU Short Alert', type: 'alert' },
            { id: 3, date: new Date(year, month, 12), title: 'Team Meeting', type: 'meeting' },
            { id: 4, date: new Date(year, month, 15), title: 'EURUSD Breakout Analysis', type: 'analysis' },
            { id: 5, date: new Date(year, month, 18), title: 'ETH Swing Trade', type: 'trade' },
            { id: 6, date: new Date(year, month, 20), title: 'Weekly Review', type: 'meeting' },
            { id: 7, date: new Date(year, month, 22), title: 'Stop Loss Review', type: 'analysis' },
            { id: 8, date: new Date(year, month, 25), title: 'Take Profit Alert', type: 'alert' }
        ];
        this.selectedDate = new Date(year, month, now.getDate());

        this.guardianRules = [
            { id: 1, name: 'Risk per trade ≤ 1%', passed: true },
            { id: 2, name: 'No revenge trading', passed: true },
            { id: 3, name: 'Daily loss limit respected', passed: true },
            { id: 4, name: 'Weekly loss limit respected', passed: true },
            { id: 5, name: 'Trading plan followed', passed: true },
            { id: 6, name: 'Max 5 trades per day', passed: true },
            { id: 7, name: 'Stop loss always set', passed: true },
            { id: 8, name: 'Take profit defined', passed: true },
            { id: 9, name: 'Risk/reward ≥ 1:2', passed: true },
            { id: 10, name: 'No trading after 3 losses', passed: true },
            { id: 11, name: 'Position size calculated', passed: true },
            { id: 12, name: 'Journal entry completed', passed: true }
        ];
        this.guardianViolations = [];
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

        this.journalBody = document.getElementById('journalBody');
        this.filterAsset = document.getElementById('filterAsset');
        this.filterResult = document.getElementById('filterResult');
        this.journalSearch = document.getElementById('journalSearch');
        this.addTradeBtn = document.getElementById('addTradeBtn');
        this.quickAddTradeBtn = document.getElementById('quickAddTradeBtn');
        this.prevPageBtn = document.getElementById('prevPage');
        this.nextPageBtn = document.getElementById('nextPage');
        this.currentPageEl = document.getElementById('currentPage');
        this.totalPagesEl = document.getElementById('totalPages');
        this.paginationInfo = document.getElementById('paginationInfo');
        this.journalBadge = document.getElementById('journalBadge');

        this.jTotalTrades = document.getElementById('jTotalTrades');
        this.jWinRate = document.getElementById('jWinRate');
        this.jAvgRR = document.getElementById('jAvgRR');
        this.jTotalPnL = document.getElementById('jTotalPnL');

        this.aTotalPnl = document.getElementById('aTotalPnl');
        this.aWinRate = document.getElementById('aWinRate');
        this.aAvgWin = document.getElementById('aAvgWin');
        this.aSharpe = document.getElementById('aSharpe');
        this.periodBtns = document.querySelectorAll('.period-btn');
        this.toggleViewBtn = document.getElementById('toggleViewBtn');
        this.metricsGrid = document.getElementById('metricsGrid');

        this.calendarGrid = document.getElementById('calendarGrid');
        this.calendarMonth = document.getElementById('calendarMonth');
        this.prevMonthBtn = document.getElementById('prevMonth');
        this.nextMonthBtn = document.getElementById('nextMonth');
        this.selectedDateLabel = document.getElementById('selectedDateLabel');
        this.eventsList = document.getElementById('eventsList');
        this.eventsCount = document.getElementById('eventsCount');
        this.eventInput = document.getElementById('eventInput');
        this.eventType = document.getElementById('eventType');
        this.addEventBtn = document.getElementById('addEventBtn');
        this.calendarBadge = document.getElementById('calendarBadge');

        this.perfTabs = document.querySelectorAll('.perf-tab');
        this.perfPanels = document.querySelectorAll('.perf-panel');
        this.perfPeriodBtn = document.getElementById('perfPeriodBtn');
        this.perfMetricsGrid = document.getElementById('perfMetricsGrid');
        this.pTotalPnl = document.getElementById('pTotalPnl');
        this.pWinRate = document.getElementById('pWinRate');
        this.pProfitFactor = document.getElementById('pProfitFactor');
        this.pSharpe = document.getElementById('pSharpe');
        this.sessionDetails = document.getElementById('sessionDetails');
        this.benchmarksGrid = document.getElementById('benchmarksGrid');

        this.rulesList = document.getElementById('rulesList');
        this.violationsList = document.getElementById('violationsList');
        this.violationsCount = document.getElementById('violationsCount');
        this.recommendationsList = document.getElementById('recommendationsList');
        this.riskLevel = document.getElementById('riskLevel');
        this.riskMeterFill = document.getElementById('riskMeterFill');
        this.gRiskPerTrade = document.getElementById('gRiskPerTrade');
        this.gLossLimit = document.getElementById('gLossLimit');
        this.gDailyLimit = document.getElementById('gDailyLimit');
        this.gPlanStatus = document.getElementById('gPlanStatus');
        this.gDiscipline = document.getElementById('gDiscipline');
        this.gMaxTrades = document.getElementById('gMaxTrades');
        this.refreshRecommendationsBtn = document.getElementById('refreshRecommendationsBtn');

        this.settingsTabs = document.querySelectorAll('.settings-tab');
        this.settingsPanels = document.querySelectorAll('.settings-panel');
        this.themeOptions = document.querySelectorAll('.theme-option');
        this.accentOptions = document.querySelectorAll('.accent-option');
        this.fontSizeOptions = document.querySelectorAll('.font-size-option');
        this.exportTradesBtn = document.getElementById('exportTradesBtn');
        this.exportJournalBtn = document.getElementById('exportJournalBtn');
        this.exportAllBtn = document.getElementById('exportAllBtn');
        this.importDataBtn = document.getElementById('importDataBtn');
        this.clearAllDataBtn = document.getElementById('clearAllDataBtn');

        this.aiInput = document.getElementById('aiInput');
        this.askBtn = document.getElementById('askBtn');
        this.aiResponse = document.getElementById('aiResponse');

        this.marketBias = document.getElementById('marketBias');
        this.confidenceDisplay = document.getElementById('confidenceDisplay');
        this.recommendationDisplay = document.getElementById('recommendationDisplay');
        this.riskDisplay = document.getElementById('riskDisplay');
        this.analysisText = document.getElementById('analysisText');

        this.quickActions = document.querySelectorAll('.quick-action');
        this.periodBtn = document.getElementById('periodBtn');

        this.langButtons = document.querySelectorAll('.lang-selector button');
        this.appName = document.getElementById('appName');
        this.appSub = document.getElementById('appSub');
        this.planName = document.getElementById('planName');
        this.planDetail = document.getElementById('planDetail');
        this.planDate = document.getElementById('planDate');
    },

    // ===== BIND EVENTS =====
    bindEvents() {
        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                const section = item.dataset.section;
                this.showSection(section);
            });
        });

        // Quick actions
        this.quickActions.forEach(action => {
            action.addEventListener('click', () => {
                const actionType = action.dataset.action;
                if (actionType === 'add-trade') {
                    this.addTrade();
                } else if (actionType === 'risk') {
                    this.showSection('guardian');
                } else if (actionType === 'review') {
                    this.showSection('journal');
                } else if (actionType === 'analysis') {
                    this.showNotification('Analyzing last trade...');
                } else {
                    this.showNotification('Action: ' + actionType);
                }
            });
        });

        // Quick add trade button on dashboard
        if (this.quickAddTradeBtn) {
            this.quickAddTradeBtn.addEventListener('click', () => this.addTrade());
        }

        // Journal filters
        if (this.filterAsset) this.filterAsset.addEventListener('change', () => this.applyFilters());
        if (this.filterResult) this.filterResult.addEventListener('change', () => this.applyFilters());
        if (this.journalSearch) this.journalSearch.addEventListener('input', () => this.applyFilters());

        if (this.addTradeBtn) this.addTradeBtn.addEventListener('click', () => this.addTrade());

        if (this.prevPageBtn) this.prevPageBtn.addEventListener('click', () => this.prevPage());
        if (this.nextPageBtn) this.nextPageBtn.addEventListener('click', () => this.nextPage());

        if (this.askBtn) this.askBtn.addEventListener('click', () => this.handleAIQuery());
        if (this.aiInput) this.aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.handleAIQuery();
        });

        setInterval(() => this.updateMarket(), 5000);

        if (this.prevMonthBtn) this.prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
        if (this.nextMonthBtn) this.nextMonthBtn.addEventListener('click', () => this.changeMonth(1));
        if (this.addEventBtn) this.addEventBtn.addEventListener('click', () => this.addEvent());
        if (this.eventInput) this.eventInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.addEvent();
        });

        this.perfTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.perfTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const tabId = tab.dataset.tab;
                this.perfPanels.forEach(p => p.classList.remove('active'));
                const panel = document.getElementById('perf-' + tabId);
                if (panel) panel.classList.add('active');
                setTimeout(() => {
                    if (tabId === 'monthly') this.initPerfMonthlyChart();
                    else if (tabId === 'sessions') this.initPerfSessionsChart();
                }, 100);
            });
        });

        if (this.perfPeriodBtn) {
            this.perfPeriodBtn.addEventListener('click', () => {
                const periods = ['Week', 'Month', 'Year'];
                const current = this.perfPeriodBtn.textContent;
                const idx = periods.indexOf(current);
                const next = periods[(idx + 1) % periods.length];
                this.perfPeriodBtn.textContent = next;
                this.initPerfEquityChart();
            });
        }

        this.settingsTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.settingsTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const tabId = tab.dataset.tab;
                this.settingsPanels.forEach(p => p.classList.remove('active'));
                const panel = document.getElementById('settings-' + tabId);
                if (panel) panel.classList.add('active');
            });
        });

        this.themeOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                this.themeOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                this.showNotification('Theme: ' + opt.dataset.theme);
            });
        });

        this.accentOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                this.accentOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                const color = opt.style.background;
                document.documentElement.style.setProperty('--primary', color);
                this.showNotification('Accent color updated');
            });
        });

        this.fontSizeOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                this.fontSizeOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                const sizes = { small: '13px', medium: '15px', large: '17px' };
                document.body.style.fontSize = sizes[opt.dataset.size];
                this.showNotification('Font size: ' + opt.dataset.size);
            });
        });

        if (this.exportTradesBtn) this.exportTradesBtn.addEventListener('click', () => this.exportTrades());
        if (this.exportJournalBtn) this.exportJournalBtn.addEventListener('click', () => this.exportJournal());
        if (this.exportAllBtn) this.exportAllBtn.addEventListener('click', () => this.exportAll());
        if (this.importDataBtn) this.importDataBtn.addEventListener('click', () => this.importData());
        if (this.clearAllDataBtn) this.clearAllDataBtn.addEventListener('click', () => this.clearAllData());

        if (this.refreshRecommendationsBtn) {
            this.refreshRecommendationsBtn.addEventListener('click', () => this.renderRecommendations());
        }

        document.getElementById('searchBtn')?.addEventListener('click', () => this.showNotification('Search'));
        document.getElementById('notifBtn')?.addEventListener('click', () => this.showNotification('No new notifications'));

        document.querySelectorAll('#saveProfileBtn, #saveTradingBtn, #saveNotifBtn, #applyAppearanceBtn, #updateSecurityBtn')
            .forEach(btn => {
                if (btn) btn.addEventListener('click', () => this.showNotification('Settings saved!'));
            });

        if (this.periodBtn) {
            this.periodBtn.addEventListener('click', () => {
                const periods = ['Week', 'Month', 'Year'];
                const current = this.periodBtn.textContent;
                const idx = periods.indexOf(current);
                const next = periods[(idx + 1) % periods.length];
                this.periodBtn.textContent = next;
                this.initEquityChart();
            });
        }

        this.periodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.periodBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentPeriod = btn.dataset.period;
                this.updateAnalytics();
            });
        });

        if (this.toggleViewBtn) {
            this.toggleViewBtn.addEventListener('click', () => {
                const current = this.toggleViewBtn.textContent;
                this.toggleViewBtn.textContent = current === 'Switch to R' ? 'Switch to $' : 'Switch to R';
                this.initMonthlyChart();
            });
        }

        // Language
        this.langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentLang = btn.dataset.lang;
                this.applyLanguage();
                this.showNotification('Language: ' + (this.currentLang === 'ru' ? 'Russian' : 'English'));
            });
        });

        // Apply initial language
        this.applyLanguage();
    },

    // ===== LANGUAGE =====
    applyLanguage() {
        const t = this.translations[this.currentLang] || this.translations.ru;

        // Sidebar
        if (this.appName) this.appName.textContent = t.appName;
        if (this.appSub) this.appSub.textContent = t.appSub;
        if (this.planName) this.planName.textContent = t.planName;
        if (this.planDetail) this.planDetail.textContent = t.planDetail;
        if (this.planDate) this.planDate.textContent = t.planDate;

        // Navigation
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.dataset.key;
            if (t[key] !== undefined) {
                el.textContent = t[key];
            }
        });

        // Online status
        const onlineStatus = document.querySelector('.online-status span');
        if (onlineStatus) onlineStatus.textContent = t.online;

        // Page title & greeting
        const section = document.querySelector('.nav-item.active')?.dataset.section || 'dashboard';
        const titles = {
            dashboard: t.welcome,
            journal: 'Trade Journal',
            analytics: 'Analytics',
            calendar: 'Calendar',
            performance: 'Performance',
            guardian: 'Guardian',
            intelligence: t.kd_intelligence,
            settings: 'Settings'
        };
        const greetings = {
            dashboard: t.greeting,
            journal: 'Trade Log',
            analytics: 'Performance Analysis',
            calendar: 'Schedule & Events',
            performance: 'Performance Overview',
            guardian: 'Risk Management',
            intelligence: 'AI Insights',
            settings: 'Preferences & Configuration'
        };
        if (this.pageTitle) this.pageTitle.textContent = titles[section] || 'KriptoDanik AI';
        if (this.pageGreeting) this.pageGreeting.textContent = greetings[section] || 'Good Evening';
    },

    // ===== NAVIGATION =====
    showSection(section) {
        Object.keys(this.sections).forEach(key => {
            if (this.sections[key]) {
                this.sections[key].classList.toggle('active', key === section);
            }
        });

        const t = this.translations[this.currentLang] || this.translations.ru;
        const titles = {
            dashboard: t.welcome,
            journal: 'Trade Journal',
            analytics: 'Analytics',
            calendar: 'Calendar',
            performance: 'Performance',
            guardian: 'Guardian',
            intelligence: t.kd_intelligence,
            settings: 'Settings'
        };
        const greetings = {
            dashboard: t.greeting,
            journal: 'Trade Log',
            analytics: 'Performance Analysis',
            calendar: 'Schedule & Events',
            performance: 'Performance Overview',
            guardian: 'Risk Management',
            intelligence: 'AI Insights',
            settings: 'Preferences & Configuration'
        };

        if (this.pageTitle) this.pageTitle.textContent = titles[section] || 'KriptoDanik AI';
        if (this.pageGreeting) this.pageGreeting.textContent = greetings[section] || 'Good Evening';

        if (section === 'journal') this.renderJournal();
        if (section === 'calendar') this.renderCalendar();
        if (section === 'analytics') setTimeout(() => this.updateAnalytics(), 200);
        if (section === 'performance') {
            setTimeout(() => {
                this.initPerfEquityChart();
                this.initPerfMonthlyChart();
                this.initPerfSessionsChart();
            }, 200);
        }
        if (section === 'guardian') {
            this.renderGuardian();
            setTimeout(() => this.initRiskChart(), 200);
        }

        this.navItems.forEach(n => n.classList.remove('active'));
        this.navItems.forEach(n => {
            if (n.dataset.section === section) n.classList.add('active');
        });

        // Re-apply language for new section
        this.applyLanguage();
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
            const matchSearch = !search ||
                trade.asset.toLowerCase().includes(search) ||
                trade.side.toLowerCase().includes(search) ||
                trade.result.toLowerCase().includes(search);
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
            this.journalBody.innerHTML =
                `<tr><td colspan="9" style="text-align:center;padding:48px 0;color:var(--muted);">No trades found</td></tr>`;
            this.updatePagination();
            return;
        }

        let html = '';
        pageData.forEach(trade => {
            const statusClass = trade.status;
            const statusLabel = trade.status.toUpperCase();
            const resultClass = trade.result.startsWith('+') ? 'result-positive' :
                trade.result.startsWith('-') ? 'result-negative' : 'result-pending';
            const sideClass = trade.side === 'BUY' ? 'side-buy' : 'side-sell';

            html += `
                    <tr>
                        <td>${trade.date}</td>
                        <td class="asset-cell">${trade.asset}</td>
                        <td class="${sideClass}">${trade.side}</td>
                        <td>${trade.entry}</td>
                        <td>${trade.exit}</td>
                        <td>${trade.rr}</td>
                        <td class="${resultClass}">${trade.result}</td>
                        <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                        <td><button class="delete-btn" data-id="${trade.id}" title="Delete">×</button></td>
                    </tr>
                `;
        });

        this.journalBody.innerHTML = html;

        this.journalBody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.deleteTrade(id);
            });
        });

        this.updatePagination();
    },

    updatePagination() {
        const total = this.filteredTrades.length;
        const totalPages = Math.ceil(total / this.pageSize) || 1;

        if (this.currentPageEl) this.currentPageEl.textContent = this.currentPage;
        if (this.totalPagesEl) this.totalPagesEl.textContent = '/ ' + totalPages;
        if (this.paginationInfo) {
            const start = (this.currentPage - 1) * this.pageSize + 1;
            const end = Math.min(start + this.pageSize - 1, total);
            this.paginationInfo.textContent = total > 0 ?
                `Showing ${start}-${end} of ${total} trades` :
                'No trades';
        }
        if (this.prevPageBtn) this.prevPageBtn.disabled = this.currentPage <= 1;
        if (this.nextPageBtn) this.nextPageBtn.disabled = this.currentPage >= totalPages;
        if (this.journalBadge) this.journalBadge.textContent = total;
    },

    prevPage() {
        if (this.currentPage > 1) { this.currentPage--;
            this.renderJournal(); }
    },

    nextPage() {
        const totalPages = Math.ceil(this.filteredTrades.length / this.pageSize);
        if (this.currentPage < totalPages) { this.currentPage++;
            this.renderJournal(); }
    },

    updateJournalStats() {
        const total = this.filteredTrades.length;
        const wins = this.filteredTrades.filter(t => t.status === 'win').length;
        const winRate = total > 0 ? (wins / total * 100) : 0;
        const rrValues = this.filteredTrades.map(t => parseFloat(t.rr)).filter(v => !isNaN(v));
        const avgRR = rrValues.length > 0 ? rrValues.reduce((a, b) => a + b, 0) / rrValues.length : 0;
        const totalPnL = rrValues.reduce((a, b) => a + b, 0);

        if (this.jTotalTrades) this.jTotalTrades.textContent = total;
        if (this.jWinRate) {
            this.jWinRate.textContent = winRate.toFixed(1) + '%';
            this.jWinRate.className = 'journal-stat-value ' + (winRate >= 50 ? 'positive' : 'negative');
        }
        if (this.jAvgRR) this.jAvgRR.textContent = avgRR.toFixed(1);
        if (this.jTotalPnL) {
            this.jTotalPnL.textContent = (totalPnL >= 0 ? '+' : '') + totalPnL.toFixed(1) + 'R';
            this.jTotalPnL.className = 'journal-stat-value ' + (totalPnL >= 0 ? 'positive' : 'negative');
        }
    },

    addTrade() {
        const assets = ['BTCUSDT', 'ETHUSDT', 'XAUUSD', 'EURUSD', 'SOLUSDT'];
        const sides = ['BUY', 'SELL'];
        const asset = assets[Math.floor(Math.random() * assets.length)];
        const side = sides[Math.floor(Math.random() * sides.length)];
        const entry = Math.round(30000 + Math.random() * 30000);
        const exit = Math.round(entry + (Math.random() > 0.5 ? 1 : -1) * (1000 + Math.random() * 5000));
        const rr = ((exit - entry) / (1000 + Math.random() * 2000) * 0.5 + 0.5).toFixed(1);
        const isWin = parseFloat(rr) > 0;
        const result = (isWin ? '+' : '-') + Math.abs(parseFloat(rr)).toFixed(1) + 'R';
        const status = isWin ? 'win' : 'loss';

        const newTrade = {
            id: Math.max(...this.trades.map(t => t.id), 0) + 1,
            date: new Date().toISOString().slice(0, 10),
            asset, side, entry, exit,
            rr: parseFloat(rr),
            result, status
        };

        this.trades.unshift(newTrade);
        this.filteredTrades = [...this.trades];
        this.currentPage = 1;
        this.renderJournal();
        this.updateJournalStats();
        this.updateAnalytics();
        this.showNotification('Added: ' + asset + ' ' + side + ' ' + result);
    },

    deleteTrade(id) {
        if (!confirm('Delete this trade?')) return;
        this.trades = this.trades.filter(t => t.id !== id);
        this.filteredTrades = [...this.trades];
        this.renderJournal();
        this.updateJournalStats();
        this.updateAnalytics();
        this.showNotification('Trade deleted');
    },

    // ============================================================
    // ANALYTICS
    // ============================================================

    updateAnalytics() {
        this.updateAnalyticsStats();
        this.initPNLChart();
        this.initWinRateChart();
        this.initMonthlyChart();
        this.updateMetrics();
    },

    getFilteredByPeriod() {
        const now = new Date();
        let cutoff = new Date();
        switch (this.currentPeriod) {
            case '7d':
                cutoff.setDate(now.getDate() - 7);
                break;
            case '30d':
                cutoff.setDate(now.getDate() - 30);
                break;
            case '90d':
                cutoff.setDate(now.getDate() - 90);
                break;
            case '1y':
                cutoff.setFullYear(now.getFullYear() - 1);
                break;
            default:
                return this.trades;
        }
        return this.trades.filter(t => new Date(t.date) >= cutoff);
    },

    updateAnalyticsStats() {
        const filtered = this.getFilteredByPeriod();
        const total = filtered.length;
        const wins = filtered.filter(t => t.status === 'win').length;
        const winRate = total > 0 ? (wins / total * 100) : 0;
        const rrValues = filtered.map(t => parseFloat(t.rr)).filter(v => !isNaN(v));
        const totalPnL = rrValues.reduce((a, b) => a + b, 0);
        const avgWin = rrValues.filter(v => v > 0).length > 0 ?
            rrValues.filter(v => v > 0).reduce((a, b) => a + b, 0) / rrValues.filter(v => v > 0).length : 0;
        const avgRR = rrValues.length > 0 ? rrValues.reduce((a, b) => a + b, 0) / rrValues.length : 0;
        const variance = rrValues.length > 0 ?
            rrValues.reduce((a, b) => a + Math.pow(b - avgRR, 2), 0) / rrValues.length : 0;
        const stdDev = Math.sqrt(variance);
        const sharpe = stdDev > 0 ? (avgRR / stdDev) * Math.sqrt(252) : 0;

        if (this.aTotalPnl) {
            this.aTotalPnl.textContent = (totalPnL >= 0 ? '+' : '') + totalPnL.toFixed(1) + 'R';
            this.aTotalPnl.className = 'analytics-stat-value ' + (totalPnL >= 0 ? 'positive' : 'negative');
        }
        if (this.aWinRate) {
            this.aWinRate.textContent = winRate.toFixed(1) + '%';
            this.aWinRate.className = 'analytics-stat-value ' + (winRate >= 50 ? 'positive' : 'negative');
        }
        if (this.aAvgWin) {
            this.aAvgWin.textContent = '+' + avgWin.toFixed(1) + 'R';
            this.aAvgWin.className = 'analytics-stat-value positive';
        }
        if (this.aSharpe) {
            this.aSharpe.textContent = sharpe.toFixed(2);
            this.aSharpe.className = 'analytics-stat-value ' + (sharpe >= 1.5 ? 'positive' : '');
        }
    },

    initPNLChart() {
        const canvas = document.getElementById('pnlDistributionChart');
        if (!canvas) return;
        if (this.analyticsCharts.pnl) { this.analyticsCharts.pnl.destroy(); }

        const filtered = this.getFilteredByPeriod();
        const rrValues = filtered.map(t => parseFloat(t.rr)).filter(v => !isNaN(v));
        const bins = {};
        rrValues.forEach(v => {
            const bucket = Math.floor(v * 2) / 2;
            const key = bucket.toFixed(1);
            bins[key] = (bins[key] || 0) + 1;
        });
        const labels = Object.keys(bins).sort((a, b) => parseFloat(a) - parseFloat(b));
        const data = labels.map(k => bins[k]);
        const colors = labels.map(k => parseFloat(k) >= 0 ? 'rgba(45,216,129,0.7)' : 'rgba(255,95,109,0.7)');
        const borderColors = labels.map(k => parseFloat(k) >= 0 ? '#2dd881' : '#ff5f6d');

        this.analyticsCharts.pnl = new Chart(canvas, {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Trades', data, backgroundColor: colors, borderColor: borderColors,
                    borderWidth: 2, borderRadius: 6 }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(13,16,24,0.92)',
                        borderColor: '#4f7cff', borderWidth: 1, padding: 12, titleColor: '#f4f7ff',
                        bodyColor: '#dbe6ff' } },
                scales: { x: { grid: { display: false }, ticks: { color: '#8B94A7' } },
                    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8B94A7' } } }
            }
        });
    },

    initWinRateChart() {
        const canvas = document.getElementById('winRateByAssetChart');
        if (!canvas) return;
        if (this.analyticsCharts.byAsset) { this.analyticsCharts.byAsset.destroy(); }

        const filtered = this.getFilteredByPeriod();
        const assets = {};
        filtered.forEach(t => {
            if (!assets[t.asset]) assets[t.asset] = { wins: 0, total: 0 };
            assets[t.asset].total++;
            if (t.status === 'win') assets[t.asset].wins++;
        });
        const labels = Object.keys(assets);
        const data = labels.map(a => (assets[a].wins / assets[a].total) * 100);
        const colors = data.map(v => v >= 60 ? 'rgba(45,216,129,0.7)' : v >= 40 ? 'rgba(255,181,71,0.7)' :
            'rgba(255,95,109,0.7)');

        this.analyticsCharts.byAsset = new Chart(canvas, {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Win Rate %', data, backgroundColor: colors, borderColor: colors.map(c =>
                        c.replace('0.7', '1')), borderWidth: 2, borderRadius: 6 }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(13,16,24,0.92)',
                        borderColor: '#4f7cff', borderWidth: 1, padding: 12, titleColor: '#f4f7ff',
                        bodyColor: '#dbe6ff', callbacks: { label: function(context) { return context.parsed.y
                                .toFixed(1) + '%'; } } } },
                scales: { x: { grid: { display: false }, ticks: { color: '#8B94A7' } },
                    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8B94A7', callback: function(
                            value) { return value + '%'; } }, min: 0, max: 100 } }
            }
        });
    },

    initMonthlyChart() {
        const canvas = document.getElementById('monthlyPerformanceChart');
        if (!canvas) return;
        if (this.analyticsCharts.monthly) { this.analyticsCharts.monthly.destroy(); }

        const filtered = this.getFilteredByPeriod();
        const monthly = {};
        filtered.forEach(t => {
            const month = t.date.slice(0, 7);
            if (!monthly[month]) monthly[month] = 0;
            monthly[month] += parseFloat(t.rr) || 0;
        });
        const labels = Object.keys(monthly).sort();
        const data = labels.map(m => monthly[m]);
        const isRR = this.toggleViewBtn?.textContent === 'Switch to $';

        this.analyticsCharts.monthly = new Chart(canvas, {
            type: 'bar',
            data: { labels, datasets: [{ label: isRR ? 'P&L (R)' : 'Monthly P&L', data, backgroundColor: data.map(v =>
                        v >= 0 ? 'rgba(45,216,129,0.7)' : 'rgba(255,95,109,0.7)'), borderColor: data.map(v => v >=
                        0 ? '#2dd881' : '#ff5f6d'), borderWidth: 2, borderRadius: 6 }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(13,16,24,0.92)',
                        borderColor: '#4f7cff', borderWidth: 1, padding: 12, titleColor: '#f4f7ff',
                        bodyColor: '#dbe6ff', callbacks: { label: function(context) { return (context.parsed.y >=
                                0 ? '+' : '') + context.parsed.y.toFixed(1) + (isRR ? 'R' : ''); } } } },
                scales: { x: { grid: { display: false }, ticks: { color: '#8B94A7' } },
                    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8B94A7' } } }
            }
        });
    },

    updateMetrics() {
        if (!this.metricsGrid) return;
        const filtered = this.getFilteredByPeriod();
        const total = filtered.length;
        const wins = filtered.filter(t => t.status === 'win').length;
        const losses = filtered.filter(t => t.status === 'loss').length;
        const rrValues = filtered.map(t => parseFloat(t.rr)).filter(v => !isNaN(v));
        const avgRR = rrValues.length > 0 ? rrValues.reduce((a, b) => a + b, 0) / rrValues.length : 0;
        const profitFactor = rrValues.filter(v => v > 0).reduce((a, b) => a + b, 0) /
            Math.abs(rrValues.filter(v => v < 0).reduce((a, b) => a + b, 0) || 1);

        let maxDrawdown = 0,
            peak = 0,
            runningTotal = 0;
        rrValues.forEach(v => { runningTotal += v; if (runningTotal > peak) peak = runningTotal; const dd = peak -
                runningTotal; if (dd > maxDrawdown) maxDrawdown = dd; });

        let maxCW = 0,
            maxCL = 0,
            cw = 0,
            cl = 0;
        filtered.forEach(t => {
            if (t.status === 'win') { cw++;
                cl = 0; if (cw > maxCW) maxCW = cw; } else { cl++;
                cw = 0; if (cl > maxCL) maxCL = cl; }
        });

        const sorted = [...rrValues].sort((a, b) => a - b);
        const metrics = [
            { label: 'Total Trades', value: total, cls: '' },
            { label: 'Winning Trades', value: wins, cls: 'positive' },
            { label: 'Losing Trades', value: losses, cls: 'negative' },
            { label: 'Win/Loss Ratio', value: (losses > 0 ? (wins / losses).toFixed(2) : '∞'), cls: '' },
            { label: 'Profit Factor', value: profitFactor.toFixed(2), cls: profitFactor >= 1.5 ? 'positive' :
                    'negative' },
            { label: 'Max Drawdown', value: '-' + maxDrawdown.toFixed(1) + 'R', cls: 'negative' },
            { label: 'Avg Trade', value: (avgRR >= 0 ? '+' : '') + avgRR.toFixed(2) + 'R', cls: avgRR >= 0 ?
                    'positive' : 'negative' },
            { label: 'Best Trade', value: '+' + (sorted[sorted.length - 1] || 0).toFixed(1) + 'R', cls: 'positive' },
            { label: 'Worst Trade', value: (sorted[0] || 0).toFixed(1) + 'R', cls: 'negative' },
            { label: 'Consecutive Wins', value: maxCW, cls: 'positive' },
            { label: 'Consecutive Losses', value: maxCL, cls: 'negative' },
            { label: 'Sharpe Ratio', value: '2.14', cls: 'positive' }
        ];

        let html = '';
        metrics.forEach(m => {
            html +=
                `<div class="metric-item"><span class="metric-label">${m.label}</span><span class="metric-value ${m.cls}">${m.value}</span></div>`;
        });
        this.metricsGrid.innerHTML = html;
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
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
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
            html += `<div class="calendar-day other-month">${prevDay}</div>`;
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(year, month, d);
            const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = d === this.selectedDate.getDate() && month === this.selectedDate.getMonth() &&
                year === this.selectedDate.getFullYear();
            const dayEvents = this.getEventsForDate(dateObj);
            let cls = 'calendar-day';
            if (isToday) cls += ' today';
            if (isSelected) cls += ' selected';
            if (dayEvents.length > 0) cls += ' has-event';

            let dotsHtml = '';
            if (dayEvents.length > 0) {
                const types = [...new Set(dayEvents.map(e => e.type))];
                dotsHtml = '<div class="day-events">';
                types.slice(0, 3).forEach(type => {
                    dotsHtml += `<span class="day-event-dot ${type}"></span>`;
                });
                if (types.length > 3) {
                    dotsHtml += `<span class="day-event-dot" style="background:var(--muted);">+</span>`;
                }
                dotsHtml += '</div>';
            }

            html +=
                `<div class="${cls}" data-date="${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}">${d}${dotsHtml}</div>`;
        }

        this.calendarGrid.innerHTML = html;

        this.calendarGrid.querySelectorAll('.calendar-day:not(.other-month)').forEach(el => {
            el.addEventListener('click', () => {
                const parts = el.dataset.date.split('-');
                this.selectedDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                this.renderCalendar();
                this.renderEvents();
            });
        });

        this.renderEvents();
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

        this.selectedDateLabel.textContent =
            monthNames[this.selectedDate.getMonth()] + ' ' +
            this.selectedDate.getDate() + ', ' +
            this.selectedDate.getFullYear();

        this.eventsCount.textContent = eventsForDate.length + ' events';

        if (eventsForDate.length === 0) {
            this.eventsList.innerHTML = `<div class="no-events">No events for this day</div>`;
            return;
        }

        let html = '';
        eventsForDate.forEach(event => {
            const colorMap = { trade: 'green', alert: 'orange', meeting: 'primary', analysis: 'primary2',
                break: 'muted' };
            html += `
                    <div class="event-item" style="border-left-color: var(--${colorMap[event.type] || 'primary'});">
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
                this.deleteEvent(id);
            });
        });
    },

    addEvent() {
        const title = this.eventInput?.value?.trim();
        const type = this.eventType?.value || 'trade';
        if (!title) { this.showNotification('Please enter an event title'); return; }

        const newEvent = {
            id: Math.max(...this.events.map(e => e.id), 0) + 1,
            date: new Date(this.selectedDate),
            title,
            type
        };
        this.events.push(newEvent);
        if (this.eventInput) this.eventInput.value = '';
        this.renderCalendar();
        this.updateCalendarBadge();
        this.showNotification('Event added: ' + title);
    },

    deleteEvent(id) {
        if (!confirm('Delete this event?')) return;
        this.events = this.events.filter(e => e.id !== id);
        this.renderCalendar();
        this.updateCalendarBadge();
        this.showNotification('Event deleted');
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
    // PERFORMANCE
    // ============================================================

    initPerfEquityChart() {
        const canvas = document.getElementById('perfEquityChart');
        if (!canvas) return;
        if (this.performanceCharts.equity) { this.performanceCharts.equity.destroy(); }

        const periods = {
            'Week': [82000, 88000, 86000, 95000, 102000, 108000, 115000],
            'Month': [82000, 88000, 95000, 102000, 112000, 118000, 125000],
            'Year': [82000, 88000, 102000, 118000, 135000, 142000, 148000]
        };
        const period = this.perfPeriodBtn?.textContent || 'Month';
        const data = periods[period] || periods['Month'];

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(79,124,255,0.3)');
        gradient.addColorStop(1, 'rgba(79,124,255,0)');

        this.performanceCharts.equity = new Chart(canvas, {
            type: 'line',
            data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Equity',
                    data, borderColor: '#4f7cff', backgroundColor: gradient, borderWidth: 3, pointRadius: 4,
                    pointBackgroundColor: '#4f7cff', pointBorderColor: '#fff', pointBorderWidth: 2,
                    tension: 0.4, fill: true }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(13,16,24,0.92)',
                        borderColor: '#4f7cff', borderWidth: 1, padding: 12, titleColor: '#f4f7ff',
                        bodyColor: '#dbe6ff', callbacks: { label: function(ctx) { return '$' + ctx.parsed.y
                                .toLocaleString(); } } } },
                scales: { x: { grid: { display: false }, ticks: { color: '#8B94A7' } },
                    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8B94A7', callback: function(
                                v) { return '$' + (v / 1000).toFixed(0) + 'k'; } } } }
            }
        });
    },

    initPerfMonthlyChart() {
        const canvas = document.getElementById('perfMonthlyChart');
        if (!canvas) return;
        if (this.performanceCharts.monthly) { this.performanceCharts.monthly.destroy(); }

        const monthly = {};
        this.trades.forEach(t => {
            const month = t.date.slice(0, 7);
            if (!monthly[month]) monthly[month] = 0;
            monthly[month] += parseFloat(t.rr) || 0;
        });
        const labels = Object.keys(monthly).sort();
        const data = labels.map(m => monthly[m]);

        this.performanceCharts.monthly = new Chart(canvas, {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Monthly P&L (R)', data, backgroundColor: data.map(v => v >= 0 ?
                        'rgba(45,216,129,0.7)' : 'rgba(255,95,109,0.7)'), borderColor: data.map(v => v >= 0 ?
                        '#2dd881' : '#ff5f6d'), borderWidth: 2, borderRadius: 6 }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(13,16,24,0.92)',
                        borderColor: '#4f7cff', borderWidth: 1, padding: 12, titleColor: '#f4f7ff',
                        bodyColor: '#dbe6ff', callbacks: { label: function(ctx) { return (ctx.parsed.y >= 0 ?
                                '+' : '') + ctx.parsed.y.toFixed(1) + 'R'; } } } },
                scales: { x: { grid: { display: false }, ticks: { color: '#8B94A7' } },
                    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8B94A7' } } }
            }
        });
    },

    initPerfSessionsChart() {
        const canvas = document.getElementById('perfSessionsChart');
        if (!canvas) return;
        if (this.performanceCharts.sessions) { this.performanceCharts.sessions.destroy(); }

        const sessions = ['London', 'New York', 'Asian', 'Sydney'];
        const data = [4.2, 3.8, 2.1, 1.5];

        this.performanceCharts.sessions = new Chart(canvas, {
            type: 'bar',
            data: { labels: sessions, datasets: [{ label: 'Performance (R)', data, backgroundColor: [
                        'rgba(79,124,255,0.7)', 'rgba(108,99,255,0.7)', 'rgba(45,216,129,0.7)',
                        'rgba(255,181,71,0.7)'
                    ], borderColor: ['#4f7cff', '#6c63ff', '#2dd881', '#ffb547'], borderWidth: 2,
                    borderRadius: 6 }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(13,16,24,0.92)',
                        borderColor: '#4f7cff', borderWidth: 1, padding: 12, titleColor: '#f4f7ff',
                        bodyColor: '#dbe6ff', callbacks: { label: function(ctx) { return ctx.parsed.y.toFixed(
                                1) + 'R'; } } } },
                scales: { x: { grid: { display: false }, ticks: { color: '#8B94A7' } },
                    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8B94A7' } } }
            }
        });

        if (this.sessionDetails) {
            const details = [
                { name: 'London Session', value: 4.2, wr: 72 },
                { name: 'New York Session', value: 3.8, wr: 68 },
                { name: 'Asian Session', value: 2.1, wr: 55 },
                { name: 'Sydney Session', value: 1.5, wr: 48 }
            ];
            let html = '';
            details.forEach(s => {
                const cls = s.value >= 0 ? 'positive' : 'negative';
                html +=
                    `<div class="session-detail-item"><span class="session-name">${s.name}</span><span><span class="session-value ${cls}">${(s.value >= 0 ? '+' : '') + s.value.toFixed(1)}R</span><span style="color:var(--muted);font-size:12px;margin-left:8px;">(${s.wr}% WR)</span></span></div>`;
            });
            this.sessionDetails.innerHTML = html;
        }

        if (this.benchmarksGrid) {
            const benchmarks = [
                { name: 'S&P 500', value: '+8.4%', diff: '+4.2%' },
                { name: 'Nasdaq', value: '+12.1%', diff: '+8.6%' },
                { name: 'BTC', value: '+15.2%', diff: '+12.4%' },
                { name: 'ETH', value: '+9.8%', diff: '+6.1%' },
                { name: 'Gold', value: '+5.2%', diff: '+1.5%' },
                { name: 'EUR/USD', value: '-2.1%', diff: '-5.8%' }
            ];
            let html = '';
            benchmarks.forEach(b => {
                const isPos = b.diff.startsWith('+');
                html +=
                    `<div class="benchmark-item"><span class="benchmark-name">${b.name}</span><span class="benchmark-value ${b.value.startsWith('+') ? 'positive' : 'negative'}">${b.value}</span><span class="benchmark-diff ${isPos ? 'positive' : 'negative'}">${b.diff} vs you</span></div>`;
            });
            this.benchmarksGrid.innerHTML = html;
        }
    },

    // ============================================================
    // GUARDIAN
    // ============================================================

    renderGuardian() {
        this.renderRules();
        this.renderViolations();
        this.renderRecommendations();
        this.updateRiskMeter();
        this.updateGuardianStats();
    },

    renderRules() {
        if (!this.rulesList) return;
        let html = '';
        this.guardianRules.forEach(rule => {
            const passed = rule.passed;
            html += `
                    <div class="rule-item">
                        <span class="rule-icon ${passed ? 'passed' : 'failed'}">${passed ? '✓' : '✗'}</span>
                        <span class="rule-name">${rule.name}</span>
                        <span class="rule-status ${passed ? 'passed' : 'failed'}">${passed ? 'Passed' : 'Failed'}</span>
                    </div>
                `;
        });
        this.rulesList.innerHTML = html;
    },

    renderViolations() {
        if (!this.violationsList) return;
        if (this.guardianViolations.length === 0) {
            this.violationsList.innerHTML =
                `<div class="no-violations">No violations recorded. Keep it up!</div>`;
            if (this.violationsCount) this.violationsCount.textContent = '0 violations';
            return;
        }
        let html = '';
        this.guardianViolations.forEach(v => {
            html +=
                `<div class="violation-item"><span class="violation-icon">⚠</span><span class="violation-text">${v.text}</span><span class="violation-date">${v.date}</span></div>`;
        });
        this.violationsList.innerHTML = html;
        if (this.violationsCount) this.violationsCount.textContent = this.guardianViolations.length + ' violations';
    },

    renderRecommendations() {
        if (!this.recommendationsList) return;
        const recs = [
            { icon: '🎯', title: 'Maintain 1% risk per trade',
                description: 'Your current risk is 0.75% — well within limits.' },
            { icon: '📊', title: 'Review losing trades',
                description: 'Your last 3 losses averaged -1.2R. Check entry timing.' },
            { icon: '🛡', title: 'Set daily loss limit',
                description: 'Consider setting a daily loss limit of $1,500.' },
            { icon: '📈', title: 'Focus on winning assets',
                description: 'BTC and XAU show the highest win rates.' }
        ];
        const shuffled = recs.sort(() => Math.random() - 0.5).slice(0, 3);
        let html = '';
        shuffled.forEach(rec => {
            html += `
                    <div class="recommendation-item">
                        <span class="rec-icon">${rec.icon}</span>
                        <div class="rec-content">
                            <div class="rec-title">${rec.title}</div>
                            <div class="rec-description">${rec.description}</div>
                        </div>
                    </div>
                `;
        });
        this.recommendationsList.innerHTML = html;
    },

    updateRiskMeter() {
        const levels = ['low', 'low', 'moderate', 'low', 'low'];
        const level = levels[Math.floor(Math.random() * levels.length)];
        if (this.riskLevel) {
            this.riskLevel.textContent = level.toUpperCase();
            this.riskLevel.className = 'risk-level ' + level;
        }
        const percentages = { low: 25, moderate: 50, high: 75, critical: 95 };
        if (this.riskMeterFill) this.riskMeterFill.style.width = percentages[level] + '%';
    },

    updateGuardianStats() {
        if (this.gRiskPerTrade) this.gRiskPerTrade.textContent = (0.5 + Math.random() * 0.5).toFixed(2) + '%';
        if (this.gLossLimit) this.gLossLimit.textContent = '$' + (1000 + Math.random() * 2000).toFixed(0);
        if (this.gDailyLimit) this.gDailyLimit.textContent = '$' + (500 + Math.random() * 1000).toFixed(0);
        if (this.gPlanStatus) this.gPlanStatus.textContent = (95 + Math.random() * 5).toFixed(0) + '%';
        if (this.gDiscipline) this.gDiscipline.textContent = (90 + Math.random() * 8).toFixed(0) + '%';
        if (this.gMaxTrades) this.gMaxTrades.textContent = Math.floor(2 + Math.random() * 3) + ' / 5';
    },

    initRiskChart() {
        const canvas = document.getElementById('riskDistributionChart');
        if (!canvas) return;
        if (this.guardianCharts.distribution) { this.guardianCharts.distribution.destroy(); }

        const assets = ['BTC', 'ETH', 'XAU', 'EUR', 'SOL'];
        const risks = [35, 20, 25, 12, 8];
        const colors = ['#4f7cff', '#6c63ff', '#2dd881', '#ffb547', '#ff5f6d'];

        this.guardianCharts.distribution = new Chart(canvas, {
            type: 'doughnut',
            data: { labels: assets, datasets: [{ data: risks, backgroundColor: colors.map(c => c + '99'),
                    borderColor: colors, borderWidth: 2, borderRadius: 4 }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#8B94A7', font: { size: 11,
                                family: 'Inter' }, padding: 16 } },
                    tooltip: { backgroundColor: 'rgba(13,16,24,0.92)', borderColor: '#4f7cff', borderWidth: 1,
                        padding: 12, titleColor: '#f4f7ff', bodyColor: '#dbe6ff', callbacks: { label: function(
                                ctx) { return ctx.label + ': ' + ctx.parsed + '%'; } } }
                }
            }
        });
    },

    // ============================================================
    // AI CHAT
    // ============================================================

    handleAIQuery() {
        const question = this.aiInput?.value?.trim();
        if (!question) {
            if (this.aiResponse) this.aiResponse.textContent = 'Please enter a question.';
            return;
        }

        if (this.aiResponse) this.aiResponse.textContent = 'Analyzing...';

        const responses = [
            'Your risk per trade is at 0.75% — well within limits. Continue this discipline.',
            'BTC showing strength. Consider entering long on break above 66K, target 68K.',
            'Risk management is solid. Daily limit not reached — you can continue trading.',
            'Market is overheated. Consider reducing position size to 0.5% per trade.',
            'Your trading plan execution is excellent. Discipline score: 96% — keep it up!',
            'European session shows best volatility. Focus on EUR pairs.'
        ];

        setTimeout(() => {
            if (this.aiResponse) {
                this.aiResponse.textContent = responses[Math.floor(Math.random() * responses.length)];
            }
            if (this.aiInput) this.aiInput.value = '';
        }, 800);
    },

    // ============================================================
    // MARKET UPDATES
    // ============================================================

    marketData: [
        { bias: 'Bullish', conf: '91%', rec: 'Wait for liquidity sweep', risk: 'Low',
            text: 'BTC showing strength above 65.4K. Potential move to 68K–70K if support holds.' },
        { bias: 'Bearish', conf: '76%', rec: 'Take profits', risk: 'Medium',
            text: 'BTC facing resistance at 66K. Possible correction to 62K.' },
        { bias: 'Neutral', conf: '68%', rec: 'Wait for breakout', risk: 'Low',
            text: 'Market consolidating. Wait for a breakout in either direction.' },
        { bias: 'Bullish', conf: '94%', rec: 'Enter long', risk: 'Low',
            text: 'BTC broke resistance. Target 70K, stop 63K.' }
    ],
    marketIndex: 0,

    updateMarket() {
        const data = this.marketData[this.marketIndex % this.marketData.length];
        this.marketIndex++;

        if (this.marketBias) {
            this.marketBias.textContent = data.bias;
            this.marketBias.className = 'market-value ' +
                (data.bias === 'Bullish' ? 'positive' : data.bias === 'Bearish' ? 'negative' : '');
        }
        if (this.confidenceDisplay) this.confidenceDisplay.textContent = data.conf;
        if (this.recommendationDisplay) this.recommendationDisplay.textContent = data.rec;
        if (this.riskDisplay) {
            this.riskDisplay.textContent = data.risk;
            this.riskDisplay.className = 'market-value ' + (data.risk === 'Low' ? 'positive' : 'warning');
        }
        if (this.analysisText) this.analysisText.textContent = data.text;
    },

    // ============================================================
    // DATA EXPORT/IMPORT
    // ============================================================

    exportTrades() {
        const headers = ['Date', 'Asset', 'Side', 'Entry', 'Exit', 'RR', 'Result', 'Status'];
        const rows = this.trades.map(t => [t.date, t.asset, t.side, t.entry, t.exit, t.rr, t.result, t.status]);
        let csv = headers.join(',') + '\n';
        rows.forEach(row => { csv += row.join(',') + '\n'; });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'trades_' + new Date().toISOString().slice(0, 10) + '.csv';
        a.click();
        URL.revokeObjectURL(url);
        this.showNotification('Trades exported (CSV)');
    },

    exportJournal() {
        const data = JSON.stringify(this.trades, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'journal_' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        URL.revokeObjectURL(url);
        this.showNotification('Journal exported (JSON)');
    },

    exportAll() {
        const data = { trades: this.trades, events: this.events, exportedAt: new Date().toISOString() };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kriptodanik_backup_' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        URL.revokeObjectURL(url);
        this.showNotification('All data exported');
    },

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.csv';
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
                        this.renderJournal();
                        this.updateJournalStats();
                        this.updateAnalytics();
                        this.showNotification('Data imported successfully!');
                    }
                } catch (err) {
                    this.showNotification('Invalid file format');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },

    clearAllData() {
        if (!confirm('⚠️ This will permanently delete ALL your data. Are you sure?')) return;
        if (!confirm('⚠️ FINAL WARNING: This action cannot be undone!')) return;
        this.trades = [];
        this.filteredTrades = [];
        this.events = [];
        this.guardianViolations = [];
        this.renderJournal();
        this.updateJournalStats();
        this.renderCalendar();
        this.updateCalendarBadge();
        this.renderGuardian();
        this.updateAnalytics();
        this.showNotification('All data cleared');
    },

    // ============================================================
    // EQUITY CHART (Dashboard)
    // ============================================================

    initEquityChart() {
        const canvas = document.getElementById('equityChart');
        if (!canvas) return;
        if (this.equityChartInstance) { this.equityChartInstance.destroy(); }

        const periods = {
            'Week': [82000, 88000, 86000, 95000, 102000, 108000, 115000],
            'Month': [82000, 88000, 95000, 102000, 112000, 118000, 125000],
            'Year': [82000, 88000, 102000, 118000, 135000, 142000, 148000]
        };
        const period = this.periodBtn?.textContent || 'Week';
        const data = periods[period] || periods['Week'];

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(79,124,255,0.3)');
        gradient.addColorStop(1, 'rgba(79,124,255,0)');

        this.equityChartInstance = new Chart(canvas, {
            type: 'line',
            data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Equity',
                    data, borderColor: '#4f7cff', backgroundColor: gradient, borderWidth: 3, pointRadius: 4,
                    pointBackgroundColor: '#4f7cff', pointBorderColor: '#fff', pointBorderWidth: 2,
                    tension: 0.4, fill: true }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(13,16,24,0.92)',
                        borderColor: '#4f7cff', borderWidth: 1, padding: 12, titleColor: '#f4f7ff',
                        bodyColor: '#dbe6ff', callbacks: { label: function(ctx) { return '$' + ctx.parsed.y
                                .toLocaleString(); } } } },
                scales: { x: { grid: { display: false }, ticks: { color: '#8B94A7' } },
                    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8B94A7', callback: function(
                                v) { return '$' + (v / 1000).toFixed(0) + 'k'; } } } }
            }
        });
    },

    // ============================================================
    // RENDER ALL
    // ============================================================

    renderAll() {
        this.renderJournal();
        this.updateJournalStats();
        this.renderCalendar();
        this.updateCalendarBadge();
        this.renderGuardian();
        this.updateAnalytics();
        this.initEquityChart();

        setTimeout(() => {
            this.initPerfEquityChart();
            this.initPerfMonthlyChart();
            this.initPerfSessionsChart();
        }, 300);

        setTimeout(() => this.initRiskChart(), 400);

        this.updateMarket();
        setInterval(() => this.updateMarket(), 5000);

        // Apply language after render
        this.applyLanguage();

        console.log('All sections rendered.');
    },

    // ============================================================
    // NOTIFICATIONS
    // ============================================================

    showNotification(message) {
        const old = document.querySelector('.toast');
        if (old) old.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

window.App = App;