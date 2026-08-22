import datetime as dt
import json
import pathlib
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "calendar.json"
URLS = [
    "https://nfs.faireconomy.media/ff_calendar_thisweek.json",
    "https://nfs.faireconomy.media/ff_calendar_nextweek.json",
]
CURRENCIES = {"USD", "EUR", "GBP", "JPY", "CAD", "AUD", "NZD", "CHF", "CNY"}


def fetch(url: str):
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "KriptoDanik-AI-calendar/1.2",
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        data = json.load(response)
    if not isinstance(data, list):
        raise ValueError("Forex Factory returned an unexpected JSON structure")
    return data


def main() -> None:
    events = []
    errors = []

    for url in URLS:
        try:
            events.extend(fetch(url))
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError, json.JSONDecodeError) as exc:
            errors.append(f"{url}: {exc}")

    now = dt.datetime.now(dt.timezone.utc)
    until = now + dt.timedelta(days=9)
    seen = set()
    clean = []

    for event in events:
        if not isinstance(event, dict):
            continue

        try:
            event_date = str(event.get("date", ""))
            event_dt = dt.datetime.fromisoformat(event_date.replace("Z", "+00:00"))
        except (TypeError, ValueError):
            continue

        if event_dt.tzinfo is None:
            event_dt = event_dt.replace(tzinfo=dt.timezone.utc)

        country = str(event.get("country", "")).upper()
        if country not in CURRENCIES:
            continue
        if event_dt < now - dt.timedelta(hours=2) or event_dt > until:
            continue

        item = {
            "title": str(event.get("title", "")),
            "country": country,
            "date": str(event.get("date", "")),
            "impact": str(event.get("impact", "")),
            "actual": str(event.get("actual", "")),
            "forecast": str(event.get("forecast", "")),
            "previous": str(event.get("previous", "")),
        }
        key = (country, item["title"], item["date"])
        if key not in seen:
            seen.add(key)
            clean.append(item)

    clean.sort(key=lambda item: item["date"])

    if not clean:
        if OUT.exists():
            print("Calendar feed unavailable or empty; keeping existing calendar cache.")
            if errors:
                print("\n".join(errors))
            return
        details = "; ".join(errors) if errors else "no valid upcoming events"
        raise SystemExit(f"Calendar update produced no usable events and no cache exists: {details}")

    payload = {
        "fetchedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
        "source": "Forex Factory weekly calendar feed",
        "timezone": "source feed timezone",
        "events": clean,
    }

    temporary = OUT.with_suffix(".json.tmp")
    temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    temporary.replace(OUT)

    print(f"Wrote {len(clean)} events to {OUT}")
    if errors:
        print("Some calendar feeds were unavailable:")
        print("\n".join(errors))


if __name__ == "__main__":
    main()
