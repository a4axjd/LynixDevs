
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Facebook } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-lynix-dark text-white">
      <div className="container-custom pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Information */}
          <div>
            <Link to="/" className="text-white font-bold text-2xl flex items-center mb-4">
              <span className="text-lynix-purple">Lynix</span>
              <span>Devs</span>
            </Link>
            <p className="text-gray-300 mb-6">
              Creating digital experiences that transform businesses and delight users.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-lynix-purple">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-lynix-purple">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-lynix-purple">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-white hover:text-lynix-purple">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-lynix-purple transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-lynix-purple transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-gray-300 hover:text-lynix-purple transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-lynix-purple transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-lynix-purple transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 text-lynix-purple" />
                <span className="text-gray-300">
                  123 Agency Street, Tech City, 10001
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-lynix-purple" />
                <a href="tel:+1234567890" className="text-gray-300 hover:text-lynix-purple transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-lynix-purple" />
                <a href="mailto:info@lynixdevs.com" className="text-gray-300 hover:text-lynix-purple transition-colors">
                  info@lynixdevs.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-gray-300 mb-4">
              Stay updated with our latest news and offers.
            </p>
            <div className="flex flex-col space-y-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="border-lynix-purple focus:ring-lynix-purple bg-gray-800 text-white" 
              />
              <Button className="bg-lynix-purple hover:bg-lynix-secondary-purple w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {year} LynixDevs. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-gray-400 text-sm hover:text-lynix-purple">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-400 text-sm hover:text-lynix-purple">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
