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
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateAutomationRuleDialog from "./CreateAutomationRuleDialog";
import EditAutomationRuleDialog from "./EditAutomationRuleDialog";
import {
  emailAutomationAPI,
  type AutomationRule,
} from "@/lib/emailAutomationAPI";

const EmailAutomationRules = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: rules = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["automationRules"],
    queryFn: () => emailAutomationAPI.getRules(),
  });

  const updateRuleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AutomationRule> }) =>
      emailAutomationAPI.updateRule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automationRules"] });
      toast({
        title: "Success",
        description: "Automation rule updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update automation rule",
        variant: "destructive",
      });
    },
  });

  const deleteRuleMutation = useMutation({
    mutationFn: (id: string) => emailAutomationAPI.deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automationRules"] });
      toast({
        title: "Success",
        description: "Automation rule deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete automation rule",
        variant: "destructive",
      });
    },
  });

  const handleToggleActive = (rule: AutomationRule) => {
    updateRuleMutation.mutate({
      id: rule.id,
      data: { is_active: !rule.is_active },
    });
  };

  const handleDeleteRule = (id: string) => {
    if (confirm("Are you sure you want to delete this automation rule?")) {
      deleteRuleMutation.mutate(id);
    }
  };

  // Display the event type as-is, but with underscores replaced by spaces and capitalized
  const formatEventType = (eventType: string) => {
    return eventType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div>Loading automation rules...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-red-600">
            Failed to load automation rules. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Automation Rules</CardTitle>
          <CardDescription>
            Configure automated email triggers for different events.
            <br />
            <span className="text-xs text-muted-foreground">
              You can use <b>any custom event type</b> (e.g.{" "}
              <code>project_inquiry_reply</code>,{" "}
              <code>project_inquiry_admin</code>) when creating a rule.
            </span>
          </CardDescription>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </CardHeader>
      <CardContent>
        {rules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No automation rules configured yet. Create your first rule to get
            started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Type</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule: AutomationRule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <Badge variant="outline">
                      {formatEventType(rule.event_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {rule.email_templates?.name || "Template not found"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {rule.email_templates?.subject}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.is_active}
                        onCheckedChange={() => handleToggleActive(rule)}
                      />
                      <span className="text-sm">
                        {rule.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(rule.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingRule(rule)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <CreateAutomationRuleDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {editingRule && (
        <EditAutomationRuleDialog
          rule={editingRule}
          open={!!editingRule}
          onOpenChange={(open) => !open && setEditingRule(null)}
        />
      )}
    </Card>
  );
};

export default EmailAutomationRules;
