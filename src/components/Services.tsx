import { Card, CardContent } from "@/components/ui/card";
import {
  Car,
  Bike,
  Truck,
  GraduationCap,
  RotateCcw,
  ClipboardCheck,
  FileText,
  BookOpen,
  Heart,
  ArrowRight,
} from "lucide-react";

type Service = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  price?: string;
};

type ServiceGroup = {
  heading: string;
  subtitle: string;
  services: Service[];
};

const groups: ServiceGroup[] = [
  {
    heading: "Vehicle Training Programs",
    subtitle: "Hands-on practical lessons across every vehicle category we offer.",
    services: [
      {
        icon: Car,
        title: "Manual Car Training",
        description: "Master clutch control, gear shifting, and confident manual driving with expert guidance.",
        features: [
          "Clutch & gear control mastery",
          "Hill starts and parking drills",
          "Real-road practical sessions",
        ],
        price: "₦90,000",
      },
      {
        icon: Car,
        title: "Automatic Car Training",
        description: "Beginner-friendly automatic driving lessons for smooth, stress-free learning.",
        features: [
          "Smooth automatic handling",
          "City & highway practice",
          "Defensive driving basics",
        ],
        price: "₦90,000",
      },
      {
        icon: Bike,
        title: "Motorcycle Training",
        description: "Safe rider training with full protective gear for all experience levels.",
        features: [
          "Balance & control drills",
          "Safety gear & helmet use",
          "Road awareness training",
        ],
        price: "₦55,000",
      },
      {
        icon: Bike,
        title: "Tricycle (Keke) Training",
        description: "Commercial and private tricycle lessons for everyday riders and operators.",
        features: [
          "Passenger handling",
          "Route & traffic awareness",
          "Commercial readiness",
        ],
        price: "₦60,000",
      },
      {
        icon: Truck,
        title: "Truck Driving",
        description: "Heavy vehicle handling and safety training for aspiring commercial drivers.",
        features: [
          "Heavy vehicle control",
          "Cargo safety basics",
          "Long-haul road readiness",
        ],
        price: "On Request",
      },
    ],
  },
  {
    heading: "Test Prep & Skill Refinement",
    subtitle: "For drivers who already know the basics — sharpen, refresh, and pass your test.",
    services: [
      {
        icon: RotateCcw,
        title: "Refresher Course",
        description: "For licensed drivers who've been off the wheel — rebuild confidence and polish bad habits.",
        features: [
          "Personalised pace",
          "Confidence-rebuilding drills",
          "Optional mock test",
        ],
        price: "₦55,000",
      },
      {
        icon: ClipboardCheck,
        title: "Mock Driving Tests",
        description: "Realistic practice tests that prepare you for the official FRSC examination.",
        features: [
          "Simulated test conditions",
          "Examiner-style feedback",
          "Pre-test readiness review",
        ],
      },
      {
        icon: BookOpen,
        title: "Weekly FRSC CBT Tests",
        description: "Computer-Based Tests held weekly to keep you exam-ready year-round.",
        features: [
          "Weekly CBT sittings",
          "Real FRSC question style",
          "Instant scoring",
        ],
        price: "Included",
      },
      {
        icon: GraduationCap,
        title: "Friday Theory Classes",
        description: "Comprehensive highway code instruction every Friday from 10:00 AM.",
        features: [
          "Highway code mastery",
          "Road signs & rules",
          "Q&A with instructors",
        ],
        price: "Included",
      },
    ],
  },
  {
    heading: "Licensing & Support Services",
    subtitle: "We handle the paperwork so you can focus on driving.",
    services: [
      {
        icon: FileText,
        title: "Driver's License Processing",
        description: "Complete assistance with your FRSC license application from start to finish.",
        features: [
          "FRSC paperwork handled",
          "Capture & biometrics support",
          "Pickup coordination",
        ],
        price: "On Request",
      },
      {
        icon: FileText,
        title: "International Driver's License",
        description: "Get your International Driving Permit (IDP) for travel and driving abroad — fully processed.",
        features: [
          "IDP application handled",
          "Valid in 150+ countries",
          "Fast turnaround",
        ],
        price: "On Request",
      },
      {
        icon: Heart,
        title: "Accident Management & First Aid",
        description: "Essential emergency response and first-aid training for every road user.",
        features: [
          "Roadside first response",
          "First-aid fundamentals",
          "Insurance & reporting tips",
        ],
        price: "Included",
      },
    ],
  },
];

const Services = () => {
  return (
    <section id="services" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            What we offer
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Our <span className="bg-gradient-primary bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Comprehensive driving education designed to make you a confident and safe driver.
          </p>
        </div>

        {/* Grouped Services */}
        <div className="space-y-16 md:space-y-20">
          {groups.map((group) => (
            <div key={group.heading}>
              <div className="mb-8 md:mb-10 text-center md:text-left max-w-3xl mx-auto md:mx-0">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{group.heading}</h3>
                <p className="text-muted-foreground">{group.subtitle}</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {group.services.map((service) => (
                  <a
                    href="#contact"
                    key={service.title}
                    className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
                    aria-label={`Enroll for ${service.title}`}
                  >
                    <Card className="relative h-full overflow-hidden hover:shadow-hover transition-all duration-300 group-hover:-translate-y-1">
                      <CardContent className="p-6 md:p-8 flex flex-col h-full">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                          <service.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                        </div>
                        <h4 className="text-lg md:text-xl font-bold mb-2">{service.title}</h4>
                        <p className="text-sm md:text-base text-muted-foreground mb-4">
                          {service.description}
                        </p>

                        <ul className="space-y-2 mb-6 text-sm">
                          {service.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-foreground/80">
                              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                          {service.price ? (
                            <span className="text-lg font-bold text-primary">{service.price}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Contact for pricing</span>
                          )}
                          <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                            Enroll <ArrowRight className="ml-1 w-4 h-4" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          Optional FRSC license processing fees may apply. Contact us for the latest rates.
        </p>
      </div>
    </section>
  );
};

export default Services;
