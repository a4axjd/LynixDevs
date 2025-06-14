import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster as Sonner } from "sonner";
import { validateEnvironment } from "@/lib/config";
import { logger } from "@/lib/logger";
import ErrorBoundary from "@/components/ErrorBoundary";

import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import RouteGuard from "@/components/RouteGuard";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Portfolio from "@/pages/Portfolio";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Contact from "@/pages/Contact";
import Auth from "@/pages/Auth";
import AuthCallback from "@/pages/AuthCallback";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import ProjectDetail from "@/pages/ProjectDetail";
import ClientProjectDashboard from "@/pages/ClientProjectDashboard";
import ClientProjectDetail from "@/pages/ClientProjectDetail";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import UsersAdmin from "@/pages/admin/UsersAdmin";
import ProjectsAdmin from "@/pages/admin/ProjectsAdmin";
import ClientProjectsAdmin from "@/pages/admin/ClientProjectsAdmin";
import BlogAdmin from "@/pages/admin/BlogAdmin";
import EmailTemplatesAdmin from "@/pages/admin/EmailTemplatesAdmin";
import NewsletterAdmin from "@/pages/admin/NewsletterAdmin";
import ContactAdmin from "@/pages/admin/ContactAdmin";
import NotFound from "@/pages/NotFound";
import EmailSettingsAdmin from "@/pages/admin/EmailSettingsAdmin";
import SettingsAdmin from "@/pages/admin/SettingsAdmin";
import EmailAutomationAdmin from "@/pages/admin/EmailAutomationAdmin";

// Validate environment on app start
try {
  validateEnvironment();
  logger.info("Application starting", {
    environment: import.meta.env.MODE,
    version: import.meta.env.VITE_APP_VERSION || "unknown",
  });
} catch (error) {
  logger.error("Environment validation failed", {}, error as Error);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false, // Don't retry mutations by default
      onError: (error: any) => {
        logger.error("Mutation error", { error: error.message });
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <ErrorBoundary>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="services" element={<Services />} />
                    <Route path="portfolio" element={<Portfolio />} />
                    <Route path="portfolio/:id" element={<ProjectDetail />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog/:slug" element={<BlogDetail />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="auth" element={<Auth />} />
                    <Route path="auth/callback" element={<AuthCallback />} />
                    {/* Supabase auth redirects */}
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="verify-email" element={<VerifyEmail />} />

                    {/* Protected routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <RouteGuard>
                          <Dashboard />
                        </RouteGuard>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <RouteGuard>
                          <Profile />
                        </RouteGuard>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <RouteGuard>
                          <Settings />
                        </RouteGuard>
                      }
                    />
                    <Route
                      path="/client-projects"
                      element={
                        <RouteGuard>
                          <ClientProjectDashboard />
                        </RouteGuard>
                      }
                    />
                    <Route
                      path="/client-project/:id"
                      element={
                        <RouteGuard>
                          <ClientProjectDetail />
                        </RouteGuard>
                      }
                    />
                  </Route>

                  {/* Admin routes */}
                  <Route
                    path="/admin"
                    element={
                      <RouteGuard adminRequired>
                        <AdminLayout />
                      </RouteGuard>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UsersAdmin />} />
                    <Route path="projects" element={<ProjectsAdmin />} />
                    <Route
                      path="client-projects"
                      element={<ClientProjectsAdmin />}
                    />
                    <Route path="blog" element={<BlogAdmin />} />
                    <Route
                      path="email-templates"
                      element={<EmailTemplatesAdmin />}
                    />
                    <Route
                      path="email-settings"
                      element={<EmailSettingsAdmin />}
                    />
                    <Route path="newsletter" element={<NewsletterAdmin />} />
                    <Route path="contact" element={<ContactAdmin />} />
                    <Route path="settings" element={<SettingsAdmin />} />
                    <Route
                      path="email-automation"
                      element={<EmailAutomationAdmin />}
                    />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
