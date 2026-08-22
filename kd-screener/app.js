"use strict";

/* KD SCREENER — base market-data layer.
   No trading signals are implemented here intentionally. */
const state = {
  symbol: "XAUUSD",
  intervalMs: 1000,
  ticks: 0,
  candles: [],
  current: null,
  previous: null,
  lastPrice: null,
  source: "DEMO"
};

const $ = (id) => document.getElementById(id);

function fmt(value) {
  return Number.isFinite(value) ? value.toFixed(2) : "—";
}

function setStatus(kind, text) {
  $("statusDot").className = `dot ${kind}`;
  $("statusText").textContent = text;
  $("feedMode").textContent = state.source;
  $("source").textContent = state.source;
}

function upsertCandle(price, ts) {
  const bucket = Math.floor(ts / 300000) * 300000;
  let candle = state.candles[state.candles.length - 1];
  if (!candle || candle.time !== bucket) {
    candle = { time: bucket, open: price, high: price, low: price, close: price };
    state.candles.push(candle);
    if (state.candles.length > 120) state.candles.shift();
  } else {
    candle.high = Math.max(candle.high, price);
    candle.low = Math.min(candle.low, price);
    candle.close = price;
  }
  state.current = candle;
  renderCandleChart();
}

function ingestTick(tick) {
  const price = Number(tick.last ?? tick.price ?? tick.bid);
  if (!Number.isFinite(price)) return;
  const ts = Number(tick.timestamp ?? Date.now());
  state.ticks += 1;
  state.lastPrice = price;
  upsertCandle(price, ts);
  $("price").textContent = fmt(price);
  $("bid").textContent = fmt(Number(tick.bid ?? price));
  $("ask").textContent = fmt(Number(tick.ask ?? price));
  $("updated").textContent = new Date(ts).toLocaleTimeString();
  $("tickCount").textContent = state.ticks.toLocaleString();
  $("candleCount").textContent = state.candles.length.toLocaleString();
  const delta = state.previous == null ? null : price - state.previous;
  $("change").textContent = delta == null ? "Поток данных активен" : `${delta >= 0 ? "+" : ""}${delta.toFixed(2)} от предыдущего тика`;
  state.previous = price;
  updateStructure();
}

function updateStructure() {
  const c = state.current;
  if (!c) return;
  $("currentHigh").textContent = fmt(c.high);
  $("currentLow").textContent = fmt(c.low);
  // Previous session levels remain empty until the session model is defined.
  $("prevHigh").textContent = "—";
  $("prevLow").textContent = "—";
}

function renderCandleChart() {
  const chart = $("chart");
  if (!state.candles.length) return;
  const w = chart.clientWidth;
  const h = chart.clientHeight;
  const canvas = chart.querySelector("canvas") || document.createElement("canvas");
  canvas.width = w * devicePixelRatio;
  canvas.height = h * devicePixelRatio;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  if (!canvas.parentNode) { chart.innerHTML = ""; chart.appendChild(canvas); }
  const ctx = canvas.getContext("2d");
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.clearRect(0, 0, w, h);
  const visible = state.candles.slice(-70);
  const hi = Math.max(...visible.map(c => c.high));
  const lo = Math.min(...visible.map(c => c.low));
  const range = Math.max(hi - lo, 0.01);
  const xStep = w / Math.max(visible.length, 1);
  const bodyW = Math.max(3, xStep * .56);
  const y = p => h - ((p - lo) / range) * (h - 24) - 12;
  visible.forEach((c, i) => {
    const x = i * xStep + xStep / 2;
    const up = c.close >= c.open;
    ctx.strokeStyle = up ? "#35d49a" : "#ff5d6c";
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y(c.high)); ctx.lineTo(x, y(c.low)); ctx.stroke();
    const top = Math.min(y(c.open), y(c.close));
    const bottom = Math.max(y(c.open), y(c.close));
    ctx.fillRect(x - bodyW/2, top, bodyW, Math.max(1, bottom - top));
  });
}

function demoTick() {
  const base = state.lastPrice ?? 3300;
  const next = base + (Math.random() - 0.5) * 1.8;
  ingestTick({ price: next, bid: next - .03, ask: next + .03, timestamp: Date.now() });
}

function startDemo() {
  state.source = "DEMO";
  setStatus("demo", "DEMO STREAM");
  demoTick();
  setInterval(demoTick, state.intervalMs);
}

function connectWebSocket(url) {
  const ws = new WebSocket(url);
  state.source = "LIVE";
  setStatus("offline", "CONNECTING…");
  ws.onopen = () => setStatus("live", "LIVE STREAM");
  ws.onmessage = e => {
    try { ingestTick(typeof e.data === "string" ? JSON.parse(e.data) : e.data); } catch (_) {}
  };
  ws.onerror = () => setStatus("offline", "FEED ERROR");
  ws.onclose = () => setStatus("offline", "DISCONNECTED");
  return ws;
}

window.KDScreener = { ingestTick, connectWebSocket, state };
window.addEventListener("resize", renderCandleChart);
startDemo();
