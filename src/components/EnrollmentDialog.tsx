import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Loader2 } from "lucide-react";

const VEHICLES = [
  "Manual Car",
  "Automatic Car",
  "Both (Automatic & Manual)",
  "Motorcycle",
  "Tricycle (Keke)",
  "Truck",
];

const COURSES = [
  "1 Month Beginners Course (₦90,000)",
  "2 Weeks Refresher Course (₦55,000)",
  "Motorcycle Training",
  "Tricycle (Keke) Training",
  "Truck Training",
  "Mock Test / CBT Prep",
  "Friday Theory Class",
  "Basic Car Maintenance",
  "FRSC Driver's License Processing",
  "International Driver's License (IDP)",
  "Other / Not sure yet",
];

const BRANCHES = [
  "Head Office — Old Timber Junction, Umuahia",
  "Office 1 — Umudike",
  "Office 2 — BCA Road (Practical Training Ground)",
  "Office 3 — Aba Road, Umuahia",
];

const EXPERIENCE = [
  "Complete Beginner",
  "Some Experience",
  "Returning / Refresher",
  "Already Licensed",
];

export type EnrollmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCourse?: string;
  defaultVehicle?: string;
  triggerSource?: string;
};

const EnrollmentDialog = ({
  open,
  onOpenChange,
  defaultCourse,
  defaultVehicle,
  triggerSource,
}: EnrollmentDialogProps) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    course: defaultCourse ?? "",
    vehicle: defaultVehicle ?? "",
    branch: "",
    experience: "",
    startDate: "",
    notes: "",
  });

  // Reset / prefill when reopened with new defaults
  useEffect(() => {
    if (open) {
      setSuccess(false);
      setForm((prev) => ({
        ...prev,
        course: defaultCourse ?? prev.course,
        vehicle: defaultVehicle ?? prev.vehicle,
      }));
    }
  }, [open, defaultCourse, defaultVehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.course || !form.vehicle || !form.branch) {
      toast({
        title: "Please fill required fields",
        description: "Name, phone, course, vehicle and branch are required.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    const messageParts = [
      `Preferred Course: ${form.course}`,
      `Preferred Branch: ${form.branch}`,
      form.experience ? `Experience Level: ${form.experience}` : null,
      form.startDate ? `Preferred Start Date: ${form.startDate}` : null,
      triggerSource ? `Source: ${triggerSource}` : null,
      form.notes ? `\nAdditional Notes:\n${form.notes}` : null,
    ].filter(Boolean);

    const { error } = await supabase.from("enrollments").insert({
      full_name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || "not-provided@marvel.local",
      service: `Vehicle: ${form.vehicle} • Course: ${form.course}`,
      message: messageParts.join("\n"),
    });

    setSubmitting(false);

    if (error) {
      toast({
        title: "Could not submit",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setSuccess(true);
    toast({
      title: "Enrollment received!",
      description: "Our team will reach out to you shortly via WhatsApp or call.",
    });
    setForm({
      name: "",
      phone: "",
      email: "",
      course: "",
      vehicle: "",
      branch: "",
      experience: "",
      startDate: "",
      notes: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {success ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">You're all set!</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Your enrollment request has been received. A Marvel Driving School
              representative will contact you within 24 hours to confirm your slot.
            </p>
            <Button onClick={() => onOpenChange(false)} size="lg">
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Enroll at Marvel Driving School</DialogTitle>
              <DialogDescription>
                Fill in your details and we'll reach out to confirm your training slot.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ed-name">Full Name *</Label>
                  <Input
                    id="ed-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ed-phone">Phone / WhatsApp *</Label>
                  <Input
                    id="ed-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+234 8XX XXX XXXX"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ed-email">Email (optional)</Label>
                <Input
                  id="ed-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Preferred Course / Service *</Label>
                  <Select
                    value={form.course}
                    onValueChange={(v) => setForm({ ...form, course: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a program" />
                    </SelectTrigger>
                    <SelectContent>
                      {COURSES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Preferred Vehicle *</Label>
                  <Select
                    value={form.vehicle}
                    onValueChange={(v) => setForm({ ...form, vehicle: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLES.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Preferred Branch *</Label>
                  <Select
                    value={form.branch}
                    onValueChange={(v) => setForm({ ...form, branch: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANCHES.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Experience Level</Label>
                  <Select
                    value={form.experience}
                    onValueChange={(v) => setForm({ ...form, experience: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Optional" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="ed-start">Preferred Start Date</Label>
                <Input
                  id="ed-start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="ed-notes">Additional Notes</Label>
                <Textarea
                  id="ed-notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Anything else we should know? (e.g. preferred time of day, special requests)"
                  className="min-h-[90px]"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="sm:w-auto"
                  onClick={() => onOpenChange(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Enrollment"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentDialog;
