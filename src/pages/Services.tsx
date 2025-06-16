import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Code,
  PenTool,
  Smartphone,
  Server,
  LayoutDashboard,
  Globe,
  CheckCircle,
  Briefcase,
  ChartBar,
  DollarSign,
  Users,
  Shield,
  Lightbulb,
  Megaphone,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react"; // Lottie for animations

const businessServices = [
  {
    category: "Business Foundation",
    icon: Briefcase,
    lottie: "/assets/business-foundation.lottie",
    services: [
      "Business Planning & Strategy Development",
      "Market Research & Feasibility Studies",
      "Company Formation & Legal Setup",
      "Funding & Grant Advisory",
      "Business Coaching & Mentorship",
    ],
  },
  {
    category: "Financial Management",
    icon: DollarSign,
    lottie: "/assets/finance.lottie",
    services: [
      "Accounting & Bookkeeping Services",
      "Tax Planning & Compliance",
      "Payroll Management Solutions",
      "Financial Analytics & Reporting",
      "Insurance & Risk Management",
    ],
  },
  {
    category: "Digital Marketing & Growth",
    icon: Megaphone,
    lottie: "/assets/marketing.lottie",
    services: [
      "Digital Marketing & Lead Generation",
      "SEO & Content Marketing",
      "Social Media Management",
      "Email Marketing & Automation",
      "Analytics & Performance Tracking",
    ],
  },
  {
    category: "Technology Solutions",
    icon: Code,
    lottie: "/assets/technology.lottie",
    services: [
      "Website Design & Development",
      "E-commerce Store Setup",
      "CRM System Implementation",
      "IT Support & Network Setup",
      "Cybersecurity & Data Protection",
    ],
  },
  {
    category: "Operations & HR",
    icon: Users,
    lottie: "/assets/hr.lottie",
    services: [
      "HR & Recruitment Services",
      "Employee Training & Development",
      "Customer Support & Helpdesk Setup",
      "Office Space & Virtual Office Services",
      "Inventory & Supply Chain Management",
    ],
  },
  {
    category: "Brand & Design",
    icon: PenTool,
    lottie: "/assets/design.lottie",
    services: [
      "Branding & Visual Identity",
      "Graphic Design & Print Collateral",
      "Packaging & Fulfillment Solutions",
      "Point-of-Sale & Payment Solutions",
      "Shipping & Logistics Coordination",
    ],
  },
];

const coreTechnicalServices = [
  {
    title: "Mobile App Development",
    icon: Smartphone,
    lottie: "/assets/mobile.lottie",
    desc: "Native and cross-platform mobile applications that engage users and drive conversions.",
    features: [
      "iOS and Android apps",
      "React Native development",
      "App store optimization",
    ],
  },
  {
    title: "Backend Development",
    icon: Server,
    lottie: "/assets/backend.lottie",
    desc: "Robust server-side solutions that power your applications with reliable performance.",
    features: [
      "API development",
      "Database architecture",
      "Cloud infrastructure",
    ],
  },
  {
    title: "Digital Marketing",
    icon: Globe,
    lottie: "/assets/seo.lottie",
    desc: "Strategic marketing solutions to increase your online visibility and drive growth.",
    features: [
      "SEO optimization",
      "Content marketing",
      "Social media management",
    ],
  },
];

const Services = () => {
  return (
    <div>
      {/* Hero Section - Suggestion: Abstract business or digital transformation animation */}
      <section className="bg-lynix-dark text-white py-20 md:py-28 relative">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1 className="heading-1 mb-6">Complete Business Solutions</h1>
            <p className="body-text text-gray-300">
              From startup to scale-up, we provide comprehensive digital and
              business services to help your company thrive in today's
              competitive marketplace.
            </p>
            <div className="flex justify-center mt-8">
              {/* HERO LOTTIE: Abstract/tech/analytics animation */}
              <DotLottieReact
                src="/assets/hero-business-abstract.lottie"
                autoplay
                loop
                style={{ width: "220px", height: "220px", margin: "auto" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Web Development */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-lynix-purple/10 text-lynix-purple font-medium text-sm mb-4">
                Website Development
              </div>
              <h2 className="heading-2 mb-4">Custom Web Development</h2>
              <p className="body-text text-gray-600 mb-6">
                We create custom-built, high-performance websites tailored to
                your specific business needs. Our development team focuses on
                creating scalable, secure, and responsive solutions that work
                across all devices.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle
                    className="text-lynix-purple mr-3 mt-1"
                    size={20}
                  />
                  <span className="text-gray-700">
                    Custom front-end and back-end development
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    className="text-lynix-purple mr-3 mt-1"
                    size={20}
                  />
                  <span className="text-gray-700">
                    E-commerce platforms with payment integration
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    className="text-lynix-purple mr-3 mt-1"
                    size={20}
                  />
                  <span className="text-gray-700">
                    Progressive Web Applications (PWAs)
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    className="text-lynix-purple mr-3 mt-1"
                    size={20}
                  />
                  <span className="text-gray-700">
                    Web portals and dashboards
                  </span>
                </li>
              </ul>
              <Button
                asChild
                className="bg-lynix-purple hover:bg-lynix-secondary-purple"
              >
                <Link to="/start-project">Get Started</Link>
              </Button>
            </div>
            <div className="relative flex items-center justify-center">
              {/* Lottie Animation: web coding / developer at screen */}
              <DotLottieReact
                src="/assets/web-dev.lottie"
                autoplay
                loop
                style={{ width: "320px", height: "320px", maxWidth: "100%" }}
              />
            </div>
          </div>

          {/* UI/UX Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 md:order-1 relative flex items-center justify-center">
              {/* Lottie Animation: creative design / wireframe / drawing */}
              <DotLottieReact
                src="/assets/ui-ux.lottie"
                autoplay
                loop
                style={{ width: "320px", height: "320px", maxWidth: "100%" }}
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-lynix-purple/10 text-lynix-purple font-medium text-sm mb-4">
                UI/UX Design
              </div>
              <h2 className="heading-2 mb-4">User Experience Design</h2>
              <p className="body-text text-gray-600 mb-6">
                We design intuitive, user-friendly interfaces that provide
                exceptional user experiences. Our design process is centered
                around understanding your users' needs and creating interfaces
                that delight and engage.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle
                    className="text-lynix-purple mr-3 mt-1"
                    size={20}
                  />
                  <span className="text-gray-700">
                    User research and persona development
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    className="text-lynix-purple mr-3 mt-1"
                    size={20}
                  />
                  <span className="text-gray-700">
                    Wireframing and prototyping
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    className="text-lynix-purple mr-3 mt-1"
                    size={20}
                  />
                  <span className="text-gray-700">
                    Visual design and UI systems
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    className="text-lynix-purple mr-3 mt-1"
                    size={20}
                  />
                  <span className="text-gray-700">
                    Usability testing and optimization
                  </span>
                </li>
              </ul>
              <Button
                asChild
                className="bg-lynix-purple hover:bg-lynix-secondary-purple"
              >
                <Link to="/start-project">Get Started</Link>
              </Button>
            </div>
          </div>

          {/* Comprehensive Business Services */}
          <div className="mt-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="heading-2 mb-4">Complete Business Services</h2>
              <p className="body-text text-gray-600">
                Everything you need to launch, grow, and scale your business
                successfully.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businessServices.map((category, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center"
                >
                  <div className="flex items-center justify-center mb-6">
                    {/* Lottie for each business service (no colored background) */}
                    <DotLottieReact
                      src={category.lottie}
                      autoplay
                      loop
                      style={{ width: "60px", height: "60px" }}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-center">
                    {category.category}
                  </h3>
                  <ul className="space-y-3">
                    {category.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-start">
                        <CheckCircle
                          className="text-lynix-purple mr-3 mt-0.5 flex-shrink-0"
                          size={16}
                        />
                        <span className="text-gray-600 text-sm">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Core Services */}
          <div className="mt-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="heading-2 mb-4">Core Technical Services</h2>
              <p className="body-text text-gray-600">
                Our specialized technical expertise to power your digital
                transformation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coreTechnicalServices.map((service, idx) => (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center"
                >
                  <div className="flex items-center justify-center mb-6">
                    {/* Lottie for each technical service (no colored background) */}
                    <DotLottieReact
                      src={service.lottie}
                      autoplay
                      loop
                      style={{ width: "60px", height: "60px" }}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 text-center">
                    {service.desc}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, fidx) => (
                      <li className="flex items-start" key={fidx}>
                        <CheckCircle
                          className="text-lynix-purple mr-2 mt-0.5"
                          size={16}
                        />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-lynix-dark py-20 relative">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-lynix-purple to-lynix-secondary-purple rounded-2xl p-10 md:p-16 relative z-10">
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-white/90 text-lg mb-8">
                Let's discuss your project and explore how our comprehensive
                services can help you achieve your business goals.
              </p>
              {/* CTA Lottie: e.g. rocket launch, handshake */}
              <div className="mb-8">
                <DotLottieReact
                  src="/assets/cta.lottie"
                  autoplay
                  loop
                  style={{ width: "140px", height: "140px" }}
                />
              </div>
              <Button
                asChild
                className="bg-white text-white hover:bg-gray-100 px-8 py-6 text-lg"
              >
                <Link to="/start-project">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
