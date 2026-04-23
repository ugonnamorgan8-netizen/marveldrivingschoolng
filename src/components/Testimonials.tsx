import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Testimonial = {
  name: string;
  role: string;
  content: string;
  rating: number;
};

const fallbackTestimonials: Testimonial[] = [
  { name: "Chioma Okafor", role: "Recent Graduate", content: "Marvel Driving School gave me the confidence I needed. The instructors were patient, professional, and made learning fun. I passed my test on the first try!", rating: 5 },
  { name: "David Nwosu", role: "Business Owner", content: "After years of not driving, I took the refresher course. It was exactly what I needed. The instructors are top-notch and the training ground is excellent.", rating: 5 },
  { name: "Blessing Eze", role: "University Student", content: "Best driving school in Umuahia! The theory classes on Fridays are very comprehensive and the practical sessions are well-structured. Highly recommend!", rating: 5 },
  { name: "Emmanuel Ikenna", role: "Medical Professional", content: "Marvel Driving School remains the best driving school in Umuahia. Professional service from start to finish. My entire family learned to drive here.", rating: 5 },
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);

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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={`${testimonial.name}-${idx}`} className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-card hover:shadow-hover transition-all duration-300">
              <Quote className="w-8 h-8 text-primary/20 mb-4" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="pt-4 border-t border-border">
                <div className="font-bold text-foreground">{testimonial.name}</div>
                {testimonial.role && (
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                )}
              </div>
            </div>
          ))}
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
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">7+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4.8</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
