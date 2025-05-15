
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface RouteGuardProps {
  requiredRole?: "admin" | "user"; // Optional role requirement
}

const RouteGuard = ({ requiredRole }: RouteGuardProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // If still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!user) {
    toast({
      title: "Authentication Required",
      description: "Please sign in to access this page",
      variant: "destructive",
    });
    
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default RouteGuard;
