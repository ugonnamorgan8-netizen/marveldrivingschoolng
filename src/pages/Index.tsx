import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import TrainingSchedule from "@/components/TrainingSchedule";
import Gallery from "@/components/Gallery";
import Locations from "@/components/Locations";
import Testimonials from "@/components/Testimonials";
import Policies from "@/components/Policies";
import Blog from "@/components/Blog";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const CarShowcase = lazy(() => import("@/components/CarShowcase"));

const showcaseBox = "relative w-full bg-gradient-hero";
const showcaseStyle = { height: "70vh", minHeight: "420px", maxHeight: "720px" } as const;

/** Downloads the heavy 3D scene only when the visitor scrolls near it. */
const DeferredCarShowcase = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const placeholder = <div className={showcaseBox} style={showcaseStyle} aria-hidden="true" />;

  return (
    <div ref={ref}>
      {show ? <Suspense fallback={placeholder}><CarShowcase /></Suspense> : placeholder}
    </div>
  );
};

const Index = () => {
  const { hash } = useLocation();

  // Arriving from another page with a #section link: scroll once content is laid out.
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => window.clearTimeout(t);
  }, [hash]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <DeferredCarShowcase />
        <About />
        <Services />
        <TrainingSchedule />
        <Gallery />
        <Locations />
        <Testimonials />
        <Policies />
        <Blog />
        <FAQ />
        <Contact />
        <CTABanner />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
