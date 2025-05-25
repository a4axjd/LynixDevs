import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Clock, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
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
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

const UPDATE_TYPES = ["progress", "milestone", "issue", "completion"];

interface ClientProjectUpdatesProps {
  clientProjectId: string;
}

const ClientProjectUpdates = ({ clientProjectId }: ClientProjectUpdatesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      title: "",
      description: "",
      update_type: "progress",
      progress_percentage: undefined,
    },
  });

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin',
      });
      
      if (!error) {
        setIsAdmin(!!data);
      }
    };
    
    checkAdminStatus();
  }, [user?.id]);

  // Fetch project updates
  const { data: updates, isLoading, error, refetch } = useQuery({
    queryKey: ["projectUpdates", clientProjectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_updates")
        .select(`
          *
        `)
        .eq("client_project_id", clientProjectId)
        .eq("is_visible_to_client", true)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Error fetching project updates: ${error.message}`);
      }

      // Fetch creator profiles separately to avoid join issues
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
              creator_profile: profile
            };
          }
          return {
            ...update,
            creator_profile: null
          };
        })
      );

      return updatesWithProfiles as ProjectUpdate[];
    },
  });

  // Set up real-time subscription for updates
  useEffect(() => {
    const channel = supabase
      .channel('project-updates-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_updates',
          filter: `client_project_id=eq.${clientProjectId}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientProjectId, refetch]);

  const onSubmit = async (values: UpdateFormValues) => {
    try {
      const { error } = await supabase
        .from("project_updates")
        .insert({
          client_project_id: clientProjectId,
          title: values.title,
          description: values.description || null,
          update_type: values.update_type,
          progress_percentage: values.progress_percentage || null,
          is_visible_to_client: true,
          created_by: user?.id,
        });

      if (error) throw error;

      toast({
        title: "Update posted",
        description: "Your project update has been posted successfully.",
      });

      form.reset();
      setIsCreateDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to post update: ${(error as Error).message}`,
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
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getUpdateTypeVariant = (type: string) => {
    switch (type) {
      case "progress":
        return "default";
      case "milestone":
        return "success";
      case "issue":
        return "destructive";
      case "completion":
        return "success";
      default:
        return "secondary";
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading updates: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Project Updates</h3>
        {isAdmin && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Update
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Project Update</DialogTitle>
                <DialogDescription>
                  Create a new update for this project.
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
                          <select className="w-full p-2 border rounded-md" {...field}>
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
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Update description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Post Update</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getUpdateIcon(update.update_type)}
                    <CardTitle className="text-base">{update.title}</CardTitle>
                    <Badge variant={getUpdateTypeVariant(update.update_type)}>
                      {update.update_type}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(update.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
                {update.creator_profile?.full_name && (
                  <CardDescription>
                    By {update.creator_profile.full_name}
                  </CardDescription>
                )}
              </CardHeader>
              {update.description && (
                <CardContent>
                  <p className="text-sm">{update.description}</p>
                  {update.progress_percentage !== null && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">
                        Progress: {update.progress_percentage}%
                      </span>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="h-8 w-8 mx-auto mb-2" />
          <p>No updates yet</p>
        </div>
      )}
    </div>
  );
};

export default ClientProjectUpdates;
