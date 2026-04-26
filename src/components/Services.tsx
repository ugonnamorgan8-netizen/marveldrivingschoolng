import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  CalendarDays,
  Bike,
  Truck,
  Wrench,
  ClipboardCheck,
  FileText,
  BookOpen,
  Heart,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import EnrollmentDialog from "./EnrollmentDialog";

type Course = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  duration: string;
  price: string;
  tagline: string;
  highlights: string[];
  badge?: string;
};

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

const courses: Course[] = [
  {
    icon: Calendar,
    title: "2 Weeks Refresher Course",
    duration: "2 Weeks",
    price: "₦55,000",
    tagline:
      "For learners who already have some driving knowledge and want to sharpen their skills — choose Manual or Automatic.",
    highlights: [
      "Choose Manual OR Automatic transmission",
      "Confidence-rebuilding practical drills",
      "Road awareness & defensive driving",
      "Mock test preparation",
    ],
  },
  {
    icon: CalendarDays,
    title: "1 Month Beginners Course",
    duration: "1 Month",
    price: "₦90,000",
    tagline:
      "Our complete beginner program — learn BOTH Manual and Automatic transmissions from scratch with full theory and practical training.",
    highlights: [
      "Learn BOTH Manual & Automatic",
      "Full highway code & theory classes",
      "Hill starts, parking & city driving",
      "FRSC test preparation included",
    ],
    badge: "Most Popular",
  },
];

const groups: ServiceGroup[] = [
  {
    heading: "Other Vehicle Training",
    subtitle: "Specialised training for two-wheelers, tricycles, and heavy vehicles.",
    services: [
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
    heading: "Skill Refinement & Test Prep",
    subtitle: "Extra training to make you a complete, confident, and exam-ready driver.",
    services: [
      {
        icon: Wrench,
        title: "Basic Car Maintenance",
        description: "Learn essential car care — checking oil, tyres, battery, and handling minor faults on the road.",
        features: [
          "Engine & fluid checks",
          "Tyre & battery basics",
          "Roadside troubleshooting",
        ],
        price: "Included",
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
        price: "Included",
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
        icon: BookOpen,
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prefill, setPrefill] = useState<{ course?: string; source?: string }>({});

  const openEnroll = (title: string, source: string) => {
    setPrefill({ course: title, source });
    setDialogOpen(true);
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            What we offer
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Our <span className="bg-gradient-primary bg-clip-text text-transparent">Courses & Services</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Choose from our two flagship driving courses, plus extra training and licensing support.
          </p>
        </div>

        {/* Flagship Courses */}
        <div className="mb-16 md:mb-20">
          <div className="mb-8 md:mb-10 text-center max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Our Driving Courses</h3>
            <p className="text-muted-foreground">
              Two structured programs designed to take you from beginner to confident driver.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {courses.map((course) => (
              <button
                type="button"
                key={course.title}
                onClick={() => openEnroll(course.title, `Services — Course Card: ${course.title}`)}
                className="group block text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
                aria-label={`Enroll for ${course.title}`}
              >
                <Card className="relative h-full overflow-hidden hover:shadow-hover transition-all duration-300 group-hover:-translate-y-1 border-2 hover:border-primary/40">
                  {course.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-gradient-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {course.badge}
                      </span>
                    </div>
                  )}
                  <CardContent className="p-6 md:p-8 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                        <course.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {course.duration}
                      </span>
                    </div>

                    <h4 className="text-xl md:text-2xl font-bold mb-2">{course.title}</h4>
                    <p className="text-sm md:text-base text-muted-foreground mb-5">
                      {course.tagline}
                    </p>

                    <ul className="space-y-2.5 mb-6">
                      {course.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-sm md:text-base text-foreground/85">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                      <div>
                        <div className="text-2xl md:text-3xl font-bold text-primary">{course.price}</div>
                        <div className="text-xs text-muted-foreground">All-inclusive</div>
                      </div>
                      <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                        Enroll Now <ArrowRight className="ml-1 w-4 h-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
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
                  <button
                    type="button"
                    key={service.title}
                    onClick={() => openEnroll(service.title, `Services — ${group.heading}: ${service.title}`)}
                    className="group block text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
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
                  </button>
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
