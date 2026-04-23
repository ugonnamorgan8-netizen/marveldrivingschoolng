import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

type Settings = {
  phone: string;
  email: string;
  address: string;
  hours: string;
  pricing_note: string;
};

const defaults: Settings = {
  phone: "+234 816 597 3142",
  email: "info@marveldrivingschool.com",
  address: "BCA Road by Secretariat, Umuahia",
  hours: "Mon–Thu: 8:30 AM – 5:30 PM • Fri (Theory): 10:00 AM – 5:30 PM",
  pricing_note: "Pricing varies by program. Contact us for the latest rates.",
};

const AdminSettings = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<Settings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("key", "general").maybeSingle();
      if (data?.value) setForm({ ...defaults, ...(data.value as Settings) });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { data: existing } = await supabase.from("site_settings").select("key").eq("key", "general").maybeSingle();
    const { error } = existing
      ? await supabase.from("site_settings").update({ value: form as any }).eq("key", "general")
      : await supabase.from("site_settings").insert({ key: "general", value: form as any });
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Settings saved" });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Site Settings</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Phone / WhatsApp</label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">Address</label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">Operating Hours</label>
            <Input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">Pricing Note</label>
            <Textarea value={form.pricing_note} onChange={(e) => setForm({ ...form, pricing_note: e.target.value })} rows={3} />
          </div>
          <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          <p className="text-xs text-muted-foreground">
            Note: These settings are stored in the database. Public pages will need to be wired to read from here as you decide what to expose.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;