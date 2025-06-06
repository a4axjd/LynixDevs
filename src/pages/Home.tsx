import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import TechAnimation from "/assets/TechAnimation.lottie";
import {
  ArrowRight,
  Code,
  LayoutDashboard,
  PenTool,
  Server,
  Smartphone,
  Star,
} from "lucide-react";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "CEO",
      company: "TechStart Inc.",
      content:
        "Working with LynixDevs was a game-changer for our business. Their team delivered a website that not only looks beautiful but also performs exceptionally well.",
      rating: 5,
      color: "from-blue-500 to-purple-500",
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      position: "Marketing Director",
      company: "Global Retail Solutions",
      content:
        "The e-commerce platform developed by LynixDevs exceeded our expectations. Their team took the time to understand our unique requirements.",
      rating: 5,
      color: "from-green-500 to-teal-500",
    },
    {
      id: 3,
      name: "Emily Chen",
      position: "Product Manager",
      company: "InnovateTech",
      content:
        "LynixDevs helped us transform our product idea into a fully-functional mobile application. Their expertise in UI/UX design was invaluable.",
      rating: 5,
      color: "from-red-500 to-orange-500",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="bg-lynix-dark text-white relative overflow-hidden pt-32 sm:pt-40 md:pt-48 lg:pt-56 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
        {/* Decorative accent behind heading */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/4 z-0 pointer-events-none">
          <div className="w-[420px] h-[220px] blur-3xl bg-lynix-purple/20 opacity-60 rounded-full"></div>
        </div>

        {/* Optional: background gradient at top for depth */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-lynix-purple/40 to-transparent z-0 pointer-events-none"></div>

        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div
              className={`lg:w-1/2 text-center lg:text-left transition-all duration-1000 ${
                isVisible ? "opacity-100" : "opacity-0 -translate-x-12"
              }`}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 sm:mb-6 relative">
                <span className="relative z-10">
                  We Create{" "}
                  <span className="text-lynix-purple drop-shadow-[0_2px_12px_rgba(139,92,246,0.20)]">
                    Digital Solutions
                  </span>{" "}
                  That Transform Businesses
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                LynixDevs is a full-service digital agency specializing in web
                development, UI/UX design, and digital marketing strategies that
                help businesses thrive in the digital landscape.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center lg:justify-start">
                <Button
                  asChild
                  className="bg-lynix-purple hover:bg-lynix-secondary-purple text-white px-8 sm:px-10 py-4 sm:py-5 text-lg font-semibold rounded-full shadow-xl transition-all duration-200"
                >
                  <Link to="/contact">Get Started</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 sm:px-10 py-4 sm:py-5 text-lg font-semibold rounded-full shadow transition-all duration-200"
                >
                  <Link to="/portfolio">Our Work</Link>
                </Button>
              </div>
            </div>
            <div
              className={`lg:w-1/2 w-full mt-10 lg:mt-0 transition-all duration-1000 delay-300 ${
                isVisible ? "opacity-100" : "opacity-0 translate-x-12"
              }`}
            >
              <div className="relative px-2 sm:px-4 lg:px-0">
                <div className="bg-lynix-purple/20 backdrop-blur-lg rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 overflow-hidden shadow-2xl shadow-lynix-purple/10 animate-[float_4s_ease-in-out_infinite]">
                  <div className="w-full h-[280px] sm:h-[320px] md:h-[350px] lg:h-[400px] bg-gradient-to-br from-lynix-purple to-lynix-secondary-purple rounded-lg overflow-hidden relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-lynix-dark/30 flex flex-col items-center justify-center p-2 sm:p-4">
                      <div className="text-center space-y-2 sm:space-y-3 lg:space-y-4 w-full">
                        <div className="flex justify-center items-center w-full mb-2 sm:mb-3 lg:mb-4">
                          <DotLottieReact
                            src="/assets/TechAnimation.lottie"
                            autoplay
                            loop
                            style={{
                              width: "min(160px, 40vw)",
                              height: "min(160px, 40vw)",
                              maxWidth: "200px",
                              maxHeight: "200px",
                            }}
                          />
                        </div>
                        <h3 className="text-white text-base sm:text-lg lg:text-xl font-bold px-2">
                          Digital Excellence
                        </h3>
                        <p className="text-white/80 text-xs sm:text-sm lg:text-base px-2">
                          Transforming ideas into reality
                        </p>

                        {/* Stats Row */}
                        <div className="flex gap-4 sm:gap-6 lg:gap-10 justify-center mt-3 sm:mt-4 px-2">
                          <div className="flex flex-col items-center min-w-0">
                            <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-lynix-purple">
                              150+
                            </span>
                            <span className="text-xs sm:text-sm text-white/80 whitespace-nowrap">
                              Projects
                            </span>
                          </div>
                          <div className="flex flex-col items-center min-w-0">
                            <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-lynix-purple">
                              50+
                            </span>
                            <span className="text-xs sm:text-sm text-white/80 whitespace-nowrap">
                              Clients
                            </span>
                          </div>
                          <div className="flex flex-col items-center min-w-0">
                            <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-lynix-purple">
                              5.0
                            </span>
                            <span className="text-xs sm:text-sm text-white/80 flex items-center gap-1 whitespace-nowrap">
                              <Star
                                className="inline text-lynix-purple w-3 h-3 sm:w-3.5 sm:h-3.5"
                                fill="currentColor"
                              />{" "}
                              Rating
                            </span>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <div className="mt-4 sm:mt-6"></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating decorative blobs */}
                <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 lg:-bottom-6 lg:-right-6 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-lynix-light-purple/20 backdrop-blur-sm rounded-full z-0"></div>
                <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 lg:-top-6 lg:-left-6 w-16 h-16 sm:w-20 sm:h-20 lg:w-32 lg:h-32 bg-lynix-purple/10 backdrop-blur-sm rounded-full z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
              Our Services
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed px-4 sm:px-0">
              We offer a comprehensive range of digital services to help your
              business grow and succeed in the digital world.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Service 1 */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 mx-4 sm:mx-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-4 sm:mb-6">
                <Code className="text-lynix-purple" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                Web Development
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Custom web development solutions tailored to your specific
                business needs and goals.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center text-lynix-purple font-medium hover:underline text-sm sm:text-base"
              >
                Learn More <ArrowRight size={14} className="ml-2" />
              </Link>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 mx-4 sm:mx-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-4 sm:mb-6">
                <PenTool className="text-lynix-purple" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                UI/UX Design
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Creating intuitive, user-friendly interfaces that provide
                exceptional user experiences.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center text-lynix-purple font-medium hover:underline text-sm sm:text-base"
              >
                Learn More <ArrowRight size={14} className="ml-2" />
              </Link>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 mx-4 sm:mx-0 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-4 sm:mb-6">
                <Smartphone className="text-lynix-purple" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                Mobile App Development
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Native and cross-platform mobile applications that engage users
                and drive conversions.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center text-lynix-purple font-medium hover:underline text-sm sm:text-base"
              >
                Learn More <ArrowRight size={14} className="ml-2" />
              </Link>
            </div>

            {/* Service 4 */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 mx-4 sm:mx-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-4 sm:mb-6">
                <Server className="text-lynix-purple" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                Backend Development
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Robust server-side solutions that power your applications with
                reliable performance.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center text-lynix-purple font-medium hover:underline text-sm sm:text-base"
              >
                Learn More <ArrowRight size={14} className="ml-2" />
              </Link>
            </div>

            {/* Service 5 */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 mx-4 sm:mx-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-4 sm:mb-6">
                <LayoutDashboard className="text-lynix-purple" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                CMS Development
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Content management systems that make it easy to update and
                manage your website.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center text-lynix-purple font-medium hover:underline text-sm sm:text-base"
              >
                Learn More <ArrowRight size={14} className="ml-2" />
              </Link>
            </div>

            {/* Service 6 */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 mx-4 sm:mx-0 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-4 sm:mb-6">
                <img
                  src="/lovable-uploads/d48b52d9-ede6-4bb2-8a5b-73ff16b8e5bb.png"
                  alt="Digital Marketing"
                  className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                  style={{ filter: "hue-rotate(260deg) saturate(2)" }}
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                SEO & Digital Marketing
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Strategies to improve your online visibility and attract more
                qualified leads.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center text-lynix-purple font-medium hover:underline text-sm sm:text-base"
              >
                Learn More <ArrowRight size={14} className="ml-2" />
              </Link>
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-12 px-4 sm:px-0">
            <Button
              asChild
              className="bg-lynix-purple hover:bg-lynix-secondary-purple text-white px-6 sm:px-8 w-full sm:w-auto"
            >
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
              What Our Clients Say
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
              Don't just take our word for it. See what our clients have to say
              about working with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100 hover:shadow-xl transition-shadow mx-4 sm:mx-0"
              >
                <div className="flex mb-4 sm:mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="fill-lynix-purple text-lynix-purple"
                      size={14}
                    />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0`}
                  >
                    <span className="text-white font-bold text-sm sm:text-base">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm sm:text-base truncate">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {testimonial.position}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-lynix-dark py-12 sm:py-16 md:py-20">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-lynix-purple to-lynix-secondary-purple rounded-2xl p-6 sm:p-10 md:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                Ready to Start Your Digital Journey?
              </h2>
              <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed">
                Let's discuss your project and explore how we can help you
                achieve your business goals.
              </p>
              <Button
                asChild
                className="bg-white text-lynix-purple hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-6 text-base sm:text-lg w-full sm:w-auto"
              >
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
