
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  // Fetch the specific project by id
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Error fetching project: ${error.message}`);
      }

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

  return (
    <div className="pt-20">
      {isLoading ? (
        <div className="flex justify-center my-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : project ? (
        <>
          {/* Hero Section */}
          <section className="relative">
            {project.image_url ? (
              <div className="h-[40vh] md:h-[60vh] w-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${project.image_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center' 
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
                </div>
              </div>
            ) : (
              <div className="h-[30vh] bg-lynix-dark"></div>
            )}

            <div className="container-custom absolute inset-0 flex items-center">
              <div className="max-w-3xl text-white z-10">
                <h1 className="heading-1 mb-4">{project.title}</h1>
                <div className="flex flex-wrap items-center gap-4">
                  {project.client && (
                    <div className="bg-white/10 text-white px-3 py-1 rounded-full">
                      Client: {project.client}
                    </div>
                  )}
                  <Badge variant={getStatusVariant(project.status)}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Project Content */}
          <section className="section-padding">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto">
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
                  <div>Created: {formatDate(project.created_at)}</div>
                  <div>Last Updated: {formatDate(project.updated_at)}</div>
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
            </div>
          </section>
        </>
      ) : (
        <div className="container-custom py-20">
          <div className="text-center">
            <h2 className="heading-2 mb-4">Project Not Found</h2>
            <p className="mb-8">The project you're looking for doesn't exist or has been removed.</p>
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
