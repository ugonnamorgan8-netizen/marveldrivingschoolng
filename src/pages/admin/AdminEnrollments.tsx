import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Phone, Mail, Trash2, Car, MapPin } from "lucide-react";
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
  email: string;
  phone: string;
  service: string | null;
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
      .select("*")
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
  const newCount = items.filter(i => i.status === "new").length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Enrollments</h1>
          <p className="text-sm text-muted-foreground">
            {newCount} new {newCount === 1 ? "submission" : "submissions"}
          </p>
        </div>
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

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : visible.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">No enrollments yet.</CardContent></Card>
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

                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <a href={`tel:${e.phone}`} className="flex items-center gap-2 text-foreground hover:text-primary">
                    <Phone className="w-4 h-4" /> {e.phone}
                  </a>
                  {e.email && e.email.trim() !== "" && (
                    <a href={`mailto:${e.email}`} className="flex items-center gap-2 text-foreground hover:text-primary">
                      <Mail className="w-4 h-4" /> {e.email}
                    </a>
                  )}
                </div>

                {(e.service || e.message) && (
                  <div className="mt-3 grid sm:grid-cols-2 gap-3">
                    {e.service && (
                      <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm">
                        <Car className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicle</div>
                          <div className="font-medium">{e.service.replace(/^Vehicle:\s*/i, "")}</div>
                        </div>
                      </div>
                    )}
                    {e.message && (
                      <div className="flex items-start gap-2 p-3 bg-accent/50 border border-border rounded-lg text-sm">
                        <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Preferred Branch</div>
                          <div className="font-medium whitespace-pre-wrap">{e.message.replace(/^Preferred Branch:\s*/i, "")}</div>
                        </div>
                      </div>
                    )}
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