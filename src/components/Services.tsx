import {
  ArrowRight, Bike, BookOpen, Calendar, CalendarDays, CircleCheck, ClipboardCheck, FileText, Heart, Truck, Wrench,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useBooking } from "./BookingDialog";

type Course = {
  icon: LucideIcon;
  duration: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  popular?: boolean;
};

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  price: string;
};

const courses: Course[] = [
  {
    icon: Calendar,
    duration: "2 Weeks",
    title: "2 Weeks Refresher Course",
    description:
      "For learners who already have some driving knowledge and want to sharpen their skills — choose Manual or Automatic.",
    features: [
      "Choose Manual OR Automatic transmission",
      "Confidence-rebuilding practical drills",
      "Road awareness & defensive driving",
      "Mock test preparation",
    ],
    price: "₦60,000",
  },
  {
    icon: CalendarDays,
    duration: "1 Month",
    title: "1 Month Beginners Course",
    description:
      "Our complete beginner program — learn BOTH Manual and Automatic transmissions from scratch with full theory and practical training.",
    features: [
      "Learn BOTH Manual & Automatic",
      "Full highway code & theory classes",
      "Hill starts, parking & city driving",
      "FRSC test preparation included",
    ],
    price: "₦90,000",
    popular: true,
  },
];

const groups: { title: string; subtitle: string; items: Service[] }[] = [
  {
    title: "Other Vehicle Training",
    subtitle: "Specialised training for two-wheelers, tricycles, and heavy vehicles.",
    items: [
      { icon: Bike, title: "Motorcycle Training", description: "Safe rider training with full protective gear for all experience levels.", features: ["Balance & control drills", "Safety gear & helmet use", "Road awareness training"], price: "₦55,000" },
      { icon: Bike, title: "Tricycle (Keke) Training", description: "Commercial and private tricycle lessons for everyday riders and operators.", features: ["Passenger handling", "Route & traffic awareness", "Commercial readiness"], price: "₦60,000" },
      { icon: Truck, title: "Truck Driving", description: "Heavy vehicle handling and safety training for aspiring commercial drivers.", features: ["Heavy vehicle control", "Cargo safety basics", "Long-haul road readiness"], price: "On Request" },
    ],
  },
  {
    title: "Skill Refinement & Test Prep",
    subtitle: "Extra training to make you a complete, confident, and exam-ready driver.",
    items: [
      { icon: Wrench, title: "Basic Car Maintenance", description: "Learn essential car care — checking oil, tyres, battery, and handling minor faults on the road.", features: ["Engine & fluid checks", "Tyre & battery basics", "Roadside troubleshooting"], price: "Included" },
      { icon: ClipboardCheck, title: "Mock Driving Tests", description: "Realistic practice tests that prepare you for the official FRSC examination.", features: ["Simulated test conditions", "Examiner-style feedback", "Pre-test readiness review"], price: "Included" },
      { icon: BookOpen, title: "Weekly FRSC CBT Tests", description: "Computer-Based Tests held weekly to keep you exam-ready year-round.", features: ["Weekly CBT sittings", "Real FRSC question style", "Instant scoring"], price: "Included" },
      { icon: BookOpen, title: "Friday Theory Classes", description: "Comprehensive highway code instruction every Friday from 10:00 AM.", features: ["Highway code mastery", "Road signs & rules", "Q&A with instructors"], price: "Included" },
    ],
  },
  {
    title: "Licensing & Support Services",
    subtitle: "We handle the paperwork so you can focus on driving.",
    items: [
      { icon: FileText, title: "Driver's License Processing", description: "Complete assistance with your FRSC license application from start to finish.", features: ["FRSC paperwork handled", "Capture & biometrics support", "Pickup coordination"], price: "On Request" },
      { icon: FileText, title: "International Driver's License", description: "Get your International Driving Permit (IDP) for travel and driving abroad — fully processed.", features: ["IDP application handled", "Valid in 150+ countries", "Fast turnaround"], price: "On Request" },
      { icon: Heart, title: "Accident Management & First Aid", description: "Essential emergency response and first-aid training for every road user.", features: ["Roadside first response", "First-aid fundamentals", "Insurance & reporting tips"], price: "Included" },
    ],
  },
];

const trackId = (title: string) => `enroll_${title.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}`;

const Services = () => {
  const { openBooking } = useBooking();

  return (
    <section id="services" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">What we offer</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Our <span className="bg-gradient-primary bg-clip-text text-transparent">Courses &amp; Services</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Choose from our two flagship driving courses, plus extra training and licensing support.
          </p>
        </div>

        {/* Flagship courses */}
        <div className="mb-16 md:mb-20">
          <div className="mb-8 md:mb-10 text-center max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Our Driving Courses</h3>
            <p className="text-muted-foreground">Two structured programs designed to take you from beginner to confident driver.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {courses.map((c) => (
              <button
                key={c.title}
                type="button"
                onClick={() => openBooking(c.title)}
                data-track={trackId(c.title)}
                aria-label={`Enroll for ${c.title}`}
                className="group block text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
              >
                <Card className="relative h-full overflow-hidden hover:shadow-hover transition-all duration-300 group-hover:-translate-y-1 border-2 hover:border-primary/40">
                  {c.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-gradient-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">Most Popular</span>
                    </div>
                  )}
                  <div className="p-6 md:p-8 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                        <c.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{c.duration}</span>
                    </div>
                    <h4 className="text-xl md:text-2xl font-bold mb-2">{c.title}</h4>
                    <p className="text-sm md:text-base text-muted-foreground mb-5">{c.description}</p>
                    <ul className="space-y-2.5 mb-6">
                      {c.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm md:text-base text-foreground/85">
                          <CircleCheck className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                      <div>
                        <div className="text-2xl md:text-3xl font-bold text-primary">{c.price}</div>
                        <div className="text-xs text-muted-foreground">All-inclusive</div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                        Enroll Now <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </div>

        {/* Other groups */}
        <div className="space-y-16 md:space-y-20">
          {groups.map((g) => (
            <div key={g.title}>
              <div className="mb-8 md:mb-10 text-center max-w-3xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{g.title}</h3>
                <p className="text-muted-foreground">{g.subtitle}</p>
              </div>
              <div className="grid-3-centered max-w-6xl mx-auto">
                {g.items.map((s) => (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => openBooking(s.title)}
                    data-track={trackId(s.title)}
                    aria-label={`Enroll for ${s.title}`}
                    className="group block text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
                  >
                    <Card className="relative h-full overflow-hidden hover:shadow-hover transition-all duration-300 group-hover:-translate-y-1">
                      <div className="p-6 md:p-8 flex flex-col h-full">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                          <s.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                        </div>
                        <h4 className="text-lg md:text-xl font-bold mb-2">{s.title}</h4>
                        <p className="text-sm md:text-base text-muted-foreground mb-4">{s.description}</p>
                        <ul className="space-y-2 mb-6 text-sm">
                          {s.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-foreground/80">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">{s.price}</span>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                            Enroll <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
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
