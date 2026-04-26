import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Car } from "lucide-react";

const VEHICLES = [
  "Manual Car",
  "Automatic Car",
  "Both (Automatic & Manual)",
  "Motorcycle",
  "Tricycle (Keke)",
  "Truck",
];

const BRANCHES = [
  "Office 1 — Umudike",
  "Office 2 — BCA Road (Head Office)",
  "Office 3 — Aba Road",
  "Timber Junction",
];

const QuickEnrollment = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    vehicle: "",
    branch: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.vehicle || !form.branch) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("enrollments").insert({
      full_name: form.name.trim(),
      phone: form.phone.trim(),
      email: "",
      service: form.vehicle,
      message: `Preferred branch: ${form.branch}`,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not submit", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Booking received!", description: "We'll reach out shortly via WhatsApp." });
    setForm({ name: "", phone: "", vehicle: "", branch: "" });
  };

  return (
    <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-large p-6 md:p-7 w-full max-w-md">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Car className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-bold">Quick Enrollment</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Reserve your spot in under a minute.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="qe-name">Full Name *</Label>
          <Input
            id="qe-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <Label htmlFor="qe-phone">Phone Number *</Label>
          <Input
            id="qe-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+234 8XX XXX XXXX"
            required
          />
        </div>
        <div>
          <Label>Preferred Vehicle *</Label>
          <Select value={form.vehicle} onValueChange={(v) => setForm({ ...form, vehicle: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLES.map((v) => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Preferred Branch *</Label>
          <Select value={form.branch} onValueChange={(v) => setForm({ ...form, branch: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a branch" />
            </SelectTrigger>
            <SelectContent>
              {BRANCHES.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          variant="success"
          size="lg"
          className="w-full"
          disabled={submitting}
        >
          {submitting ? "Sending…" : "Book a Lesson"}
        </Button>
      </form>
    </div>
  );
};

export default QuickEnrollment;
