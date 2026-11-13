import { useCallback, useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Pair = { name: string; value: number };
type Daily = { date: string; pageviews: number; visitors: number; enquiries: number };
type Analytics = {
  days: number;
  totals: { pageviews: number; visitors: number; sessions: number; clicks: number; enquiries: number; new_enquiries: number };
  daily: Daily[];
  top_pages: Pair[];
  referrers: Pair[];
  devices: Pair[];
  countries: Pair[];
  clicks: Pair[];
  enquiry_status: Pair[];
  enquiry_sources: Pair[];
  enquiry_services: Pair[];
  enquiry_branches?: Pair[];
  enquiry_vehicles?: Pair[];
  pending_reviews?: number;
};

const RANGES = [7, 30, 90] as const;
const nf = new Intl.NumberFormat("en-NG");
const shortDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

const CLICK_LABELS: Record<string, string> = {
  hero_view_services: "Hero · View Services",
  hero_form_submit: "Quick Enrollment · Submit",
  booking_form_submit: "Book-a-lesson popup · Submit",
  review_open: "Testimonials · Share Experience",
  review_submit: "Review form · Submit",
  facebook_reviews: "Testimonials · Facebook reviews",
  blog_book_training: "Blog post · Book training",
  contact_form_submit: "Contact form · Submit",
  nav_book_now: "Nav · Book Now",
  nav_book_now_mobile: "Nav · Book Now (mobile)",
  whatsapp_cta_banner: "WhatsApp · CTA banner",
  whatsapp_faq: "WhatsApp · FAQ",
  whatsapp_footer: "WhatsApp · Footer",
  contact_phone: "Contact · Phone/WhatsApp",
  contact_email: "Contact · Email",
  contact_instagram: "Contact · Instagram",
  contact_facebook: "Contact · Facebook",
  email_footer: "Footer · Email",
  instagram: "Gallery · Instagram",
  instagram_footer: "Footer · Instagram",
  cta_book_first_lesson: "CTA · Book First Lesson",

};

const SOURCE_LABELS: Record<string, string> = {
  hero: "Homepage quick enrollment",
  booking: "Book-a-lesson popup",
  contact: "Contact form",
};

const labelForClick = (s: string) =>
  CLICK_LABELS[s] ??
  (s.startsWith("enroll_")
    ? `Services · Enroll: ${s.slice(7).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`
    : s);

const Stat = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <Card>
    <CardContent className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold mt-1 tabular-nums">{value}</p>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </CardContent>
  </Card>
);

/** Ranked list with a proportional bar: label and value in text ink, bar carries the magnitude. */
const RankList = ({ title, items, format = (s: string) => s }: { title: string; items: Pair[]; format?: (s: string) => string }) => {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-base font-semibold mb-4">{title}</h3>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data yet.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((i) => (
              <li key={i.name} title={`${format(i.name)}: ${nf.format(i.value)}`}>
                <div className="flex justify-between gap-3 text-sm mb-1">
                  <span className="truncate">{format(i.name)}</span>
                  <span className="tabular-nums text-muted-foreground">{nf.format(i.value)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(i.value / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

const tooltipStyle = {
  contentStyle: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 8,
    fontSize: 12,
    color: "hsl(var(--foreground))",
  },
  labelFormatter: (d: string) => shortDate(d),
};

const axisProps = {
  tick: { fontSize: 11, fill: "hsl(var(--muted-foreground))" },
  tickLine: false,
  axisLine: false,
} as const;

const AdminAnalytics = () => {
  const [days, setDays] = useState<(typeof RANGES)[number]>(30);
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: res, error: err } = await supabase.rpc("admin_analytics", { p_days: days });
    if (err) {
      setError(
        err.message.includes("admin_analytics") || err.code === "PGRST202"
          ? "Analytics isn't set up yet. Run the launch SQL migration in Supabase (see DEPLOYMENT.md)."
          : err.message
      );
      setData(null);
    } else {
      setData(res as unknown as Analytics);
    }
    setLoading(false);
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  const t = data?.totals;
  const conversion = t && t.visitors > 0 ? `${((t.enquiries / t.visitors) * 100).toFixed(1)}%` : "—";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">Website traffic and enquiries (Lagos time)</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border p-0.5 bg-card" role="group" aria-label="Date range">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setDays(r)}
                aria-pressed={days === r}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  days === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}d
              </button>
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={load} aria-label="Refresh" disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {loading && !data ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : error ? (
        <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">{error}</CardContent></Card>
      ) : data && t ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat label="Page views" value={nf.format(t.pageviews)} hint={`${nf.format(t.sessions)} sessions`} />
            <Stat label="Visitors" value={nf.format(t.visitors)} hint="Unique per day" />
            <Stat label="Enquiries" value={nf.format(t.enquiries)} hint={`${nf.format(t.new_enquiries)} awaiting reply`} />
            <Stat label="Enquiry rate" value={conversion} hint={`Enquiries ÷ visitors${data.pending_reviews ? ` · ${data.pending_reviews} review(s) to approve` : ""}`} />
          </div>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold">Page views per day</h3>
                <button className="text-xs text-primary hover:underline" onClick={() => setShowTable((v) => !v)}>
                  {showTable ? "Hide table" : "Show as table"}
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.daily} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tickFormatter={shortDate} minTickGap={24} {...axisProps} />
                    <YAxis allowDecimals={false} width={44} {...axisProps} />
                    <Tooltip {...tooltipStyle} cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }} />
                    <Area
                      type="monotone"
                      dataKey="pageviews"
                      name="Page views"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="hsl(var(--primary))"
                      fillOpacity={0.12}
                      activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {showTable && (
                <div className="mt-4 max-h-64 overflow-auto border border-border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr>
                        <th className="text-left p-2 font-medium">Date</th>
                        <th className="text-right p-2 font-medium">Page views</th>
                        <th className="text-right p-2 font-medium">Visitors</th>
                        <th className="text-right p-2 font-medium">Enquiries</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...data.daily].reverse().map((d) => (
                        <tr key={d.date} className="border-t border-border">
                          <td className="p-2">{shortDate(d.date)}</td>
                          <td className="p-2 text-right tabular-nums">{nf.format(d.pageviews)}</td>
                          <td className="p-2 text-right tabular-nums">{nf.format(d.visitors)}</td>
                          <td className="p-2 text-right tabular-nums">{nf.format(d.enquiries)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="text-base font-semibold mb-4">Enquiries per day</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.daily} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tickFormatter={shortDate} minTickGap={24} {...axisProps} />
                    <YAxis allowDecimals={false} width={44} {...axisProps} />
                    <Tooltip {...tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
                    <Bar dataKey="enquiries" name="Enquiries" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <RankList title="Button & link clicks" items={data.clicks} format={labelForClick} />
            <RankList title="Enquiries by course" items={data.enquiry_services} />
            <RankList title="Enquiries by branch" items={data.enquiry_branches ?? []} />
            <RankList title="Enquiries by vehicle" items={data.enquiry_vehicles ?? []} />
            <RankList title="Where visitors come from" items={data.referrers} />
            <RankList title="Top pages" items={data.top_pages} />
            <RankList title="Devices" items={data.devices} format={(s) => s.charAt(0).toUpperCase() + s.slice(1)} />
            <RankList title="Countries" items={data.countries} format={(s) => (s === "??" ? "Unknown" : s)} />
            <RankList title="Enquiries by form" items={data.enquiry_sources} format={(s) => SOURCE_LABELS[s] ?? s} />
            <RankList title="Enquiries by status" items={data.enquiry_status} format={(s) => s.charAt(0).toUpperCase() + s.slice(1)} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminAnalytics;
