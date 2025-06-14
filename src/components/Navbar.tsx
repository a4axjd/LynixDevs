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
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur shadow-md border-b border-lynix-purple/10 transition-all">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="h-10 w-10 flex items-center justify-center rounded-full overflow-hidden transition-transform group-hover:scale-110 bg-white shadow">
              <img
                src="/logo.png"
                alt="LynixDevs Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
            <span className="ml-3 text-xl font-bold text-lynix-purple tracking-tight hidden sm:inline">
              LynixDevs
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-2 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-full text-base font-medium transition-all duration-150 ${
                  isActive(item.path)
                    ? "bg-lynix-light-purple/25 text-lynix-purple shadow"
                    : "text-gray-700 hover:text-lynix-purple hover:bg-lynix-light-purple/10"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {user && (
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-full text-base font-medium transition-all duration-150 ${
                  location.pathname.startsWith("/dashboard")
                    ? "bg-lynix-light-purple/25 text-lynix-purple shadow"
                    : "text-gray-700 hover:text-lynix-purple hover:bg-lynix-light-purple/10"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Section desktop */}
          <div className="hidden md:flex items-center ml-4">
            {isLoading ? (
              <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
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
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-lynix-purple hover:text-lynix-secondary-purple focus:outline-none p-2 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Nav */}
      <div
        className={`md:hidden transition-max-h duration-300 overflow-hidden bg-white/80 backdrop-blur shadow ${
          isOpen ? "max-h-[400px] border-b border-lynix-purple/10" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 flex flex-col">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-lynix-light-purple/25 text-lynix-purple shadow"
                  : "text-gray-700 hover:text-lynix-purple hover:bg-lynix-light-purple/10"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {user && (
            <Link
              to="/dashboard"
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                location.pathname.startsWith("/dashboard")
                  ? "bg-lynix-light-purple/25 text-lynix-purple shadow"
                  : "text-gray-700 hover:text-lynix-purple hover:bg-lynix-light-purple/10"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          )}
          <div className="px-4 py-3 border-t border-lynix-purple/10 mt-2">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
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
    </header>
  );
};

export default Navbar;
