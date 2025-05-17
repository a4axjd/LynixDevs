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
import { Loader2, Edit, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploadField from "@/components/admin/ImageUploadField";
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

// Define the Project type based on the Supabase schema
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

// Form schema for project validation
const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  content: z.string().optional(),
  client: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  image_url: z.string().nullable(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

// Available project statuses
const PROJECT_STATUSES = ["active", "completed", "on-hold", "cancelled"];

const ProjectsAdmin = () => {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      client: "",
      status: "active",
      image_url: null,
    },
  });

  // Watch content for auto-generation of description
  const watchContent = form.watch("content");

  // Auto-generate description from content
  useEffect(() => {
    if (watchContent && (!form.getValues("description") || form.getValues("description") === "")) {
      const plainText = watchContent.replace(/#+\s/g, "").replace(/\*\*/g, "");
      const description = plainText.substring(0, 150) + (plainText.length > 150 ? "..." : "");
      form.setValue("description", description);
    }
  }, [watchContent, form]);

  // Fetch projects
  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Error fetching projects: ${error.message}`);
      }

      return data as Project[];
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading projects",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Reset the form when opening create new project
  const handleCreateProject = () => {
    form.reset({
      title: "",
      description: "",
      content: "",
      client: "",
      status: "active",
      image_url: null,
    });
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  // Set form values when editing an existing project
  const handleEditProject = (project: Project) => {
    form.reset({
      title: project.title,
      description: project.description || "",
      content: project.content || "",
      client: project.client || "",
      status: project.status,
      image_url: project.image_url,
    });
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  // Close form sheet
  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  // Submit form handler
  const onSubmit = async (values: ProjectFormValues) => {
    try {
      if (selectedProject) {
        // Update existing project
        const { data, error } = await supabase
          .from("projects")
          .update({
            title: values.title,
            description: values.description || null,
            content: values.content || null,
            client: values.client || null,
            status: values.status,
            image_url: values.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedProject.id)
          .select();

        if (error) throw error;

        toast({
          title: "Project updated",
          description: "The project was successfully updated.",
        });
      } else {
        // Create new project
        const { data, error } = await supabase
          .from("projects")
          .insert({
            title: values.title,
            description: values.description || null,
            content: values.content || null,
            client: values.client || null,
            status: values.status,
            image_url: values.image_url,
          })
          .select();

        if (error) throw error;

        toast({
          title: "Project created",
          description: "The project was successfully created.",
        });
      }

      // Close form and refetch data
      setIsFormOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${selectedProject ? "update" : "create"} project: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  // Delete project handler
  const handleDeleteProject = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Project deleted",
        description: "The project was successfully deleted.",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete project: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
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
    <div className="container py-6">
      <AdminPageHeader
        title="Projects Management"
        description="Manage your client projects"
        actionLabel="Create Project"
        actionHref="#"
        actionButton={
          <Button onClick={handleCreateProject}>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
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
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      {project.image_url ? (
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <img 
                            src={project.image_url} 
                            alt={project.title}
                            className="object-cover w-full h-full" 
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-muted flex items-center justify-center rounded-md">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.client || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(project.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProject(project)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No projects found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Project form in a sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {selectedProject ? "Edit Project" : "Create Project"}
            </SheetTitle>
            <SheetDescription>
              {selectedProject
                ? "Update the details of your project"
                : "Add a new project to your portfolio"}
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Project title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <FormControl>
                        <Input placeholder="Client name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of the client (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Image</FormLabel>
                      <FormControl>
                        <ImageUploadField
                          bucketName="project_images"
                          value={field.value}
                          onChange={field.onChange}
                          label="Project Image"
                        />
                      </FormControl>
                      <FormDescription>
                        Upload a featured image for your project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Project content in markdown format"
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Write detailed project content using markdown
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief project description"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A short summary that appears in project listings (auto-generated from content if left blank)
                      </FormDescription>
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROJECT_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseForm}
                  >
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

export default ProjectsAdmin;
