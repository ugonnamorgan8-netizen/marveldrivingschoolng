import { useState } from "react";
import { Menu, X } from "lucide-react";
import marvelLogo from "@/assets/marvel-logo.jpg";
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
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
          <a href="#home" className="flex items-center space-x-2 text-xs">
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
            {navItems.map(item => <a key={item.label} href={item.href} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-accent">
                {item.label}
              </a>)}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-md text-foreground hover:bg-accent" aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <div className="lg:hidden pb-4 space-y-2">
            {navItems.map(item => <a key={item.label} href={item.href} onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors">
                {item.label}
              </a>)}
          </div>}
      </div>
    </nav>;
};
export default Navigation;