import { Calendar, Clock, MapPin, AlertTriangle } from "lucide-react";

const TrainingSchedule = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Training <span className="bg-gradient-primary bg-clip-text text-transparent">Schedule</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Flexible training hours designed around your availability
            </p>
          </div>

          {/* Schedule Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-card">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Training Days</h3>
                  <p className="text-muted-foreground">Monday to Friday</p>
                  <p className="text-sm text-muted-foreground mt-1">Weekend training available on special request with additional payment</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-card">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Training Hours</h3>
                  <p className="text-muted-foreground">8:30 AM – 5:30 PM</p>
                  <p className="text-sm text-muted-foreground mt-1">Practical: Mon-Thu | Theory: Fri (starts 10 AM)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Training Ground */}
          <div className="bg-accent p-6 md:p-8 rounded-xl border border-border mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Training Ground Location</h3>
                <p className="text-muted-foreground mb-2">
                  BCA Road by Secretariat, beside Vision Africa Radio Station
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                  FRSC Approved Location
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-card p-6 md:p-8 rounded-xl border-2 border-primary/20 shadow-card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3">Important Information</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Training is target-based, not time-based</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Maximum daily practical session: 30 minutes per student (FRSC requirement)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>All practical training occurs at the BCA Road location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Friday theory classes begin promptly at 10:00 AM unless otherwise communicated</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingSchedule;
