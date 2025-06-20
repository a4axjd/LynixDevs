import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  emailAutomationAPI,
  type AutomationJob,
} from "@/lib/emailAutomationAPI";

const EmailAutomationJobs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageSize] = useState(20);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: jobsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["automationJobs", currentPage, statusFilter],
    queryFn: () =>
      emailAutomationAPI.getJobs({
        page: currentPage,
        limit: pageSize,
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
  });

  const retryJobMutation = useMutation({
    mutationFn: (jobId: string) => emailAutomationAPI.retryJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automationJobs"] });
      toast({
        title: "Success",
        description: "Job retry initiated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to retry job",
        variant: "destructive",
      });
    },
  });

  const handleRetryJob = (jobId: string) => {
    retryJobMutation.mutate(jobId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatEventType = (eventType: string) => {
    return eventType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div>Loading automation jobs...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-red-600">
            Failed to load automation jobs. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  const jobs = jobsData?.jobs || [];
  const pagination = jobsData?.pagination || {
    page: 1,
    limit: pageSize,
    total: 0,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Automation Jobs</CardTitle>
            <CardDescription>
              View the status and history of automated email jobs
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["automationJobs"] })
              }
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No automation jobs found.
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job: AutomationJob) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">
                      {job.recipient_email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {formatEventType(
                          job.email_automation_rules?.event_type || "Unknown"
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {job.email_automation_rules?.email_templates?.name ||
                            "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {job.email_automation_rules?.email_templates?.subject}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(job.status)}
                      {job.retry_count && job.retry_count > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Retries: {job.retry_count}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(job.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {job.sent_at
                        ? new Date(job.sent_at).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {job.status === "failed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetryJob(job.id)}
                          disabled={retryJobMutation.isPending}
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Retry
                        </Button>
                      )}
                      {job.error_message && (
                        <div
                          className="text-xs text-red-600 mt-1 max-w-xs truncate"
                          title={job.error_message}
                        >
                          {job.error_message}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {pagination.total > pageSize && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, pagination.total)} of{" "}
                  {pagination.total} jobs
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage * pageSize >= pagination.total}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailAutomationJobs;
