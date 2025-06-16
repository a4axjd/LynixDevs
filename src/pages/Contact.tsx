import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Mail, Clock } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { DotLottieReact } from "@lottiefiles/dotlottie-react"; // For Lottie animations

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL || "http://localhost:3001"
        }/api/contact/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Message sent successfully!",
          description:
            "Thank you for your message. We'll get back to you soon.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <SEOHead
        title="Contact Us | LynixDevs - Get In Touch"
        description="Contact LynixDevs for your web development needs. We're here to help bring your digital vision to life."
        url={`${window.location.origin}/contact`}
      />

      {/* Hero Section with Lottie Animation */}
      <section className="bg-lynix-dark text-white py-20 md:py-28 relative">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1 className="heading-1 mb-6">Get In Touch</h1>
            <p className="body-text text-gray-300">
              Ready to start your next project? We'd love to hear from you.
            </p>
            {/* Lottie Animation: Friendly chat, communication, or envelope animation */}
            <div className="flex justify-center mt-8">
              <DotLottieReact
                src="/assets/contact-hero.lottie"
                autoplay
                loop
                style={{ width: "220px", height: "220px", margin: "auto" }}
              />
            </div>
          </div>
        </div>
        {/* Optionally, add a decorative animated background Lottie here for style */}
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="heading-2 mb-8">Let's Start a Conversation</h2>
              <p className="body-text text-gray-600 mb-8">
                We're here to help bring your digital vision to life. Reach out
                to us and let's discuss your project.
              </p>

              <div className="space-y-6">
                {/* Lottie Animation: Location pin, globe, or remote work */}
                <div className="flex items-start">
                  <div className="w-10 h-10 flex items-center justify-center mr-4">
                    <DotLottieReact
                      src="/assets/location.lottie"
                      autoplay
                      loop
                      style={{ width: "40px", height: "40px" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Office Location</h3>
                    <p className="text-gray-600">
                      Remote Team - Serving Globally
                    </p>
                  </div>
                </div>
                {/* Lottie Animation: Email/envelope */}
                <div className="flex items-start">
                  <div className="w-10 h-10 flex items-center justify-center mr-4">
                    <DotLottieReact
                      src="/assets/email.lottie"
                      autoplay
                      loop
                      style={{ width: "40px", height: "40px" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">hello@lynixdevs.us</p>
                  </div>
                </div>
                {/* Lottie Animation: Clock/timer */}
                <div className="flex items-start">
                  <div className="w-10 h-10 flex items-center justify-center mr-4">
                    <DotLottieReact
                      src="/assets/clock.lottie"
                      autoplay
                      loop
                      style={{ width: "40px", height: "40px" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Response Time</h3>
                    <p className="text-gray-600">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form with Lottie Animation */}
            <div className="bg-white p-8 rounded-xl shadow-lg relative">
              {/* Lottie Animation: Paper plane, sending message, or form animation */}
              <div className="absolute -top-12 right-4 z-10 hidden md:block">
                <DotLottieReact
                  src="/assets/send-message.lottie"
                  autoplay
                  loop
                  style={{ width: "80px", height: "80px" }}
                />
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject *
                  </label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="border-gray-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="border-gray-300"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-lynix-purple hover:bg-lynix-secondary-purple text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Collaboration/Community Section with Lottie */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              {/* Lottie Animation: Collaboration, teamwork, or global community */}
              <DotLottieReact
                src="/assets/community.lottie"
                autoplay
                loop
                style={{ width: "120px", height: "120px", margin: "auto" }}
              />
            </div>
            <h2 className="heading-2 mb-4">More Than Just a Project</h2>
            <p className="body-text text-gray-600">
              When you reach out to Lynix Devs, you’re connecting with a global
              network of passionate creators, innovators, and problem-solvers.
              We believe in building lasting relationships and growing together.
              Whether you have a question, need advice, or want to collaborate
              on something meaningful, we’re here to listen and help.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
