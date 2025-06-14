import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, Home, FolderOpen } from "lucide-react";

interface ClientProjectNavigationProps {
  projectTitle?: string;
  projectId?: string;
  allProjects?: Array<{ id: string; title: string }>;
}

const ClientProjectNavigation = ({
  projectTitle,
  projectId,
  allProjects = [],
}: ClientProjectNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackToDashboard = () => {
    navigate("/client-projects");
  };

  const handleProjectChange = (newProjectId: string) => {
    navigate(`/client-project/${newProjectId}`);
  };

  const isProjectDetailPage = location.pathname.includes("/client-project/");

  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToDashboard}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="flex items-center">
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/client-projects">
                My Projects
              </BreadcrumbLink>
            </BreadcrumbItem>
            {isProjectDetailPage && projectTitle && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold">
                    {projectTitle}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {isProjectDetailPage && allProjects.length > 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <FolderOpen className="h-4 w-4 mr-2" />
              Switch Project
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {allProjects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => handleProjectChange(project.id)}
                className={projectId === project.id ? "bg-accent" : ""}
              >
                {project.title}
                {projectId === project.id && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Current
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ClientProjectNavigation;
