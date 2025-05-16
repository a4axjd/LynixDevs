
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  actionButton?: ReactNode;
}

const AdminPageHeader = ({
  title,
  description,
  actionLabel,
  actionHref,
  actionButton,
}: AdminPageHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
            <Link to="/admin">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back to dashboard</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actionButton ? (
        actionButton
      ) : actionLabel && actionHref ? (
        <Button asChild>
          <Link to={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
};

export default AdminPageHeader;
