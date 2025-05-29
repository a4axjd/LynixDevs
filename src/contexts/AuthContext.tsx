
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: string | null;
    success: boolean;
  }>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, fullName?: string, additionalData?: any) => Promise<{
    error: string | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: string | null;
    success: boolean;
  }>;
  verifyEmail: (token: string) => Promise<{
    error: string | null;
    success: boolean;
  }>;
  updatePassword: (token: string, newPassword: string) => Promise<{
    error: string | null;
    success: boolean;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message, success: false };
      }

      return { error: null, success: true };
    } catch (error) {
      console.error("Sign in error:", error);
      return { 
        error: "An unexpected error occurred during sign in", 
        success: false 
      };
    }
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/auth/callback",
      },
    });
  };

  const signUp = async (email: string, password: string, fullName?: string, additionalData?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            ...additionalData,
          },
          emailRedirectTo: undefined, // Disable Supabase's email confirmation
        },
      });

      if (error) {
        return { error: error.message, success: false };
      }

      // Send custom verification email
      if (data.user && !data.user.email_confirmed_at) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/send-verification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              userId: data.user.id,
            }),
          });

          if (!response.ok) {
            console.error('Failed to send verification email');
          }
        } catch (verificationError) {
          console.error('Error sending verification email:', verificationError);
        }
      }

      return { error: null, success: true };
    } catch (error) {
      console.error("Sign up error:", error);
      return { 
        error: "An unexpected error occurred during sign up", 
        success: false 
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/send-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.error || 'Failed to send reset email', success: false };
      }

      return { error: null, success: true };
    } catch (error) {
      console.error("Reset password error:", error);
      return { 
        error: "An unexpected error occurred during password reset", 
        success: false 
      };
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.error || 'Failed to verify email', success: false };
      }

      // Refresh the session to get updated user data
      await supabase.auth.refreshSession();

      return { error: null, success: true };
    } catch (error) {
      console.error("Verify email error:", error);
      return { 
        error: "An unexpected error occurred during email verification", 
        success: false 
      };
    }
  };

  const updatePassword = async (token: string, newPassword: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.error || 'Failed to reset password', success: false };
      }

      return { error: null, success: true };
    } catch (error) {
      console.error("Update password error:", error);
      return { 
        error: "An unexpected error occurred during password update", 
        success: false 
      };
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    verifyEmail,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
