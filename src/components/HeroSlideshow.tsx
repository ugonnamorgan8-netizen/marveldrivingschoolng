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

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {images.map((src, i) => {
        const isActive = i === activeIndex;
        // alternate zoom direction per slide for visual variety
        const zoomIn = i % 2 === 0;
        return (
          <div
            key={`${src}-${i}`}
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              transitionDuration: "1800ms",
            }}
          >
            <img
              src={src}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              className="w-full h-full object-cover will-change-transform"
              style={{
                animation: isActive
                  ? `${zoomIn ? "hero-zoom-in" : "hero-zoom-out"} ${SLIDE_DURATION_MS + 2000}ms ease-out forwards`
                  : "none",
              }}
            />
          </div>
        );
      })}

      {/* Overlay for legibility — lighter so images show through more clearly */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/35 to-background/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/55 via-background/15 to-transparent" />
    </div>
  );
};

export default HeroSlideshow;
