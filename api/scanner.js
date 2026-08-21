const OPENAI_URL = 'https://api.openai.com/v1/responses';
const MODEL = process.env.SCANNER_MODEL || 'gpt-5.6-luna';

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function localFallback() {
  return {
    asset: null,
    direction: null,
    timeframe: null,
    entry: null,
    stop_loss: null,
    take_profit: null,
    setup: 'Автоматическое распознавание Vision пока недоступно. Проверь поля вручную.',
    structures: [],
    confidence: 0,
    warnings: ['Не удалось подключить Vision-модель. Не используем догадки.'],
    model: 'local',
    local: true
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const image = String(body.image || '');
    if (!image.startsWith('data:image/')) return json(res, 400, { error: 'A data URL image is required.' });
    if (image.length > 15_000_000) return json(res, 413, { error: 'Image is too large.' });

    if (!process.env.OPENAI_API_KEY) return json(res, 200, localFallback());

    const schema = {
      type: 'object',
      additionalProperties: false,
      properties: {
        asset: { type: ['string','null'] },
        direction: { type: ['string','null'] },
        timeframe: { type: ['string','null'] },
        entry: { type: ['number','null'] },
        stop_loss: { type: ['number','null'] },
        take_profit: { type: ['number','null'] },
        setup: { type: 'string' },
        structures: { type: 'array', items: { type: 'string' } },
        confidence: { type: 'number' },
        warnings: { type: 'array', items: { type: 'string' } }
      },
      required: ['asset','direction','timeframe','entry','stop_loss','take_profit','setup','structures','confidence','warnings']
    };

    const input = [{
      role: 'user',
      content: [
        { type: 'input_text', text: `Ты — AI Scanner графиков KriptoDanik AI. Проанализируй только то, что реально видно на скриншоте. Найди тикер/актив, направление LONG/SHORT, таймфрейм, цену входа, Stop Loss и Take Profit, если они явно присутствуют. Найди визуально подписанные торговые структуры из списка: FVG, IFVG, Order Block, Liquidity Sweep, Liquidity, BOS, MSS/CHOCH, Premium/Discount, Pin Bar, Range. Не придумывай цены и не делай прогноз движения рынка. Если поле не читается — верни null. confidence 0–100 означает уверенность именно в распознавании изображения, а не вероятность успеха сделки. setup — короткое описание видимых элементов. warnings — список неоднозначностей. Все строки на русском, кроме тикера, направления и названий структур.` },
        { type: 'input_image', image_url: image }
      ]
    }];

    const upstream = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: MODEL,
        input,
        reasoning: { effort: 'medium' },
        max_output_tokens: 1200,
        store: false,
        text: { format: { type: 'json_schema', name: 'chart_scan', strict: true, schema } }
      })
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.warn('Scanner Vision unavailable:', data?.error?.message || upstream.status);
      return json(res, 200, { ...localFallback(), gatewayError: true });
    }

    let parsed = null;
    try { parsed = JSON.parse(String(data?.output_text || '')); } catch (_) {}
    if (!parsed) return json(res, 200, localFallback());

    parsed.direction = ['long','short','LONG','SHORT'].includes(String(parsed.direction || '')) ? String(parsed.direction).toLowerCase() : null;
    parsed.confidence = Math.max(0, Math.min(100, Number(parsed.confidence) || 0));
    return json(res, 200, { ...parsed, model: MODEL, local: false });
  } catch (error) {
    console.error('Scanner gateway error:', error);
    return json(res, 200, { ...localFallback(), gatewayError: true });
  }
}
