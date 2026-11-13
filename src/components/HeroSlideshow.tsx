import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import galleryVehicles from "@/assets/gallery-vehicles.jpg";
import galleryStudentDriver from "@/assets/gallery-student-driver.jpg";
import galleryClass from "@/assets/gallery-class.jpg";
import galleryFrscCbt from "@/assets/gallery-frsc-cbt.jpg";
import galleryGraduates from "@/assets/gallery-graduates.jpg";
import galleryInstructorStudentCar from "@/assets/gallery-instructor-student-car.jpg";

const fallback = [
  galleryInstructorStudentCar,
  galleryStudentDriver,
  galleryVehicles,
  galleryClass,
  galleryFrscCbt,
  galleryGraduates,
];

const SLIDE_DURATION_MS = 6000;

const HeroSlideshow = () => {
  const [images, setImages] = useState<string[]>(fallback);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("gallery_images")
        .select("image_url")
        .order("sort_order", { ascending: true });
      if (active && data && data.length > 0) {
        setImages(data.map((d) => d.image_url));
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length);
    }, SLIDE_DURATION_MS);
    return () => window.clearInterval(id);
  }, [images.length]);

  // Only download the current slide and the next one (not the whole gallery up front).
  const [mounted, setMounted] = useState<Set<string>>(() => new Set(fallback.slice(0, 2)));
  useEffect(() => {
    if (images.length === 0) return;
    const current = images[activeIndex % images.length];
    const next = images[(activeIndex + 1) % images.length];
    setMounted((prev) => {
      if (prev.has(current) && prev.has(next)) return prev;
      const s = new Set(prev);
      s.add(current);
      s.add(next);
      return s;
    });
  }, [images, activeIndex]);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Background layer */}
      <div className="absolute inset-0 bg-black z-0" />

      {/* Hero images */}
      {images.map((src, i) => {
        const isActive = i === activeIndex % images.length;
        // alternate zoom direction per slide for visual variety
        const zoomIn = i % 2 === 0;
        if (!mounted.has(src)) return null;
        return (
          <div
            key={`${src}-${i}`}
            className="absolute inset-0 transition-opacity ease-in-out z-[1]"
            style={{
              opacity: isActive ? 1 : 0,
              transitionDuration: "1800ms",
            }}
          >
            <img
              src={src}
              alt=""
              loading="eager"
              decoding="async"
              {...(i === 0 ? { fetchpriority: "high" } : {})}
              className="w-full h-full object-cover will-change-transform motion-reduce:!animate-none"
              style={{
                animation: isActive
                  ? `${zoomIn ? "hero-zoom-in" : "hero-zoom-out"} ${SLIDE_DURATION_MS + 2000}ms ease-out forwards`
                  : "none",
              }}
            />
          </div>
        );
      })}

      {/* Light, even tint: photos stay clear; text gets its legibility from a text-shadow */}
      <div className="absolute inset-0 bg-black/40 z-[2]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent z-[2]" />
    </div>
  );
};

export default HeroSlideshow;
