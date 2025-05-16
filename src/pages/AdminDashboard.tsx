
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Loader2, Users, FolderKanban, FileText, Mail, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminCounts {
  users: number;
  projects: number;
  blog_posts: number;
  email_templates: number;
  newsletters: number;
  contact_submissions: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: counts, isLoading, error } = useQuery({
    queryKey: ['adminCounts'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_admin_counts");
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Add type assertion to resolve the type mismatch
      return data as AdminCounts;
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading dashboard data",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" asChild>
          <Link to="/admin/settings">Admin Settings</Link>
        </Button>
      </div>
      
      <p className="text-muted-foreground mb-8">
        Welcome, Admin {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}!
      </p>
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/admin/users" className="rounded-lg border bg-card p-6 shadow hover:bg-accent/5 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Users</h3>
              <div className="p-2 rounded-full bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-muted-foreground mb-4">Manage user accounts</p>
            <div className="text-3xl font-bold">{counts?.users || 0}</div>
          </Link>
          
          <Link to="/admin/projects" className="rounded-lg border bg-card p-6 shadow hover:bg-accent/5 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <div className="p-2 rounded-full bg-primary/10">
                <FolderKanban className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-muted-foreground mb-4">Manage client projects</p>
            <div className="text-3xl font-bold">{counts?.projects || 0}</div>
          </Link>
          
          <Link to="/admin/blog" className="rounded-lg border bg-card p-6 shadow hover:bg-accent/5 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Blog Posts</h3>
              <div className="p-2 rounded-full bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-muted-foreground mb-4">Manage blog content</p>
            <div className="text-3xl font-bold">{counts?.blog_posts || 0}</div>
          </Link>
          
          <Link to="/admin/email-templates" className="rounded-lg border bg-card p-6 shadow hover:bg-accent/5 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Email Templates</h3>
              <div className="p-2 rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-muted-foreground mb-4">Manage email templates</p>
            <div className="text-3xl font-bold">{counts?.email_templates || 0}</div>
          </Link>
          
          <Link to="/admin/newsletter" className="rounded-lg border bg-card p-6 shadow hover:bg-accent/5 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Newsletter</h3>
              <div className="p-2 rounded-full bg-primary/10">
                <Send className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-muted-foreground mb-4">Send newsletters</p>
            <div className="text-3xl font-bold">{counts?.newsletters || 0}</div>
          </Link>
          
          <Link to="/admin/contact" className="rounded-lg border bg-card p-6 shadow hover:bg-accent/5 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Contact Form</h3>
              <div className="p-2 rounded-full bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-muted-foreground mb-4">View contact submissions</p>
            <div className="text-3xl font-bold">{counts?.contact_submissions || 0}</div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
