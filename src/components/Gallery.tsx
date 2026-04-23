import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import galleryVehicles from "@/assets/gallery-vehicles.jpg";
import galleryStudentDriver from "@/assets/gallery-student-driver.jpg";
import galleryClass from "@/assets/gallery-class.jpg";
import galleryFrscCbt from "@/assets/gallery-frsc-cbt.jpg";
import galleryTheory from "@/assets/gallery-theory.jpg";
import galleryGraduates from "@/assets/gallery-graduates.jpg";
import galleryInstructorFrsc from "@/assets/gallery-instructor-frsc.jpg";
import galleryFrscTeam from "@/assets/gallery-frsc-team.jpg";
import galleryBikes from "@/assets/gallery-bikes.jpg";
import galleryInstructorStudentCar from "@/assets/gallery-instructor-student-car.jpg";

type GalleryItem = {
  title: string;
  description: string;
  category: string;
  image: string;
};

const fallbackItems: GalleryItem[] = [
  { title: "In-Car Instruction", description: "Certified instructor guiding a student behind the wheel", category: "Training", image: galleryInstructorStudentCar },
  { title: "Our Training Vehicles", description: "Well-branded fleet of training cars in Umuahia", category: "Vehicles", image: galleryVehicles },
  { title: "Practical Driving Lessons", description: "Students gaining real road confidence behind the wheel", category: "Training", image: galleryStudentDriver },
  { title: "Theory Classes", description: "Friday classroom sessions with packed attendance", category: "Theory", image: galleryClass },
  { title: "FRSC CBT Testing", description: "Weekly computer-based tests with FRSC officials", category: "Testing", image: galleryFrscCbt },
  { title: "One-on-One Instruction", description: "Personalized guidance from certified instructors", category: "Training", image: galleryTheory },
  { title: "Successful Graduates", description: "Proud students after completing their training", category: "Graduates", image: galleryGraduates },
  { title: "FRSC Partnership", description: "Working closely with FRSC for certified training", category: "Certified", image: galleryInstructorFrsc },
  { title: "FRSC Office Visit", description: "Our team with FRSC officials in Abia State", category: "Certified", image: galleryFrscTeam },
  { title: "Motorbike Training", description: "Safe rider training with full protective gear", category: "Training", image: galleryBikes },
];

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>(fallbackItems);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("gallery_images")
        .select("title, alt_text, image_url")
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        setItems(
          data.map((d) => ({
            title: d.title || "Marvel Driving School",
            description: d.alt_text || "",
            category: "Gallery",
            image: d.image_url,
          }))
        );
      }
    })();
  }, []);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Our <span className="bg-gradient-primary bg-clip-text text-transparent">Gallery</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            See our training facilities, vehicles, and successful students
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, index) => (
            <Card
              key={index}
              className="group overflow-hidden hover:shadow-hover transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Category badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-medium z-10">
                  {item.category}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Want to see more? Follow us on{" "}
            <a
              href="https://instagram.com/marveldrivingschool"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              Instagram @marveldrivingschool
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
