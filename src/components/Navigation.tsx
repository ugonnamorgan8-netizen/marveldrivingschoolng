import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import marvelLogo from "@/assets/marvel-logo.jpg";
import { useBooking } from "./BookingDialog";
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  // On sub-pages (e.g. a blog post) section links must point back to the homepage.
  const { pathname } = useLocation();
  const base = pathname === "/" ? "" : "/";
  const { openBooking } = useBooking();
  const navItems = [{
    label: "Home",
    href: "#home"
  }, {
    label: "About",
    href: "#about"
  }, {
    label: "Services",
    href: "#services"
  }, {
    label: "Gallery",
    href: "#gallery"
  }, {
    label: "Locations",
    href: "#locations"
  }, {
    label: "Testimonials",
    href: "#testimonials"
  }, {
    label: "Blog",
    href: "#blog"
  }, {
    label: "FAQ",
    href: "#faq"
  }, {
    label: "Contact",
    href: "#contact"
  }];
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href={`${base}#home`} className="flex items-center space-x-2 text-xs">
            <img
              src={marvelLogo}
              alt="Marvel Driving School logo"
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover"
            />
            <span className="text-xl md:text-2xl font-bold text-foreground hidden sm:block">
              Marvel Driving School
            </span>
            <span className="text-lg font-bold text-foreground sm:hidden">Marvel</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => <a key={item.label} href={`${base}${item.href}`} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-accent">
                {item.label}
              </a>)}
            <Button size="sm" className="ml-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-6 shadow-md transition-transform hover:scale-[1.02]" onClick={() => openBooking()} data-track="nav_book_now">
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-md text-foreground hover:bg-accent" aria-label="Toggle menu" aria-expanded={isOpen}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <div className="lg:hidden pb-4 space-y-2">
            {navItems.map(item => <a key={item.label} href={`${base}${item.href}`} onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors">
                {item.label}
              </a>)}
            <Button variant="default" size="default" className="w-full mt-4" data-track="nav_book_now_mobile"
              onClick={() => { setIsOpen(false); openBooking(); }}>
              Book Now
            </Button>
          </div>}
      </div>
    </nav>;
};
export default Navigation;