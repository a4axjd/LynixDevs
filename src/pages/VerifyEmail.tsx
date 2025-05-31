
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Mail } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  useEffect(() => {
    const handleEmailVerification = async () => {
      if (!token || type !== "signup") {
        setError("Invalid verification link");
        setIsVerifying(false);
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "signup"
        });
        
        if (error) {
          setError(error.message);
        } else {
          setIsVerified(true);
          toast({
            title: "Email Verified Successfully!",
            description: "Your account has been activated. You can now sign in.",
          });
        }
      } catch (err) {
        console.error("Email verification error:", err);
        setError("An unexpected error occurred during verification");
      } finally {
        setIsVerifying(false);
      }
    };

    handleEmailVerification();
  }, [token, type, toast]);

  const handleContinue = () => {
    navigate("/auth");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-lynix-purple/10 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-background/95 backdrop-blur-sm p-8 shadow-2xl text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-primary to-lynix-purple rounded-2xl flex items-center justify-center">
            {isVerifying ? (
              <Mail className="h-8 w-8 text-white" />
            ) : isVerified ? (
              <CheckCircle className="h-8 w-8 text-white" />
            ) : (
              <AlertCircle className="h-8 w-8 text-white" />
            )}
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-lynix-purple bg-clip-text text-transparent">
            {isVerifying ? "Verifying Email..." : isVerified ? "Email Verified!" : "Verification Failed"}
          </h1>
        </div>

        {isVerifying && (
          <div className="space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </div>
        )}

        {!isVerifying && isVerified && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Your email has been successfully verified! You can now sign in to your account and access all features.
            </p>
            <Button 
              onClick={handleContinue}
              className="w-full btn-gradient text-white shadow-lg hover:shadow-xl"
            >
              Continue to Sign In
            </Button>
          </div>
        )}

        {!isVerifying && !isVerified && error && (
          <div className="space-y-4">
            <p className="text-destructive">
              {error}
            </p>
            <p className="text-sm text-muted-foreground">
              The verification link may have expired or been used already. Please try signing up again or contact support.
            </p>
            <Button 
              onClick={() => navigate("/auth")}
              variant="outline"
              className="w-full"
            >
              Go to Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
