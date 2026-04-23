import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  phone: string;
  email: string;
  address: string;
  hours: string;
  pricing_note: string;
};

export const defaultSettings: SiteSettings = {
  phone: "+234 816 597 3142",
  email: "info@marveldrivingschool.com",
  address: "BCA Road by Secretariat, Umuahia",
  hours: "Mon–Thu: 8:30 AM – 5:30 PM • Fri (Theory): 10:00 AM – 5:30 PM",
  pricing_note: "Pricing varies by program. Contact us for the latest rates.",
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "general")
        .maybeSingle();
      if (!active) return;
      if (data?.value) {
        setSettings({ ...defaultSettings, ...(data.value as Partial<SiteSettings>) });
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { settings, loading };
};
