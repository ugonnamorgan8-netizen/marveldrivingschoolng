import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex-1">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of <span className="bg-gradient-primary bg-clip-text text-transparent">Service</span>
          </h1>
          <p className="text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}</p>

          <div className="prose prose-lg max-w-none space-y-6 text-foreground/90">
            <section>
              <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By enrolling in any training program or using services provided by Marvel Driving School (RC 2564711), you
                agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. Enrollment & Payment</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>All course fees must be paid in full before training commences unless otherwise agreed in writing.</li>
                <li>Payments confirm your enrollment and reserve your training slot.</li>
                <li>Receipts will be issued for all payments made.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. Refunds & Cancellations</h2>
              <p className="text-muted-foreground leading-relaxed">
                All payments are <strong>final and non-refundable</strong> once training has commenced. Course registrations
                cannot be cancelled after payment has been processed. Please review our policies carefully before enrolling.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. Rescheduling</h2>
              <p className="text-muted-foreground leading-relaxed">
                Students may reschedule training sessions with reasonable advance notice to their assigned instructor.
                Rescheduling is subject to instructor availability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">5. Training Hours</h2>
              <p className="text-muted-foreground leading-relaxed">
                Training sessions are conducted within official operating hours (8:30 AM – 5:30 PM). Training time cannot
                exceed these hours. Friday theory classes commence at 10:00 AM unless otherwise communicated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">6. Student Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Arrive on time for all scheduled training sessions.</li>
                <li>Follow all instructions given by certified instructors.</li>
                <li>Comply with Nigerian traffic laws and FRSC regulations during practical training.</li>
                <li>Treat instructors, staff, and fellow students with respect.</li>
                <li>Notify the school promptly of any inability to attend a session.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">7. Conduct & Safety</h2>
              <p className="text-muted-foreground leading-relaxed">
                Students must not be under the influence of alcohol or any substance during training. Marvel Driving School
                reserves the right to suspend or terminate training for any student whose conduct compromises safety or
                disrupts learning, with no refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">8. Certification & Licensing</h2>
              <p className="text-muted-foreground leading-relaxed">
                Completion of training does not automatically guarantee issuance of a driver's license. Final licensing is
                subject to FRSC requirements and successful completion of all assessments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">9. Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                While we take all reasonable precautions to ensure student safety, Marvel Driving School shall not be liable
                for personal loss or injury resulting from a student's failure to follow instructions or established safety
                guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">10. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. Updates will be posted on this page with a
                revised date. Continued use of our services after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">11. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions regarding these Terms, please reach out to Marvel Driving School through the contact details
                provided on our website.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
