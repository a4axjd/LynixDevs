
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, User, Clock, Users } from "lucide-react";

const About = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-lynix-dark text-white py-20 md:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-1 mb-6">About LynixDevs</h1>
            <p className="body-text text-gray-300">
              We're a team of passionate designers, developers, and digital strategists dedicated to 
              creating exceptional digital experiences.
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
                Founded in 2018, LynixDevs was born from a simple idea: to create digital solutions 
                that truly work for businesses and their customers. What started as a small team of 
                three passionate developers has grown into a full-service digital agency with a 
                team of experts across various disciplines.
              </p>
              <p className="body-text text-gray-600 mb-6">
                We believe that great technology should simplify lives, not complicate them. 
                This philosophy guides everything we do – from the websites we build to the 
                applications we develop and the strategies we create.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="text-lynix-purple mr-2 mt-1" size={20} />
                  <span className="text-gray-700">User-Centered Approach</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-lynix-purple mr-2 mt-1" size={20} />
                  <span className="text-gray-700">Innovative Solutions</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-lynix-purple mr-2 mt-1" size={20} />
                  <span className="text-gray-700">Quality Craftsmanship</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-lynix-purple mr-2 mt-1" size={20} />
                  <span className="text-gray-700">Open Communication</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden h-[400px] bg-gradient-to-br from-lynix-purple/80 to-lynix-tertiary-purple/80">
                {/* This would be an image in a real implementation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-xl font-semibold mb-2">Our Office</p>
                    <p className="opacity-80">Where creativity meets technology</p>
                  </div>
                </div>
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
              <p className="text-gray-600">Team Members</p>
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
              These principles guide our work and define our culture. They shape how we collaborate 
              with clients and approach every project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="w-14 h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-6">
                <span className="text-lynix-purple text-2xl font-bold">01</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Excellence</h3>
              <p className="text-gray-600">
                We're committed to delivering work of the highest quality in everything we do, 
                from code to design to client communication.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="w-14 h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-6">
                <span className="text-lynix-purple text-2xl font-bold">02</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-gray-600">
                We stay at the forefront of technology and design trends, always seeking 
                better solutions to complex problems.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="w-14 h-14 rounded-lg bg-lynix-purple/10 flex items-center justify-center mb-6">
                <span className="text-lynix-purple text-2xl font-bold">03</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Integrity</h3>
              <p className="text-gray-600">
                We build relationships based on trust, honesty, and transparency, 
                following through on our commitments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section Placeholder */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 mb-4">Meet Our Team</h2>
            <p className="body-text text-gray-600">
              Our talented team brings together a diverse range of skills and expertise to deliver exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* In a real implementation, this would include actual team member photos and info */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg">
                <div className="h-64 bg-gradient-to-br from-lynix-purple/70 to-lynix-tertiary-purple/70"></div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-1">Team Member {i}</h3>
                  <p className="text-lynix-purple mb-4">Position</p>
                  <p className="text-gray-600 text-sm">
                    Brief description about the team member and their expertise.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-lynix-dark text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 mb-6">Ready to Work With Us?</h2>
            <p className="body-text text-gray-300 mb-8">
              Let's discuss how we can help you achieve your business goals with our digital expertise.
            </p>
            <Button asChild className="bg-lynix-purple hover:bg-lynix-secondary-purple text-white px-8 py-6">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
