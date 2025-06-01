
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Mail } from "lucide-react";

const EmailAutomationStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['automationStats'],
    queryFn: async () => {
      // Using the email automation service to get stats
      const response = await fetch('/api/email-automation/jobs?limit=1000');
      if (!response.ok) {
        throw new Error('Failed to fetch automation stats');
      }
      const data = await response.json();
      
      // Calculate stats from jobs data
      const jobs = data.jobs || [];
      const total = jobs.length;
      const completed = jobs.filter((job: any) => job.status === 'completed').length;
      const failed = jobs.filter((job: any) => job.status === 'failed').length;
      const pending = jobs.filter((job: any) => job.status === 'pending').length;
      
      return {
        total,
        completed,
        failed,
        pending,
        successRate: total > 0 ? ((completed / total) * 100).toFixed(1) : '0'
      };
    },
  });

  if (isLoading) {
    return <div>Loading automation statistics...</div>;
  }

  if (!stats) {
    return <div>Failed to load statistics</div>;
  }

  const statCards = [
    {
      title: "Total Jobs",
      value: stats.total,
      icon: Mail,
      description: "Total automation jobs processed",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      description: "Successfully sent emails",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Failed",
      value: stats.failed,
      icon: XCircle,
      description: "Failed email attempts",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      description: "Jobs waiting to be processed",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Automation Statistics</CardTitle>
          <CardDescription>
            Overview of email automation performance (last 30 days)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`p-2 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Success Rate</CardTitle>
          <CardDescription>
            Overall email automation success rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-green-600">
              {stats.successRate}%
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.successRate}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {stats.completed} out of {stats.total} emails sent successfully
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {stats.failed > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Failed Jobs Analysis
            </CardTitle>
            <CardDescription>
              Jobs that failed to send emails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Failed jobs require attention</span>
                <Badge variant="destructive">{stats.failed} failed</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Check the Automation Jobs tab to retry failed jobs or investigate error messages.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailAutomationStats;
