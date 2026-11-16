// Minimal Supabase REST helpers for the server functions (service role, server-only).
import { supabaseConfig } from "./http.js";

// Legacy service_role keys are JWTs ("eyJ\u2026") and also go in Authorization.
// New-style secret keys ("sb_secret_\u2026") must only be sent in the apikey header.
const headers = (key, extra = {}) => ({
  apikey: key,
  ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
  "Content-Type": "application/json",
  ...extra,
});

/** True when PostgREST says a column doesn't exist yet (migration not run). */
const isMissingColumn = (status, text) =>
  (status === 400 || status === 404) && /PGRST204|42703|Could not find the '.*' column|column .* does not exist/i.test(text);

/**
 * Insert one row. If the database hasn't been migrated yet (new columns missing),
 * retry with `legacyRow` so the site keeps working whichever order launch steps run in.
 * Returns { ok: true } | { ok: false, rateLimited?: boolean, detail?: string }.
 */
export const insertRow = async (table, row, legacyRow) => {
  const { url, serviceKey } = supabaseConfig();
  const attempt = async (body) => {
    const r = await fetch(`${url}/rest/v1/${table}`, {
      method: "POST",
      headers: headers(serviceKey, { Prefer: "return=minimal" }),
      body: JSON.stringify(body),
    });
    return { ok: r.ok, status: r.status, text: r.ok ? "" : await r.text() };
  };

  let res = await attempt(row);
  if (!res.ok && legacyRow && isMissingColumn(res.status, res.text)) {
    console.warn(`${table}: new columns missing \u2014 run the launch SQL migration. Using legacy insert.`);
    res = await attempt(legacyRow);
  }
  if (res.ok) return { ok: true };
  if (res.text.includes("rate_limited")) return { ok: false, rateLimited: true };
  return { ok: false, detail: `${res.status} ${res.text.slice(0, 300)}` };
};

/** Count rows matching a PostgREST filter query string (e.g. "ip_hash=eq.x&created_at=gte.y"). */
export const countRows = async (table, filter, { raw = false } = {}) => {
  const { url, serviceKey } = supabaseConfig();
  const r = await fetch(`${url}/rest/v1/${table}?select=id&${filter}`, {
    method: "HEAD",
    headers: headers(serviceKey, { Prefer: "count=exact" }),
  });
  if (raw) return { ok: r.ok, status: r.status };
  if (!r.ok) return 0; // e.g. column not migrated yet \u2014 the DB trigger still protects
  const range = r.headers.get("content-range") || "*/0";
  return Number(range.split("/")[1]) || 0;
};
