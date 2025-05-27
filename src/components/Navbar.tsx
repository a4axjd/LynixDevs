
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "@/components/UserMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="flex items-center">
                <div className="h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <img 
                    src="/lovable-uploads/01329662-a38f-40c0-83b8-4941820efc5f.png" 
                    alt="LynixDevs Logo" 
                    className="h-8 object-contain"
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  isActive(item.path)
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                } px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg border-b-2 border-transparent hover:border-primary/50`}
              >
                {item.name}
              </Link>
            ))}
            
            {user && (
              <Link
                to="/dashboard"
                className={`${
                  location.pathname.startsWith("/dashboard")
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                } px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg border-b-2 border-transparent hover:border-primary/50`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <UserMenu />
            ) : (
              <Link to="/auth">
                <Button className="shadow-lg hover:shadow-xl">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary focus:outline-none focus:text-primary p-2 rounded-lg hover:bg-primary/5 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  isActive(item.path)
                    ? "text-primary bg-primary/10 border-l-4 border-primary"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                } block px-4 py-3 text-base font-medium transition-all duration-200 rounded-r-lg`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {user && (
              <Link
                to="/dashboard"
                className={`${
                  location.pathname.startsWith("/dashboard")
                    ? "text-primary bg-primary/10 border-l-4 border-primary"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                } block px-4 py-3 text-base font-medium transition-all duration-200 rounded-r-lg`}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            <div className="px-4 py-3 border-t border-gray-200/50 mt-3">
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : user ? (
                <UserMenu />
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button className="w-full shadow-lg">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
