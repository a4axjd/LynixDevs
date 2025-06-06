import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "@/components/UserMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Scroll hide/show logic
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScrollY > lastScrollY.current && currentScrollY > 40) {
            setShowNavbar(false);
          } else {
            setShowNavbar(true);
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      {/* Floating Navbar */}
      <nav
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[97%] max-w-3xl transition-transform duration-300
          ${
            showNavbar
              ? "translate-y-0 opacity-100"
              : "-translate-y-24 opacity-0 pointer-events-none"
          }
          mb-4 sm:mb-8`} // Add margin-bottom for mobile spacing
        style={{ willChange: "transform, opacity" }}
      >
        <div
          className="bg-lynix-dark border border-lynix-purple/40 rounded-full px-4 py-2 flex items-center justify-between 
            shadow-lg ring-2 ring-lynix-purple/40 
            shadow-[0_0_24px_4px_rgba(139,92,246,0.25)]"
        >
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center group mr-2">
            {/* Desktop Logo */}
            <div className="h-8 w-8 items-center justify-center group-hover:scale-110 transition-transform duration-200 hidden md:flex">
              <img
                src="/lovable-uploads/8acf2a8b-1d28-4ce8-8395-0f8e15a7f7f6.png"
                alt="LynixDevs Logo"
                className="h-6 w-auto object-contain"
              />
            </div>
            {/* Mobile Logo */}
            <div className="h-8 w-8 items-center justify-center group-hover:scale-110 transition-transform duration-200 flex md:hidden">
              <img
                src="/lovable-uploads/mobile-logo.png" // <-- Set your mobile logo path here
                alt="LynixDevs Mobile Logo"
                className="h-6 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 font-medium text-base rounded-full transition-all duration-150 ${
                  isActive(item.path)
                    ? "bg-lynix-light-purple/20 text-lynix-purple"
                    : "text-white hover:text-lynix-purple hover:bg-lynix-light-purple/10"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {user && (
              <Link
                to="/dashboard"
                className={`px-4 py-2 font-medium text-base rounded-full transition-all duration-150 ${
                  location.pathname.startsWith("/dashboard")
                    ? "bg-lynix-light-purple/20 text-lynix-purple"
                    : "text-white hover:text-lynix-purple hover:bg-lynix-light-purple/10"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center ml-2">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />
            ) : user ? (
              <UserMenu />
            ) : (
              <Link to="/auth">
                <Button
                  size="sm"
                  className="rounded-full bg-lynix-purple text-white px-6 py-2 font-semibold shadow-md hover:bg-lynix-secondary-purple transition-colors duration-150"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center ml-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-lynix-purple focus:outline-none p-2 rounded-full hover:bg-lynix-light-purple/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-2 bg-lynix-dark border border-lynix-purple/40 rounded-2xl shadow-lg ring-2 ring-lynix-purple/30 shadow-[0_0_24px_4px_rgba(139,92,246,0.25)] overflow-hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 max-h-screen overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-lynix-light-purple/20 text-lynix-purple"
                      : "text-white hover:text-lynix-purple hover:bg-lynix-light-purple/10"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <Link
                  to="/dashboard"
                  className={`block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                    location.pathname.startsWith("/dashboard")
                      ? "bg-lynix-light-purple/20 text-lynix-purple"
                      : "text-white hover:text-lynix-purple hover:bg-lynix-light-purple/10"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <div className="px-4 py-3 border-t border-lynix-purple/30 mt-3">
                {isLoading ? (
                  <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />
                ) : user ? (
                  <UserMenu />
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-full bg-lynix-purple text-white shadow-md text-sm hover:bg-lynix-secondary-purple transition-colors duration-150">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
