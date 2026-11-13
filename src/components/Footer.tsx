import { Phone, Instagram, Facebook, MapPin, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSiteSettings } from "@/hooks/use-site-settings";
import marvelLogo from "@/assets/marvel-logo.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const waNumber = settings.phone.replace(/[^\d]/g, "");
  const { pathname } = useLocation();
  const base = pathname === "/" ? "" : "/";

  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src={marvelLogo}
                alt="Marvel Driving School logo"
                loading="lazy"
                className="w-10 h-10 rounded-lg object-cover bg-white"
              />
              <span className="text-xl font-bold">Marvel</span>
            </div>
            <p className="text-sm text-background/70 mb-4">
              Umuahia's premier FRSC-approved driving school, training confident and safe drivers for over 8 years.
            </p>
            <p className="text-xs text-background/60">RC 2564711</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href={`${base}#about`} className="text-background/70 hover:text-background transition-colors">About Us</a></li>
              <li><a href={`${base}#services`} className="text-background/70 hover:text-background transition-colors">Services</a></li>
              <li><a href={`${base}#gallery`} className="text-background/70 hover:text-background transition-colors">Gallery</a></li>
              <li><a href={`${base}#testimonials`} className="text-background/70 hover:text-background transition-colors">Testimonials</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-background/70" />
                <a
                  href={waNumber ? `https://wa.me/${waNumber}` : `tel:${settings.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp_footer"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-background/70" />
                <a
                  href={`mailto:${settings.email}`}
                  data-track="email_footer"
                  className="text-background/70 hover:text-background transition-colors break-all"
                >
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Instagram className="w-4 h-4 mt-0.5 flex-shrink-0 text-background/70" />
                <a href="https://instagram.com/marveldrivingschool" target="_blank" rel="noopener noreferrer" data-track="instagram_footer" className="text-background/70 hover:text-background transition-colors">
                  @marveldrivingschool
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Facebook className="w-4 h-4 mt-0.5 flex-shrink-0 text-background/70" />
                <a
                  href="https://www.facebook.com/profile.php?id=100063753002842"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  Marvel Driving School Umuahia
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-background/70" />
                <span className="text-background/70">{settings.address}</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-bold mb-4">Operating Hours</h3>
            <p className="text-sm text-background/70 whitespace-pre-line">{settings.hours}</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/60">
            <p>© {currentYear} Marvel Driving School. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="hover:text-background transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-background transition-colors">Terms of Service</Link>
              <a href={`${base}#policies`} className="hover:text-background transition-colors">School Policies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
