import { useRef } from "react";
import HeroScene3D from "./HeroScene3D";

const CarShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      aria-label="Marvel Driving School training car"
      className="relative w-full bg-gradient-hero overflow-hidden"
      style={{ height: "70vh", minHeight: "420px", maxHeight: "720px" }}
    >
      <HeroScene3D containerRef={sectionRef} />

      {/* Subtle caption overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 px-4 text-center pointer-events-none">
        <p className="text-xs md:text-sm font-medium tracking-widest uppercase text-foreground/70">
          Scroll to drive
        </p>
      </div>
    </section>
  );
};

export default CarShowcase;
