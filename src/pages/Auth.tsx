import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isResetPassword) {
        const { error, success } = await resetPassword(email);

        if (success) {
          toast({
            title: "Password Reset Email Sent",
            description: "Check your email for password reset instructions",
          });
          setIsResetPassword(false);
        } else {
          setError(error || "Failed to send reset email");
        }
      } else if (isSignUp) {
        const fullName = `${firstName} ${lastName}`.trim();
        const { error, success } = await signUp(email, password, fullName, {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          company: company,
        });

        if (success) {
          toast({
            title: "Account Created Successfully!",
            description: "Please check your email to verify your account",
          });
        } else {
          setError(error || "Failed to create account");
        }
      } else {
        const { error, success } = await signIn(email, password);

        if (success) {
          toast({
            title: "Welcome Back!",
            description: "You have successfully signed in",
          });
          navigate(from, { replace: true });
        } else {
          setError(error || "Invalid credentials");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Google sign in error:", err);
      setError("Failed to sign in with Google");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-lynix-purple/10 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-background/95 backdrop-blur-sm p-8 shadow-2xl">
        <div className="mb-8 text-center flex flex-col items-center">
          {/* Lottie animation replaces 'L' card */}
          <div className="w-20 h-20 mb-3 flex items-center justify-center">
            <DotLottieReact
              src="/assets/auth.lottie"
              autoplay
              loop
              style={{
                width: "80px",
                height: "80px",
                margin: "auto",
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-lynix-purple drop-shadow-[0_2px_12px_rgba(139,92,246,0.20)]">
            {isResetPassword
              ? "Reset Password"
              : isSignUp
              ? "Join LynixDevs"
              : "Welcome Back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isResetPassword
              ? "Enter your email to receive reset instructions"
              : isSignUp
              ? "Create your account and start building amazing projects"
              : "Sign in to access your dashboard and projects"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isResetPassword && isSignUp && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required={isSignUp}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required={isSignUp}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {!isResetPassword && isSignUp && (
            <>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  id="company"
                  placeholder="Your Company Name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-1"
                />
              </div>
            </>
          )}

          {!isResetPassword && (
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password *</Label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetPassword(true);
                      setIsSignUp(false);
                    }}
                    className="text-xs text-lynix-purple hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isResetPassword}
                className="mt-1"
              />
              {isSignUp && (
                <p className="text-xs text-muted-foreground mt-1">
                  Password must be at least 8 characters long
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-lynix-purple text-white shadow-lg hover:shadow-xl drop-shadow-[0_2px_12px_rgba(139,92,246,0.20)]"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                <span className="ml-2">
                  {isResetPassword
                    ? "Sending..."
                    : isSignUp
                    ? "Creating Account..."
                    : "Signing In..."}
                </span>
              </>
            ) : isResetPassword ? (
              "Send Reset Instructions"
            ) : isSignUp ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {!isResetPassword && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="flex w-full items-center gap-3 hover:bg-primary/5"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>

            <div className="mt-6 text-center text-sm">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setIsResetPassword(false);
                    }}
                    className="font-medium text-lynix-purple hover:underline"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setIsResetPassword(false);
                    }}
                    className="font-medium text-lynix-purple hover:underline"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {isResetPassword && (
          <div className="mt-6 text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setIsResetPassword(false);
              }}
              className="font-medium text-lynix-purple hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
