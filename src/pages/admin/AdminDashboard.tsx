
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, FileText, Mail, Send, MessageSquare } from "lucide-react";

interface AdminCounts {
  users: number;
  projects: number;
  blog_posts: number;
  email_templates: number;
  newsletters: number;
  contact_submissions: number;
}

const AdminDashboard = () => {
  const { data: counts, isLoading } = useQuery({
    queryKey: ["adminCounts"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_admin_counts");
      if (error) throw new Error(error.message);
      return data as unknown as AdminCounts;
    },
  });

  const stats = [
    {
      title: "Total Users",
      value: counts?.users || 0,
      icon: Users,
      description: "Registered users",
    },
    {
      title: "Projects",
      value: counts?.projects || 0,
      icon: FolderKanban,
      description: "Active projects",
    },
    {
      title: "Blog Posts",
      value: counts?.blog_posts || 0,
      icon: FileText,
      description: "Published articles",
    },
    {
      title: "Email Templates",
      value: counts?.email_templates || 0,
      icon: Mail,
      description: "Available templates",
    },
    {
      title: "Newsletters",
      value: counts?.newsletters || 0,
      icon: Send,
      description: "Sent newsletters",
    },
    {
      title: "Contact Forms",
      value: counts?.contact_submissions || 0,
      icon: MessageSquare,
      description: "Form submissions",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your application statistics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
