import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2, Edit, Trash2, Plus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ClientProject {
  id: string;
  project_id: string;
  client_user_id: string;
  status: string;
  progress: number;
  start_date: string | null;
  estimated_completion: string | null;
  actual_completion: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  project_info?: {
    title: string;
    description: string | null;
  } | null;
  client_profile?: {
    full_name: string | null;
  } | null;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
}

interface User {
  id: string;
  full_name: string | null;
}

const clientProjectFormSchema = z.object({
  project_id: z.string().min(1, "Project is required"),
  client_user_id: z.string().min(1, "Client is required"),
  status: z.string().min(1, "Status is required"),
  progress: z.number().min(0).max(100),
  start_date: z.string().optional(),
  estimated_completion: z.string().optional(),
  notes: z.string().optional(),
});

type ClientProjectFormValues = z.infer<typeof clientProjectFormSchema>;

const PROJECT_STATUSES = ["not_started", "in_progress", "completed", "on_hold", "cancelled"];

const ClientProjectsAdmin = () => {
  const { toast } = useToast();
  const [selectedClientProject, setSelectedClientProject] = useState<ClientProject | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<ClientProjectFormValues>({
    resolver: zodResolver(clientProjectFormSchema),
    defaultValues: {
      project_id: "",
      client_user_id: "",
      status: "not_started",
      progress: 0,
      start_date: "",
      estimated_completion: "",
      notes: "",
    },
  });

  // Fetch client projects with project and user details
  const { data: clientProjects, isLoading, error, refetch } = useQuery({
    queryKey: ["clientProjects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_projects")
        .select(`
          *
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Error fetching client projects: ${error.message}`);
      }

      // Fetch related data separately to avoid join issues
      const projectsWithDetails = await Promise.all(
        (data || []).map(async (clientProject) => {
          const [projectResult, profileResult] = await Promise.all([
            supabase
              .from("projects")
              .select("title, description")
              .eq("id", clientProject.project_id)
              .single(),
            supabase
              .from("profiles")
              .select("full_name")
              .eq("id", clientProject.client_user_id)
              .single()
          ]);

          return {
            ...clientProject,
            project_info: projectResult.data,
            client_profile: profileResult.data
          };
        })
      );

      return projectsWithDetails as ClientProject[];
    },
  });

  // Fetch available projects
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, description")
        .order("title");

      if (error) throw error;
      return data as Project[];
    },
  });

  // Fetch available users (clients)
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .order("full_name");

      if (error) throw error;
      return data as User[];
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading client projects",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleCreateClientProject = () => {
    form.reset({
      project_id: "",
      client_user_id: "",
      status: "not_started",
      progress: 0,
      start_date: "",
      estimated_completion: "",
      notes: "",
    });
    setSelectedClientProject(null);
    setIsFormOpen(true);
  };

  const handleEditClientProject = (clientProject: ClientProject) => {
    form.reset({
      project_id: clientProject.project_id,
      client_user_id: clientProject.client_user_id,
      status: clientProject.status,
      progress: clientProject.progress || 0,
      start_date: clientProject.start_date ? clientProject.start_date.split('T')[0] : "",
      estimated_completion: clientProject.estimated_completion ? clientProject.estimated_completion.split('T')[0] : "",
      notes: clientProject.notes || "",
    });
    setSelectedClientProject(clientProject);
    setIsFormOpen(true);
  };

  const onSubmit = async (values: ClientProjectFormValues) => {
    try {
      const submitData = {
        project_id: values.project_id,
        client_user_id: values.client_user_id,
        status: values.status,
        progress: values.progress,
        start_date: values.start_date ? new Date(values.start_date).toISOString() : null,
        estimated_completion: values.estimated_completion ? new Date(values.estimated_completion).toISOString() : null,
        notes: values.notes || null,
        updated_at: new Date().toISOString(),
      };

      if (selectedClientProject) {
        const { error } = await supabase
          .from("client_projects")
          .update(submitData)
          .eq("id", selectedClientProject.id);

        if (error) throw error;

        toast({
          title: "Client project updated",
          description: "The client project was successfully updated.",
        });
      } else {
        const { error } = await supabase
          .from("client_projects")
          .insert(submitData);

        if (error) throw error;

        toast({
          title: "Client project created",
          description: "The client project was successfully assigned.",
        });
      }

      setIsFormOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${selectedClientProject ? "update" : "create"} client project: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteClientProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("client_projects")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Client project deleted",
        description: "The client project was successfully deleted.",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete client project: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

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

  return (
    <div className="container py-6">
      <AdminPageHeader
        title="Client Projects"
        description="Assign and manage projects for clients"
        actionLabel="Assign Project"
        actionHref="#"
        actionButton={
          <Button onClick={handleCreateClientProject}>
            <Plus className="mr-2 h-4 w-4" />
            Assign Project
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Est. Completion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientProjects && clientProjects.length > 0 ? (
                clientProjects.map((clientProject) => (
                  <TableRow key={clientProject.id}>
                    <TableCell className="font-medium">
                      {clientProject.project_info?.title || "Unknown Project"}
                    </TableCell>
                    <TableCell>
                      {clientProject.client_profile?.full_name || "Unknown User"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(clientProject.status)}>
                        {clientProject.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{clientProject.progress || 0}%</TableCell>
                    <TableCell>
                      {clientProject.start_date ? format(new Date(clientProject.start_date), "MMM d, yyyy") : "-"}
                    </TableCell>
                    <TableCell>
                      {clientProject.estimated_completion ? format(new Date(clientProject.estimated_completion), "MMM d, yyyy") : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClientProject(clientProject)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClientProject(clientProject.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No client projects found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {selectedClientProject ? "Edit Client Project" : "Assign Project to Client"}
            </SheetTitle>
            <SheetDescription>
              {selectedClientProject
                ? "Update the client project details"
                : "Assign a project to a client and track progress"}
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="project_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a project" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects?.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="client_user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users?.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name || "Unnamed User"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROJECT_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.replace('_', ' ').toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="progress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Progress (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estimated_completion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Completion</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Additional notes or comments" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ClientProjectsAdmin;
