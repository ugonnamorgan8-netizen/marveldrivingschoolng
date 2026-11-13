import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Phone, Mail, Trash2, MessageCircle, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Status = "new" | "contacted" | "enrolled" | "archived";

type Enrollment = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  vehicle: string | null;
  branch: string | null;
  service: string | null;
  preferred_time: string | null;
  source: string | null;
  message: string | null;
  status: Status;
  admin_notes: string | null;
  created_at: string;
};

const statusColors: Record<Status, string> = {
  new: "bg-primary text-primary-foreground",
  contacted: "bg-amber-500 text-white",
  enrolled: "bg-green-600 text-white",
  archived: "bg-muted text-muted-foreground",
};

const AdminEnrollments = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | "all">("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("enrollments")
      .select("id, full_name, email, phone, service, vehicle, branch, preferred_time, source, message, status, admin_notes, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setItems((data ?? []) as Enrollment[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("enrollments").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this enrollment? This cannot be undone.")) return;
    const { error } = await supabase.from("enrollments").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    setItems(prev => prev.filter(i => i.id !== id));
    toast({ title: "Deleted" });
  };

  const visible = filter === "all" ? items : items.filter(i => i.status === filter);

  const exportCsv = () => {
    const cols = ["created_at", "full_name", "phone", "email", "service", "vehicle", "branch", "preferred_time", "source", "status", "message"] as const;
    // Prefix risky leading characters so spreadsheet apps never treat a cell as a formula.
    const cell = (v: unknown) => {
      let t = v == null ? "" : String(v);
      if (/^[=+\-@\t\r]/.test(t)) t = "'" + t;
      return `"${t.replace(/"/g, '""')}"`;
    };
    const csv = [cols.join(","), ...visible.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const newCount = items.filter(i => i.status === "new").length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Enquiries</h1>
          <p className="text-sm text-muted-foreground">
            {newCount} new {newCount === 1 ? "submission" : "submissions"}
          </p>
        </div>
        <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={exportCsv} disabled={visible.length === 0}>
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
        <Select value={filter} onValueChange={(v) => setFilter(v as Status | "all")}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ({items.length})</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="enrolled">Enrolled</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : visible.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">No enquiries yet.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {visible.map((e) => (
            <Card key={e.id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg">{e.full_name}</h3>
                      <Badge className={statusColors[e.status]}>{e.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(e.created_at).toLocaleString()}
                      {" · "}
                      {e.source === "hero" ? "Homepage quick enrollment" : e.source === "booking" ? "Book-a-lesson popup" : "Contact form"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={e.status} onValueChange={(v) => updateStatus(e.id, v as Status)}>
                      <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="enrolled">Enrolled</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => remove(e.id)} aria-label="Delete">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                  <a href={`tel:${e.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-2 text-foreground hover:text-primary">
                    <Phone className="w-4 h-4" /> {e.phone}
                  </a>
                  <a
                    href={`https://wa.me/${e.phone.replace(/\D/g, "").replace(/^0/, "234")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-foreground hover:text-primary"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                  {e.email ? (
                    <a href={`mailto:${e.email}`} className="flex items-center gap-2 text-foreground hover:text-primary break-all">
                      <Mail className="w-4 h-4 flex-shrink-0" /> {e.email}
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4 flex-shrink-0" /> No email given
                    </span>
                  )}
                </div>

                {e.service && <p className="mt-3 text-sm"><span className="font-medium">Interested in:</span> {e.service}</p>}
                {e.vehicle && <p className="mt-1 text-sm"><span className="font-medium">Vehicle:</span> {e.vehicle}</p>}
                {e.branch && <p className="mt-1 text-sm"><span className="font-medium">Branch:</span> {e.branch}</p>}
                {e.preferred_time && <p className="mt-1 text-sm"><span className="font-medium">Preferred time:</span> {e.preferred_time}</p>}
                {e.message && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap">
                    {e.message}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEnrollments;