// POST /api/review \u2014 visitors submit a testimonial. It is stored UNPUBLISHED;
// an admin must approve it (Admin \u2192 Testimonials) before it appears on the site.
import { NAME_RE, burstLimited, cleanText, clientIp, guard, hashValue, readJson, send, supabaseConfig } from "./_lib/http.js";
import { countRows, insertRow } from "./_lib/supabase.js";
import { notify } from "./_lib/email.js";

const IP_LIMIT_PER_DAY = 3;

export const validateReview = (body) => {
  if (!body || typeof body !== "object") return { error: "Invalid request" };
  const name = cleanText(body.name, 60);
  const role = cleanText(body.role, 60);
  const content = cleanText(body.content, 800, { multiline: true });
  const rating = Number(body.rating);

  if (name.length < 2 || !NAME_RE.test(name)) return { error: "Please enter your name." };
  if (role && !/^[\p{L}\p{M}\p{N}' .,&()/-]+$/u.test(role)) return { error: "Please use plain text for the course/role." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: "Please choose a star rating." };
  if (content.length < 20) return { error: "Please write at least 20 characters about your experience." };
  if (/https?:\/\/|www\./i.test(content)) return { error: "Please remove links from your review." };

  return { data: { name, role, content, rating } };
};

export default async function handler(req, res) {
  if (!guard(req, res)) return;

  const { url, serviceKey } = supabaseConfig();
  if (!url || !serviceKey) {
    console.error("review: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not configured");
    return send(res, 500, { ok: false, error: "Reviews are temporarily unavailable. Please try again later." });
  }

  const ip = clientIp(req);
  if (burstLimited(`rev:${ip}`, 2, 60_000)) {
    return send(res, 429, { ok: false, error: "Too many requests. Please wait a minute and try again." });
  }

  let body;
  try {
    body = await readJson(req);
  } catch (e) {
    return send(res, e.status === 413 ? 413 : 400, { ok: false, error: "Invalid request" });
  }

  if ((typeof body?.website === "string" && body.website.trim() !== "") ||
      (typeof body?.elapsedMs === "number" && body.elapsedMs < 3000)) {
    return send(res, 200, { ok: true });
  }

  const { data, error } = validateReview(body);
  if (error) return send(res, 400, { ok: false, error });

  const ipHash = hashValue("ip", ip);
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recent = await countRows("testimonials", `ip_hash=eq.${ipHash}&created_at=gte.${encodeURIComponent(since)}`);
    if (recent >= IP_LIMIT_PER_DAY) {
      return send(res, 429, { ok: false, error: "Thanks! We've already received your review today." });
    }

    const row = { ...data, published: false, sort_order: 1000 };
    const result = await insertRow("testimonials", { ...row, source: "website", ip_hash: ipHash }, row);
    if (!result.ok) {
      if (result.rateLimited) {
        return send(res, 429, { ok: false, error: "Thanks! We've already received your review." });
      }
      console.error("review insert failed", result.detail);
      return send(res, 500, { ok: false, error: "Could not send your review. Please try again." });
    }
  } catch (e) {
    console.error("review error", e?.message);
    return send(res, 500, { ok: false, error: "Could not send your review. Please try again." });
  }

  try {
    await notify({
      subject: `New review awaiting approval: ${data.name} (${data.rating}\u2605)`,
      heading: "New website review \u2014 awaiting approval",
      rows: [
        ["Name", data.name],
        ["Course / role", data.role || "\u2014"],
        ["Rating", `${data.rating} / 5`],
        ["Review", data.content],
      ],
      footer: "Approve or delete it in Admin \u2192 Testimonials. It is hidden until you publish it.",
    });
  } catch (e) {
    console.error("notification error", e?.message);
  }

  return send(res, 200, { ok: true });
}
