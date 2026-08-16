# KriptoDanik AI Coach — real LLM gateway

This release upgrades AI Coach from the existing local rule-based engine to a real OpenAI Responses API gateway. The browser never contains the OpenAI API key.

## Files added

- `api/coach.js` — secure server-side gateway to OpenAI Responses API
- `package.json` — deployment metadata

## Deployment

Recommended: deploy this repository on Vercel. The `/api/coach` serverless function will run there automatically.

Add an environment variable in the deployment settings:

`OPENAI_API_KEY=...`

Optional:

`COACH_MODEL=gpt-5.6`

The `gpt-5.6` alias currently routes to GPT-5.6 Sol.

## Important

GitHub Pages is static hosting and cannot execute `/api/coach.js`. If the site remains on GitHub Pages, the frontend will correctly fall back to the existing local Coach until the same-origin API endpoint is hosted somewhere.

No API key belongs in `app.js`, `index.html`, or any public asset.
