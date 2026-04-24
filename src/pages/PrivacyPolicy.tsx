import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
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
            Privacy <span className="bg-gradient-primary bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}</p>

          <div className="prose prose-lg max-w-none space-y-6 text-foreground/90">
            <section>
              <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Marvel Driving School ("we", "us", "our") respects your privacy and is committed to protecting the personal
                information you share with us. This Privacy Policy explains how we collect, use, and safeguard your
                information when you visit our website or enroll in our training programs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We may collect the following information when you interact with us:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Full name, phone number, and email address (when you enroll or contact us)</li>
                <li>Service or course of interest</li>
                <li>Messages or inquiries you submit through our forms or chatbot</li>
                <li>Basic device and browser information for analytics purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To process and manage your enrollment</li>
                <li>To respond to inquiries and provide customer support</li>
                <li>To schedule and coordinate training sessions</li>
                <li>To send important updates about your course or our services</li>
                <li>To improve our website and training programs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share information only when
                required by law, with the FRSC for licensing purposes, or with trusted service providers who help us operate
                our business under strict confidentiality agreements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement reasonable security measures to protect your personal information from unauthorized access,
                disclosure, alteration, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">6. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to access, correct, or request deletion of your personal information. To exercise these
                rights, please contact us using the details below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">7. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website may use cookies to enhance user experience and analyze traffic. You can disable cookies through
                your browser settings, although this may affect website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">8. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated
                revision date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">9. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy or how we handle your data, please contact Marvel Driving
                School in Umuahia through the contact details listed on our website.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
