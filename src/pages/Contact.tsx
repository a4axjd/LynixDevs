
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-lynix-dark text-white py-20 md:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-1 mb-6">Contact Us</h1>
            <p className="body-text text-gray-300">
              Have a project in mind or want to learn more about our services? 
              Get in touch with our team today.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="heading-3 mb-6">Get In Touch</h2>
              <p className="body-text text-gray-600 mb-8">
                Fill out the form and our team will get back to you within 24 hours. 
                You can also reach us directly through the contact information below.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6 flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="w-10 h-10 rounded-full bg-lynix-purple/10 flex items-center justify-center">
                        <Phone className="text-lynix-purple" size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Phone</h3>
                      <p className="text-gray-600">(123) 456-7890</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="w-10 h-10 rounded-full bg-lynix-purple/10 flex items-center justify-center">
                        <Mail className="text-lynix-purple" size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
                      <p className="text-gray-600">info@lynixdevs.com</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="w-10 h-10 rounded-full bg-lynix-purple/10 flex items-center justify-center">
                        <MapPin className="text-lynix-purple" size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Location</h3>
                      <p className="text-gray-600">123 Agency Street, Tech City, 10001</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="w-10 h-10 rounded-full bg-lynix-purple/10 flex items-center justify-center">
                        <Clock className="text-lynix-purple" size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Hours</h3>
                      <p className="text-gray-600">Mon-Fri: 9AM - 6PM</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-lynix-dark rounded-xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Let's Discuss Your Project</h3>
                <p className="mb-6">
                  Schedule a free consultation with our team to discuss your project needs and how we can help.
                </p>
                <Button className="bg-lynix-purple hover:bg-lynix-secondary-purple w-full">
                  Book a Consultation
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <h2 className="heading-3 mb-6">Send Us a Message</h2>
                <form>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name
                        </label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          className="border-gray-300 focus:border-lynix-purple focus:ring-lynix-purple"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          className="border-gray-300 focus:border-lynix-purple focus:ring-lynix-purple"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number (optional)
                      </label>
                      <Input
                        id="phone"
                        placeholder="(123) 456-7890"
                        className="border-gray-300 focus:border-lynix-purple focus:ring-lynix-purple"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        placeholder="How can we help you?"
                        className="border-gray-300 focus:border-lynix-purple focus:ring-lynix-purple"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your project..."
                        className="min-h-[150px] border-gray-300 focus:border-lynix-purple focus:ring-lynix-purple"
                      />
                    </div>

                    <div>
                      <Button type="submit" className="w-full bg-lynix-purple hover:bg-lynix-secondary-purple">
                        Send Message
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="h-[400px] bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-600 text-lg">Map Integration Placeholder</p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
