import { useState, useEffect } from "react";
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
import { Loader2, FileText, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import ClientProjectUpdates from "@/components/ClientProjectUpdates";
import ClientProjectFiles from "@/components/ClientProjectFiles";
import ClientProjectNavigation from "@/components/ClientProjectNavigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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

const ClientProjectDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(
    null
  );

  // Fetch user's assigned projects
  const {
    data: clientProjects,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["myClientProjects", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

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
        .eq("client_user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Error fetching client projects: ${error.message}`);
      }

      return data as ClientProject[];
    },
    enabled: !!user?.id,
  });

  // Set up real-time subscription for project updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("client-project-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "client_projects",
          filter: `client_user_id=eq.${user.id}`,
        },
        () => {
          refetch();
          toast({
            title: "Project Updated",
            description: "Your project status has been updated.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refetch, toast]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading projects",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (clientProjects && clientProjects.length > 0 && !selectedProject) {
      setSelectedProject(clientProjects[0]);
    }
  }, [clientProjects, selectedProject]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in_progress":
        return "text-blue-600";
      case "on_hold":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Create array for navigation dropdown
  const allProjects =
    clientProjects?.map((project) => ({
      id: project.id,
      title: project.projects?.title || "Untitled Project",
    })) || [];

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center my-12 gap-6">
          <DotLottieReact
            src="/assets/project-info.lottie"
            autoplay
            loop
            style={{ width: 90, height: 90 }}
          />
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!clientProjects || clientProjects.length === 0) {
    return (
      <div className="container py-8">
        <ClientProjectNavigation />
        <div className="text-center py-12 flex flex-col items-center">
          <DotLottieReact
            src="/assets/project-info.lottie"
            autoplay
            loop
            style={{ width: 120, height: 120, marginBottom: 24 }}
          />
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Projects Assigned</h2>
          <p className="text-muted-foreground">
            You don't have any projects assigned yet. Contact your administrator
            for more information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <ClientProjectNavigation
        projectTitle={selectedProject?.projects?.title}
        projectId={selectedProject?.id}
        allProjects={allProjects}
      />

      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-lynix-purple drop-shadow-[0_2px_12px_rgba(139,92,246,0.20)]">
            My Projects
          </h1>
          <p className="text-muted-foreground">
            Track the progress of your assigned projects
          </p>
        </div>
        <div className="hidden md:block">
          <DotLottieReact
            src="/assets/hr.lottie"
            autoplay
            loop
            style={{ width: 80, height: 80 }}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {clientProjects.map((project) => (
          <Card
            key={project.id}
            className={`cursor-pointer transition-shadow hover:shadow-lg ${
              selectedProject?.id === project.id
                ? "ring-2 ring-lynix-purple"
                : ""
            }`}
            onClick={() => setSelectedProject(project)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DotLottieReact
                    src="/assets/project-info.lottie"
                    autoplay
                    loop
                    style={{
                      width: 32,
                      height: 32,
                      marginRight: 8,
                      minWidth: 32,
                    }}
                  />
                  {project.projects?.title}
                </CardTitle>
              </div>
              <Badge variant={getStatusBadgeVariant(project.status)}>
                {project.status.replace("_", " ").toUpperCase()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{project.progress || 0}%</span>
                </div>
                <Progress value={project.progress || 0} className="h-2" />
                {project.estimated_completion && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    Due{" "}
                    {format(
                      new Date(project.estimated_completion),
                      "MMM d, yyyy"
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProject && (
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <DotLottieReact
                    src="/assets/project-info.lottie"
                    autoplay
                    loop
                    style={{
                      width: 36,
                      height: 36,
                      minWidth: 36,
                    }}
                  />
                  {selectedProject.projects?.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  {selectedProject.projects?.description}
                </CardDescription>
              </div>
              <Badge variant={getStatusBadgeVariant(selectedProject.status)}>
                {selectedProject.status.replace("_", " ").toUpperCase()}
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
                    <span className="font-medium">
                      {selectedProject.progress || 0}%
                    </span>
                  </div>
                  <Progress value={selectedProject.progress || 0} />
                </div>
              </div>
              <div className="space-y-4">
                {selectedProject.start_date && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Started:{" "}
                      {format(
                        new Date(selectedProject.start_date),
                        "MMM d, yyyy"
                      )}
                    </span>
                  </div>
                )}
                {selectedProject.estimated_completion && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Due:{" "}
                      {format(
                        new Date(selectedProject.estimated_completion),
                        "MMM d, yyyy"
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {selectedProject.notes && (
              <div className="mb-6">
                <h4 className="font-medium mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {selectedProject.notes}
                </p>
              </div>
            )}

            <Tabs defaultValue="updates" className="w-full">
              <TabsList>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
              <TabsContent value="updates">
                <ClientProjectUpdates clientProjectId={selectedProject.id} />
              </TabsContent>
              <TabsContent value="files">
                <ClientProjectFiles clientProjectId={selectedProject.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientProjectDashboard;
