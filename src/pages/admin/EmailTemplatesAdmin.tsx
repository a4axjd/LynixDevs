import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmailEventsList from "@/components/admin/EmailEventsList";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Pencil, 
  Loader2, 
  Trash,
  Copy,
  FileText,
  Check,
  Eye,
  Settings,
  Info
} from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { generateWelcomeEmailHTML } from "@/components/email-templates/WelcomeEmailTemplate";
import { generatePasswordResetHTML } from "@/components/email-templates/PasswordResetTemplate";
import { generateProjectUpdateHTML } from "@/components/email-templates/ProjectUpdateTemplate";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  trigger_event: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface EmailTemplateCategory {
  id: string;
  name: string;
  description: string;
}

interface EmailTemplateAssignment {
  id: string;
  template_id: string;
  event_type: string;
  is_active: boolean;
}

// Form schema
const emailTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  trigger_event: z.string().optional(),
});

type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>;

const EmailTemplatesAdmin = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<EmailTemplate | null>(null);
  const [showAssignments, setShowAssignments] = useState(false);
  const [showEventsList, setShowEventsList] = useState(false);
  
  // Form
  const form = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      name: "",
      subject: "",
      content: "",
      category: "general",
      trigger_event: "",
    },
  });

  // Reset form when editing template changes
  useEffect(() => {
    if (editingTemplate) {
      form.reset({
        name: editingTemplate.name,
        subject: editingTemplate.subject,
        content: editingTemplate.content,
        category: editingTemplate.category || "general",
        trigger_event: editingTemplate.trigger_event || "",
      });
    } else {
      form.reset({
        name: "",
        subject: "",
        content: "",
        category: "general",
        trigger_event: "",
      });
    }
  }, [editingTemplate, form]);

  // Fetch templates
  const { 
    data: templates, 
    isLoading, 
    error,
    refetch,
  } = useQuery({
    queryKey: ["emailTemplates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw new Error(error.message);
      return data as EmailTemplate[];
    },
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["emailTemplateCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_template_categories")
        .select("*")
        .order("name");
      
      if (error) throw new Error(error.message);
      return data as EmailTemplateCategory[];
    },
  });

  // Fetch assignments
  const { data: assignments, refetch: refetchAssignments } = useQuery({
    queryKey: ["emailTemplateAssignments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_template_assignments")
        .select("*");
      
      if (error) throw new Error(error.message);
      return data as EmailTemplateAssignment[];
    },
  });

  // Create default templates
  const createDefaultTemplates = async () => {
    try {
      const defaultTemplates = [
        {
          name: "Welcome Email",
          subject: "Welcome to LynixDevs! 🎉",
          content: generateWelcomeEmailHTML({ userName: "{user_name}", userEmail: "{user_email}" }),
          category: "welcome",
          trigger_event: "user_signup",
          is_default: true,
          user_id: user?.id,
        },
        {
          name: "Password Reset",
          subject: "Reset Your Password - LynixDevs",
          content: generatePasswordResetHTML({ 
            userName: "{user_name}", 
            resetLink: "{reset_link}", 
            userEmail: "{user_email}" 
          }),
          category: "password_reset",
          trigger_event: "password_reset",
          is_default: true,
          user_id: user?.id,
        },
        {
          name: "Project Update Notification",
          subject: "Project Update: {project_name}",
          content: generateProjectUpdateHTML({
            userName: "{user_name}",
            projectName: "{project_name}",
            updateTitle: "{update_title}",
            updateDescription: "{update_description}",
            progressPercentage: 75,
            userEmail: "{user_email}",
            projectDashboardLink: "{dashboard_link}",
          }),
          category: "project_updates",
          trigger_event: "project_update",
          is_default: true,
          user_id: user?.id,
        }
      ];

      for (const template of defaultTemplates) {
        const { error } = await supabase
          .from("email_templates")
          .insert([template]);
        
        if (error && !error.message.includes('duplicate key')) {
          throw new Error(error.message);
        }
      }

      toast({
        title: "Default templates created",
        description: "Default email templates have been added successfully.",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create default templates",
        variant: "destructive",
      });
    }
  };

  // Create or update template handler
  const onSubmit = async (values: EmailTemplateFormValues) => {
    try {
      if (editingTemplate) {
        // Update existing template
        const { error } = await supabase
          .from("email_templates")
          .update({
            name: values.name,
            subject: values.subject,
            content: values.content,
            category: values.category,
            trigger_event: values.trigger_event || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingTemplate.id);
        
        if (error) throw new Error(error.message);
        
        toast({
          title: "Template updated",
          description: "The email template has been updated successfully.",
        });
      } else {
        // Create new template
        const { error } = await supabase
          .from("email_templates")
          .insert([
            {
              name: values.name,
              subject: values.subject,
              content: values.content,
              category: values.category,
              trigger_event: values.trigger_event || null,
              user_id: user?.id,
            },
          ]);
        
        if (error) throw new Error(error.message);
        
        toast({
          title: "Template created",
          description: "The email template has been created successfully.",
        });
      }
      
      setShowCreateTemplate(false);
      setEditingTemplate(null);
      form.reset();
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  // Delete template
  const handleDeleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from("email_templates")
        .delete()
        .eq("id", id);
      
      if (error) throw new Error(error.message);
      
      toast({
        title: "Template deleted",
        description: "The email template has been deleted successfully.",
      });
      
      setShowDeleteConfirm(null);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  // Duplicate template
  const handleDuplicateTemplate = async (template: EmailTemplate) => {
    try {
      const { error } = await supabase
        .from("email_templates")
        .insert([
          {
            name: `${template.name} (Copy)`,
            subject: template.subject,
            content: template.content,
            category: template.category,
            trigger_event: template.trigger_event,
            user_id: user?.id,
          },
        ]);
      
      if (error) throw new Error(error.message);
      
      toast({
        title: "Template duplicated",
        description: "The email template has been duplicated successfully.",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container p-6">
      <AdminPageHeader 
        title="Email Templates" 
        description="Create and manage beautiful email templates for automated communications." 
        actionLabel="Create Template"
        actionButton={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowEventsList(true)}
            >
              <Info className="h-4 w-4 mr-2" />
              View Events
            </Button>
            <Button
              variant="outline"
              onClick={createDefaultTemplates}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Defaults
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAssignments(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Events
            </Button>
            <Button onClick={() => {
              setEditingTemplate(null);
              form.reset({
                name: "",
                subject: "",
                content: "",
                category: "general",
                trigger_event: "",
              });
              setShowCreateTemplate(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-12 text-destructive">
            Error loading templates: {error.message}
          </div>
        ) : templates?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Email Templates</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Create email templates to streamline your communications and ensure consistent messaging across all touchpoints.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={createDefaultTemplates}>
                <Plus className="h-4 w-4 mr-2" />
                Add Default Templates
              </Button>
              <Button variant="outline" onClick={() => {
                setEditingTemplate(null);
                form.reset();
                setShowCreateTemplate(true);
              }}>
                Create Custom Template
              </Button>
            </div>
          </div>
        ) : (
          templates?.map((template) => (
            <Card key={template.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span className="truncate">{template.name}</span>
                  {template.is_default && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="space-y-1">
                  <div>Updated {format(new Date(template.updated_at), "PPP")}</div>
                  <div className="text-xs bg-muted px-2 py-1 rounded-md inline-block">
                    {template.category}
                  </div>
                  {template.trigger_event && (
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md inline-block ml-1">
                      Event: {template.trigger_event}
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div>
                    <Label>Subject</Label>
                    <p className="text-sm text-muted-foreground truncate">
                      {template.subject}
                    </p>
                  </div>
                  <div>
                    <Label>Content Preview</Label>
                    <div className="text-sm text-muted-foreground mt-1 h-20 overflow-hidden relative">
                      <div dangerouslySetInnerHTML={{ __html: template.content.substring(0, 200) + '...' }} />
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(template)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingTemplate(template);
                      setShowCreateTemplate(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicateTemplate(template)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Dialog open={showDeleteConfirm === template.id} onOpenChange={(open) => {
                    if (!open) setShowDeleteConfirm(null);
                    else setShowDeleteConfirm(template.id);
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Template</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this template? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteConfirm(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      {/* Create/Edit Template Dialog */}
      <Dialog open={showCreateTemplate} onOpenChange={setShowCreateTemplate}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Edit Template" : "Create Template"}</DialogTitle>
            <DialogDescription>
              {editingTemplate 
                ? "Edit your email template details and content." 
                : "Create a new email template with modern styling."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Welcome Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.name} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Welcome to LynixDevs" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trigger_event"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trigger Event (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="user_signup, password_reset, etc." {...field} />
                      </FormControl>
                      <FormDescription>
                        Event that triggers this template
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Content (HTML)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="<h1>Welcome!</h1><p>Thank you for joining us...</p>" 
                        className="min-h-[400px] font-mono text-sm"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      HTML content of your email. Use placeholders like {"{user_name}"}, {"{user_email}"}, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">
                  {editingTemplate ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!showPreview} onOpenChange={() => setShowPreview(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Email Template Preview</DialogTitle>
            <DialogDescription>
              Preview of "{showPreview?.name}" template
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted p-3 border-b">
              <div className="text-sm font-medium">Subject: {showPreview?.subject}</div>
            </div>
            <div 
              className="p-4 max-h-[500px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: showPreview?.content || '' }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Events List Dialog */}
      <Dialog open={showEventsList} onOpenChange={setShowEventsList}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Available Email Events & Variables</DialogTitle>
            <DialogDescription>
              Reference guide for all available email events and their corresponding template variables.
            </DialogDescription>
          </DialogHeader>
          <EmailEventsList />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailTemplatesAdmin;
