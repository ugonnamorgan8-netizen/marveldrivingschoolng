// Client helpers for the /api serverless functions.
// The server re-validates everything; option lists live in ./options.ts.
export { COURSES, VEHICLES, BRANCHES, PREFERRED_TIMES } from "./options";

export type EnquiryInput = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  service?: string;
  vehicle?: string;
  branch?: string;
  preferredTime?: string;
  source: "hero" | "contact" | "booking";
  /** honeypot — must stay empty */
  website?: string;
  /** ms between form render and submit (bot check) */
  elapsedMs?: number;
};

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;

/** Quick client-side check for instant feedback. Returns an error message or null. */
export const checkEnquiry = (d: EnquiryInput): string | null => {
  if (d.name.trim().length < 2) return "Please enter your full name.";
  const digits = d.phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return "Please enter a valid phone number.";
  const email = (d.email ?? "").trim();
  if (d.source === "contact" && !email) return "Please enter your email address.";
  if (email && !EMAIL_RE.test(email)) return "Please enter a valid email address.";
  if ((d.source === "hero" || d.source === "booking") && (!d.vehicle || !d.branch)) {
    return "Please choose your preferred vehicle and branch.";
  }
  if ((d.message ?? "").length > 2000) return "Message is too long (max 2000 characters).";
  return null;
};

const post = async (path: string, data: unknown): Promise<{ ok: boolean; error?: string }> => {
  try {
    const r = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await r.json().catch(() => ({}));
    if (r.ok && json.ok) return { ok: true };
    return { ok: false, error: json.error || "Could not send. Please try again." };
  } catch {
    return { ok: false, error: "Network error. Please check your connection and try again." };
  }
};

export const submitEnquiry = (data: EnquiryInput) => post("/api/enquiry", data);

export type ReviewInput = {
  name: string;
  role?: string;
  content: string;
  rating: number;
  website?: string;
  elapsedMs?: number;
};

export const checkReview = (d: ReviewInput): string | null => {
  if (d.name.trim().length < 2) return "Please enter your name.";
  if (!(d.rating >= 1 && d.rating <= 5)) return "Please choose a star rating.";
  if (d.content.trim().length < 20) return "Please write at least 20 characters about your experience.";
  if (d.content.length > 800) return "Please keep your review under 800 characters.";
  return null;
};

export const submitReview = (data: ReviewInput) => post("/api/review", data);

// ---------- analytics ----------
const sessionId = (() => {
  try {
    let id = sessionStorage.getItem("mds_sid");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("mds_sid", id);
    }
    return id;
  } catch {
    return undefined;
  }
})();

export const trackEvent = (type: "pageview" | "click", path: string, label?: string) => {
  if (import.meta.env.DEV && !import.meta.env.VITE_TRACK_IN_DEV) return;
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        path,
        label,
        referrer: type === "pageview" ? document.referrer : undefined,
        sid: sessionId,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* analytics must never break the page */
  }
};
