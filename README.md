# Western Wear Intel

Google Sheets publishing integration for the Western Wear Intel research pipeline.

Target spreadsheet: [Western Wear Intel](https://docs.google.com/spreadsheets/d/1mr98RzE76pSvBUa9l_Ws1noQa5EKQqaR1dmESXmUiag/edit).

## Daily Google Sheets workflow

The GitHub Actions workflow is configured for **09:00 Asia/Kolkata** and can also be run manually from the Actions tab. It is designed to:

1. Install the Python project and run tests.
2. Rebuild the 300-brand seed list and refresh brand/contact evidence.
3. Build and validate the complete and pending CSV exports.
4. Publish the data to the Google Sheet using the Apps Script receiver.

The integration files are:
- `google-apps-script/Code.gs` — authenticated Google Sheets receiver.
- `scripts/publish_to_sheets.py` — sends generated CSV data to the receiver.
- `.github/workflows/daily-refresh.yml` — scheduled refresh and sync.
- [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) — deployment and secret setup.

## Important current status

The repository was empty before the integration scaffold was added. **The original Python pipeline source, seed data, and tests from the supplied project archive have not yet been uploaded.** Therefore the workflow file is present, but it cannot successfully run until those project files are pushed.

Generated contact CSVs, Excel workbooks, local SQLite databases, and logs should remain excluded from this public repository. The workflow creates fresh exports on its runner and sends them directly to the Sheet.

## Setup required

Follow [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) to deploy the Apps Script and add these repository Actions secrets:
- `GOOGLE_SHEETS_WEBHOOK_URL`
- `GOOGLE_SHEETS_WEBHOOK_SECRET`
