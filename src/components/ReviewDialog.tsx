import { useRef, useState } from "react";
import { CheckCircle2, Loader2, Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { checkReview, submitReview } from "@/lib/api";

const MAX = 800;

const ReviewForm = ({ onDone }: { onDone: () => void }) => {
  const { toast } = useToast();
  const startedAt = useRef(Date.now());
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, role, content, rating, website, elapsedMs: Date.now() - startedAt.current };
    const problem = checkReview(payload);
    if (problem) {
      toast({ title: "Please check your review", description: problem, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const result = await submitReview(payload);
    setSubmitting(false);
    if (!result.ok) {
      toast({ title: "Could not send", description: result.error, variant: "destructive" });
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="text-center py-4">
        <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
        <p className="text-lg font-bold mb-1">Thank you for your review!</p>
        <p className="text-sm text-muted-foreground mb-5">
          It will appear on the website once our team has checked it.
        </p>
        <Button variant="outline" size="sm" onClick={onDone}>Close</Button>
      </div>
    );
  }

  const shown = hover || rating;
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 relative">
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-medium mb-2">Your rating *</legend>
        <div className="flex gap-1" role="radiogroup" aria-label="Star rating" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              className="p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Star className={`w-7 h-7 transition-colors ${n <= shown ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="rv-name" className="text-sm font-medium">Your name *</label>
        <Input id="rv-name" autoComplete="name" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ada O." />
      </div>
      <div className="space-y-2">
        <label htmlFor="rv-role" className="text-sm font-medium">
          Course taken <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Input id="rv-role" maxLength={60} value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. 1 Month Beginners Course" />
      </div>
      <div className="space-y-2">
        <label htmlFor="rv-content" className="text-sm font-medium">Your experience *</label>
        <Textarea id="rv-content" rows={5} maxLength={MAX} value={content} onChange={(e) => setContent(e.target.value)}
          placeholder="Tell others what learning with Marvel Driving School was like…" />
        <p className="text-xs text-muted-foreground text-right">{content.length}/{MAX}</p>
      </div>

      <Button type="submit" disabled={submitting} className="w-full rounded-full" data-track="review_submit">
        {submitting ? <><Loader2 className="animate-spin" /> Sending…</> : "Submit Review"}
      </Button>
      <p className="text-[11px] text-muted-foreground text-center">
        Reviews are checked by our team before they are published.
      </p>
    </form>
  );
};

const ReviewDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md max-h-[92svh] overflow-y-auto rounded-2xl">
      <DialogHeader className="text-left">
        <DialogTitle className="text-xl font-bold">Share Your Experience</DialogTitle>
        <DialogDescription>Trained with us? Tell future students how it went.</DialogDescription>
      </DialogHeader>
      {open && <ReviewForm onDone={() => onOpenChange(false)} />}
    </DialogContent>
  </Dialog>
);

export default ReviewDialog;
