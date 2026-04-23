import { GraduationCap, RotateCcw, Car, ClipboardCheck, FileText, BookOpen, ShoppingCart, Heart, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Services = () => {
  const services = [
    {
      icon: GraduationCap,
      title: "Beginner Driving Lessons",
      description: "Comprehensive training for first-time drivers",
      price: "₦90,000",
      popular: true,
    },
    {
      icon: RotateCcw,
      title: "Refresher Course",
      description: "Brush up your skills and regain confidence",
      price: "₦55,000",
      popular: false,
    },
    {
      icon: Car,
      title: "Manual & Automatic Training",
      description: "Learn on both transmission types",
      price: "Included",
      popular: false,
    },
    {
      icon: ClipboardCheck,
      title: "Mock Driving Tests",
      description: "Practice tests to prepare you for the real exam",
      price: "Available",
      popular: false,
    },
    {
      icon: FileText,
      title: "Driver's License Processing",
      description: "Complete assistance with license application",
      price: "On Request",
      popular: false,
    },
    {
      icon: BookOpen,
      title: "Weekly FRSC CBT Tests",
      description: "Computer-Based Tests every week",
      price: "Included",
      popular: false,
    },
    {
      icon: ShoppingCart,
      title: "Car Sales & Purchase Assistance",
      description: "Expert guidance on buying your first car",
      price: "Free Consultation",
      popular: false,
    },
    {
      icon: Heart,
      title: "Friday Theory Classes",
      description: "Comprehensive highway code instruction",
      price: "Included",
      popular: false,
    },
    {
      icon: AlertCircle,
      title: "Accident Management & First Aid",
      description: "Essential emergency response training",
      price: "Included",
      popular: false,
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Our <span className="bg-gradient-primary bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Comprehensive driving education designed to make you a confident and safe driver
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service) => (
            <Card 
              key={service.title} 
              className={`relative overflow-hidden hover:shadow-hover transition-all duration-300 ${
                service.popular ? 'border-primary border-2' : ''
              }`}
            >
              {service.popular && (
                <div className="absolute top-0 right-0 bg-gradient-primary text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                  POPULAR
                </div>
              )}
              <CardContent className="p-6 md:p-8">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4">{service.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-lg md:text-xl font-bold text-primary">{service.price}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Ready to get started?</p>
          <a 
            href="#contact" 
            className="inline-flex items-center justify-center h-12 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary-hover shadow-md hover:shadow-lg transition-all duration-300"
          >
            Book Your Package
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
