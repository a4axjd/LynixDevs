import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FolderKanban, User, Settings, FileText } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: "My Projects",
      description: "View and track your assigned projects",
      icon: FolderKanban,
      href: "/client-projects",
      color: "text-blue-600",
    },
    {
      title: "Profile",
      description: "Update your personal information",
      icon: User,
      href: "/profile",
      color: "text-green-600",
    },
    {
      title: "Settings",
      description: "Manage your account settings",
      icon: Settings,
      href: "/settings",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.user_metadata?.full_name || user?.email}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your account and recent activity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {quickActions.map((action) => (
          <Card
            key={action.title}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <action.icon className={`h-6 w-6 ${action.color}`} />
              <CardTitle className="ml-2 text-lg">{action.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {action.description}
              </CardDescription>
              <Button asChild variant="outline" className="w-full">
                <Link to={action.href}>Open {action.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Check Your Projects</h4>
                <p className="text-sm text-muted-foreground">
                  View any projects that have been assigned to you and track
                  their progress.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Update Your Profile</h4>
                <p className="text-sm text-muted-foreground">
                  Complete your profile information to help us serve you better.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Explore Features</h4>
                <p className="text-sm text-muted-foreground">
                  Discover all the features available in your dashboard.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
