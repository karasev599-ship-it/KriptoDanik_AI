import json, urllib.request, datetime as dt, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'data' / 'calendar.json'
URLS = [
    'https://nfs.faireconomy.media/ff_calendar_thisweek.json',
    'https://nfs.faireconomy.media/ff_calendar_nextweek.json',
]
CURRENCIES = {'USD','EUR','GBP','JPY','CAD','AUD','NZD','CHF','CNY'}

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent':'KriptoDanik-AI-calendar/1.0'})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.load(r)

events=[]
errors=[]
for url in URLS:
    try:
        data=fetch(url)
        if isinstance(data,list): events.extend(data)
    except Exception as exc:
        errors.append(f'{url}: {exc}')

now=dt.datetime.now(dt.timezone.utc)
until=now+dt.timedelta(days=9)
seen=set(); clean=[]
for e in events:
    try:
        d=dt.datetime.fromisoformat(str(e.get('date','')).replace('Z','+00:00'))
    except Exception:
        continue
    if d.tzinfo is None: d=d.replace(tzinfo=dt.timezone.utc)
    country=str(e.get('country','')).upper()
    if country not in CURRENCIES or d < now-dt.timedelta(hours=2) or d > until:
        continue
    item={
        'title':e.get('title',''), 'country':country, 'date':e.get('date',''),
        'impact':e.get('impact',''), 'actual':e.get('actual',''),
        'forecast':e.get('forecast',''), 'previous':e.get('previous','')
    }
    key=(country,item['title'],item['date'])
    if key not in seen:
        seen.add(key); clean.append(item)
clean.sort(key=lambda x:x['date'])

payload={
    'fetchedAt':dt.datetime.now(dt.timezone.utc).isoformat(),
    'source':'Forex Factory weekly calendar feed',
    'timezone':'source feed timezone',
    'events':clean
}
if not clean:
    raise SystemExit('Calendar update produced no events; refusing to overwrite a working file.')
OUT.write_text(json.dumps(payload,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Wrote {len(clean)} events to {OUT}')
if errors: print('\n'.join(errors))
