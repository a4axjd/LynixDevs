
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
import { Eye, Loader2, Mail, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
}

const ContactAdmin = () => {
  const { toast } = useToast();
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  
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

  const handleSendReply = async (email: string) => {
    try {
      // Redirect to a new email composition with the recipient's email
      window.location.href = `mailto:${email}`;
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
                    <TableHead>Subject</TableHead>
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
                      <TableCell>{submission.subject}</TableCell>
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
                                <div>
                                  <h4 className="text-sm font-medium">Subject</h4>
                                  <p className="text-sm text-muted-foreground">{selectedSubmission?.subject}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Message</h4>
                                  <div className="rounded-md bg-muted p-4 mt-2">
                                    <p className="text-sm whitespace-pre-wrap">{selectedSubmission?.message}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                  <Button 
                                    variant="default" 
                                    onClick={() => handleSendReply(selectedSubmission?.email || "")}
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
                            onClick={() => handleSendReply(submission.email)}
                          >
                            <Mail className="h-4 w-4 mr-1" />
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
    </div>
  );
};

export default ContactAdmin;
