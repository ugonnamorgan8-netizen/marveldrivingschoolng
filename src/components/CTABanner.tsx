import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
const CTABanner = () => {
  return <section className="py-16 md:py-24 bg-gradient-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Begin Your Driving Journey?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied students who learned to drive with confidence at Marvel Driving School. 
            Book your first lesson today and take the first step toward driving independence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-lg group" asChild>
              <a href="#contact">
                Book Your First Lesson
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary" asChild>
              <a href="https://wa.me/2348165973142" target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp
              </a>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">FRSC</div>
              <div className="text-sm text-white/80">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">3000+</div>
              <div className="text-sm text-white/80">Students Trained</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">98%</div>
              <div className="text-sm text-white/80">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">7+</div>
              <div className="text-sm text-white/80">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CTABanner;