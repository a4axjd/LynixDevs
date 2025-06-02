
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

interface AutomationRule {
  id: string;
  event_type: string;
  template_id: string;
  is_active: boolean;
  conditions: any;
}

interface EditAutomationRuleDialogProps {
  rule: AutomationRule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EVENT_TYPES = [
  { value: 'user_welcome', label: 'User Welcome' },
  { value: 'contact_form_reply', label: 'Contact Form Reply' },
  { value: 'project_update', label: 'Project Update' },
  { value: 'newsletter_confirmation', label: 'Newsletter Confirmation' },
];

const EditAutomationRuleDialog = ({ rule, open, onOpenChange }: EditAutomationRuleDialogProps) => {
  const [eventType, setEventType] = useState(rule.event_type);
  const [templateId, setTemplateId] = useState(rule.template_id);
  const [isActive, setIsActive] = useState(rule.is_active);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    setEventType(rule.event_type);
    setTemplateId(rule.template_id);
    setIsActive(rule.is_active);
  }, [rule]);

  const { data: templates = [] } = useQuery({
    queryKey: ['emailTemplates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('id, name, subject')
        .order('name');
      
      if (error) throw error;
      // Filter out templates with invalid IDs
      return data?.filter(template => template.id && template.id.trim() !== '') || [];
    },
  });

  const updateRuleMutation = useMutation({
    mutationFn: async (ruleData: any) => {
      const response = await fetch(`/api/email-automation/rules/${rule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ruleData),
      });
      if (!response.ok) {
        throw new Error('Failed to update automation rule');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automationRules'] });
      toast({
        title: "Success",
        description: "Automation rule updated successfully",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventType || !templateId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    updateRuleMutation.mutate({
      event_type: eventType,
      template_id: templateId,
      is_active: isActive,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Automation Rule</DialogTitle>
          <DialogDescription>
            Update the automation rule settings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-type">Event Type *</Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue placeholder="Select an event type" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((event) => (
                  <SelectItem key={event.value} value={event.value}>
                    {event.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Email Template *</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an email template" />
              </SelectTrigger>
              <SelectContent>
                {templates.length === 0 ? (
                  <SelectItem value="no-templates" disabled>
                    No templates available
                  </SelectItem>
                ) : (
                  templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-muted-foreground">{template.subject}</div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="is-active">Active</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateRuleMutation.isPending}>
              {updateRuleMutation.isPending ? 'Updating...' : 'Update Rule'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAutomationRuleDialog;
