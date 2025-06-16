import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, User, Clock, Users } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Example logos, you can replace these URLs with your own SVGs or images
const companyLogos = [
  {
    name: "Google",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    name: "Microsoft Azure",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg",
  },
  {
    name: "Amazon AWS",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
  },
  {
    name: "Meta",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png",
  },
  {
    name: "Shopify",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/2560px-Shopify_logo_2018.svg.png",
  },
  {
    name: "Slack",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png",
  },
  {
    name: "Stripe",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png",
  },
  {
    name: "Notion",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
  },
];

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-lynix-dark text-white py-20 md:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-1 mb-6">About LynixDevs</h1>
            <p className="body-text text-gray-300">
              We are not just a company—we are a collective of passionate
              freelancers, dreamers, and builders. United by our love for
              technology, creativity, and meaningful collaboration, we transform
              ideas into reality, one innovation at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-2 mb-6">Our Story</h2>
              <p className="body-text text-gray-600 mb-4">
                LynixDevs began in 2018, not as a traditional agency, but as a
                gathering of talented freelancers from diverse
                backgrounds—developers, designers, storytellers and
                strategists—each bringing a unique perspective to the table.
              </p>
              <p className="body-text text-gray-600 mb-6">
                For us, every project is personal. We know the late-night
                brainstorming, the rush of inspiration, and the joy of seeing a
                client's vision come to life. Our remote, borderless way of
                working means we are always innovating, always learning, and
                always connected to the heartbeat of what matters most—people.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start">
                  <CheckCircle
                    className="text-lynix-purple mr-2 mt-1"
                    size={20}
                  />
                  <span className="text-gray-700">Human-Centered Design</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle
                    className="text-lynix-purple mr-2 mt-1"
                    size={20}
                  />
                  <span className="text-gray-700">Flexible Collaboration</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle
                    className="text-lynix-purple mr-2 mt-1"
                    size={20}
                  />
                  <span className="text-gray-700">Relentless Curiosity</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle
                    className="text-lynix-purple mr-2 mt-1"
                    size={20}
                  />
                  <span className="text-gray-700">
                    Innovation-Driven Spirit
                  </span>
                </div>
              </div>
              <p className="body-text text-lynix-purple font-semibold italic mt-6">
                We believe the web should feel like home—welcoming, inspiring,
                and uniquely yours.
              </p>
            </div>
            {/* Lottie Animation instead of image */}
            <div className="relative h-[400px] flex items-center justify-center">
              <div className="rounded-2xl overflow-hidden w-full h-full bg-gradient-to-br from-lynix-purple/80 to-lynix-tertiary-purple/80 flex items-center justify-center">
                <DotLottieReact
                  src="/assets/AboutPage.lottie"
                  autoplay
                  loop
                  style={{
                    width: "min(320px, 70vw)",
                    height: "min(320px, 70vw)",
                    maxWidth: "320px",
                    maxHeight: "320px",
                    margin: "auto",
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-lynix-purple/10 backdrop-blur-sm rounded-full z-0"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-lynix-light-purple/20 backdrop-blur-sm rounded-full z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-lynix-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="text-lynix-purple" size={24} />
              </div>
              <h3 className="text-4xl font-bold text-lynix-dark mb-2">200+</h3>
              <p className="text-gray-600">Happy Clients</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-lynix-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-lynix-purple" size={24} />
              </div>
              <h3 className="text-4xl font-bold text-lynix-dark mb-2">5+</h3>
              <p className="text-gray-600">Years Experience</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-lynix-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-lynix-purple" size={24} />
              </div>
              <h3 className="text-4xl font-bold text-lynix-dark mb-2">350+</h3>
              <p className="text-gray-600">Projects Completed</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-lynix-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-lynix-purple" size={24} />
              </div>
              <h3 className="text-4xl font-bold text-lynix-dark mb-2">25+</h3>
              <p className="text-gray-600">Collaborating Freelancers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 mb-4">Our Core Values</h2>
            <p className="body-text text-gray-600">
              These principles guide our work and define our culture. They shape
              how we collaborate with clients and approach every project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="w-14 h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-6">
                <span className="text-lynix-purple text-2xl font-bold">01</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Empathy</h3>
              <p className="text-gray-600">
                We listen deeply, approach with heart, and create solutions that
                truly help people.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="w-14 h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-6">
                <span className="text-lynix-purple text-2xl font-bold">02</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-gray-600">
                We embrace change and bring fresh ideas to every project, always
                pushing boundaries.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="w-14 h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-6">
                <span className="text-lynix-purple text-2xl font-bold">03</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Integrity</h3>
              <p className="text-gray-600">
                Honesty and transparency are at the core of everything we do.
                Our clients are our partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Affiliations Section - Scrolling Logos */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="heading-2 mb-4">
              Affiliated With Leading Companies
            </h2>
            <p className="body-text text-gray-600">
              Our freelancers have worked with, contributed to, or collaborated
              with top global brands:
            </p>
          </div>
          <div className="overflow-x-hidden">
            <div className="relative w-full h-24">
              <div
                className="absolute flex gap-16 animate-scroll-logos items-center"
                style={{
                  animation: "scroll-logos 25s linear infinite",
                  minWidth: "1200px",
                }}
              >
                {companyLogos.concat(companyLogos).map((logo, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center min-w-36"
                  >
                    <img
                      src={logo.url}
                      alt={logo.name}
                      className="h-12 mb-2 object-contain"
                      style={{ filter: "grayscale(0.2)" }}
                    />
                    <span className="text-xs text-gray-600">{logo.name}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Keyframes for infinite scroll */}
            <style>
              {`
                @keyframes scroll-logos {
                  0% { left: 0%; }
                  100% { left: -50%; }
                }
                .animate-scroll-logos {
                  left: 0;
                  will-change: left;
                }
              `}
            </style>
          </div>
        </div>
      </section>

      {/* Why Freelance? Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-2 mb-6">
              Why We Choose Freelance Collaboration
            </h2>
            <p className="body-text text-gray-600 mb-6">
              For us, freelancing is more than a way of working—it's a
              philosophy of life. It means freedom to create, to connect across
              borders, and to bring the best talent together for every
              challenge. Our journey is filled with trust, creativity, and the
              courage to try something new. We believe that when passionate
              people unite, anything is possible.
            </p>
            <p className="body-text text-lynix-purple font-semibold italic">
              Every project is a story, every client a collaborator, every
              result a shared achievement.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-lynix-dark text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 mb-6">Ready to Work With Us?</h2>
            <p className="body-text text-gray-300 mb-8">
              Let's discuss how we can help you achieve your business goals with
              our digital expertise.
            </p>
            <Button
              asChild
              className="bg-lynix-purple hover:bg-lynix-secondary-purple text-white px-8 py-6"
            >
              <Link to="/start-project">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
