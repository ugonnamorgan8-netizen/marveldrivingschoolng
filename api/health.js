// GET /api/health — configuration check. Reports only WHETHER settings exist
// (true/false), never their values.
// TEMPORARY diagnostics (remove after launch check):
//   GET  /api/health?db=1  → HTTP status codes the database returns to the server (no data)
//   POST /api/health {"t": "..."} → code points of the received text (encoding check)
import { env, readJson, send, supabaseConfig } from "./_lib/http.js";

const probe = async (table, method = "HEAD") => {
  const { url, serviceKey } = supabaseConfig();
  const headers = { apikey: serviceKey, Prefer: "count=exact" };
  if (serviceKey.startsWith("eyJ")) headers.Authorization = `Bearer ${serviceKey}`;
  try {
    const r = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, { method, headers });
    const text = method === "HEAD" ? "" : await r.text();
    let code = null;
    try { code = JSON.parse(text)?.code ?? null; } catch { /* not json */ }
    return { status: r.status, code, message: r.ok ? null : (JSON.parse(text || "{}")?.message || null) };
  } catch (e) {
    return { error: e.message };
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    let body = {};
    try { body = await readJson(req); } catch { /* ignore */ }
    const t = typeof body?.t === "string" ? body.t.slice(0, 40) : "";
    return send(res, 200, { codepoints: [...t].map((c) => c.codePointAt(0).toString(16)), bodyType: typeof req.body, ct: req.headers["content-type"] || null });
  }
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, { ok: false });
  }
  const key = env("SUPABASE_SERVICE_ROLE_KEY", "");
  const out = {
    ok: true,
    serverKeyPresent: key.length > 0,
    serverKeyType: key.startsWith("sb_secret_") ? "sb_secret" : key.startsWith("eyJ") ? "legacy_jwt" : key ? "unknown" : null,
    serverKeyLength: key.length,
    serverKeyHasWhitespace: /\s/.test(key),
    resendKeyPresent: Boolean(env("RESEND_API_KEY")),
    notifyEmailPresent: Boolean(env("NOTIFY_EMAIL_TO")),
    supabaseHost: (() => { try { return new URL(supabaseConfig().url).host; } catch { return null; } })(),
    environment: env("VERCEL_ENV", "unknown"),
    commit: (env("VERCEL_GIT_COMMIT_SHA", "") || "").slice(0, 7) || null,
  };
  const wantsDb = new URL(req.url, "http://x").searchParams.get("db") === "1";
  if (wantsDb && key) {
    out.db = {
      enrollments: await probe("enrollments", "GET"),
      testimonials: await probe("testimonials", "GET"),
      page_events: await probe("page_events", "GET"),
    };
  }
  return send(res, 200, out);
}
