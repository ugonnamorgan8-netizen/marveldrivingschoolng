import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import TrainingSchedule from "@/components/TrainingSchedule";
import Gallery from "@/components/Gallery";
import Locations from "@/components/Locations";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Policies from "@/components/Policies";
import Blog from "@/components/Blog";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Services />
      <TrainingSchedule />
      <Gallery />
      <Locations />
      <Testimonials />
      <Pricing />
      <Policies />
        <Blog />
        <FAQ />
      <Contact />
      <CTABanner />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
