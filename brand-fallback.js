(function () {
'use strict';

// Safe fallback loaded before app.js.
// The real branded Dashboard synchronizer is installed by app.js.
// This file must always be valid JavaScript.

window.KDRefreshBrandDashboard =
    window.KDRefreshBrandDashboard ||
    function () {
        try {
            if (
                window.App &&
                typeof window.App.updateDashboardStats === 'function'
            ) {
                window.App.updateDashboardStats();
            }
        } catch (e) {
            console.warn('KriptoDanik brand fallback:', e);
        }
    };

})();
