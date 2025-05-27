
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Facebook } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { config } from "@/lib/config";

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

      const response = await fetch(`${config.serverUrl}/api/newsletter/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to subscribe");
      }

      const data = await response.json();
      
      toast({
        title: "Subscription successful!",
        description: data.message || "Thank you for subscribing to our newsletter.",
      });
      
      setEmail("");
    } catch (error) {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Information */}
          <div className="text-center sm:text-left">
            <Link to="/" className="text-white font-bold text-xl sm:text-2xl flex items-center justify-center sm:justify-start mb-4">
              <img 
                src="/lovable-uploads/8acf2a8b-1d28-4ce8-8395-0f8e15a7f7f6.png" 
                alt="LynixDevs Logo" 
                className="h-6 sm:h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
              Creating digital experiences that transform businesses and delight users.
            </p>
            <div className="flex space-x-4 justify-center sm:justify-start">
              <a href="#" className="text-white hover:text-lynix-purple transition-colors p-1">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-white hover:text-lynix-purple transition-colors p-1">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-white hover:text-lynix-purple transition-colors p-1">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-white hover:text-lynix-purple transition-colors p-1">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-lynix-purple transition-colors text-sm sm:text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-lynix-purple transition-colors text-sm sm:text-base">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-gray-300 hover:text-lynix-purple transition-colors text-sm sm:text-base">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-lynix-purple transition-colors text-sm sm:text-base">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-lynix-purple transition-colors text-sm sm:text-base">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start justify-center sm:justify-start">
                <MapPin size={16} className="mr-2 mt-1 text-lynix-purple flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base">
                  123 Agency Street, Tech City, 10001
                </span>
              </li>
              <li className="flex items-center justify-center sm:justify-start">
                <Phone size={16} className="mr-2 text-lynix-purple flex-shrink-0" />
                <a href="tel:+1234567890" className="text-gray-300 hover:text-lynix-purple transition-colors text-sm sm:text-base">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center justify-center sm:justify-start">
                <Mail size={16} className="mr-2 text-lynix-purple flex-shrink-0" />
                <a href="mailto:info@lynixdevs.us" className="text-gray-300 hover:text-lynix-purple transition-colors text-sm sm:text-base break-all">
                  info@lynixdevs.us
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Subscribe</h3>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
              Stay updated with our latest news and offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address" 
                className="border-lynix-purple focus:ring-lynix-purple bg-gray-800 text-white text-sm" 
              />
              <Button 
                type="submit"
                disabled={isSubmitting} 
                size="sm"
                className="bg-lynix-purple hover:bg-lynix-secondary-purple w-full text-sm"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        <hr className="border-gray-800 my-6 sm:my-8" />

        <div className="flex flex-col sm:flex-row sm:justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
            &copy; {year} LynixDevs. All rights reserved.
          </p>
          <div className="flex space-x-4 sm:space-x-6">
            <Link to="/privacy-policy" className="text-gray-400 text-xs sm:text-sm hover:text-lynix-purple">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-400 text-xs sm:text-sm hover:text-lynix-purple">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
