// POST /api/enquiry \u2014 receives booking/enquiry forms, stores them in Supabase
// and emails the school via Resend.
//
// Required env (Vercel \u2192 Project \u2192 Settings \u2192 Environment Variables):
//   SUPABASE_SERVICE_ROLE_KEY   server-only secret, NEVER prefix with VITE_
//   SUPABASE_URL                (falls back to VITE_SUPABASE_URL)
//   RESEND_API_KEY              for email notifications (optional but recommended)
//   NOTIFY_EMAIL_TO             where enquiry emails go (comma separated)
//   NOTIFY_EMAIL_FROM           e.g. "Marvel Driving School <bookings@yourdomain>"
//   IP_HASH_SALT                any long random string
//   ALLOWED_ORIGINS             optional extra origins, comma separated
import { EMAIL_RE, NAME_RE, burstLimited, cleanText, clientIp, guard, hashValue, readJson, send, supabaseConfig } from "./_lib/http.js";
import { BRANCHES, COURSES, PREFERRED_TIMES, VEHICLES } from "./_lib/options.js";
import { countRows, insertRow } from "./_lib/supabase.js";
import { notify } from "./_lib/email.js";

const SOURCES = ["hero", "contact", "booking"];
const SOURCE_LABELS = { hero: "Homepage quick enrollment", contact: "Contact form", booking: "Book-a-lesson popup" };


const IP_LIMIT_PER_HOUR = 5;

const oneOf = (value, list) => {
  const v = cleanText(value, 120);
  return v && list.includes(v) ? v : v ? undefined : null; // undefined = invalid, null = empty
};

/** Validate + sanitise. Returns { data } or { error }. */
export const validateEnquiry = (body) => {
  if (!body || typeof body !== "object") return { error: "Invalid request" };

  const full_name = cleanText(body.name, 100);
  const email = cleanText(body.email, 254).toLowerCase();
  const phone = cleanText(body.phone, 30);
  const message = cleanText(body.message, 2000, { multiline: true });
  const source = SOURCES.includes(body.source) ? body.source : "contact";
  const service = oneOf(body.service, COURSES);
  const vehicle = oneOf(body.vehicle, VEHICLES);
  const branch = oneOf(body.branch, BRANCHES);
  const preferred_time = oneOf(body.preferredTime, PREFERRED_TIMES);

  if (full_name.length < 2 || !NAME_RE.test(full_name)) return { error: "Please enter your full name." };
  const digits = phone.replace(/\D/g, "");
  if (!/^[+\d][\d\s()-]*$/.test(phone) || digits.length < 7 || digits.length > 15) {
    return { error: "Please enter a valid phone number." };
  }
  if (email && !EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (source === "contact" && !email) return { error: "Please enter your email address." };
  if (service === undefined) return { error: "Please choose a valid course." };
  if (vehicle === undefined) return { error: "Please choose a valid vehicle type." };
  if (branch === undefined) return { error: "Please choose a valid branch." };
  if (preferred_time === undefined) return { error: "Please choose a valid time." };
  if ((source === "hero" || source === "booking") && (!vehicle || !branch)) {
    return { error: "Please choose your preferred vehicle and branch." };
  }

  return {
    data: { full_name, email: email || null, phone, message: message || null, service, vehicle, branch, preferred_time, source },
  };
};

/** Row shape for a database that hasn't had the launch migration yet. */
const legacyRow = (d) => ({
  full_name: d.full_name,
  email: d.email || "",
  phone: d.phone,
  service: d.service,
  message:
    [
      d.message,
      d.vehicle && `Vehicle: ${d.vehicle}`,
      d.branch && `Branch: ${d.branch}`,
      d.preferred_time && `Preferred time: ${d.preferred_time}`,
      `Form: ${SOURCE_LABELS[d.source]}`,
    ]
      .filter(Boolean)
      .join("\n") || null,
});

export default async function handler(req, res) {
  if (!guard(req, res)) return;

  const { url, serviceKey } = supabaseConfig();
  if (!url || !serviceKey) {
    console.error("enquiry: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not configured");
    return send(res, 500, { ok: false, error: "Booking is temporarily unavailable. Please contact us on WhatsApp." });
  }

  const ip = clientIp(req);
  if (burstLimited(`enq:${ip}`, 3, 60_000)) {
    return send(res, 429, { ok: false, error: "Too many requests. Please wait a minute and try again." });
  }

  let body;
  try {
    body = await readJson(req);
  } catch (e) {
    return send(res, e.status === 413 ? 413 : 400, { ok: false, error: "Invalid request" });
  }

  // Bot traps: hidden honeypot field filled in, or form submitted inhumanly fast.
  if ((typeof body?.website === "string" && body.website.trim() !== "") ||
      (typeof body?.elapsedMs === "number" && body.elapsedMs < 1500)) {
    return send(res, 200, { ok: true }); // pretend success, store nothing
  }

  const { data, error } = validateEnquiry(body);
  if (error) return send(res, 400, { ok: false, error });

  const ipHash = hashValue("ip", ip);
  const genericError = { ok: false, error: "Could not send your request. Please try again or use WhatsApp." };

  try {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recent = await countRows("enrollments", `ip_hash=eq.${ipHash}&created_at=gte.${encodeURIComponent(since)}`);
    if (recent >= IP_LIMIT_PER_HOUR) {
      return send(res, 429, {
        ok: false,
        error: "You've sent several requests already. We'll be in touch soon \u2014 or message us on WhatsApp.",
      });
    }

    const result = await insertRow("enrollments", { ...data, ip_hash: ipHash }, legacyRow(data));
    if (!result.ok) {
      if (result.rateLimited) {
        return send(res, 429, { ok: false, error: "We've already received your request. We'll be in touch soon." });
      }
      console.error("enquiry insert failed", result.detail);
      return send(res, 500, genericError);
    }
  } catch (e) {
    console.error("enquiry error", e?.message);
    return send(res, 500, genericError);
  }

  // Saved. Email failure must not fail the user's submission.
  try {
    await notify({
      subject: `New enquiry: ${data.full_name}${data.service ? ` \u2014 ${data.service}` : ""}`,
      heading: "New enquiry \u2014 Marvel Driving School",
      replyTo: data.email,
      rows: [
        ["Name", data.full_name],
        ["Phone", data.phone],
        ["Email", data.email || "\u2014"],
        ["Course", data.service || "\u2014"],
        ["Vehicle", data.vehicle || "\u2014"],
        ["Branch", data.branch || "\u2014"],
        ["Preferred time", data.preferred_time || "\u2014"],
        ["Form", SOURCE_LABELS[data.source]],
        ["Message", data.message || "\u2014"],
      ],
      footer: data.email ? "Reply to this email to answer the student directly." : "No email given \u2014 call or WhatsApp the student.",
    });
  } catch (e) {
    console.error("notification error", e?.message);
  }

  return send(res, 200, { ok: true });
}
