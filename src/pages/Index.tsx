
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code, Palette, Rocket, Users, Star, CheckCircle } from "lucide-react";

const Index = () => {
  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Custom websites and web applications built with modern technologies",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Beautiful and intuitive designs that enhance user experience",
    },
    {
      icon: Rocket,
      title: "Digital Marketing",
      description: "Strategic marketing solutions to grow your online presence",
    },
  ];

  const features = [
    "Modern responsive design",
    "Fast loading speeds",
    "SEO optimized",
    "Mobile-first approach",
    "Custom development",
    "Ongoing support",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="heading-1 mb-6 bg-gradient-to-r from-primary to-lynix-purple bg-clip-text text-transparent">
              LynixDevs Digital Agency
            </h1>
            <p className="body-text text-muted-foreground mb-8 max-w-2xl mx-auto">
              We specialize in creating exceptional digital experiences through web development, 
              UI/UX design, and strategic digital marketing solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="group">
                <Link to="/portfolio">
                  View Our Work
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Our Services</h2>
            <p className="body-text text-muted-foreground max-w-2xl mx-auto">
              We offer comprehensive digital solutions to help your business thrive online
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-2 mb-6">Why Choose LynixDevs?</h2>
              <p className="body-text text-muted-foreground mb-8">
                We combine creativity with technical expertise to deliver solutions that 
                drive results for your business.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary to-lynix-purple rounded-lg p-8 text-white">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">50+ Happy Clients</h3>
                <p className="opacity-90 mb-6">
                  Join our growing family of satisfied customers
                </p>
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-sm opacity-75 mt-2">5.0 average rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-2 mb-4">Ready to Start Your Project?</h2>
            <p className="body-text text-muted-foreground mb-8">
              Let's discuss how we can help bring your vision to life with our expertise 
              in web development and digital solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/contact">Start Your Project</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/services">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
