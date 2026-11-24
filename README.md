# Western Wear Intel

Google Sheets publishing integration scaffold for the Western Wear Intel research project.

The target spreadsheet is [Western Wear Intel](https://docs.google.com/spreadsheets/d/1mr98RzE76pSvBUa9l_Ws1noQa5EKQqaR1dmESXmUiag/edit).

## Integration files

- `google-apps-script/Code.gs` — authenticated receiver that refreshes the managed tabs.
- `scripts/publish_to_sheets.py` — sends the latest CSV exports to the receiver.
- [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) — deployment and GitHub secret setup.

## Current status

The GitHub repository was empty when this integration was added. The full research pipeline source from the supplied project archive has **not yet been uploaded**, so the daily workflow is intentionally not enabled yet. Once the source files are added, restore the daily workflow and configure the two Actions secrets described in the setup guide.

Generated CSVs and local databases should remain excluded from this public repository so scraped business contact data is not published.
