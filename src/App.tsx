
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

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
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import ProjectDetail from "@/pages/ProjectDetail";
import ClientProjectDashboard from "@/pages/ClientProjectDashboard";

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

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogDetail />} />
              <Route path="contact" element={<Contact />} />
              <Route path="auth" element={<Auth />} />
              <Route path="auth/callback" element={<AuthCallback />} />
            </Route>

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
              path="/project/:id"
              element={
                <RouteGuard>
                  <ProjectDetail />
                </RouteGuard>
              }
            />
            <Route
              path="/client-project/:id"
              element={
                <RouteGuard>
                  <ClientProjectDashboard />
                </RouteGuard>
              }
            />

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
              <Route path="client-projects" element={<ClientProjectsAdmin />} />
              <Route path="blog" element={<BlogAdmin />} />
              <Route path="email-templates" element={<EmailTemplatesAdmin />} />
              <Route path="email-settings" element={<EmailSettingsAdmin />} />
              <Route path="newsletter" element={<NewsletterAdmin />} />
              <Route path="contact" element={<ContactAdmin />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
