
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Key, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Supabase handles the token validation automatically
  useEffect(() => {
    // Check if we have a valid session for password reset
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setError("Invalid or expired reset link");
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        setError(error.message);
      } else {
        setIsReset(true);
        toast({
          title: "Password Reset Successfully!",
          description: "You can now sign in with your new password.",
        });
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate("/auth");
  };

  if (isReset) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-lynix-purple/10 p-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-background/95 backdrop-blur-sm p-8 shadow-2xl text-center">
          <div className="mb-8">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-primary to-lynix-purple rounded-2xl flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-lynix-purple bg-clip-text text-transparent">
              Password Reset!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your password has been successfully updated
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground">
              Your password has been successfully reset! You can now sign in to your account with your new password.
            </p>
            <Button 
              onClick={handleContinue}
              className="w-full btn-gradient text-white shadow-lg hover:shadow-xl"
            >
              Continue to Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-lynix-purple/10 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-background/95 backdrop-blur-sm p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-primary to-lynix-purple rounded-2xl flex items-center justify-center">
            <Key className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-lynix-purple bg-clip-text text-transparent">
            Reset Your Password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="newPassword">New Password *</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Password must be at least 8 characters long
            </p>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password *</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full btn-gradient text-white shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                <span className="ml-2">Resetting Password...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button
            type="button"
            onClick={() => navigate("/auth")}
            className="font-medium text-primary hover:underline"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
