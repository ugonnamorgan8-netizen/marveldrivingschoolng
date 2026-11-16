// GET /api/health \u2014 configuration check. Reports only WHETHER settings exist
// and HTTP status codes. Never returns values, error messages or data.
import { env, send, supabaseConfig } from "./_lib/http.js";
import { countRows } from "./_lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, { ok: false });
  }
  const { serviceKey } = supabaseConfig();
  let database = "not_configured";
  if (serviceKey) {
    try {
      const r = await countRows("gallery_images", "limit=1", { raw: true });
      database = r.ok ? "ok" : `error_${r.status}`;
    } catch {
      database = "unreachable";
    }
  }
  return send(res, 200, {
    ok: true,
    serverKeyPresent: Boolean(serviceKey),
    resendKeyPresent: Boolean(env("RESEND_API_KEY")),
    notifyEmailPresent: Boolean(env("NOTIFY_EMAIL_TO")),
    database,
    commit: (env("VERCEL_GIT_COMMIT_SHA", "") || "").slice(0, 7) || null,
  });
}
