# KriptoDanik AI

Version: v1.8.11

Market Pulse redesigned: Crypto/Forex modes, live economic calendar with impact levels, market-relevant news feed, and cleaner context UI.

## v1.8.8 — AI Scanner functional pass
- Reliable image upload with PNG/JPG/WEBP support, drag & drop, paste, and mobile camera input.
- Images are resized/compressed before persistence to avoid localStorage quota failures.
- Added optional OCR analysis via pinned Tesseract.js CDN.
- OCR can populate asset, timeframe, direction and recognizable structure labels without inventing price levels.
- Added visible analysis progress/status and recognized-text preview.
- Service-worker cache bumped to v1.8.8.

## v1.8.11 — Vision Scanner hardening
- Hardened `/api/scanner` image validation and supported image data URLs.
- Uses OpenAI Responses API Structured Outputs with a strict JSON Schema.
- Uses high-detail vision input for chart screenshots.
- Direction is returned only when explicitly visible; no guessing from candle colors.
- Price levels remain `null` when they are not clearly readable.
- Added bounded warnings/structures output and safer Vision fallback handling.
