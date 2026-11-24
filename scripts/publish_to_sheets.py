#!/usr/bin/env python3
"""Publish the latest western-wear CSV exports to a Google Sheet Apps Script endpoint."""
from __future__ import annotations
import csv
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]

def read_csv(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        raise FileNotFoundError(f"Required export not found: {path}")
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return [dict(row) for row in csv.DictReader(handle)]

def main() -> int:
    endpoint = os.environ.get("GOOGLE_SHEETS_WEBHOOK_URL", "").strip()
    secret = os.environ.get("GOOGLE_SHEETS_WEBHOOK_SECRET", "").strip()
    if not endpoint or not secret:
        print("Google Sheets publishing skipped: webhook URL/secret not configured.", file=sys.stderr)
        return 0
    all_brands = read_csv(ROOT / "output" / "western_wear_brands.csv")
    pending = read_csv(ROOT / "output" / "pending_marketplace_candidates.csv")
    payload = {"secret": secret, "generated_at": datetime.now(timezone.utc).isoformat(), "all_brands": all_brands, "pending_brands": pending}
    request = Request(endpoint, data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
                      headers={"Content-Type": "application/json", "User-Agent": "western-wear-intel/1.0"}, method="POST")
    with urlopen(request, timeout=90) as response:
        result = response.read().decode("utf-8", errors="replace")
        if response.status < 200 or response.status >= 300:
            raise RuntimeError(f"Google Sheets endpoint returned HTTP {response.status}: {result[:500]}")
    parsed = json.loads(result)
    if not parsed.get("ok"):
        raise RuntimeError(f"Google Sheets rejected the update: {parsed}")
    print(f"Google Sheets updated: {parsed.get('all_brands', len(all_brands))} all brands, {parsed.get('pending_brands', len(pending))} pending candidates.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
