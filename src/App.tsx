
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import RouteGuard from "./components/RouteGuard";

// Auth pages
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import ProjectDetail from "./pages/ProjectDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import Testimonials from "./pages/Testimonials";

// Protected pages
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Admin pages
import UsersAdmin from "./pages/admin/UsersAdmin";
import ProjectsAdmin from "./pages/admin/ProjectsAdmin";
import BlogAdmin from "./pages/admin/BlogAdmin";
import EmailTemplatesAdmin from "./pages/admin/EmailTemplatesAdmin";
import NewsletterAdmin from "./pages/admin/NewsletterAdmin";
import ContactAdmin from "./pages/admin/ContactAdmin";
// import AdminSettings from "./pages/admin/AdminSettings";

// Layout components
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:id" element={<ProjectDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Auth routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* User protected routes */}
            <Route element={<RouteGuard />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Admin protected routes */}
            <Route element={<RouteGuard requiredRole="admin" />}>
              <Route path="/admin" element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              } />
              <Route path="/admin/users" element={
                <AdminLayout>
                  <UsersAdmin />
                </AdminLayout>
              } />
              <Route path="/admin/projects" element={
                <AdminLayout>
                  <ProjectsAdmin />
                </AdminLayout>
              } />
              <Route path="/admin/blog" element={
                <AdminLayout>
                  <BlogAdmin />
                </AdminLayout>
              } />
              <Route path="/admin/email-templates" element={
                <AdminLayout>
                  <EmailTemplatesAdmin />
                </AdminLayout>
              } />
              <Route path="/admin/newsletter" element={
                <AdminLayout>
                  <NewsletterAdmin />
                </AdminLayout>
              } />
              <Route path="/admin/contact" element={
                <AdminLayout>
                  <ContactAdmin />
                </AdminLayout>
              } />
            </Route>

            {/* Not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
