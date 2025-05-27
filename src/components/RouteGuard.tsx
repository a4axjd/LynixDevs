
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface RouteGuardProps {
  children: ReactNode;
  adminRequired?: boolean;
}

const RouteGuard = ({ children, adminRequired = false }: RouteGuardProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  const { data: hasAdminRole, isLoading: roleLoading } = useQuery({
    queryKey: ["hasAdminRole", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      
      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }
      
      return data;
    },
    enabled: !!user?.id && adminRequired,
  });

  if (isLoading || (adminRequired && roleLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (adminRequired && !hasAdminRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
