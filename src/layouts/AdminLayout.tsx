
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  FileText, 
  Mail, 
  Send, 
  MessageSquare,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { pathname } = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Projects",
      href: "/admin/projects",
      icon: FolderKanban,
    },
    {
      title: "Blog Posts",
      href: "/admin/blog",
      icon: FileText,
    },
    {
      title: "Email Templates",
      href: "/admin/email-templates",
      icon: Mail,
    },
    {
      title: "Newsletter",
      href: "/admin/newsletter",
      icon: Send,
    },
    {
      title: "Contact Form",
      href: "/admin/contact",
      icon: MessageSquare,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <ScrollArea className="py-6 pr-6 lg:py-8">
            <div className="pl-4 lg:pl-8">
              <h2 className="mb-4 text-lg font-semibold tracking-tight">
                Admin Panel
              </h2>
              <nav className="grid grid-flow-row auto-rows-max text-sm gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn("justify-start", pathname === item.href ? "bg-muted" : "")}
                    asChild
                  >
                    <Link to={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                ))}
              </nav>
            </div>
          </ScrollArea>
        </aside>
        <main className="flex flex-col w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
