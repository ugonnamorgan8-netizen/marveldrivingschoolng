import { AlertCircle, X, RefreshCw, Calendar } from "lucide-react";

const Policies = () => {
  const policies = [
    {
      icon: X,
      title: "No Refund Policy",
      description: "All payments are final. Once training has commenced, fees are non-refundable.",
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      icon: X,
      title: "No Cancellation",
      description: "Course registrations cannot be cancelled once payment has been processed.",
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      icon: RefreshCw,
      title: "Rescheduling Allowed",
      description: "You may reschedule your training sessions with advance notice to your instructor.",
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      icon: Calendar,
      title: "Time Restrictions",
      description: "Training time cannot exceed official operating hours (8:30 AM - 5:30 PM).",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: AlertCircle,
      title: "Friday Theory Classes",
      description: "Theory classes begin at 10:00 AM on Fridays unless otherwise communicated.",
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <section id="policies" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Our <span className="bg-gradient-primary bg-clip-text text-transparent">Policies</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Please read and understand our training policies before enrollment
          </p>
        </div>

        {/* Policies Grid */}
        <div className="max-w-5xl mx-auto space-y-6">
          {policies.map((policy) => (
            <div
              key={policy.title}
              className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-card hover:shadow-hover transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${policy.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <policy.icon className={`w-6 h-6 ${policy.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{policy.title}</h3>
                  <p className="text-muted-foreground">{policy.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notice */}
        <div className="mt-12 max-w-4xl mx-auto bg-accent p-6 md:p-8 rounded-xl border border-border">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold mb-2">Important Notice</h3>
              <p className="text-muted-foreground">
                By enrolling in our training programs, you acknowledge that you have read, understood, and agree 
                to abide by all policies listed above. These policies are in place to ensure fair and consistent 
                treatment for all students and to maintain the high quality of our training services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Policies;
