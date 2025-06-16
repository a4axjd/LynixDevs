import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Instagram, Twitter, Linkedin, Facebook } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { config } from "@/lib/config";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Footer = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${config.serverUrl}/api/newsletter/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to subscribe");
      }

      const data = await response.json();

      toast({
        title: "Subscription successful!",
        description:
          data.message || "Thank you for subscribing to our newsletter.",
      });

      setEmail("");
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-lynix-dark text-white">
      <div className="container-custom pt-12 sm:pt-16 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Company Information */}
          <div className="flex flex-col items-center sm:items-start">
            <Link
              to="/"
              className="text-white font-bold text-xl sm:text-2xl flex items-center justify-center sm:justify-start mb-4"
            >
              <img
                src="/favicon.svg"
                alt="LynixDevs Logo"
                className="h-7 sm:h-8 w-auto object-contain mr-2"
              />
              <span className="ml-2">Lynix Devs</span>
              {/* Replace "LynixDevs" with your desired text */}
            </Link>
            <p className="text-gray-300 mb-5 text-sm sm:text-base leading-relaxed text-center sm:text-left max-w-[280px]">
              Creating digital experiences that transform businesses and delight
              users.
            </p>
            <div className="flex space-x-4 justify-center sm:justify-start mb-6">
              <a
                href="#"
                className="text-white hover:text-lynix-purple transition-colors p-1"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="text-white hover:text-lynix-purple transition-colors p-1"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="text-white hover:text-lynix-purple transition-colors p-1"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="text-white hover:text-lynix-purple transition-colors p-1"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
            <div className="hidden sm:block w-full mt-auto">
              <DotLottieReact
                src="/assets/AboutPage.lottie"
                autoplay
                loop
                style={{ width: 120, height: 120 }}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-start w-full max-w-[240px] sm:max-w-none">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4 sm:mb-5 text-center sm:text-left">
                  Quick Links
                </h3>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:block sm:space-y-3">
                  <li>
                    <Link
                      to="/about"
                      className="text-gray-300 hover:text-lynix-purple transition-colors text-sm sm:text-base block py-1"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services"
                      className="text-gray-300 hover:text-lynix-purple transition-colors text-sm sm:text-base block py-1"
                    >
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/portfolio"
                      className="text-gray-300 hover:text-lynix-purple transition-colors text-sm sm:text-base block py-1"
                    >
                      Portfolio
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog"
                      className="text-gray-300 hover:text-lynix-purple transition-colors text-sm sm:text-base block py-1"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-gray-300 hover:text-lynix-purple transition-colors text-sm sm:text-base block py-1"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-start w-full max-w-[240px] sm:max-w-none">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4 sm:mb-5 text-center sm:text-left">
                  Contact Us
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-center sm:justify-start">
                    <Mail
                      size={16}
                      className="mr-2 text-lynix-purple flex-shrink-0"
                    />
                    <a
                      href="mailto:info@lynixdevs.us"
                      className="text-gray-300 hover:text-lynix-purple transition-colors text-sm sm:text-base break-all"
                    >
                      info@lynixdevs.us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-start w-full max-w-[280px] sm:max-w-none">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4 sm:mb-5 text-center sm:text-left">
                  Newsletter
                </h3>
                <p className="text-gray-300 mb-4 text-sm sm:text-base text-center sm:text-left">
                  Stay updated with our latest news and offers.
                </p>
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col space-y-3 w-full"
                >
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="border-lynix-purple focus:ring-lynix-purple bg-gray-800 text-white text-sm h-10"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-lynix-purple hover:bg-lynix-secondary-purple h-10 text-sm"
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <hr className="border-gray-800 my-8" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs sm:text-sm">
            &copy; {year} LynixDevs. All rights reserved.
          </p>
          <div className="flex space-x-5">
            <Link
              to="/privacy-policy"
              className="text-gray-400 hover:text-lynix-purple text-xs sm:text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-gray-400 hover:text-lynix-purple text-xs sm:text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
