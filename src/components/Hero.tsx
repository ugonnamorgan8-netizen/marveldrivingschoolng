import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useRef } from "react";
import HeroScene3D from "./HeroScene3D";

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-hero overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full text-sm font-medium text-accent-foreground">
              <CheckCircle className="w-4 h-4" />
              FRSC Approved • RC 2564711
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Learn to Drive With{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Confidence
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Abia's premier FRSC-approved driving school. Master the road with professional instructors, modern training methods, and internationally recognized best practices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="success" size="lg" className="w-full sm:w-auto group" asChild>
                <a href="#contact">
                  Book a Lesson
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>

              <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                <a href="#services">View Packages</a>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-primary">3000+</div>
                <div className="text-sm text-muted-foreground">Students Trained</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right: 3D Scene */}
          <div className="relative h-[420px] md:h-[520px] lg:h-[560px]">
            <HeroScene3D containerRef={sectionRef} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
