import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How long does the driving course take?",
    a: "Our standard target-based program runs for about 3–4 weeks, depending on how quickly you hit your practical milestones. Each practical session is capped at 1 hour and theory classes hold every Friday.",
  },
  {
    q: "Do I get an FRSC-approved driver's license after training?",
    a: "Yes. Marvel Driving School is FRSC-approved (RC 2564711). After completing your practicals and passing the FRSC CBT, we guide you through the official licensing process.",
  },
  {
    q: "What are your operating hours?",
    a: "Monday to Thursday: 8:30 AM – 5:30 PM for practicals. Friday: 10:00 AM – 5:30 PM for theory classes. Weekend sessions are available by special request.",
  },
  {
    q: "Where is the training ground located?",
    a: "Our office and main training ground are at BCA Road, by the Secretariat in Umuahia. We also use approved practical grounds within the city.",
  },
  {
    q: "Can I reschedule or get a refund if I miss a class?",
    a: "Rescheduling is allowed with reasonable prior notice. Refunds follow our published policy — please reach out via WhatsApp on +234 816 597 3142 to discuss your specific case.",
  },
  {
    q: "Do you train people who have never driven before?",
    a: "Absolutely. Most of our students start as complete beginners. Our instructors are patient, FRSC-trained, and walk you through everything from clutch control to highway driving.",
  },
  {
    q: "Do you offer training for motorcycles or commercial vehicles?",
    a: "Yes. We train on cars, motorcycles, and select commercial vehicles. Visit the Services section or contact us to confirm availability for your category.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Questions, answered
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know before enrolling at Marvel Driving School.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card border border-border rounded-xl px-5 shadow-sm"
              >
                <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-foreground hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-center text-sm text-muted-foreground mt-10">
            Still have questions?{" "}
            <a
              href="https://wa.me/2348165973142"
              className="text-primary font-semibold hover:underline"
            >
              Chat with us on WhatsApp
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;