import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Calendar, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import ClientProjectUpdates from "@/components/ClientProjectUpdates";
import ClientProjectFiles from "@/components/ClientProjectFiles";
import ClientProjectNavigation from "@/components/ClientProjectNavigation";

interface ClientProject {
  id: string;
  project_id: string;
  status: string;
  progress: number;
  start_date: string | null;
  estimated_completion: string | null;
  actual_completion: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  projects: {
    title: string;
    description: string | null;
    image_url: string | null;
  };
}

const ClientProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch the specific project
  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clientProject", id],
    queryFn: async () => {
      if (!user?.id || !id) return null;

      const { data, error } = await supabase
        .from("client_projects")
        .select(
          `
          *,
          projects:project_id (
            title,
            description,
            image_url
          )
        `
        )
        .eq("id", id)
        .eq("client_user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          throw new Error("Project not found or you don't have access to it");
        }
        throw new Error(`Error fetching project: ${error.message}`);
      }

      return data as ClientProject;
    },
    enabled: !!user?.id && !!id,
  });

  // Fetch all user projects for navigation
  const { data: allProjects } = useQuery({
    queryKey: ["myClientProjects", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("client_projects")
        .select(
          `
          id,
          projects:project_id (
            title
          )
        `
        )
        .eq("client_user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects for navigation:", error);
        return [];
      }

      return data.map((p) => ({
        id: p.id,
        title: p.projects?.title || "Untitled Project",
      }));
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading project",
        description: (error as Error).message,
        variant: "destructive",
      });
      // Redirect back to dashboard if project not found
      if ((error as Error).message.includes("not found")) {
        navigate("/client-projects");
      }
    }
  }, [error, toast, navigate]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in_progress":
        return "default";
      case "on_hold":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <ClientProjectNavigation />
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-8">
        <ClientProjectNavigation />
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground">
            The project you're looking for doesn't exist or you don't have
            access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <ClientProjectNavigation
        projectTitle={project.projects?.title}
        projectId={project.id}
        allProjects={allProjects || []}
      />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">
                {project.projects?.title}
              </CardTitle>
              <CardDescription className="mt-2">
                {project.projects?.description}
              </CardDescription>
            </div>
            <Badge variant={getStatusBadgeVariant(project.status)}>
              {project.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <div>
              <h4 className="font-medium mb-2">Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion</span>
                  <span className="font-medium">{project.progress || 0}%</span>
                </div>
                <Progress value={project.progress || 0} />
              </div>
            </div>
            <div className="space-y-4">
              {project.start_date && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    Started:{" "}
                    {format(new Date(project.start_date), "MMM d, yyyy")}
                  </span>
                </div>
              )}
              {project.estimated_completion && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    Due:{" "}
                    {format(
                      new Date(project.estimated_completion),
                      "MMM d, yyyy"
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {project.notes && (
            <div className="mb-6">
              <h4 className="font-medium mb-2">Notes</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {project.notes}
              </p>
            </div>
          )}

          <Tabs defaultValue="updates" className="w-full">
            <TabsList>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
            <TabsContent value="updates">
              <ClientProjectUpdates clientProjectId={project.id} />
            </TabsContent>
            <TabsContent value="files">
              <ClientProjectFiles clientProjectId={project.id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientProjectDetail;
