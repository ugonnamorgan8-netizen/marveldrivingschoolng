import { useRef, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BRANCHES, COURSES, VEHICLES, checkEnquiry, submitEnquiry } from "@/lib/api";

interface Props {
  source: "hero" | "booking";
  /** Pre-selected course (e.g. when opened from a course card). */
  defaultCourse?: string;
  /** Show the course picker + optional email (booking popup). */
  extended?: boolean;
  idPrefix: string;
  onSuccess?: () => void;
}

type FormState = { name: string; phone: string; email: string; course: string; vehicle: string; branch: string; website: string };

/** Quick enrollment form — same fields as the hero card; the popup adds course + optional email. */
const EnrollmentForm = ({ source, defaultCourse, extended = false, idPrefix, onSuccess }: Props) => {
  const { toast } = useToast();
  const startedAt = useRef(Date.now());
  const [form, setForm] = useState<FormState>({
    name: "", phone: "", email: "", course: defaultCourse ?? "", vehicle: "", branch: "", website: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: keyof FormState) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      service: form.course || undefined,
      vehicle: form.vehicle || undefined,
      branch: form.branch || undefined,
      website: form.website,
      source,
      elapsedMs: Date.now() - startedAt.current,
    };
    const problem = checkEnquiry(payload);
    if (problem) {
      toast({ title: "Please check the form", description: problem, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const result = await submitEnquiry(payload);
    setSubmitting(false);
    if (!result.ok) {
      toast({ title: "Could not send", description: result.error, variant: "destructive" });
      return;
    }
    setDone(true);
    onSuccess?.();
  };

  if (done) {
    return (
      <div className="text-center py-4">
        <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
        <p className="text-lg font-bold mb-1">Request received!</p>
        <p className="text-sm text-muted-foreground">
          Thank you. Our team will call or WhatsApp you shortly to confirm your lesson.
        </p>
      </div>
    );
  }

  const label = "text-sm font-medium leading-none";
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 relative">
      {/* Honeypot: hidden from people, bots fill it in */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website")(e.target.value)} />
        </label>
      </div>

      <div className="space-y-2">
        <label className={label} htmlFor={`${idPrefix}-name`}>Full Name *</label>
        <Input id={`${idPrefix}-name`} placeholder="John Doe" autoComplete="name" maxLength={100} required
          value={form.name} onChange={(e) => set("name")(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className={label} htmlFor={`${idPrefix}-phone`}>Phone Number *</label>
        <Input id={`${idPrefix}-phone`} type="tel" inputMode="tel" placeholder="+234 8XX XXX XXXX" autoComplete="tel"
          maxLength={30} required value={form.phone} onChange={(e) => set("phone")(e.target.value)} />
      </div>

      {extended && (
        <>
          <div className="space-y-2">
            <label className={label} htmlFor={`${idPrefix}-email`}>
              Email <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Input id={`${idPrefix}-email`} type="email" placeholder="you@example.com" autoComplete="email"
              maxLength={254} value={form.email} onChange={(e) => set("email")(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className={label} id={`${idPrefix}-course-label`}>Course</label>
            <Select value={form.course || undefined} onValueChange={set("course")}>
              <SelectTrigger id={`${idPrefix}-course`} aria-labelledby={`${idPrefix}-course-label`}>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {COURSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <div className="space-y-2">
        <label className={label} id={`${idPrefix}-vehicle-label`}>Preferred Vehicle *</label>
        <Select value={form.vehicle || undefined} onValueChange={set("vehicle")}>
          <SelectTrigger id={`${idPrefix}-vehicle`} aria-labelledby={`${idPrefix}-vehicle-label`}>
            <SelectValue placeholder="Select vehicle type" />
          </SelectTrigger>
          <SelectContent>
            {VEHICLES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className={label} id={`${idPrefix}-branch-label`}>Preferred Branch *</label>
        <Select value={form.branch || undefined} onValueChange={set("branch")}>
          <SelectTrigger id={`${idPrefix}-branch`} aria-labelledby={`${idPrefix}-branch-label`}>
            <SelectValue placeholder="Select a branch" />
          </SelectTrigger>
          <SelectContent>
            {BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" variant="success" disabled={submitting} data-track={`${source}_form_submit`}
        className="w-full rounded-full h-12 text-base">
        {submitting ? <><Loader2 className="animate-spin" /> Sending…</> : "Book a Lesson"}
      </Button>
    </form>
  );
};

export default EnrollmentForm;
