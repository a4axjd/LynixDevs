import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
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
import { Home, FolderOpen } from "lucide-react";

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

  const handleProjectChange = (newProjectId: string) => {
    navigate(`/client-project/${newProjectId}`);
  };

  const isProjectDetailPage = location.pathname.includes("/client-project/");

  return (
    <nav
      className="flex items-center justify-between mb-8 py-4 px-6 rounded-xl border border-lynix-purple/10
        bg-gradient-to-br from-white via-lynix-light-purple/30 to-lynix-purple/5
        shadow-sm relative overflow-hidden"
      style={{ backdropFilter: "blur(3px)" }}
    >
      {/* Abstract blobs */}
      <span className="pointer-events-none absolute -top-8 -left-12 w-36 h-36 bg-lynix-light-purple/20 rounded-full blur-2xl opacity-50" />
      <span className="pointer-events-none absolute -bottom-10 right-0 w-32 h-32 bg-lynix-purple/10 rounded-full blur-xl opacity-40" />

      {/* Breadcrumb navigation */}
      <div className="flex items-center space-x-6 relative z-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                className="flex items-center text-lg font-semibold text-lynix-purple hover:underline"
              >
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/client-projects"
                className="text-base font-medium text-lynix-purple/90 hover:underline"
              >
                My Projects
              </BreadcrumbLink>
            </BreadcrumbItem>
            {isProjectDetailPage && projectTitle && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-base text-lynix-purple">
                    {projectTitle}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Switch Project Dropdown */}
      {isProjectDetailPage && allProjects.length > 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-lynix-purple text-lynix-purple hover:bg-lynix-purple/10 hover:text-lynix-purple transition"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Switch Project
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-lg shadow-lg border border-lynix-purple bg-background/95"
          >
            {allProjects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => handleProjectChange(project.id)}
                className={`rounded font-medium ${
                  projectId === project.id
                    ? "bg-lynix-purple/10 text-lynix-purple"
                    : ""
                }`}
              >
                {project.title}
                {projectId === project.id && (
                  <span className="ml-auto text-xs text-muted-foreground font-normal">
                    Current
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
};

export default ClientProjectNavigation;
