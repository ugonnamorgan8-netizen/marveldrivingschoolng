import { useRef, useState } from "react";
import { Phone, Instagram, Facebook, MapPin, Clock, Send, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { COURSES, checkEnquiry, submitEnquiry } from "@/lib/api";
import { useSiteSettings } from "@/hooks/use-site-settings";

const Contact = () => {
  const { toast } = useToast();
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    service: "",
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const startedAt = useRef(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, source: "contact" as const, elapsedMs: Date.now() - startedAt.current };
    const problem = checkEnquiry(payload);
    if (problem) {
      toast({ title: "Please check the form", description: problem, variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const result = await submitEnquiry(payload);
    setIsSubmitting(false);

    if (!result.ok) {
      toast({
        title: "Could not send",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent!",
      description: "Thanks! We'll reach out shortly via WhatsApp or email.",
    });
    setFormData({ name: "", email: "", phone: "", message: "", service: "", website: "" });
    startedAt.current = Date.now();
  };

  const waNumber = settings.phone.replace(/[^\d]/g, "");
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone / WhatsApp",
      content: settings.phone,
      link: waNumber ? `https://wa.me/${waNumber}` : null,
    },
    {
      icon: Mail,
      title: "Email",
      content: settings.email,
      link: `mailto:${settings.email}`,
    },
    {
      icon: Instagram,
      title: "Instagram",
      content: "@marveldrivingschool",
      link: "https://instagram.com/marveldrivingschool",
    },
    {
      icon: Facebook,
      title: "Facebook",
      content: "Marvel Driving School Umuahia",
      link: "https://www.facebook.com/profile.php?id=100063753002842",
    },
    {
      icon: MapPin,
      title: "Training Ground",
      content: settings.address,
      link: null,
    },
    {
      icon: Clock,
      title: "Operating Hours",
      content: settings.hours,
      link: null,
    },
  ];

  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Get In <span className="bg-gradient-primary bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Ready to start your driving journey? Contact us today
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className="bg-card p-6 rounded-xl border border-border shadow-card hover:shadow-hover transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">{info.title}</h4>
                    {info.link ? (
                      <a
                        href={info.link}
                        {...(info.link.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        data-track={`contact_${info.title.split(" ")[0].toLowerCase()}`}
                        className="text-primary hover:underline break-all"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">{info.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-card">
            <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit} noValidate className="space-y-4 relative">
              {/* Honeypot: hidden from people, bots fill it in */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </label>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={30}
                  placeholder="+234 XXX XXX XXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium mb-2">
                  Course <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <select
                  id="service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Choose a course</option>
                  {COURSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us how we can help you..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  maxLength={2000}
                  className="w-full min-h-[120px]"
                />
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
                data-track="contact_form_submit"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
