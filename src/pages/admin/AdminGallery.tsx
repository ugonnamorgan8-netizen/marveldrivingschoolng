import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Trash2 } from "lucide-react";

type Img = {
  id: string;
  title: string;
  alt_text: string;
  image_url: string;
  sort_order: number;
};

const AdminGallery = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<Img[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery_images").select("*").order("sort_order", { ascending: true });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setImages((data ?? []) as Img[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onFile = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `gallery/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("gallery-images").upload(path, file);
    if (upErr) { toast({ title: "Upload failed", description: upErr.message, variant: "destructive" }); setUploading(false); return; }
    const { data } = supabase.storage.from("gallery-images").getPublicUrl(path);
    const next = (images[images.length - 1]?.sort_order ?? 0) + 1;
    const { error } = await supabase.from("gallery_images").insert({
      title: file.name, alt_text: file.name, image_url: data.publicUrl, sort_order: next,
    });
    if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); setUploading(false); return; }
    toast({ title: "Image added" });
    setUploading(false);
    load();
  };

  const updateField = async (id: string, patch: Partial<Img>) => {
    setImages(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
    await supabase.from("gallery_images").update(patch).eq("id", id);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    setImages(p => p.filter(i => i.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Gallery</h1>
          <p className="text-sm text-muted-foreground">{images.length} images</p>
        </div>
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer text-sm font-semibold hover:opacity-90">
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload Image"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : images.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">No images yet.</CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <Card key={img.id} className="overflow-hidden">
              <img src={img.image_url} alt={img.alt_text} className="w-full aspect-square object-cover" />
              <CardContent className="p-3 space-y-2">
                <Input
                  defaultValue={img.title}
                  placeholder="Title"
                  onBlur={(e) => updateField(img.id, { title: e.target.value })}
                />
                <Input
                  defaultValue={img.alt_text}
                  placeholder="Alt text (for accessibility)"
                  onBlur={(e) => updateField(img.id, { alt_text: e.target.value })}
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    defaultValue={img.sort_order}
                    onBlur={(e) => updateField(img.id, { sort_order: Number(e.target.value) })}
                    className="w-24"
                  />
                  <span className="text-xs text-muted-foreground">order</span>
                  <Button size="sm" variant="ghost" className="ml-auto" onClick={() => remove(img.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGallery;