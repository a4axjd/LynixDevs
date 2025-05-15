
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }

        if (data.session) {
          toast({
            title: "Authentication Successful",
            description: "You are now signed in",
          });
          navigate("/");
        } else {
          navigate("/auth");
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        toast({
          title: "Authentication Error",
          description: "An unexpected error occurred during authentication",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
        <p className="mt-4 text-lg">Completing authentication...</p>
        <p className="mt-2 text-sm text-muted-foreground">Please wait while we log you in</p>
      </div>
    </div>
  );
};

export default AuthCallback;
