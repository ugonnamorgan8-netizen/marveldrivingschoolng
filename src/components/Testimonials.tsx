import { useEffect, useState } from "react";
import { ExternalLink, MessageSquarePlus, Quote, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FACEBOOK_PAGE_URL, FACEBOOK_REVIEWS, type Testimonial } from "@/data/testimonials";
import ReviewDialog from "./ReviewDialog";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FACEBOOK_REVIEWS);
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("name, role, content, rating")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        setTestimonials(data as Testimonial[]);
      }
    })();
  }, []);

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            What Our <span className="bg-gradient-primary bg-clip-text text-transparent">Students Say</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Join hundreds of satisfied students who learned to drive with confidence
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid-3-centered max-w-6xl mx-auto">
          {testimonials.map((t, idx) => (
            <figure
              key={`${t.name}-${idx}`}
              className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-card hover:shadow-hover transition-all duration-300 flex flex-col"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" aria-hidden="true" />
              <div className="flex gap-1 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: Math.min(5, Math.max(0, Math.round(t.rating || 0))) }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
                "{t.content}"
              </blockquote>
              <figcaption className="pt-4 border-t border-border mt-auto">
                <div className="font-bold text-foreground">{t.name}</div>
                {t.role && <div className="text-sm text-muted-foreground">{t.role}</div>}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Leave a review */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button size="lg" className="rounded-full" onClick={() => setReviewOpen(true)} data-track="review_open">
            <MessageSquarePlus /> Share Your Experience
          </Button>
          <Button variant="outline" size="lg" className="rounded-full" asChild>
            <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer" data-track="facebook_reviews">
              Read more on Facebook <ExternalLink />
            </a>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 md:mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">3000+</div>
            <div className="text-sm text-muted-foreground">Happy Students</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-sm text-muted-foreground">Pass Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">8+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Recommend us on Facebook</div>
          </div>
        </div>
      </div>

      <ReviewDialog open={reviewOpen} onOpenChange={setReviewOpen} />
    </section>
  );
};

export default Testimonials;
