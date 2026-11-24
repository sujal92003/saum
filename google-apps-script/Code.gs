/**
 * Google Sheets receiver for western-wear-intel.
 * Deploy as a Web App that executes as you; set access to Anyone.
 * Set Script Property SHEETS_WEBHOOK_SECRET to the same secret stored in GitHub Actions.
 */
const SPREADSHEET_ID = '1mr98RzE76pSvBUa9l_Ws1noQa5EKQqaR1dmESXmUiag';

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const expected = PropertiesService.getScriptProperties().getProperty('SHEETS_WEBHOOK_SECRET');
    if (!expected || !body.secret || body.secret !== expected) {
      return jsonResponse({ ok: false, error: 'Unauthorized' });
    }
    const all = Array.isArray(body.all_brands) ? body.all_brands : [];
    const pending = Array.isArray(body.pending_brands) ? body.pending_brands : [];
    if (!all.length) return jsonResponse({ ok: false, error: 'All Brands payload is empty; refusing to clear the sheet.' });

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const generatedAt = body.generated_at || new Date().toISOString();
    const contactRows = all.filter(r => hasValue(r, ['Business Email', 'Phone', 'Founder Name', 'Contact Person', 'LinkedIn (Person)']));
    const verifiedRows = all.filter(isVerified);

    replaceTab(ss, 'All Brands', all);
    replaceTab(ss, 'Pending Marketplace Verification', pending);
    replaceTab(ss, 'Contact Research', contactRows);
    replaceTab(ss, 'Verified Brands', verifiedRows);
    appendRunHistory(ss, generatedAt, all.length, pending.length, contactRows.length, verifiedRows.length);
    return jsonResponse({ ok: true, all_brands: all.length, pending_brands: pending.length, contact_research: contactRows.length, verified_brands: verifiedRows.length });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function replaceTab(ss, name, records) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  sheet.clearContents();
  if (!records.length) {
    sheet.getRange(1, 1).setValue('No records in this refresh');
    sheet.setFrozenRows(1);
    return;
  }
  const headers = Object.keys(records[0]);
  const values = [headers].concat(records.map(record => headers.map(h => record[h] == null ? '' : String(record[h]))));
  sheet.getRange(1, 1, values.length, headers.length).setValues(values);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  if (!sheet.getFilter()) sheet.getDataRange().createFilter();
  sheet.autoResizeColumns(1, Math.min(headers.length, 12));
}

function hasValue(record, fields) {
  return fields.some(field => String(record[field] || '').trim() !== '');
}

function isVerified(record) {
  const qualification = String(record['Qualification Status'] || '').trim().toLowerCase();
  const ajio = String(record['AJIO Status'] || '').trim().toLowerCase();
  const myntra = String(record['Myntra Status'] || '').trim().toLowerCase();
  return qualification === 'verified' || ['listed', 'verified'].includes(ajio) || ['listed', 'verified'].includes(myntra);
}

function appendRunHistory(ss, generatedAt, allCount, pendingCount, contactCount, verifiedCount) {
  let sheet = ss.getSheetByName('Run History');
  if (!sheet) {
    sheet = ss.insertSheet('Run History');
    sheet.appendRow(['Refresh time (UTC)', 'All brands', 'Pending marketplace verification', 'Contact research', 'Verified brands']);
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([generatedAt, allCount, pendingCount, contactCount, verifiedCount]);
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
