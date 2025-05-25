
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye, Loader2, Mail, CheckCircle, Reply } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at: string;
  read: boolean;
  updated_at: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

const ContactAdmin = () => {
  const { toast } = useToast();
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("no-template");
  const [replyMessage, setReplyMessage] = useState<string>("");
  const [replySubject, setReplySubject] = useState<string>("");
  const [isReplying, setIsReplying] = useState(false);
  
  // Fetch contact submissions
  const { data: submissions, isLoading, error, refetch } = useQuery({
    queryKey: ["contactSubmissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw new Error(error.message);
      return data as ContactSubmission[];
    },
  });

  // Fetch email templates
  const { data: emailTemplates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["emailTemplates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("id, name, subject, content")
        .order("name", { ascending: true });
      
      if (error) throw new Error(error.message);
      return data as EmailTemplate[];
    },
  });

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ read: true })
        .eq("id", id);
      
      if (error) throw new Error(error.message);
      
      toast({
        title: "Marked as read",
        description: "The submission has been marked as read.",
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

  const handleOpenReplyDialog = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setReplySubject(submission.subject ? `Re: ${submission.subject}` : "Re: Your contact submission");
    setShowReplyDialog(true);
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    
    if (templateId === "no-template") {
      setReplyMessage("");
      return;
    }
    
    const template = emailTemplates?.find((t) => t.id === templateId);
    if (template) {
      let content = template.content;
      
      // Replace placeholder variables if they exist in the template
      if (selectedSubmission) {
        content = content
          .replace(/\{name\}/g, selectedSubmission.name)
          .replace(/\{email\}/g, selectedSubmission.email)
          .replace(/\{message\}/g, selectedSubmission.message);
      }
      
      setReplyMessage(content);
      setReplySubject(template.subject);
    }
  };

  const handleSendReply = async () => {
    if (!selectedSubmission || !replyMessage || !replySubject) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsReplying(true);
      
      // Send email via Express server
      const response = await fetch("http://localhost:3001/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: selectedSubmission.email,
          subject: replySubject,
          html: replyMessage,
          replyTo: "info@lynixdevs.com",
          name: selectedSubmission.name
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send email");
      }

      // Update submission as read if not already
      if (!selectedSubmission.read) {
        await handleMarkAsRead(selectedSubmission.id);
      }
      
      toast({
        title: "Reply sent",
        description: `Your reply has been sent to ${selectedSubmission.name}.`,
      });
      
      setShowReplyDialog(false);
      setReplyMessage("");
      setReplySubject("");
      setSelectedTemplateId("no-template");
    } catch (error) {
      toast({
        title: "Error sending reply",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="container p-6">
      <AdminPageHeader 
        title="Contact Form Submissions" 
        description="View and manage contact form submissions from your website." 
      />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
          <CardDescription>
            You have received {submissions?.length || 0} contact form submissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Error loading submissions: {error.message}
            </div>
          ) : submissions?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No contact form submissions yet.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>{submissions[0]?.subject ? 'Subject' : 'Date'}</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions?.map((submission) => (
                    <TableRow key={submission.id} className={!submission.read ? "bg-muted/30" : ""}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.subject || '-'}</TableCell>
                      <TableCell>{format(new Date(submission.created_at), "PPP")}</TableCell>
                      <TableCell>
                        <Badge variant={submission.read ? "outline" : "default"}>
                          {submission.read ? "Read" : "Unread"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedSubmission(submission)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Contact Submission</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium">Name</h4>
                                    <p className="text-sm text-muted-foreground">{selectedSubmission?.name}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium">Email</h4>
                                    <p className="text-sm text-muted-foreground">{selectedSubmission?.email}</p>
                                  </div>
                                </div>
                                {selectedSubmission?.subject && (
                                  <div>
                                    <h4 className="text-sm font-medium">Subject</h4>
                                    <p className="text-sm text-muted-foreground">{selectedSubmission?.subject}</p>
                                  </div>
                                )}
                                <div>
                                  <h4 className="text-sm font-medium">Message</h4>
                                  <div className="rounded-md bg-muted p-4 mt-2">
                                    <p className="text-sm whitespace-pre-wrap">{selectedSubmission?.message}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                  <Button 
                                    variant="default" 
                                    onClick={() => handleOpenReplyDialog(selectedSubmission!)}
                                  >
                                    <Reply className="h-4 w-4 mr-2" />
                                    Reply with Template
                                  </Button>
                                  
                                  <Button 
                                    variant="outline" 
                                    onClick={() => window.location.href = `mailto:${selectedSubmission?.email}`}
                                  >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Reply via Email
                                  </Button>
                                  
                                  {!selectedSubmission?.read && (
                                    <Button 
                                      variant="outline" 
                                      onClick={() => handleMarkAsRead(selectedSubmission?.id || "")}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Mark as Read
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenReplyDialog(submission)}
                          >
                            <Reply className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                          
                          {!submission.read && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMarkAsRead(submission.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Read
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Email Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Reply to {selectedSubmission?.name}</DialogTitle>
            <DialogDescription>
              Use an email template or write a custom reply
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="template">Email Template</Label>
                <Select 
                  value={selectedTemplateId} 
                  onValueChange={handleTemplateChange}
                >
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-template">No template (custom reply)</SelectItem>
                    {emailTemplates?.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Textarea 
                  id="subject" 
                  placeholder="Enter email subject" 
                  className="min-h-[44px] resize-none"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Enter your reply message" 
                  className="min-h-[200px]"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  HTML formatting is supported. You can use {"{name}"}, {"{email}"}, and {"{message}"} as placeholders.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowReplyDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendReply} 
              disabled={isReplying || !replyMessage || !replySubject}
            >
              {isReplying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reply
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactAdmin;
