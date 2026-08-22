import datetime as dt
import json
import pathlib
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "calendar.json"
URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.json"
CURRENCIES = {"USD", "EUR", "GBP", "JPY", "CAD", "AUD", "NZD", "CHF", "CNY"}


def fetch(url: str):
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "KriptoDanik-AI-calendar/1.1",
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=20) as response:
        return json.load(response)


def main() -> None:
    try:
        events = fetch(URL)
        if not isinstance(events, list):
            raise ValueError("Forex Factory returned an unexpected JSON structure")
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError) as exc:
        if OUT.exists():
            print(f"WARNING: calendar feed unavailable: {exc}")
            print("Keeping the existing calendar cache.")
            return
        raise SystemExit(f"Calendar feed unavailable and no cache exists: {exc}")

    now = dt.datetime.now(dt.timezone.utc)
    until = now + dt.timedelta(days=8)
    seen = set()
    clean = []

    for event in events:
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
            "title": event.get("title", ""),
            "country": country,
            "date": event.get("date", ""),
            "impact": event.get("impact", ""),
            "actual": event.get("actual", ""),
            "forecast": event.get("forecast", ""),
            "previous": event.get("previous", ""),
        }
        key = (country, item["title"], item["date"])
        if key not in seen:
            seen.add(key)
            clean.append(item)

    clean.sort(key=lambda item: item["date"])

    if not clean:
        if OUT.exists():
            print("No upcoming events in the current feed; keeping existing calendar cache.")
            return
        raise SystemExit("Calendar update produced no events and no cache exists.")

    payload = {
        "fetchedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
        "source": "Forex Factory weekly calendar feed",
        "timezone": "source feed timezone",
        "events": clean,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(clean)} events to {OUT}")


if __name__ == "__main__":
    main()
