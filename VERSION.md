# KriptoDanik AI v1.0.6 — UX Polish & First User Experience

This version does not add new features. It turns v1.0.5 from a prototype
with hardcoded demo content into an application that starts genuinely
empty and only ever displays real user activity.

## 1. First user experience
- Page header now reads "Welcome, {UserName}" (was "Welcome back, Danik").
- Fixed a second, separate spot with the same issue: the AI Coach's
  welcome card (shown when opening the AI Coach section) also said
  "Welcome back" / "Добро пожаловать обратно" — changed to "Welcome" /
  "Добро пожаловать". A brand-new user should never see "back" language
  anywhere in the app.
- After onboarding, the app no longer opens straight to the Dashboard.
  It shows an AI Coach greeting followed by an interactive product tour
  that highlights each nav item in turn (Dashboard, Journal, Calendar,
  Academy, Strategy Library, Market Pulse, Analytics, Performance,
  Guardian, AI Coach, Settings) with a short explanation of what it is,
  why it exists, and when you'd use it. The Dashboard only opens once
  the tour is finished.
- The tour ends with: "Enjoy using KriptoDanik AI." followed by the
  permanent disclaimer ("not a financial advisor, no signals, no market
  predictions — helps you follow your own strategy and discipline").
  That same disclaimer is now also pinned above the AI Coach chat at
  all times, not just shown once during the tour.

## 2. Removed all demo/fake data
- Trades, calendar events, Guardian violation history, and the
  dashboard's "R-distribution", "Best Trading Time", and "Asset
  distribution" panels were previously 100% hardcoded static HTML.
  All of it is gone. A brand-new account starts completely empty.
- **Post-release fix:** found and fixed two real bugs that made Guardian
  still show fabricated-looking data for a zero-trade account even after
  the seed-data removal above:
  1. `initGuardianChart()` (the "Дисциплина по дням" chart) defaulted
     every day with no trades to a score of 100 and always drew a full
     7-day line — regardless of whether the user had ever placed a
     trade. It now shows a real empty state when there are zero trades,
     and plots a genuine gap (no point) for any day with no trades even
     once real data exists.
  2. `updateGuardianStats()`'s zero-trades branch cleared the wrong DOM
     element (`guardianRulesList` instead of `guardianTimeline`), so if
     a trade was ever added and later deleted in the same session, the
     old "История" (History) entry stayed stuck on screen — while the
     history counter correctly reset to 0. Now both elements are
     properly cleared to their real empty state whenever trades drop to
     zero, including after "Clear All Data".
- Removed a fabricated Guardian timeline entry ("5-day streak" shown
  even when no such streak existed) and the modulo-based fake event
  padding that used to pad the Guardian history out to 3+ entries.
- Removed the notification center's synthetic "everything's fine" 
  fallback. An empty notification list now genuinely renders "No
  notifications yet."
- Fixed an inverted-logic bug in Guardian's recommendation panel that
  displayed "Enough data for recommendations" when there was, in fact,
  not enough data.

## 3. Dynamic balance
- Account balance is now always starting capital + sum of all trade P&L,
  recalculated after every add/edit/delete, and reflected in the header
  balance, Settings, and the equity chart.

## 4. Dashboard, Analytics, Performance — real data, honest empty states
- Equity chart now plots real cumulative balance over real trades
  (was a hardcoded 7-point fake series). Shows "No equity data yet"
  until the first trade is logged.
- "Best Trading Time" is computed from each trade's actual recorded
  session (London/NY/Asian/Sydney) rather than displaying a fabricated
  hour-by-hour heatmap with no underlying data. Requires 5+ trades
  before showing a conclusion; otherwise shows "Not enough trading
  history" plus an explanation of what the panel means once it has data.
- Fixed a related bug in Performance's session chart, which derived an
  "hour of day" from a date-only string (always meaningless/wrong) —
  now uses the same real session field.
- Analytics and Performance sections show a dedicated "no data yet"
  banner and dim their KPI grid until real trades exist.

## 5. AI Coach (renamed from "AI Assistant")
- Replaced the previous engine, which returned one of four fixed
  paragraphs at random regardless of what was asked, with a topic-aware
  coach: it classifies the question (risk, psychology, discipline,
  strategy, mistakes, sessions, stats, or a buy/sell request) and always
  grounds its answer in the user's real journal data — win rate, average
  RR, streaks, Guardian violations, best session — rather than canned,
  unrelated text.
- Explicitly refuses buy/sell/market-direction requests with a short
  explanation of what it does instead, every time, regardless of phrasing.
- No backend LLM is wired up (this remains a static front-end app with
  no server) — see the comment block above getCoachStats() in app.js
  for exactly where to swap in a real inference call later.

## 6. Settings — now actually functional
- Dark/Light theme and 5 accent colors apply instantly on click (CSS
  variables via data-theme/data-accent attributes) and persist.
- Language (RU/EN) switches instantly, including previously-skipped
  dashboard and journal-stat labels (removed an old exclusion that
  silently prevented those from translating).
- Fixed the "Welcome, {name}" header losing its span binding when
  translated.

## 7. Profile & avatar
- Real avatar upload/replace (client-side, base64, 2MB cap, image-type
  validated) in both the header and Settings, replacing the hardcoded
  "KD" initials. Falls back to the user's real first-initial when no
  photo is set.

## 8. Roadmap placeholders (prepared, not implemented)
- Academy, Strategy Library, and Market Pulse appear as disabled
  "Soon" items in the sidebar and are introduced (as coming-soon) in
  the product tour, per the instruction to prepare architecture without
  building the features yet. Challenges, Prop Firm Mode, and an
  Advanced AI Coach are not yet represented in the UI and remain purely
  a future-version note in this file.

## Explicitly not done in this version
- No backend / real LLM integration for AI Coach (out of scope for a
  static front-end app).
- No Stop-Loss field exists on the trade form, so the "Stop Loss always
  set" Guardian rule cannot be checked against real data yet and passes
  by default — this needs a new form field in a future version rather
  than being faked.

## Files
- index.html
- style.css
- app.js
- chart.js (unchanged)
