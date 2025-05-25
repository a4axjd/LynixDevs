
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import RouteGuard from "@/components/RouteGuard";
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Import pages
import Index from "@/pages/Index";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Portfolio from "@/pages/Portfolio";
import ProjectDetail from "@/pages/ProjectDetail";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Contact from "@/pages/Contact";
import Auth from "@/pages/Auth";
import AuthCallback from "@/pages/AuthCallback";
import Dashboard from "@/pages/Dashboard";
import ClientProjectDashboard from "@/pages/ClientProjectDashboard";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Testimonials from "@/pages/Testimonials";
import NotFound from "@/pages/NotFound";

// Admin pages
import AdminDashboard from "@/pages/AdminDashboard";
import UsersAdmin from "@/pages/admin/UsersAdmin";
import ProjectsAdmin from "@/pages/admin/ProjectsAdmin";
import ClientProjectsAdmin from "@/pages/admin/ClientProjectsAdmin";
import BlogAdmin from "@/pages/admin/BlogAdmin";
import EmailTemplatesAdmin from "@/pages/admin/EmailTemplatesAdmin";
import NewsletterAdmin from "@/pages/admin/NewsletterAdmin";
import ContactAdmin from "@/pages/admin/ContactAdmin";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="home" element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="portfolio/:id" element={<ProjectDetail />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogDetail />} />
              <Route path="contact" element={<Contact />} />
              <Route path="testimonials" element={<Testimonials />} />
            </Route>

            {/* Auth routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected user routes */}
            <Route
              path="/dashboard"
              element={
                <RouteGuard>
                  <MainLayout />
                </RouteGuard>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ClientProjectDashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Protected admin routes */}
            <Route
              path="/admin"
              element={
                <RouteGuard requiredRole="admin">
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
              <Route path="newsletter" element={<NewsletterAdmin />} />
              <Route path="contact" element={<ContactAdmin />} />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
