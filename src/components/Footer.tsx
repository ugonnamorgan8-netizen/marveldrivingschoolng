import { Phone, Instagram, Facebook, MapPin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold">Marvel</span>
            </div>
            <p className="text-sm text-background/70 mb-4">
              Umuahia's premier FRSC-approved driving school, training confident and safe drivers since 2009.
            </p>
            <p className="text-xs text-background/60">RC 2564711</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="text-background/70 hover:text-background transition-colors">About Us</a></li>
              <li><a href="#services" className="text-background/70 hover:text-background transition-colors">Services</a></li>
              <li><a href="#pricing" className="text-background/70 hover:text-background transition-colors">Pricing</a></li>
              <li><a href="#testimonials" className="text-background/70 hover:text-background transition-colors">Testimonials</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-background/70" />
                <a href="https://wa.me/2348165973142" className="text-background/70 hover:text-background transition-colors">
                  +234 816 597 3142
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Instagram className="w-4 h-4 mt-0.5 flex-shrink-0 text-background/70" />
                <a href="https://instagram.com/marveldrivingschool" className="text-background/70 hover:text-background transition-colors">
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
                <span className="text-background/70">BCA Road by Secretariat</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-bold mb-4">Operating Hours</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li>Monday - Thursday</li>
              <li className="font-medium">8:30 AM - 5:30 PM</li>
              <li className="mt-3">Friday (Theory)</li>
              <li className="font-medium">10:00 AM - 5:30 PM</li>
              <li className="mt-3 text-xs">Weekend: By special request</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/60">
            <p>© {currentYear} Marvel Driving School. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-background transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-background transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
