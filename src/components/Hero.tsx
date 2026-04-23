import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useRef } from "react";
import HeroSlideshow from "./HeroSlideshow";

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-hero overflow-hidden"
    >
      <HeroSlideshow />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl space-y-6 md:space-y-8 [text-shadow:_0_2px_12px_hsl(var(--background)/0.85)]">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full text-sm font-medium text-accent-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.25),0_4px_16px_-4px_hsl(var(--primary)/0.35)] [text-shadow:none]">
            <CheckCircle className="w-4 h-4" />
            FRSC Approved • RC 2564711
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Learn to Drive With{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent [text-shadow:none] [-webkit-text-stroke:1px_hsl(var(--primary)/0.35)]">
              Confidence
            </span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/90 max-w-2xl font-medium">
            Abia's premier FRSC-approved driving school. Master the road with professional instructors, modern training methods, and internationally recognized best practices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 [text-shadow:none]">
            <Button variant="success" size="lg" className="w-full sm:w-auto group" asChild>
              <a href="#contact">
                Book a Lesson
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>

            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-background/70 backdrop-blur-sm" asChild>
              <a href="#services">View Packages</a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-6 pt-6 border-t border-border/60">
            <div>
              <div className="text-3xl font-bold text-primary [-webkit-text-stroke:0.5px_hsl(var(--primary)/0.4)]">3000+</div>
              <div className="text-sm text-foreground/80 font-medium">Students Trained</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary [-webkit-text-stroke:0.5px_hsl(var(--primary)/0.4)]">15+</div>
              <div className="text-sm text-foreground/80 font-medium">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary [-webkit-text-stroke:0.5px_hsl(var(--primary)/0.4)]">98%</div>
              <div className="text-sm text-foreground/80 font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
