/**
 * Writer's Ground — Data Loader
 * ==============================
 * This file handles loading opportunity data from either:
 *   1. Google Sheets (live, auto-updating) — when SHEETS_URL is set
 *   2. Static data.js (fallback) — always available
 *
 * HOW TO ACTIVATE GOOGLE SHEETS SYNC:
 * 1. Follow the steps in google-sheets-sync/Code.gs to deploy your Apps Script
 * 2. Copy the Web App URL from the deployment
 * 3. Paste it below as the value of SHEETS_URL
 * 4. Save and redeploy to Netlify
 *
 * The loader tries Google Sheets first. If it fails (offline, quota, etc.),
 * it automatically falls back to the static data.js — so the site never breaks.
 */

// ── CONFIGURATION ──────────────────────────────────────────────────────────
// Paste your Google Apps Script Web App URL here:
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyxhznKIvjynpBeAAqpkgXp3iKLjpPh47-X2SPWOoYF7FYHwaRs5hpiJTKs0vDwVQ7SDw/exec';

// How long to cache the Google Sheets data in the browser (milliseconds)
// Default: 30 minutes. Set to 0 to always fetch fresh.
const CACHE_DURATION_MS = 30 * 60 * 1000;

// ── CACHE HELPERS ───────────────────────────────────────────────────────────
function getCachedData() {
  try {
    const cached = sessionStorage.getItem('wg_data');
    const ts = sessionStorage.getItem('wg_data_ts');
    if (cached && ts && (Date.now() - parseInt(ts)) < CACHE_DURATION_MS) {
      return JSON.parse(cached);
    }
  } catch (e) {}
  return null;
}

function setCachedData(data) {
  try {
    sessionStorage.setItem('wg_data', JSON.stringify(data));
    sessionStorage.setItem('wg_data_ts', Date.now().toString());
  } catch (e) {}
}

// ── MAIN LOADER ─────────────────────────────────────────────────────────────
/**
 * loadData(callback)
 * Calls callback(data, source) where:
 *   data   = the WG_DATA object (same structure as data.js)
 *   source = 'sheets' | 'cache' | 'static'
 */
async function loadData(callback) {
  // 1. Try session cache first (avoids repeat fetches on tab switch)
  const cached = getCachedData();
  if (cached) {
    console.log('[WG] Loaded from session cache');
    callback(cached, 'cache');
    return;
  }

  // 2. Try Google Sheets if URL is configured
  if (SHEETS_URL && SHEETS_URL.trim() !== '') {
    try {
      const res = await fetch(SHEETS_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      // Merge with static data — sheets data takes priority, static fills gaps
      const merged = Object.assign({}, WG_DATA, json);
      delete merged._meta;

      setCachedData(merged);
      console.log(`[WG] Loaded from Google Sheets — ${json._meta?.total || '?'} entries, updated ${json._meta?.updated || 'unknown'}`);
      callback(merged, 'sheets');
      return;
    } catch (err) {
      console.warn('[WG] Google Sheets fetch failed, falling back to static data:', err.message);
    }
  }

  // 3. Fall back to static data.js
  console.log('[WG] Using static data');
  callback(WG_DATA, 'static');
}

// ── DATA SOURCE INDICATOR ───────────────────────────────────────────────────
function showDataSourceBadge(source) {
  const badge = document.getElementById('data-source-badge');
  if (!badge) return;
  if (source === 'sheets') {
    badge.textContent = '🔄 Live data';
    badge.title = 'Data loaded from Google Sheets';
    badge.style.display = 'inline-block';
  } else if (source === 'cache') {
    badge.textContent = '⚡ Cached';
    badge.title = 'Data loaded from session cache';
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}
