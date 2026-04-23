import { Award, Users, Target, Shield } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Award,
      title: "FRSC Approved",
      description: "Officially certified by the Federal Road Safety Corps with registration number RC 2564711",
    },
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Friendly, professional tutors trained in international best practices",
    },
    {
      icon: Target,
      title: "Weekly CBT Tests",
      description: "Regular Computer-Based Tests to ensure thorough understanding of traffic rules",
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Training safe, confident, and road-worthy drivers is our top priority",
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            About <span className="bg-gradient-primary bg-clip-text text-transparent">Marvel Driving School</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            We are Umuahia's leading FRSC-approved driving school, committed to producing confident, safe, and skilled drivers through modern training methods and expert instruction.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-card hover:shadow-hover transition-all duration-300"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="mt-12 md:mt-16 bg-accent p-8 md:p-12 rounded-2xl border border-border">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              At Marvel Driving School, we are dedicated to training safe, confident, and road-worthy drivers. 
              We combine modern teaching techniques with international best practices, ensuring every student receives 
              the highest quality driver education. Our goal is not just to help you pass your test, but to prepare 
              you for a lifetime of safe and responsible driving.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
