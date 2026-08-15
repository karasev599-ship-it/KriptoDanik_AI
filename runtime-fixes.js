(function () {
'use strict';

function fixProfile() {
    try {
        const raw = localStorage.getItem('kriptodanik_state');
        if (!raw) return;

        const state = JSON.parse(raw);
        const user = state.userData || {};
        const name = String(user.name || '').trim();

        if (name) {
            const coach = document.getElementById('brandCoachName');
            if (coach) coach.textContent = name;

            const header = document.getElementById('userNameDisplay');
            if (header) header.textContent = name;
        }

        if (typeof App !== 'undefined') {
            if (name && App.userData) {
                App.userData.name = name;
            }

            App.getCurrentBalance = function () {
                const start =
                    Number.parseFloat(this.userData?.capital) || 0;

                const pnl = (this.trades || []).reduce((sum, trade) => {
                    const value =
                        typeof trade.pnl === 'number' && Number.isFinite(trade.pnl)
                            ? trade.pnl
                            : Number.parseFloat(trade.pnl) || 0;

                    return sum + value;
                }, 0);

                return start + pnl;
            };

            if (typeof App.updateBalanceDisplay === 'function') {
                App.updateBalanceDisplay();
            }
        }
    } catch (e) {
        console.warn('KriptoDanik runtime profile fix:', e);
    }
}

function ensureDashboardVisible() {
    try {
        if (typeof App === 'undefined') return;
        if (typeof App.showSection !== 'function') return;

        const active = document.querySelector('.section-content.active');

        // Never interrupt normal navigation.
        // Recover only when the application has no visible section at all.
        if (!active) {
            console.warn('KriptoDanik: no active section detected — restoring Dashboard.');

            App.showSection('dashboard');
        }
    } catch (e) {
        console.warn('KriptoDanik dashboard recovery:', e);

        const dashboard = document.getElementById('section-dashboard');

        if (dashboard) {
            document.querySelectorAll('.section-content')
                .forEach(section => section.classList.remove('active'));

            dashboard.classList.add('active');

            document.querySelectorAll('.nav-item')
                .forEach(item => item.classList.toggle(
                    'active',
                    item.dataset.section === 'dashboard'
                ));
        }
    }
}

function bootFixes() {
    fixProfile();

    // App.init() runs before this script, so this is the final safety net.
    ensureDashboardVisible();

    setTimeout(fixProfile, 500);
    setTimeout(ensureDashboardVisible, 500);

    setTimeout(fixProfile, 1500);
    setTimeout(ensureDashboardVisible, 1500);
}

document.addEventListener('DOMContentLoaded', bootFixes);

window.addEventListener('pageshow', event => {
    // Only recover BFCache restores if the page came back with no section.
    if (event.persisted) {
        setTimeout(ensureDashboardVisible, 0);
    }
});

})();
