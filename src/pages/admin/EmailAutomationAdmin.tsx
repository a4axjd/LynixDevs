
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailAutomationRules from "@/components/admin/EmailAutomationRules";
import EmailAutomationJobs from "@/components/admin/EmailAutomationJobs";
import EmailAutomationStats from "@/components/admin/EmailAutomationStats";

const EmailAutomationAdmin = () => {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Email Automation"
        description="Manage automated email rules and view automation jobs"
      />

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="jobs">Automation Jobs</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <EmailAutomationRules />
        </TabsContent>

        <TabsContent value="jobs">
          <EmailAutomationJobs />
        </TabsContent>

        <TabsContent value="stats">
          <EmailAutomationStats />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailAutomationAdmin;
