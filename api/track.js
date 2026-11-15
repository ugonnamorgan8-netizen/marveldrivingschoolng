// POST /api/track — privacy-friendly first-party analytics (page views + CTA clicks).
// No cookies, no raw IPs: visitors are counted with a salted hash that rotates daily.
import { burstLimited, cleanText, clientIp, guard, hashValue, readJson, send, supabaseConfig } from "./_lib/http.js";
import { insertRow } from "./_lib/supabase.js";

const BOT_RE = /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|monitor|curl|wget|python|axios|node-fetch/i;

const deviceFrom = (ua) => {
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) return "tablet";
  if (/Mobi|iPhone|iPod|Android|BlackBerry|Opera Mini|IEMobile/i.test(ua)) return "mobile";
  return "desktop";
};

const referrerHost = (ref, ownHost) => {
  if (typeof ref !== "string" || !ref) return null;
  try {
    const u = new URL(ref);
    if (!/^https?:$/.test(u.protocol)) return null;
    if (u.host === ownHost) return null; // internal navigation
    return u.hostname.replace(/^www\./, "").slice(0, 300);
  } catch {
    return null;
  }
};

export default async function handler(req, res) {
  // Analytics must never break the page, so every failure is a quiet 204.
  if (!guard(req, res, { requireOrigin: false })) return;

  const ua = String(req.headers["user-agent"] || "");
  if (!ua || BOT_RE.test(ua)) return send(res, 204);

  const ip = clientIp(req);
  if (burstLimited(`trk:${ip}`, 60, 60_000)) return send(res, 204);

  const { url, serviceKey } = supabaseConfig();
  if (!url || !serviceKey) return send(res, 204);

  let body;
  try {
    body = await readJson(req);
  } catch {
    return send(res, 204);
  }

  const event_type = body?.type === "click" ? "click" : "pageview";
  let path = cleanText(body?.path, 300);
  if (!path.startsWith("/")) path = "/";
  path = path.split("?")[0];
  if (path.startsWith("/admin")) return send(res, 204); // never track admin pages

  const host = (req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
  const day = new Date().toISOString().slice(0, 10);

  const row = {
    event_type,
    path,
    label: event_type === "click" ? cleanText(body?.label, 100) || null : null,
    referrer: event_type === "pageview" ? referrerHost(body?.referrer, host) : null,
    device: deviceFrom(ua),
    country: /^[A-Z]{2}$/.test(String(req.headers["x-vercel-ip-country"] || ""))
      ? req.headers["x-vercel-ip-country"]
      : null,
    visitor_hash: hashValue("visitor", day, ip, ua),
    session_id: /^[a-zA-Z0-9-]{8,64}$/.test(String(body?.sid || "")) ? body.sid : null,
  };

  try {
    await insertRow("page_events", row);
  } catch {
    /* ignore */
  }
  return send(res, 204);
}
