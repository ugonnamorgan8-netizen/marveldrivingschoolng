// GET /api/health — configuration check. Reports only WHETHER settings exist
// (true/false), never their values.
import { env, send } from "./_lib/http.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, { ok: false });
  }
  const key = env("SUPABASE_SERVICE_ROLE_KEY", "");
  return send(res, 200, {
    ok: true,
    serverKeyPresent: key.length > 0,
    serverKeyType: key.startsWith("sb_secret_") ? "sb_secret" : key.startsWith("eyJ") ? "legacy_jwt" : key ? "unknown" : null,
    resendKeyPresent: Boolean(env("RESEND_API_KEY")),
    notifyEmailPresent: Boolean(env("NOTIFY_EMAIL_TO")),
    environment: env("VERCEL_ENV", "unknown"),
    commit: (env("VERCEL_GIT_COMMIT_SHA", "") || "").slice(0, 7) || null,
  });
}
