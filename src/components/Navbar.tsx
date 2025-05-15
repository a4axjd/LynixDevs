
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Blog", path: "/blog" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Contact", path: "/contact" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isOpen ? "bg-lynix-dark py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-white font-bold text-2xl flex items-center"
          >
            <span className="text-lynix-purple">Lynix</span>
            <span>Devs</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-lynix-purple ${
                  location.pathname === link.path ? "text-lynix-purple" : "text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button className="bg-lynix-purple hover:bg-lynix-secondary-purple text-white">
              Get Started
            </Button>
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pt-5 pb-6 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-base font-medium transition-colors hover:text-lynix-purple ${
                    location.pathname === link.path ? "text-lynix-purple" : "text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Button className="bg-lynix-purple hover:bg-lynix-secondary-purple text-white w-full mt-2">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
