
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
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
  Check
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Form schema
const emailTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>;

const EmailTemplatesAdmin = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Form
  const form = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      name: "",
      subject: "",
      content: "",
    },
  });

  // Reset form when editing template changes
  useState(() => {
    if (editingTemplate) {
      form.reset({
        name: editingTemplate.name,
        subject: editingTemplate.subject,
        content: editingTemplate.content,
      });
    } else {
      form.reset({
        name: "",
        subject: "",
        content: "",
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
    } catch (error) {
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
    } catch (error) {
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
            user_id: user?.id,
          },
        ]);
      
      if (error) throw new Error(error.message);
      
      toast({
        title: "Template duplicated",
        description: "The email template has been duplicated successfully.",
      });
      
      refetch();
    } catch (error) {
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
        description="Create and manage email templates for your communications." 
        actionLabel="Create Template"
        actionButton={
          <Button onClick={() => {
            setEditingTemplate(null);
            form.reset({
              name: "",
              subject: "",
              content: "",
            });
            setShowCreateTemplate(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
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
              Create email templates to streamline your communications and ensure consistent messaging.
            </p>
            <Button onClick={() => {
              setEditingTemplate(null);
              form.reset();
              setShowCreateTemplate(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Template
            </Button>
          </div>
        ) : (
          templates?.map((template) => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span className="truncate">{template.name}</span>
                </CardTitle>
                <CardDescription>
                  Updated {format(new Date(template.updated_at), "PPP")}
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
                      <div dangerouslySetInnerHTML={{ __html: template.content }} />
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingTemplate(template);
                    form.reset({
                      name: template.name,
                      subject: template.subject,
                      content: template.content,
                    });
                    setShowCreateTemplate(true);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Edit Template" : "Create Template"}</DialogTitle>
            <DialogDescription>
              {editingTemplate 
                ? "Edit your email template details and content." 
                : "Create a new email template for your communications."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Welcome Email" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for internal reference
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Welcome to LynixDevs" {...field} />
                    </FormControl>
                    <FormDescription>
                      The subject line recipients will see
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Content (HTML)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="<h1>Welcome!</h1><p>Thank you for joining us...</p>" 
                        className="min-h-[300px] font-mono text-sm"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      HTML content of your email. Use placeholders like {"{name}"} for personalization.
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
    </div>
  );
};

export default EmailTemplatesAdmin;
