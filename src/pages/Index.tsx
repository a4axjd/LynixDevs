
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code, Palette, Rocket, Users, Star, CheckCircle, Sparkles, Globe, Zap } from "lucide-react";

const Index = () => {
  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Custom websites and web applications built with cutting-edge technologies",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Beautiful and intuitive designs that enhance user experience and drive engagement",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Rocket,
      title: "Digital Marketing",
      description: "Strategic marketing solutions to grow your online presence and reach your audience",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const features = [
    "Modern responsive design",
    "Lightning-fast loading speeds",
    "SEO optimized",
    "Mobile-first approach",
    "Custom development",
    "24/7 ongoing support",
  ];

  const stats = [
    { number: "50+", label: "Happy Clients" },
    { number: "100+", label: "Projects Completed" },
    { number: "99%", label: "Client Satisfaction" },
    { number: "24/7", label: "Support Available" },
  ];

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <img 
                src="/lovable-uploads/041cb83a-ded4-4d58-bdcc-8ae8bf10f151.png" 
                alt="LynixDevs" 
                className="w-4 h-4 mr-2 object-contain"
              />
              Leading Digital Agency
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-lynix-purple to-primary bg-clip-text text-transparent animate-fade-in">
              LynixDevs Digital Agency
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              We specialize in creating exceptional digital experiences through innovative web development, 
              stunning UI/UX design, and strategic digital marketing solutions that drive real results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button asChild size="lg" className="group shadow-2xl hover:shadow-primary/25">
                <Link to="/portfolio">
                  <Globe className="w-5 h-5 mr-2" />
                  View Our Work
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-xl">
                <Link to="/contact">
                  <Zap className="w-5 h-5 mr-2" />
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse"></div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 bg-gradient-to-r from-primary to-lynix-purple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Rocket className="w-4 h-4 mr-2" />
              Our Services
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Comprehensive Digital Solutions
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We offer a complete range of digital services designed to help your business thrive in the modern digital landscape
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 overflow-hidden">
                <div className={`h-1 bg-gradient-to-r ${service.gradient}`}></div>
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto mb-6 p-4 bg-gradient-to-r ${service.gradient} rounded-2xl w-fit shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                  <Button 
                    asChild 
                    variant="ghost" 
                    className="mt-6 group-hover:bg-primary/10 group-hover:text-primary"
                  >
                    <Link to="/services">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Why Choose Us
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Experience the LynixDevs Difference
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  We combine creativity with technical expertise to deliver solutions that 
                  drive measurable results for your business.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/50 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-lynix-purple flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              <Button asChild size="lg" className="shadow-xl">
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary via-lynix-purple to-primary rounded-3xl p-8 lg:p-12 text-white shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl lg:text-4xl font-bold mb-2">50+ Happy Clients</h3>
                    <p className="text-white/90 text-lg mb-6">
                      Join our growing family of satisfied customers who trust us with their digital presence
                    </p>
                  </div>
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-current text-yellow-300" />
                    ))}
                  </div>
                  <p className="text-white/75 text-sm">5.0 average rating based on 50+ reviews</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-secondary/30 to-primary/30 rounded-full blur-xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-lynix-purple to-primary p-12 lg:p-20 text-center text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative max-w-4xl mx-auto space-y-8">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 text-white text-sm font-medium backdrop-blur-sm">
                <img 
                  src="/lovable-uploads/041cb83a-ded4-4d58-bdcc-8ae8bf10f151.png" 
                  alt="LynixDevs" 
                  className="w-4 h-4 mr-2 object-contain"
                />
                Ready to Get Started?
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold">
                Let's Build Something Amazing Together
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Transform your digital presence with our expert team. Let's discuss how we can help 
                bring your vision to life and achieve your business goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" variant="secondary" className="shadow-2xl hover:shadow-white/25">
                  <Link to="/contact">
                    <Rocket className="w-5 h-5 mr-2" />
                    Start Your Project
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 shadow-xl">
                  <Link to="/services">
                    <Globe className="w-5 h-5 mr-2" />
                    Explore Services
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Background Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white/30 rounded-full"></div>
            <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
