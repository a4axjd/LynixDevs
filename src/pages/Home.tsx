
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, LayoutDashboard, PenTool, Server, Smartphone } from "lucide-react";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="bg-lynix-dark text-white pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center">
            <div className={`lg:w-1/2 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 -translate-x-12'}`}>
              <h1 className="heading-1 mb-6">
                We Create <span className="text-lynix-purple">Digital Solutions</span> That Transform Businesses
              </h1>
              <p className="body-text text-gray-300 mb-8 max-w-xl">
                LynixDevs is a full-service digital agency specializing in web development, 
                UI/UX design, and digital marketing strategies that help businesses thrive in 
                the digital landscape.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-lynix-purple hover:bg-lynix-secondary-purple text-white px-8 py-6">
                  <Link to="/contact">Get Started</Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6">
                  <Link to="/portfolio">Our Work</Link>
                </Button>
              </div>
            </div>
            <div className={`lg:w-1/2 mt-12 lg:mt-0 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0 translate-x-12'}`}>
              <div className="relative">
                <div className="bg-lynix-purple/20 backdrop-blur-sm rounded-2xl p-4 md:p-8 overflow-hidden">
                  <div className="w-full h-[300px] md:h-[400px] bg-gradient-to-br from-lynix-purple to-lynix-secondary-purple rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-lynix-dark/30 flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                          <img 
                            src="/lovable-uploads/041cb83a-ded4-4d58-bdcc-8ae8bf10f151.png" 
                            alt="LynixDevs Logo" 
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <h3 className="text-white text-xl font-bold">Digital Excellence</h3>
                        <p className="text-white/80 mt-2">Transforming ideas into reality</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-lynix-light-purple/20 backdrop-blur-sm rounded-full z-0"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-lynix-purple/10 backdrop-blur-sm rounded-full z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 mb-4">Our Services</h2>
            <p className="body-text text-gray-600">
              We offer a comprehensive range of digital services to help your business grow and succeed in the digital world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-6">
                <Code className="text-lynix-purple" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Web Development</h3>
              <p className="text-gray-600 mb-6">
                Custom web development solutions tailored to your specific business needs and goals.
              </p>
              <Link to="/services" className="inline-flex items-center text-lynix-purple font-medium hover:underline">
                Learn More <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-6">
                <PenTool className="text-lynix-purple" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">UI/UX Design</h3>
              <p className="text-gray-600 mb-6">
                Creating intuitive, user-friendly interfaces that provide exceptional user experiences.
              </p>
              <Link to="/services" className="inline-flex items-center text-lynix-purple font-medium hover:underline">
                Learn More <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-6">
                <Smartphone className="text-lynix-purple" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Mobile App Development</h3>
              <p className="text-gray-600 mb-6">
                Native and cross-platform mobile applications that engage users and drive conversions.
              </p>
              <Link to="/services" className="inline-flex items-center text-lynix-purple font-medium hover:underline">
                Learn More <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            {/* Service 4 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-6">
                <Server className="text-lynix-purple" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Backend Development</h3>
              <p className="text-gray-600 mb-6">
                Robust server-side solutions that power your applications with reliable performance.
              </p>
              <Link to="/services" className="inline-flex items-center text-lynix-purple font-medium hover:underline">
                Learn More <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            {/* Service 5 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-6">
                <LayoutDashboard className="text-lynix-purple" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">CMS Development</h3>
              <p className="text-gray-600 mb-6">
                Content management systems that make it easy to update and manage your website.
              </p>
              <Link to="/services" className="inline-flex items-center text-lynix-purple font-medium hover:underline">
                Learn More <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            {/* Service 6 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-6">
                <img 
                  src="/lovable-uploads/041cb83a-ded4-4d58-bdcc-8ae8bf10f151.png" 
                  alt="Digital Marketing" 
                  className="w-7 h-7 object-contain"
                  style={{ filter: 'hue-rotate(260deg) saturate(2)' }}
                />
              </div>
              <h3 className="text-xl font-bold mb-3">SEO & Digital Marketing</h3>
              <p className="text-gray-600 mb-6">
                Strategies to improve your online visibility and attract more qualified leads.
              </p>
              <Link to="/services" className="inline-flex items-center text-lynix-purple font-medium hover:underline">
                Learn More <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild className="bg-lynix-purple hover:bg-lynix-secondary-purple text-white px-8">
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-lynix-dark py-20">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-lynix-purple to-lynix-secondary-purple rounded-2xl p-10 md:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Start Your Digital Journey?
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

export default Home;
