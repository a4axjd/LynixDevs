
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}!
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="text-lg font-medium mb-2">Projects</h3>
          <p className="text-muted-foreground mb-4">View and manage your projects</p>
          <div className="text-3xl font-bold">0</div>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="text-lg font-medium mb-2">Notifications</h3>
          <p className="text-muted-foreground mb-4">Your recent notifications</p>
          <div className="text-3xl font-bold">0</div>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="text-lg font-medium mb-2">Documents</h3>
          <p className="text-muted-foreground mb-4">Access project documents</p>
          <div className="text-3xl font-bold">0</div>
        </div>
      </div>

      <p className="text-center text-muted-foreground mt-12">
        This is a placeholder dashboard. Full implementation coming soon.
      </p>
    </div>
  );
};

export default Dashboard;
