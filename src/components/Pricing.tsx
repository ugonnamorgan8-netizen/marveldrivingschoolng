import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Pricing = () => {
  const packages = [
    {
      name: "Beginner Course",
       price: "₦90,000",
      description: "Complete training for first-time drivers",
      features: [
        "Comprehensive practical training",
        "Friday theory classes",
        "Weekly FRSC CBT tests",
        "Manual & automatic training",
        "Mock driving tests",
        "Accident management training",
        "First aid education",
        "Target-based learning",
      ],
      popular: true,
    },
    {
      name: "Refresher Course",
       price: "₦55,000",
      description: "Perfect for those returning to driving",
      features: [
        "Skill assessment session",
        "Focused practical training",
        "Confidence building exercises",
        "Road safety refresher",
        "Mock driving tests",
        "Flexible scheduling",
        "Professional instructors",
        "Target-based approach",
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Simple <span className="bg-gradient-primary bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Transparent pricing with no hidden fees. Choose the package that's right for you
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg) => (
            <Card
              key={pkg.name}
              className={`relative overflow-hidden hover:shadow-hover transition-all duration-300 ${
                pkg.popular ? 'border-2 border-primary shadow-large' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-gradient-primary text-white px-6 py-2 text-sm font-bold rounded-bl-xl">
                  MOST POPULAR
                </div>
              )}
              
              <CardContent className="p-8 md:p-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{pkg.name}</h3>
                <p className="text-muted-foreground mb-6">{pkg.description}</p>
                
                <div className="mb-8">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {pkg.price}
                  </div>
                  <div className="text-sm text-muted-foreground">Complete package</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-success" />
                      </div>
                      <span className="text-sm md:text-base text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={pkg.popular ? "default" : "outline"}
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <a href="#contact">Book This Package</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-2">
            Need help with your driver's license?
          </p>
          <p className="text-sm text-muted-foreground">
            License processing fees available on request. Contact us for details.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
