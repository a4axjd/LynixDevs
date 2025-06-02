
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Mail } from "lucide-react";
import { emailAutomationAPI } from "@/lib/emailAutomationAPI";

const EmailAutomationStats = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['automationStats'],
    queryFn: () => emailAutomationAPI.getStats(),
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center py-8">
              <div>Loading...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-red-600">
            Failed to load automation statistics. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  const { total = 0, completed = 0, failed = 0, pending = 0 } = stats || {};
  const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground">
              Email automation jobs executed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completed}</div>
            <p className="text-xs text-muted-foreground">
              Successfully sent emails
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failed}</div>
            <p className="text-xs text-muted-foreground">
              Failed email sends
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pending}</div>
            <p className="text-xs text-muted-foreground">
              Queued for processing
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Success Rate</CardTitle>
          <CardDescription>
            Overall email automation performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Success Rate</span>
              <Badge variant={successRate >= 90 ? "default" : successRate >= 70 ? "secondary" : "destructive"}>
                {successRate}%
              </Badge>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  successRate >= 90 ? 'bg-green-600' : 
                  successRate >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: `${successRate}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-green-600">{completed}</div>
                <div className="text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-yellow-600">{pending}</div>
                <div className="text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-red-600">{failed}</div>
                <div className="text-muted-foreground">Failed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailAutomationStats;
