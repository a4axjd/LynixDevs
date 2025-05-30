import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  Download,
  Loader2,
  MailPlus,
  Send,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Subscriber {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string; // Changed to match actual database structure
  updated_at: string;
  subscribed: boolean;
}

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  created_at: string;
  sent_at: string | null;
  recipient_count: number;
}

// Form schemas
const addSubscriberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

const createNewsletterSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

type AddSubscriberFormValues = z.infer<typeof addSubscriberSchema>;
type CreateNewsletterFormValues = z.infer<typeof createNewsletterSchema>;

const NewsletterAdmin = () => {
  const { toast } = useToast();
  const [showAddSubscriber, setShowAddSubscriber] = useState(false);
  const [showCreateNewsletter, setShowCreateNewsletter] = useState(false);

  // Add subscriber form
  const addSubscriberForm = useForm<AddSubscriberFormValues>({
    resolver: zodResolver(addSubscriberSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
    },
  });

  // Create newsletter form
  const createNewsletterForm = useForm<CreateNewsletterFormValues>({
    resolver: zodResolver(createNewsletterSchema),
    defaultValues: {
      subject: "",
      content: "",
    },
  });

  // Fetch subscribers
  const {
    data: subscribers,
    isLoading: isLoadingSubscribers,
    error: subscribersError,
    refetch: refetchSubscribers,
  } = useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data as Subscriber[];
    },
  });

  // Fetch newsletters
  const {
    data: newsletters,
    isLoading: isLoadingNewsletters,
    error: newslettersError,
    refetch: refetchNewsletters,
  } = useQuery({
    queryKey: ["newsletters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletters")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data as Newsletter[];
    },
  });

  // Add subscriber handler
  const onSubmitAddSubscriber = async (values: AddSubscriberFormValues) => {
    try {
      const { data, error } = await supabase.from("subscribers").insert([
        {
          email: values.email,
          first_name: values.first_name || null,
          last_name: values.last_name || null,
          subscribed: true,
        },
      ]);

      if (error) throw new Error(error.message);

      toast({
        title: "Subscriber added",
        description: "The subscriber has been added successfully.",
      });

      setShowAddSubscriber(false);
      addSubscriberForm.reset();
      refetchSubscribers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  // Create newsletter handler
  const onSubmitCreateNewsletter = async (
    values: CreateNewsletterFormValues
  ) => {
    try {
      const { data, error } = await supabase.from("newsletters").insert([
        {
          subject: values.subject,
          content: values.content,
        },
      ]);

      if (error) throw new Error(error.message);

      toast({
        title: "Newsletter created",
        description: "The newsletter has been created and is ready to send.",
      });

      setShowCreateNewsletter(false);
      createNewsletterForm.reset();
      refetchNewsletters();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  // Send newsletter
  const handleSendNewsletter = async (newsletterId: string) => {
    try {
      toast({
        title: "Sending newsletter",
        description: "The newsletter is being sent to all subscribers.",
      });

      const newsletter = newsletters?.find((n) => n.id === newsletterId);
      if (!newsletter) throw new Error("Newsletter not found.");

      // Use your Vite environment variable
      const serverUrl = import.meta.env.VITE_SERVER_URL;
      if (!serverUrl) throw new Error("Server URL not configured.");

      // Call the backend at /api/newsletter/send
      const res = await fetch(`${serverUrl}/api/newsletter/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: newsletter.subject,
          html: newsletter.content,
          newsletter_id: newsletter.id,
        }),
      });

      const result = await res.json();

      if (!result.success)
        throw new Error(result.error || "Failed to send newsletter");

      toast({
        title: "Newsletter sent",
        description: `Sent to ${result.sentCount} subscribers.`,
      });

      refetchNewsletters();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  // Delete subscriber
  const handleDeleteSubscriber = async (subscriberId: string) => {
    try {
      const { error } = await supabase
        .from("subscribers")
        .delete()
        .eq("id", subscriberId);

      if (error) throw new Error(error.message);

      toast({
        title: "Subscriber deleted",
        description: "The subscriber has been deleted successfully.",
      });

      refetchSubscribers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  // Export subscribers
  const handleExportSubscribers = () => {
    if (!subscribers?.length) return;

    const activeSubscribers = subscribers.filter((s) => s.subscribed);

    const csvContent = [
      ["Email", "First Name", "Last Name", "Subscribed At"].join(","),
      ...activeSubscribers.map((sub) =>
        [
          sub.email,
          sub.first_name || "",
          sub.last_name || "",
          new Date(sub.created_at).toISOString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Subscribers exported",
      description: "The subscriber list has been exported as a CSV file.",
    });
  };

  return (
    <div className="container p-6">
      <AdminPageHeader
        title="Newsletter Management"
        description="Manage newsletter subscribers and send newsletters."
      />

      <Tabs defaultValue="subscribers" className="mt-6">
        <TabsList>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="newsletters">Newsletters</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Subscribers</CardTitle>
                <CardDescription>
                  You have{" "}
                  {subscribers?.filter((s) => s.subscribed)?.length || 0} active
                  subscribers.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleExportSubscribers}
                  disabled={!subscribers?.length}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={() => setShowAddSubscriber(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Subscriber
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingSubscribers ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : subscribersError ? (
                <div className="text-center py-8 text-destructive">
                  Error loading subscribers: {subscribersError.message}
                </div>
              ) : subscribers?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No subscribers yet.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date Subscribed</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers?.map((subscriber) => (
                        <TableRow key={subscriber.id}>
                          <TableCell className="font-medium">
                            {subscriber.email}
                          </TableCell>
                          <TableCell>
                            {[subscriber.first_name, subscriber.last_name]
                              .filter(Boolean)
                              .join(" ") || "-"}
                          </TableCell>
                          <TableCell>
                            {format(new Date(subscriber.created_at), "PPP")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                subscriber.subscribed ? "default" : "outline"
                              }
                            >
                              {subscriber.subscribed
                                ? "Active"
                                : "Unsubscribed"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteSubscriber(subscriber.id)
                              }
                            >
                              <Trash className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newsletters" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Newsletters</CardTitle>
                <CardDescription>
                  Create and send newsletters to your subscribers.
                </CardDescription>
              </div>
              <Button onClick={() => setShowCreateNewsletter(true)}>
                <MailPlus className="h-4 w-4 mr-2" />
                Create Newsletter
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingNewsletters ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : newslettersError ? (
                <div className="text-center py-8 text-destructive">
                  Error loading newsletters: {newslettersError.message}
                </div>
              ) : newsletters?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No newsletters created yet.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newsletters?.map((newsletter) => (
                        <TableRow key={newsletter.id}>
                          <TableCell className="font-medium">
                            {newsletter.subject}
                          </TableCell>
                          <TableCell>
                            {format(new Date(newsletter.created_at), "PPP")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                newsletter.sent_at ? "outline" : "default"
                              }
                            >
                              {newsletter.sent_at ? "Sent" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {newsletter.sent_at ? (
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                {newsletter.recipient_count}
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {!newsletter.sent_at && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleSendNewsletter(newsletter.id)
                                }
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Send
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Subscriber Dialog */}
      <Dialog open={showAddSubscriber} onOpenChange={setShowAddSubscriber}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subscriber</DialogTitle>
            <DialogDescription>
              Add a new subscriber to your newsletter list.
            </DialogDescription>
          </DialogHeader>
          <Form {...addSubscriberForm}>
            <form
              onSubmit={addSubscriberForm.handleSubmit(onSubmitAddSubscriber)}
              className="space-y-4"
            >
              <FormField
                control={addSubscriberForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addSubscriberForm.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addSubscriberForm.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Add Subscriber</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Create Newsletter Dialog */}
      <Dialog
        open={showCreateNewsletter}
        onOpenChange={setShowCreateNewsletter}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Newsletter</DialogTitle>
            <DialogDescription>
              Create a new newsletter to send to your subscribers.
            </DialogDescription>
          </DialogHeader>
          <Form {...createNewsletterForm}>
            <form
              onSubmit={createNewsletterForm.handleSubmit(
                onSubmitCreateNewsletter
              )}
              className="space-y-4"
            >
              <FormField
                control={createNewsletterForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Newsletter Subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createNewsletterForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (HTML)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="<h1>Newsletter Content</h1><p>Your content here...</p>"
                        className="min-h-[300px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Create Newsletter</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsletterAdmin;
