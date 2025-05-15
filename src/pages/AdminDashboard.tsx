
import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Welcome, Admin {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}!
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="text-lg font-medium mb-2">Users</h3>
          <p className="text-muted-foreground mb-4">Manage user accounts</p>
          <div className="text-3xl font-bold">0</div>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="text-lg font-medium mb-2">Projects</h3>
          <p className="text-muted-foreground mb-4">Manage client projects</p>
          <div className="text-3xl font-bold">0</div>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="text-lg font-medium mb-2">Blog Posts</h3>
          <p className="text-muted-foreground mb-4">Manage blog content</p>
          <div className="text-3xl font-bold">0</div>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="text-lg font-medium mb-2">Email Templates</h3>
          <p className="text-muted-foreground mb-4">Manage email templates</p>
          <div className="text-3xl font-bold">0</div>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="text-lg font-medium mb-2">Newsletter</h3>
          <p className="text-muted-foreground mb-4">Send newsletters</p>
          <div className="text-3xl font-bold">0</div>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="text-lg font-medium mb-2">Contact Form</h3>
          <p className="text-muted-foreground mb-4">View contact submissions</p>
          <div className="text-3xl font-bold">0</div>
        </div>
      </div>

      <p className="text-center text-muted-foreground mt-12">
        This is a placeholder admin dashboard. Full implementation coming soon.
      </p>
    </div>
  );
};

export default AdminDashboard;
