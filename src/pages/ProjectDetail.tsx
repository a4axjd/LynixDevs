import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Loader2,
  User,
  Award,
  Folder,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  client: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  // Fetch the specific project by id from backend server
  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL || "http://localhost:3001"
        }/api/projects/${id}`
      );

      if (!response.ok) {
        throw new Error(`Error fetching project: ${response.statusText}`);
      }

      const data = await response.json();
      return data as Project;
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading project",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Helper function to get status badge variant
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

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  // SEO meta data
  const pageTitle = project
    ? `${project.title} | LynixDevs Portfolio`
    : "Project | LynixDevs Portfolio";
  const pageDescription =
    project?.description ||
    "Explore our latest project showcasing innovative web development and design solutions.";
  const pageImage = project?.image_url || "/placeholder.svg";
  const pageUrl = `${window.location.origin}/portfolio/${id}`;

  return (
    <div>
      {/* Dynamic SEO Meta Tags */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="LynixDevs" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        {project && (
          <meta
            property="article:published_time"
            content={project.created_at}
          />
        )}
        {project && (
          <meta property="article:modified_time" content={project.updated_at} />
        )}
        {project && project.client && (
          <meta name="author" content={project.client} />
        )}
      </Helmet>

      {isLoading ? (
        <div className="flex justify-center my-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : project ? (
        <>
          {/* Hero Section with Floating Lottie Decorations */}
          <section className="relative overflow-hidden">
            {project.image_url ? (
              <div className="h-[40vh] md:h-[60vh] w-full relative">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${project.image_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
                </div>
                {/* Top right floating animation */}
                <div className="absolute top-4 right-4 z-20 hidden md:block">
                  <DotLottieReact
                    src="/assets/hero-float.lottie"
                    autoplay
                    loop
                    style={{
                      width: 80,
                      height: 80,
                    }}
                  />
                </div>
                {/* Bottom left floating animation */}
                <div className="absolute bottom-4 left-4 z-20 hidden md:block">
                  <DotLottieReact
                    src="/assets/hero-float-2.lottie"
                    autoplay
                    loop
                    style={{
                      width: 60,
                      height: 60,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="h-[30vh] bg-lynix-dark relative">
                <div className="absolute top-4 right-4 z-20">
                  <DotLottieReact
                    src="/assets/hero-float.lottie"
                    autoplay
                    loop
                    style={{
                      width: 120,
                      height: 120,
                    }}
                  />
                </div>
                <div className="absolute bottom-4 left-4 z-20">
                  <DotLottieReact
                    src="/assets/hero-float-2.lottie"
                    autoplay
                    loop
                    style={{
                      width: 100,
                      height: 100,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="container-custom absolute inset-0 flex items-center">
              <div className="max-w-3xl text-white z-10">
                <h1 className="heading-1 mb-4 flex items-center gap-3">
                  <span>{project.title}</span>
                  {/* Title Sparkle Animation */}
                  <span className="hidden md:inline">
                    <DotLottieReact
                      src="/assets/title-sparkle.lottie"
                      autoplay
                      loop
                      style={{ width: 68, height: 68, marginBottom: -8 }}
                    />
                  </span>
                </h1>
                <div className="flex flex-wrap items-center gap-4">
                  {project.client && (
                    <div className="bg-white/10 text-white px-3 py-1 rounded-full flex items-center gap-2">
                      <User size={16} /> Client: {project.client}
                    </div>
                  )}
                  <Badge variant={getStatusVariant(project.status)}>
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Project Content + Side Info Card */}
          <section className="section-padding bg-gray-50">
            <div className="container-custom grid grid-cols-1 lg:grid-cols-7 gap-12 relative">
              {/* Main Content */}
              <div className="max-w-3xl mx-auto lg:mx-0 col-span-1 lg:col-span-5">
                <Button variant="ghost" asChild className="mb-8">
                  <Link to="/portfolio" className="flex items-center">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Portfolio
                  </Link>
                </Button>

                {project.description && (
                  <div className="text-xl text-gray-700 mb-8 font-medium border-l-4 border-lynix-purple pl-4">
                    {project.description}
                  </div>
                )}

                <div className="flex justify-between items-center text-gray-500 text-sm mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} /> Created:{" "}
                    {formatDate(project.created_at)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={16} /> Last Updated:{" "}
                    {formatDate(project.updated_at)}
                  </div>
                </div>

                {project.content ? (
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown>{project.content}</ReactMarkdown>
                  </div>
                ) : project.description ? (
                  <div className="prose prose-lg max-w-none">
                    <p>{project.description}</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>No detailed content available for this project.</p>
                  </div>
                )}
              </div>

              {/* Side Info Card */}
              <aside className="hidden lg:block col-span-2">
                <div className="sticky top-28">
                  <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-6 flex flex-col items-center gap-6">
                    {/* Lottie of folder/success/portfolio */}
                    <DotLottieReact
                      src="/assets/project-info.lottie"
                      autoplay
                      loop
                      style={{ width: 80, height: 80 }}
                    />
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                          <Folder size={16} /> Project ID
                        </span>
                        <span className="text-gray-500 text-xs">
                          {project.id}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                          <User size={16} /> Client
                        </span>
                        <span className="text-gray-500 text-xs">
                          {project.client || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                          <Sparkles size={16} /> Status
                        </span>
                        <span className="text-gray-500 text-xs capitalize">
                          {project.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                          <Calendar size={16} /> Started
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatDate(project.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
              {/* End Side Info Card */}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-lynix-dark text-white">
            <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                  <DotLottieReact
                    src="/assets/cta.lottie"
                    autoplay
                    loop
                    style={{ width: 36, height: 36 }}
                  />
                  Want a project like this?
                </h2>
                <p className="text-white/80 text-lg mb-4">
                  Let’s collaborate and turn your next big idea into reality!
                </p>
              </div>
              <Button
                asChild
                className="bg-white text-white hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg"
              >
                <Link to="/start-project">Start Your Project</Link>
              </Button>
            </div>
          </section>
        </>
      ) : (
        <div className="container-custom py-20">
          <div className="text-center">
            <h2 className="heading-2 mb-4">Project Not Found</h2>
            <p className="mb-8">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/portfolio">Return to Portfolio</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
