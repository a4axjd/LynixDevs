
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Plus, Save, Mail } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmailSender {
  id: string;
  email: string;
  name: string;
  is_default: boolean;
  created_at: string;
}

const EmailSettingsAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [defaultSender, setDefaultSender] = useState("");

  // Fetch email senders
  const { data: emailSenders, isLoading } = useQuery({
    queryKey: ["emailSenders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_senders")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw new Error(error.message);
      return data;
    },
  });

  // Set default sender when data loads
  useEffect(() => {
    const defaultSenderData = emailSenders?.find(sender => sender.is_default);
    if (defaultSenderData) {
      setDefaultSender(defaultSenderData.id);
    }
  }, [emailSenders]);

  // Add email sender mutation
  const addSenderMutation = useMutation({
    mutationFn: async () => {
      if (!newEmail || !newName) {
        throw new Error("Email and name are required");
      }

      const { error } = await supabase
        .from("email_senders")
        .insert([
          {
            email: newEmail,
            name: newName,
            is_default: emailSenders?.length === 0, // First sender becomes default
          },
        ]);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({
        title: "Email sender added",
        description: "The email sender has been added successfully.",
      });
      setNewEmail("");
      setNewName("");
      queryClient.invalidateQueries({ queryKey: ["emailSenders"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete email sender mutation
  const deleteSenderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("email_senders")
        .delete()
        .eq("id", id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({
        title: "Email sender deleted",
        description: "The email sender has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["emailSenders"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update default sender mutation
  const updateDefaultMutation = useMutation({
    mutationFn: async (newDefaultId: string) => {
      // First, remove default from all senders
      await supabase
        .from("email_senders")
        .update({ is_default: false })
        .neq("id", "");

      // Then set the new default
      const { error } = await supabase
        .from("email_senders")
        .update({ is_default: true })
        .eq("id", newDefaultId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({
        title: "Default sender updated",
        description: "The default email sender has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["emailSenders"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddSender = () => {
    addSenderMutation.mutate();
  };

  const handleDeleteSender = (id: string) => {
    deleteSenderMutation.mutate(id);
  };

  const handleUpdateDefault = () => {
    if (defaultSender) {
      updateDefaultMutation.mutate(defaultSender);
    }
  };

  return (
    <div className="container p-6">
      <AdminPageHeader 
        title="Email Settings" 
        description="Manage email sender addresses and configure default sending options."
      />

      <div className="grid gap-6 mt-6">
        {/* Add New Email Sender */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Email Sender
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="noreply@lynixdevs.us"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  placeholder="LynixDevs"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
            </div>
            <Button 
              onClick={handleAddSender}
              disabled={!newEmail || !newName || addSenderMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Sender
            </Button>
          </CardContent>
        </Card>

        {/* Current Email Senders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Senders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : emailSenders?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No email senders configured. Add one above to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {emailSenders?.map((sender) => (
                  <div
                    key={sender.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium">{sender.name}</div>
                        <div className="text-sm text-muted-foreground">{sender.email}</div>
                      </div>
                      {sender.is_default && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSender(sender.id)}
                      disabled={deleteSenderMutation.isPending}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Default Sender Selection */}
        {emailSenders && emailSenders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Default Email Sender</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="defaultSender">Select Default Sender</Label>
                <Select value={defaultSender} onValueChange={setDefaultSender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select default sender" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailSenders.map((sender) => (
                      <SelectItem key={sender.id} value={sender.id}>
                        {sender.name} ({sender.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleUpdateDefault}
                disabled={!defaultSender || updateDefaultMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Update Default
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmailSettingsAdmin;
