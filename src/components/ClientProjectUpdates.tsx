
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
import { Loader2, Plus, Clock, TrendingUp, AlertCircle, CheckCircle, Sparkles } from "lucide-react";
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
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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

  const getUpdateTypeColor = (type: string) => {
    switch (type) {
      case "progress":
        return "from-blue-500 to-cyan-500";
      case "milestone":
        return "from-green-500 to-emerald-500";
      case "issue":
        return "from-red-500 to-rose-500";
      case "completion":
        return "from-purple-500 to-pink-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  if (error) {
    return (
      <div className="text-center py-12 px-4">
        <div className="max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load updates</h3>
          <p className="text-muted-foreground mb-4">
            {(error as Error).message}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border">
        <div>
          <h3 className="text-xl font-bold text-foreground">Project Updates</h3>
          <p className="text-muted-foreground mt-1">Stay informed about your project progress</p>
        </div>
        {isAdmin && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Update
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Add Project Update</DialogTitle>
                <DialogDescription>
                  Create a new update to keep your client informed about the project progress.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Update title" {...field} className="h-11" />
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
                          <select className="w-full p-3 border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary" {...field}>
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
                            className="h-11"
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
                          <Textarea placeholder="Update description" className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-primary to-primary/80">
                      Post Update
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading updates...</p>
        </div>
      ) : updates && updates.length > 0 ? (
        <div className="space-y-4">
          {updates.map((update) => (
            <Card key={update.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className={`h-1 bg-gradient-to-r ${getUpdateTypeColor(update.update_type)}`} />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getUpdateTypeColor(update.update_type)} bg-opacity-10`}>
                      {getUpdateIcon(update.update_type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <CardTitle className="text-lg">{update.title}</CardTitle>
                        <Badge variant={getUpdateTypeVariant(update.update_type)} className="text-xs">
                          {update.update_type}
                        </Badge>
                      </div>
                      {update.creator_profile?.full_name && (
                        <CardDescription className="text-sm">
                          By {update.creator_profile.full_name}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground text-right">
                    <div>{format(new Date(update.created_at), "MMM d, yyyy")}</div>
                    <div className="text-xs">{format(new Date(update.created_at), "h:mm a")}</div>
                  </div>
                </div>
              </CardHeader>
              {(update.description || update.progress_percentage !== null) && (
                <CardContent className="pt-0">
                  {update.description && (
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {update.description}
                    </p>
                  )}
                  {update.progress_percentage !== null && (
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${getUpdateTypeColor(update.update_type)} transition-all duration-300`}
                          style={{ width: `${update.progress_percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
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
        <div className="text-center py-16 px-4">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No updates yet</h3>
            <p className="text-muted-foreground">
              Updates will appear here as your project progresses
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProjectUpdates;
