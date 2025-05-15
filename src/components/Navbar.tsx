
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          LynixDevs
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="block md:hidden"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn("text-sm font-medium transition-colors hover:text-primary", {
                "text-primary": isActive,
                "text-muted-foreground": !isActive,
              })
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              cn("text-sm font-medium transition-colors hover:text-primary", {
                "text-primary": isActive,
                "text-muted-foreground": !isActive,
              })
            }
          >
            About
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              cn("text-sm font-medium transition-colors hover:text-primary", {
                "text-primary": isActive,
                "text-muted-foreground": !isActive,
              })
            }
          >
            Services
          </NavLink>
          <NavLink
            to="/portfolio"
            className={({ isActive }) =>
              cn("text-sm font-medium transition-colors hover:text-primary", {
                "text-primary": isActive,
                "text-muted-foreground": !isActive,
              })
            }
          >
            Portfolio
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              cn("text-sm font-medium transition-colors hover:text-primary", {
                "text-primary": isActive,
                "text-muted-foreground": !isActive,
              })
            }
          >
            Blog
          </NavLink>
          <NavLink
            to="/testimonials"
            className={({ isActive }) =>
              cn("text-sm font-medium transition-colors hover:text-primary", {
                "text-primary": isActive,
                "text-muted-foreground": !isActive,
              })
            }
          >
            Testimonials
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              cn("text-sm font-medium transition-colors hover:text-primary", {
                "text-primary": isActive,
                "text-muted-foreground": !isActive,
              })
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={`fixed top-16 left-0 z-40 w-full transform bg-background px-6 py-8 shadow-lg transition-transform duration-300 md:hidden ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="flex flex-col space-y-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn("text-base font-medium transition-colors hover:text-primary", {
                  "text-primary": isActive,
                  "text-muted-foreground": !isActive,
                })
              }
              onClick={closeMenu}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                cn("text-base font-medium transition-colors hover:text-primary", {
                  "text-primary": isActive,
                  "text-muted-foreground": !isActive,
                })
              }
              onClick={closeMenu}
            >
              About
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                cn("text-base font-medium transition-colors hover:text-primary", {
                  "text-primary": isActive,
                  "text-muted-foreground": !isActive,
                })
              }
              onClick={closeMenu}
            >
              Services
            </NavLink>
            <NavLink
              to="/portfolio"
              className={({ isActive }) =>
                cn("text-base font-medium transition-colors hover:text-primary", {
                  "text-primary": isActive,
                  "text-muted-foreground": !isActive,
                })
              }
              onClick={closeMenu}
            >
              Portfolio
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                cn("text-base font-medium transition-colors hover:text-primary", {
                  "text-primary": isActive,
                  "text-muted-foreground": !isActive,
                })
              }
              onClick={closeMenu}
            >
              Blog
            </NavLink>
            <NavLink
              to="/testimonials"
              className={({ isActive }) =>
                cn("text-base font-medium transition-colors hover:text-primary", {
                  "text-primary": isActive,
                  "text-muted-foreground": !isActive,
                })
              }
              onClick={closeMenu}
            >
              Testimonials
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                cn("text-base font-medium transition-colors hover:text-primary", {
                  "text-primary": isActive,
                  "text-muted-foreground": !isActive,
                })
              }
              onClick={closeMenu}
            >
              Contact
            </NavLink>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
