# KriptoDanik AI v1.0.5 — Onboarding & First-Use Experience Complete

## Included (on top of v1.0.4)
- First Launch Wizard: replaced the single-screen onboarding with a 4-step
  wizard (progress bar, step counter, Back/Next, per-step validation):
    1. Name
    2. Initial Balance, Risk/Trade, Daily Profit Goal, Max Daily Loss, Preferred RR
    3. Preferred Session, Favorite Markets, Favorite Assets
    4. Personal Trading Strategy (free text) + philosophy statement
       ("not a signal provider, not a prediction engine")
- All wizard fields reuse the exact same userData keys the existing
  Settings -> Trading tab already writes (capital, risk, dailyLoss,
  dailyTarget, rr, session) so there is one source of truth, not two
  parallel profile systems. New keys added: markets, assets, strategy.
- Dashboard: the "Daily Goal / Max Loss / Risk per Trade" cards were
  100% hardcoded static HTML before this version (a real, confirmed gap)
  - now populated from real userData. Added a new "Trading Profile" panel
  (Preferred RR, Session, Today's Progress bar) computed from real
  trades' pnl for the current day.
- Settings -> Trading Profile: added "Reset Trading Profile", which
  clears ONLY userData + onboardingDone and re-opens the wizard. Verified
  it does not touch trades/events/guardianRules/aiHistory.

## Explicitly NOT changed in this version (per approved scope)
- AI Coach logic — untouched. The new `strategy` field is stored in
  userData but NOT yet wired into AI Coach's responses (see report:
  the ticket's own text conflicted with its architecture constraint,
  flagged rather than resolved unilaterally).
- Journal, Calendar, Analytics, Performance, Guardian — no logic changes.

## Files
- index.html
- style.css
- app.js
- chart.js (unchanged since v1.0.1)
