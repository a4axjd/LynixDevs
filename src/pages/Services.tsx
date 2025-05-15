import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code, PenTool, Smartphone, Server, LayoutDashboard, Globe, CheckCircle } from "lucide-react";

const Services = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-lynix-dark text-white py-20 md:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-1 mb-6">Our Services</h1>
            <p className="body-text text-gray-300">
              We offer a comprehensive range of digital services to help your business 
              grow and succeed in the digital world.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-lynix-purple/10 text-lynix-purple font-medium text-sm mb-4">
                Website Development
              </div>
              <h2 className="heading-2 mb-4">Custom Web Development</h2>
              <p className="body-text text-gray-600 mb-6">
                We create custom-built, high-performance websites tailored to your specific business 
                needs. Our development team focuses on creating scalable, secure, and responsive 
                solutions that work across all devices.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="text-lynix-purple mr-3 mt-1" size={20} />
                  <span className="text-gray-700">Custom front-end and back-end development</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-lynix-purple mr-3 mt-1" size={20} />
                  <span className="text-gray-700">E-commerce platforms with payment integration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-lynix-purple mr-3 mt-1" size={20} />
                  <span className="text-gray-700">Progressive Web Applications (PWAs)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-lynix-purple mr-3 mt-1" size={20} />
                  <span className="text-gray-700">Web portals and dashboards</span>
                </li>
              </ul>
              <Button asChild className="bg-lynix-purple hover:bg-lynix-secondary-purple">
                <Link to="/contact">Get Started</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="w-full h-[400px] bg-gradient-to-br from-lynix-purple to-lynix-secondary-purple rounded-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Code className="text-white/20" size={180} />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-lynix-purple/10 backdrop-blur-sm rounded-full z-0"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-lynix-light-purple/20 backdrop-blur-sm rounded-full z-0"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 md:order-1 relative">
              <div className="w-full h-[400px] bg-gradient-to-br from-lynix-purple to-lynix-secondary-purple rounded-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <PenTool className="text-white/20" size={180} />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-lynix-purple/10 backdrop-blur-sm rounded-full z-0"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-lynix-light-purple/20 backdrop-blur-sm rounded-full z-0"></div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-lynix-purple/10 text-lynix-purple font-medium text-sm mb-4">
                UI/UX Design
              </div>
              <h2 className="heading-2 mb-4">User Experience Design</h2>
              <p className="body-text text-gray-600 mb-6">
                We design intuitive, user-friendly interfaces that provide exceptional user experiences. 
                Our design process is centered around understanding your users' needs and creating 
                interfaces that delight and engage.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="text-lynix-purple mr-3 mt-1" size={20} />
                  <span className="text-gray-700">User research and persona development</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-lynix-purple mr-3 mt-1" size={20} />
                  <span className="text-gray-700">Wireframing and prototyping</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-lynix-purple mr-3 mt-1" size={20} />
                  <span className="text-gray-700">Visual design and UI systems</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-lynix-purple mr-3 mt-1" size={20} />
                  <span className="text-gray-700">Usability testing and optimization</span>
                </li>
              </ul>
              <Button asChild className="bg-lynix-purple hover:bg-lynix-secondary-purple">
                <Link to="/contact">Get Started</Link>
              </Button>
            </div>
          </div>

          {/* Other Services Grid */}
          <div className="mt-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="heading-2 mb-4">Additional Services</h2>
              <p className="body-text text-gray-600">
                Explore our full range of digital services designed to help your business succeed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Service 1 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-14 h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-6">
                  <Smartphone className="text-lynix-purple" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Mobile Development</h3>
                <p className="text-gray-600 mb-6">
                  Native and cross-platform mobile applications that engage users and drive conversions.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="text-lynix-purple mr-2 mt-0.5" size={16} />
                    <span className="text-gray-600 text-sm">iOS and Android apps</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-lynix-purple mr-2 mt-0.5" size={16} />
                    <span className="text-gray-600 text-sm">React Native development</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-lynix-purple mr-2 mt-0.5" size={16} />
                    <span className="text-gray-600 text-sm">App store optimization</span>
                  </li>
                </ul>
              </div>

              {/* Service 2 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-14 h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-6">
                  <Server className="text-lynix-purple" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Backend Development</h3>
                <p className="text-gray-600 mb-6">
                  Robust server-side solutions that power your applications with reliable performance.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="text-lynix-purple mr-2 mt-0.5" size={16} />
                    <span className="text-gray-600 text-sm">API development</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-lynix-purple mr-2 mt-0.5" size={16} />
                    <span className="text-gray-600 text-sm">Database architecture</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-lynix-purple mr-2 mt-0.5" size={16} />
                    <span className="text-gray-600 text-sm">Cloud infrastructure</span>
                  </li>
                </ul>
              </div>

              {/* Service 3 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-14 h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-6">
                  <Globe className="text-lynix-purple" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Digital Marketing</h3>
                <p className="text-gray-600 mb-6">
                  Strategic marketing solutions to increase your online visibility and drive growth.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="text-lynix-purple mr-2 mt-0.5" size={16} />
                    <span className="text-gray-600 text-sm">SEO optimization</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-lynix-purple mr-2 mt-0.5" size={16} />
                    <span className="text-gray-600 text-sm">Content marketing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-lynix-purple mr-2 mt-0.5" size={16} />
                    <span className="text-gray-600 text-sm">Social media management</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-lynix-dark py-20">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-lynix-purple to-lynix-secondary-purple rounded-2xl p-10 md:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Digital Presence?
              </h2>
              <p className="text-white/90 text-lg mb-8">
                Let's discuss your project and explore how we can help you achieve your business goals.
              </p>
              <Button asChild className="bg-white text-lynix-purple hover:bg-gray-100 px-8 py-6 text-lg">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
