import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";

// Define project type based on Supabase schema
interface Project {
  id: string;
  title: string;
  description: string | null;
  client: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  image_url: string | null;
}

const Portfolio = () => {
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "active", name: "Active Projects" },
    { id: "completed", name: "Completed" },
    { id: "on-hold", name: "On Hold" },
  ];

  // Fetch projects from backend server
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["publicProjects"],
    queryFn: async () => {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL || "http://localhost:3001"
        }/api/projects/public`
      );

      if (!response.ok) {
        console.error("Error fetching projects:", response.statusText);
        return []; // Return empty array instead of throwing to allow graceful handling
      }

      const data = await response.json();
      return data as Project[];
    },
    retry: 1, // Only retry once to avoid excessive requests
  });

  // Only show toast for actual errors, not empty results
  if (error) {
    console.error("Portfolio query error:", error);
  }

  // Filter projects by selected category/status
  const filteredProjects = projects
    ? filter === "all"
      ? projects
      : projects.filter((project) => project.status === filter)
    : [];

  // Helper function to get project color based on status
  const getProjectColor = (status: string) => {
    switch (status) {
      case "active":
        return "from-blue-500 to-purple-500";
      case "completed":
        return "from-green-500 to-teal-500";
      case "on-hold":
        return "from-yellow-500 to-amber-500";
      case "cancelled":
        return "from-red-500 to-orange-500";
      default:
        return "from-indigo-500 to-violet-500";
    }
  };

  // Helper function to get badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "success";
      case "on-hold":
        return "warning";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div>
      {/* SEO Meta Tags */}
      <SEOHead
        title="Portfolio | LynixDevs - Our Latest Projects"
        description="Explore our portfolio of innovative web development and design projects. See how we've helped businesses achieve their digital goals."
        url={`${window.location.origin}/portfolio`}
      />

      {/* Hero Section */}
      <section className="bg-lynix-dark text-white py-20 md:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-1 mb-6">Our Portfolio</h1>
            <p className="body-text text-gray-300">
              Explore our latest work and see how we've helped businesses
              achieve their digital goals.
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
          {isLoading ? (
            <div className="flex justify-center my-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className="relative h-64 overflow-hidden"
                    style={{
                      backgroundImage: project.image_url
                        ? `url(${project.image_url})`
                        : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: project.image_url
                        ? "transparent"
                        : undefined,
                    }}
                  >
                    {!project.image_url && (
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${getProjectColor(
                          project.status
                        )}`}
                      ></div>
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        asChild
                        className="bg-white text-white hover:bg-gray-100"
                      >
                        <Link to={`/portfolio/${project.id}`}>
                          View Project
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-bold group-hover:text-lynix-purple transition-colors">
                        {project.title}
                      </h3>
                      <Badge variant={getStatusVariant(project.status)}>
                        {project.status.charAt(0).toUpperCase() +
                          project.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {project.client
                        ? `Client: ${project.client}`
                        : "Internal Project"}
                    </p>
                    {project.description && (
                      <p className="text-gray-500 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    <Link
                      to={`/portfolio/${project.id}`}
                      className="inline-flex items-center text-lynix-purple font-medium hover:underline"
                    >
                      Case Study <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No projects found matching your filter criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 mb-6">Have a Project in Mind?</h2>
            <p className="body-text text-gray-600 mb-8">
              Let's collaborate to bring your ideas to life with our expertise
              in design and development.
            </p>
            <Button
              asChild
              className="bg-lynix-purple hover:bg-lynix-secondary-purple text-white px-8"
            >
              <Link to="/start-project">Start a Project</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
