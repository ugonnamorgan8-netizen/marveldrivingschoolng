// Shared helpers for the /api serverless functions (Vercel Node runtime).
// Files/folders starting with "_" are NOT exposed as routes by Vercel.
import { createHash } from "node:crypto";

const MAX_BODY_BYTES = 10 * 1024; // 10 KB is plenty for a form

export const env = (name, fallback) => {
  const v = process.env[name];
  return v === undefined || v === "" ? fallback : v;
};

// Public project URL (not a secret). Override with SUPABASE_URL if the project ever moves.
const PUBLIC_SUPABASE_URL = "https://swtfnidnohbifsoklhns.supabase.co";

export const supabaseConfig = () => ({
  url: env("SUPABASE_URL", env("VITE_SUPABASE_URL", PUBLIC_SUPABASE_URL)),
  serviceKey: env("SUPABASE_SERVICE_ROLE_KEY"),
});

/** Send a JSON response with safe defaults. */
export const send = (res, status, body) => {
  res.statusCode = status;
  res.removeHeader?.("X-Powered-By");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(body === undefined ? "" : JSON.stringify(body));
};

/** Origins allowed to call the API: same host, plus ALLOWED_ORIGINS (comma separated). */
const isAllowedOrigin = (origin, req) => {
  if (!origin) return false;
  let url;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  const host = (req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
  if (url.host === host) return true;
  const extra = env("ALLOWED_ORIGINS", "")
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);
  return extra.includes(url.origin);
};

/**
 * CORS + method guard. Returns true if the request may proceed.
 * - Only POST (and the OPTIONS preflight) are accepted.
 * - Cross-origin callers must be listed in ALLOWED_ORIGINS; no wildcard.
 */
export const guard = (req, res, { requireOrigin = true } = {}) => {
  const origin = req.headers.origin;
  const allowed = isAllowedOrigin(origin, req);

  if (origin && allowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "600");
  }

  if (req.method === "OPTIONS") {
    send(res, allowed ? 204 : 403);
    return false;
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    send(res, 405, { ok: false, error: "Method not allowed" });
    return false;
  }
  if ((origin && !allowed) || (!origin && requireOrigin)) {
    send(res, 403, { ok: false, error: "Forbidden" });
    return false;
  }
  return true;
};

/** Read and JSON-parse the request body (works on Vercel and in the Vite dev server). */
export const readJson = async (req) => {
  // Vercel pre-parses JSON bodies into req.body.
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === "object" && !Buffer.isBuffer(req.body)) return req.body;
    const raw = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : String(req.body);
    if (raw.length > MAX_BODY_BYTES) throw Object.assign(new Error("too_large"), { status: 413 });
    return JSON.parse(raw);
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw Object.assign(new Error("too_large"), { status: 413 });
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
};

export const clientIp = (req) => {
  const fwd = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(fwd) ? fwd[0] : fwd || "").split(",")[0].trim();
  return ip || req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
};

/** One-way, salted hash so raw IP addresses are never stored. */
export const hashValue = (...parts) => {
  const salt = env("IP_HASH_SALT", env("SUPABASE_SERVICE_ROLE_KEY", "dev-salt"));
  return createHash("sha256").update([salt, ...parts].join("|")).digest("hex").slice(0, 32);
};

/**
 * Small in-memory limiter. Serverless instances are short-lived, so this only
 * stops bursts; the durable limits live in the database (see enquiry.js).
 */
const buckets = new Map();
export const burstLimited = (key, limit, windowMs) => {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || now - entry.start > windowMs) {
    buckets.set(key, { start: now, count: 1 });
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (now - v.start > windowMs) buckets.delete(k);
    }
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
};

// ---------- sanitising ----------
// Control characters, zero-width chars and bidi overrides (built from code points so the
// source stays plain ASCII).
const STRIP_RANGES = [
  [0x00, 0x08], [0x0b, 0x0c], [0x0e, 0x1f], [0x7f, 0x7f],
  [0x200b, 0x200f], [0x202a, 0x202e], [0x2066, 0x2069],
];
const CONTROL_CHARS = new RegExp(
  `[${STRIP_RANGES.map(([a, b]) => `${String.fromCodePoint(a)}-${String.fromCodePoint(b)}`).join("")}]`,
  "g"
);

/** Strip control chars and anything tag-like; collapse whitespace; enforce length. */
export const cleanText = (value, max, { multiline = false } = {}) => {
  if (typeof value !== "string") return "";
  let s = value.normalize("NFC").replace(CONTROL_CHARS, "");
  s = s.replace(/<[^>]*>?/g, ""); // drop HTML tags / partial tags
  s = s.replace(/[<>]/g, ""); // and any stray angle brackets
  s = multiline
    ? s.replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n")
    : s.replace(/\s+/g, " ");
  return s.trim().slice(0, max);
};

/** Escape text for safe inclusion in HTML email bodies. */
export const escapeHtml = (s) =>
  String(s).replace(/[&<>"'`=/]/g, (c) => `&#${c.charCodeAt(0)};`);

// Shared validation patterns
export const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
export const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u;
