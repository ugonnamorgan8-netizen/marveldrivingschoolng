import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Upload } from "lucide-react";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  image_url: string | null;
  published: boolean;
  published_at: string;
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 80);

const empty: Omit<Post, "id" | "published_at"> = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  category: "General",
  read_time: "5 min read",
  image_url: null,
  published: true,
};

const AdminBlog = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState(empty);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setPosts((data ?? []) as Post[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (p: Post) => {
    setEditing(p);
    setForm({
      slug: p.slug, title: p.title, excerpt: p.excerpt, content: p.content,
      category: p.category, read_time: p.read_time, image_url: p.image_url, published: p.published,
    });
    setOpen(true);
  };

  const handleImage = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `posts/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false); return;
    }
    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    setForm(f => ({ ...f, image_url: data.publicUrl }));
    setUploading(false);
  };

  const save = async () => {
    if (!form.title || !form.excerpt || !form.content) {
      toast({ title: "Missing fields", description: "Title, excerpt and content are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const slug = form.slug || slugify(form.title);
    if (editing) {
      const { error } = await supabase.from("blog_posts").update({ ...form, slug }).eq("id", editing.id);
      if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); setSaving(false); return; }
    } else {
      const { error } = await supabase.from("blog_posts").insert({ ...form, slug });
      if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); setSaving(false); return; }
    }
    toast({ title: editing ? "Post updated" : "Post created" });
    setOpen(false);
    setSaving(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    setPosts(p => p.filter(x => x.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Blog Posts</h1>
          <p className="text-sm text-muted-foreground">{posts.length} posts</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />New Post</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : posts.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">No blog posts yet. Click "New Post" to add one.</CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {posts.map(p => (
            <Card key={p.id} className="overflow-hidden">
              {p.image_url && <img src={p.image_url} alt={p.title} className="w-full aspect-[16/9] object-cover" />}
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <Badge variant="secondary">{p.category}</Badge>
                  {!p.published && <Badge variant="outline">Draft</Badge>}
                </div>
                <h3 className="font-bold mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.excerpt}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="w-3.5 h-3.5 mr-1" />Edit</Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Read time</label>
                <Input value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Slug (auto from title if empty)</label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="my-post-url" />
            </div>
            <div>
              <label className="text-sm font-medium">Excerpt</label>
              <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} />
            </div>
            <div>
              <label className="text-sm font-medium">Cover Image</label>
              <div className="mt-1 flex items-center gap-3">
                {form.image_url && <img src={form.image_url} alt="" className="w-20 h-20 object-cover rounded-md" />}
                <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer text-sm hover:bg-accent">
                  <Upload className="w-4 h-4" />
                  {uploading ? "Uploading..." : "Choose image"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <p className="text-xs text-muted-foreground mb-1">Separate paragraphs with blank lines.</p>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} />
            </div>
            <div className="flex items-center gap-2">
              <input id="pub" type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              <label htmlFor="pub" className="text-sm">Published (visible on site)</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;