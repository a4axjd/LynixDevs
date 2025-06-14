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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MarkdownRenderer from "../MarkdownRenderer";

interface ProjectUpdate {
  id: string;
  client_project_id: string;
  title: string;
  description: string | null;
  update_type: string;
  progress_percentage: number | null;
  is_visible_to_client: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  creator_profile?: {
    full_name: string | null;
  } | null;
}

const updateFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  update_type: z.string().min(1, "Update type is required"),
  progress_percentage: z.number().min(0).max(100).optional(),
  is_visible_to_client: z.boolean(),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

const UPDATE_TYPES = ["progress", "milestone", "issue", "completion"];

interface AdminProjectUpdatesProps {
  clientProjectId: string;
}

const AdminProjectUpdates = ({ clientProjectId }: AdminProjectUpdatesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<ProjectUpdate | null>(
    null
  );

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      title: "",
      description: "",
      update_type: "progress",
      progress_percentage: undefined,
      is_visible_to_client: true,
    },
  });

  // Fetch project updates (all updates for admin view)
  const {
    data: updates,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminProjectUpdates", clientProjectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_updates")
        .select(
          `
          *
        `
        )
        .eq("client_project_id", clientProjectId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Error fetching project updates: ${error.message}`);
      }

      // Fetch creator profiles separately
      const updatesWithProfiles = await Promise.all(
        (data || []).map(async (update) => {
          if (update.created_by) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", update.created_by)
              .single();

            return {
              ...update,
              creator_profile: profile,
            };
          }
          return {
            ...update,
            creator_profile: null,
          };
        })
      );

      return updatesWithProfiles as ProjectUpdate[];
    },
  });

  const resetForm = () => {
    form.reset({
      title: "",
      description: "",
      update_type: "progress",
      progress_percentage: undefined,
      is_visible_to_client: true,
    });
    setSelectedUpdate(null);
  };

  const handleCreateUpdate = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleEditUpdate = (update: ProjectUpdate) => {
    form.reset({
      title: update.title,
      description: update.description || "",
      update_type: update.update_type,
      progress_percentage: update.progress_percentage || undefined,
      is_visible_to_client: update.is_visible_to_client,
    });
    setSelectedUpdate(update);
    setIsEditDialogOpen(true);
  };

  const onSubmit = async (values: UpdateFormValues) => {
    try {
      if (selectedUpdate) {
        // Update existing
        const { error } = await supabase
          .from("project_updates")
          .update({
            title: values.title,
            description: values.description || null,
            update_type: values.update_type,
            progress_percentage: values.progress_percentage || null,
            is_visible_to_client: values.is_visible_to_client,
          })
          .eq("id", selectedUpdate.id);

        if (error) throw error;

        toast({
          title: "Update modified",
          description: "The project update has been successfully modified.",
        });
        setIsEditDialogOpen(false);
      } else {
        // Create new
        const { error } = await supabase.from("project_updates").insert({
          client_project_id: clientProjectId,
          title: values.title,
          description: values.description || null,
          update_type: values.update_type,
          progress_percentage: values.progress_percentage || null,
          is_visible_to_client: values.is_visible_to_client,
          created_by: user?.id,
        });

        if (error) throw error;

        toast({
          title: "Update posted",
          description: "The project update has been posted successfully.",
        });
        setIsCreateDialogOpen(false);
      }

      resetForm();
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${selectedUpdate ? "update" : "post"} update: ${
          (error as Error).message
        }`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUpdate = async (updateId: string) => {
    try {
      const { error } = await supabase
        .from("project_updates")
        .delete()
        .eq("id", updateId);

      if (error) throw error;

      toast({
        title: "Update deleted",
        description: "The project update has been deleted successfully.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete update: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "progress":
        return <TrendingUp className="h-4 w-4" />;
      case "milestone":
        return <CheckCircle className="h-4 w-4" />;
      case "issue":
        return <AlertCircle className="h-4 w-4" />;
      case "completion":
        return <Sparkles className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getUpdateTypeVariant = (type: string) => {
    switch (type) {
      case "progress":
        return "default";
      case "milestone":
        return "secondary";
      case "issue":
        return "destructive";
      case "completion":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
        <p className="text-muted-foreground">
          Failed to load updates: {(error as Error).message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Project Updates</h3>
          <p className="text-sm text-muted-foreground">
            Manage updates for this client project
          </p>
        </div>
        <Button onClick={handleCreateUpdate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Update
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : updates && updates.length > 0 ? (
        <div className="space-y-4">
          {updates.map((update) => (
            <Card key={update.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {getUpdateIcon(update.update_type)}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {update.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant={getUpdateTypeVariant(update.update_type)}
                        >
                          {update.update_type}
                        </Badge>
                        <Badge
                          variant={
                            update.is_visible_to_client
                              ? "default"
                              : "secondary"
                          }
                        >
                          {update.is_visible_to_client
                            ? "Visible to Client"
                            : "Internal Only"}
                        </Badge>
                      </div>
                      {update.creator_profile?.full_name && (
                        <CardDescription className="text-xs mt-1">
                          By {update.creator_profile.full_name} •{" "}
                          {format(
                            new Date(update.created_at),
                            "MMM d, yyyy 'at' h:mm a"
                          )}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUpdate(update)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUpdate(update.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {(update.description || update.progress_percentage !== null) && (
                <CardContent className="pt-0">
                  {update.description && (
                    <div className="mb-4">
                      <MarkdownRenderer
                        content={update.description}
                        className="prose-sm"
                      />
                    </div>
                  )}
                  {update.progress_percentage !== null && (
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${update.progress_percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {update.progress_percentage}%
                      </span>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No updates have been posted yet.
          </p>
        </div>
      )}

      {/* Create Update Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Project Update</DialogTitle>
            <DialogDescription>
              Create a new update for this client project. You can use Markdown
              formatting in the description.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Update title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="update_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded-md"
                        {...field}
                      >
                        {UPDATE_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="progress_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progress (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Progress percentage"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_visible_to_client"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="visible-to-client"
                        checked={field.value}
                        onChange={field.onChange}
                        className="rounded"
                      />
                      <FormLabel
                        htmlFor="visible-to-client"
                        className="text-sm font-normal"
                      >
                        Visible to client
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Markdown supported)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Update description (you can use Markdown formatting)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Post Update</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Update Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Project Update</DialogTitle>
            <DialogDescription>
              Modify the project update. You can use Markdown formatting in the
              description.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Update title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="update_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded-md"
                        {...field}
                      >
                        {UPDATE_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="progress_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progress (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Progress percentage"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_visible_to_client"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="edit-visible-to-client"
                        checked={field.value}
                        onChange={field.onChange}
                        className="rounded"
                      />
                      <FormLabel
                        htmlFor="edit-visible-to-client"
                        className="text-sm font-normal"
                      >
                        Visible to client
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Markdown supported)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Update description (you can use Markdown formatting)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjectUpdates;
