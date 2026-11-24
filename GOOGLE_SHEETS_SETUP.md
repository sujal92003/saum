# Google Sheets daily sync setup

The workflow is scheduled for **09:00 Asia/Kolkata**. It refreshes the four data tabs in place (no duplicate rows) and appends one row to Run History.

## 1. Configure Apps Script in the target spreadsheet

1. Open the spreadsheet: https://docs.google.com/spreadsheets/d/1mr98RzE76pSvBUa9l_Ws1noQa5EKQqaR1dmESXmUiag/edit
2. Choose **Extensions → Apps Script**.
3. Paste the complete contents of [google-apps-script/Code.gs](google-apps-script/Code.gs).
4. In **Project Settings → Script Properties**, add `SHEETS_WEBHOOK_SECRET` with a long random secret.
5. Choose **Deploy → New deployment → Web app**.
6. Set **Execute as: Me** and **Who has access: Anyone**, deploy, authorize, and copy the URL ending in `/exec`.

The shared secret is checked before the Sheet is changed. Do not commit it or share it.

## 2. Add GitHub Actions secrets

In repository **Settings → Secrets and variables → Actions**, create:
- `GOOGLE_SHEETS_WEBHOOK_URL`: Apps Script Web App `/exec` URL.
- `GOOGLE_SHEETS_WEBHOOK_SECRET`: same value configured in Script Properties.

## 3. Run first sync

Use **Actions → Daily Western Wear refresh and Google Sheets sync → Run workflow**. Scheduled runs then repeat daily at 09:00 IST; GitHub may delay scheduled starts.

## Managed tabs

- **All Brands** — complete latest audit.
- **Pending Marketplace Verification** — current provisional pending list.
- **Contact Research** — rows with public business contact or named-contact details.
- **Verified Brands** — rows explicitly marked Verified or Listed.
- **Run History** — one summary row per successful sync.

The four data tabs are replaced on each run; other tabs remain untouched. Existing content in managed tabs will be overwritten on the first sync.
