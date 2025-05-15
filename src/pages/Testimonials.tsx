import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const Testimonials = () => {
  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "CEO, TechStart Inc.",
      company: "TechStart Inc.",
      content: "Working with LynixDevs was a game-changer for our business. Their team delivered a website that not only looks beautiful but also performs exceptionally well. The attention to detail and commitment to our project's success was evident throughout the process.",
      rating: 5,
      image: "gradient-1", // In a real implementation, this would be an actual image path
      color: "from-blue-500 to-purple-500",
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      position: "Marketing Director",
      company: "Global Retail Solutions",
      content: "The e-commerce platform developed by LynixDevs exceeded our expectations. Their team took the time to understand our unique requirements and delivered a solution that has significantly improved our online sales. The ongoing support has been exceptional.",
      rating: 5,
      image: "gradient-2",
      color: "from-green-500 to-teal-500",
    },
    {
      id: 3,
      name: "Emily Chen",
      position: "Product Manager",
      company: "InnovateTech",
      content: "LynixDevs helped us transform our product idea into a fully-functional mobile application. Their expertise in UI/UX design and development was invaluable. The app has received excellent feedback from our users, and we're already planning our next project with them.",
      rating: 4,
      image: "gradient-3",
      color: "from-red-500 to-orange-500",
    },
    {
      id: 4,
      name: "David Thompson",
      position: "Founder",
      company: "Creative Solutions",
      content: "The team at LynixDevs is truly exceptional. They redesigned our website and implemented a new CMS that has made content management so much easier for our team. Their technical knowledge combined with their creative approach made all the difference.",
      rating: 5,
      image: "gradient-4",
      color: "from-yellow-500 to-amber-500",
    },
    {
      id: 5,
      name: "Jennifer Garcia",
      position: "Operations Director",
      company: "HealthTech Innovations",
      content: "We needed a secure, compliant platform for our healthcare application, and LynixDevs delivered exactly what we needed. Their attention to security and data protection while maintaining an intuitive user experience was impressive.",
      rating: 5,
      image: "gradient-5",
      color: "from-pink-500 to-rose-500",
    },
    {
      id: 6,
      name: "Robert Wilson",
      position: "CTO",
      company: "Finance Solutions Ltd",
      content: "LynixDevs helped us modernize our legacy financial software with a cloud-based solution. The transition was smooth, and the new system has improved our efficiency tremendously. Their technical expertise and project management are top-notch.",
      rating: 4,
      image: "gradient-6",
      color: "from-indigo-500 to-violet-500",
    },
  ];

  // Featured testimonial (first one in the list)
  const featuredTestimonial = testimonials[0];
  // Rest of the testimonials
  const regularTestimonials = testimonials.slice(1);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-lynix-dark text-white py-20 md:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-1 mb-6">Client Testimonials</h1>
            <p className="body-text text-gray-300">
              Don't just take our word for it. See what our clients have to say about working with us.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Testimonial */}
      <section className="py-16">
        <div className="container-custom">
          <div className="bg-lynix-purple/5 rounded-2xl overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className={`bg-gradient-to-br ${featuredTestimonial.color} min-h-[300px] md:min-h-full flex items-center justify-center`}>
                <div className="text-center text-white p-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {featuredTestimonial.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{featuredTestimonial.name}</h3>
                  <p className="opacity-90">{featuredTestimonial.position}</p>
                  <p className="text-white/80">{featuredTestimonial.company}</p>
                </div>
              </div>
              <div className="p-8 md:p-12">
                <div className="flex mb-6">
                  {[...Array(featuredTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="fill-lynix-purple text-lynix-purple" size={20} />
                  ))}
                </div>
                <blockquote className="text-xl md:text-2xl font-medium text-gray-700 mb-6">
                  "{featuredTestimonial.content}"
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-2 text-center mb-16">What Our Clients Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularTestimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="fill-lynix-purple text-lynix-purple" size={16} />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center mr-4`}>
                    <span className="text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">
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
      <section className="py-20">
        <div className="container-custom">
          <div className="bg-lynix-dark rounded-2xl p-10 md:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Join Our Success Stories?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Let's work together to create a digital solution that exceeds your expectations.
              </p>
              <Button asChild className="bg-lynix-purple hover:bg-lynix-secondary-purple text-white px-8 py-6 text-lg">
                <Link to="/contact">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
