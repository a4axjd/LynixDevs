
import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface RouteGuardProps {
  requiredRole?: "admin" | "user"; // Optional role requirement
}

const RouteGuard = ({ requiredRole }: RouteGuardProps) => {
  const { user, isLoading: authLoading } = useAuth();
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(!!requiredRole);
  const location = useLocation();
  const { toast } = useToast();

  // Check if user has the required role
  useEffect(() => {
    const checkRole = async () => {
      if (requiredRole && user) {
        try {
          if (requiredRole === "admin") {
            const { data, error } = await supabase.rpc("has_role", {
              _user_id: user.id,
              _role: "admin",
            });

            if (error) throw error;

            setHasRequiredRole(!!data);
          } else {
            // Default role is "user", all authenticated users have this role
            setHasRequiredRole(true);
          }
        } catch (error) {
          console.error("Error checking role:", error);
          setHasRequiredRole(false);
        } finally {
          setIsCheckingRole(false);
        }
      } else {
        setIsCheckingRole(false);
      }
    };

    checkRole();
  }, [user, requiredRole]);

  // If still loading auth or checking role, show a loading indicator
  if (authLoading || isCheckingRole) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
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

  // If user doesn't have the required role, redirect to appropriate page
  if (requiredRole && hasRequiredRole === false) {
    toast({
      title: "Access Denied",
      description: `You need ${requiredRole} privileges to access this page`,
      variant: "destructive",
    });
    
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // If authenticated and has required role (or no specific role required), render the child routes
  return <Outlet />;
};

export default RouteGuard;
