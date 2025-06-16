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
import { FolderKanban, FileText, PlusCircle } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Dashboard = () => {
  const { user } = useAuth();

  // Only show the "My Projects" and "Start a Project" actions, with Lottie
  const quickActions = [
    {
      title: "My Projects",
      description: "View and track your assigned projects",
      icon: FolderKanban,
      lottie: "/assets/project-info.lottie",
      href: "/client-projects",
      color: "text-blue-600",
    },
    {
      title: "Start a Project",
      description: "Kickstart a new project with LynixDevs",
      icon: PlusCircle,
      lottie: "/assets/email.lottie",
      href: "/start-project",
      color: "text-lynix-purple",
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.user_metadata?.full_name || user?.email}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your account and recent activity.
          </p>
        </div>
        {/* Optional: Add a nice dashboard Lottie on the right */}
        <div className="hidden md:block">
          <DotLottieReact
            src="/assets/technology.lottie"
            autoplay
            loop
            style={{ width: 96, height: 96 }}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-8">
        {quickActions.map((action) => (
          <Card
            key={action.title}
            className="hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <action.icon className={`h-6 w-6 ${action.color}`} />
              <CardTitle className="ml-2 text-lg">{action.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between gap-3">
              <CardDescription className="mb-2">
                {action.description}
              </CardDescription>
              <div className="flex items-center justify-between">
                <Button asChild variant="outline" className="w-full md:w-auto">
                  <Link to={action.href}>Open {action.title}</Link>
                </Button>
                <div className="hidden md:flex ml-4">
                  <DotLottieReact
                    src={action.lottie}
                    autoplay
                    loop
                    style={{ width: 56, height: 56 }}
                  />
                </div>
              </div>
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
              <div className="w-2 h-2 bg-lynix-purple rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Start a New Project</h4>
                <p className="text-sm text-muted-foreground">
                  Launch a new idea with LynixDevs by starting a project.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Explore Features</h4>
                <p className="text-sm text-muted-foreground">
                  Discover all the features available in your dashboard.
                </p>
              </div>
            </div>
          </div>
          {/* Add a friendly getting started Lottie at the bottom */}
          <div className="w-full flex justify-center mt-8">
            <DotLottieReact
              src="/assets/contact-hero.lottie"
              autoplay
              loop
              style={{ width: 100, height: 100 }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
