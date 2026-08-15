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
        console.warn('KriptoDanik runtime fix:', e);
    }
}

document.addEventListener('DOMContentLoaded', fixProfile);
setTimeout(fixProfile, 500);
setTimeout(fixProfile, 1500);
})();
