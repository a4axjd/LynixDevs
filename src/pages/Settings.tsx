
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Settings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <Separator className="mb-6" />
            
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="username" />
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <select 
                    id="language" 
                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <select 
                  id="timezone" 
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="utc">UTC</option>
                  <option value="est">Eastern Time (ET)</option>
                  <option value="cst">Central Time (CT)</option>
                  <option value="mst">Mountain Time (MT)</option>
                  <option value="pst">Pacific Time (PT)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketingEmails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features and offers
                  </p>
                </div>
                <Switch id="marketingEmails" />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
            <Separator className="mb-6" />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Project Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about project status changes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Comment Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when someone comments on your project
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Newsletter</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive our newsletter with updates and tips
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            <Separator className="mb-6" />
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Sessions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your active sessions and sign out from other devices
                </p>
                <Button variant="outline">Manage Sessions</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 flex justify-end">
        <Button variant="outline" className="mr-2">Cancel</Button>
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2"></div>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      <p className="text-center text-muted-foreground mt-12">
        This is a placeholder settings page. Full implementation coming soon.
      </p>
    </div>
  );
};

export default Settings;
