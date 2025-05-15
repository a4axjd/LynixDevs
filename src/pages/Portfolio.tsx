
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Portfolio = () => {
  const [filter, setFilter] = useState("all");

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "web", name: "Web Development" },
    { id: "mobile", name: "Mobile Apps" },
    { id: "design", name: "UI/UX Design" },
    { id: "ecommerce", name: "E-Commerce" },
  ];

  // Sample portfolio items
  const portfolioItems = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "ecommerce",
      image: "gradient-1",
      color: "from-blue-500 to-purple-500",
    },
    {
      id: 2,
      title: "Mobile Banking App",
      category: "mobile",
      image: "gradient-2",
      color: "from-green-500 to-teal-500",
    },
    {
      id: 3,
      title: "Real Estate Website",
      category: "web",
      image: "gradient-3",
      color: "from-red-500 to-orange-500",
    },
    {
      id: 4,
      title: "Travel Agency UI Design",
      category: "design",
      image: "gradient-4",
      color: "from-yellow-500 to-amber-500",
    },
    {
      id: 5,
      title: "Fitness Tracking App",
      category: "mobile",
      image: "gradient-5",
      color: "from-pink-500 to-rose-500",
    },
    {
      id: 6,
      title: "Restaurant Ordering System",
      category: "web",
      image: "gradient-6",
      color: "from-indigo-500 to-violet-500",
    },
  ];

  const filteredItems = filter === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-lynix-dark text-white py-20 md:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-1 mb-6">Our Portfolio</h1>
            <p className="body-text text-gray-300">
              Explore our latest work and see how we've helped businesses achieve their digital goals.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center mb-12 gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={filter === category.id ? "default" : "outline"}
                className={
                  filter === category.id 
                    ? "bg-lynix-purple hover:bg-lynix-secondary-purple" 
                    : "border-gray-300 hover:border-lynix-purple hover:text-lynix-purple"
                }
                onClick={() => setFilter(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`relative h-64 bg-gradient-to-br ${item.color} overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button asChild className="bg-white text-lynix-purple hover:bg-gray-100">
                      <Link to={`/portfolio/${item.id}`}>
                        View Project
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-lynix-purple transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {categories.find(cat => cat.id === item.category)?.name}
                  </p>
                  <Link 
                    to={`/portfolio/${item.id}`}
                    className="inline-flex items-center text-lynix-purple font-medium hover:underline"
                  >
                    Case Study <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 mb-6">Have a Project in Mind?</h2>
            <p className="body-text text-gray-600 mb-8">
              Let's collaborate to bring your ideas to life with our expertise in design and development.
            </p>
            <Button asChild className="bg-lynix-purple hover:bg-lynix-secondary-purple text-white px-8">
              <Link to="/contact">Start a Project</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
