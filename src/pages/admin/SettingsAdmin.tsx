
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Mail, 
  Shield, 
  Clock, 
  Server, 
  Users, 
  FileText,
  Save,
  TestTube
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface AdminSettings {
  id?: string;
  email_verification_expiry_hours: number;
  password_reset_expiry_hours: number;
  session_timeout_hours: number;
  max_login_attempts: number;
  account_lockout_duration_minutes: number;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  smtp_use_tls: boolean;
  smtp_reply_to: string;
  from_email: string;
  from_name: string;
  maintenance_mode: boolean;
  user_registration_enabled: boolean;
  email_notifications_enabled: boolean;
  newsletter_enabled: boolean;
  contact_form_enabled: boolean;
  file_upload_max_size_mb: number;
  allowed_file_types: string;
}

const SettingsAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);

  // Fetch admin settings
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["adminSettings"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/settings`);
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      return data.settings;
    },
  });

  useEffect(() => {
    if (settingsData) {
      setSettings(settingsData);
    }
  }, [settingsData]);

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: AdminSettings) => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update settings');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Admin settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["adminSettings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Test SMTP mutation
  const testSmtpMutation = useMutation({
    mutationFn: async () => {
      if (!settings) throw new Error('No settings available');
      
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/settings/test-smtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          smtp_host: settings.smtp_host,
          smtp_port: settings.smtp_port,
          smtp_username: settings.smtp_username,
          smtp_password: settings.smtp_password,
          smtp_use_tls: settings.smtp_use_tls,
          from_email: settings.from_email,
        }),
      });
      
      if (!response.ok) throw new Error('SMTP test failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "SMTP Test Successful",
        description: "SMTP connection is working properly.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "SMTP Test Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveSettings = () => {
    if (settings) {
      updateSettingsMutation.mutate(settings);
    }
  };

  const handleTestSmtp = async () => {
    setIsTestingSmtp(true);
    await testSmtpMutation.mutateAsync();
    setIsTestingSmtp(false);
  };

  const updateSetting = (key: keyof AdminSettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="container p-6">
        <AdminPageHeader title="Settings" description="Configure system settings and preferences." />
        <div className="text-center py-4">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container p-6">
      <AdminPageHeader 
        title="System Settings" 
        description="Configure system-wide settings, email preferences, and security options."
      />

      <Tabs defaultValue="email" className="mt-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="email">Email & SMTP</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="files">File Upload</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-6">
          {/* Email Expiry Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Email Expiry Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emailVerificationExpiry">Email Verification Expiry (hours)</Label>
                  <Input
                    id="emailVerificationExpiry"
                    type="number"
                    value={settings.email_verification_expiry_hours}
                    onChange={(e) => updateSetting('email_verification_expiry_hours', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="passwordResetExpiry">Password Reset Expiry (hours)</Label>
                  <Input
                    id="passwordResetExpiry"
                    type="number"
                    value={settings.password_reset_expiry_hours}
                    onChange={(e) => updateSetting('password_reset_expiry_hours', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SMTP Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                SMTP Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    placeholder="smtp.gmail.com"
                    value={settings.smtp_host}
                    onChange={(e) => updateSetting('smtp_host', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    placeholder="587"
                    value={settings.smtp_port}
                    onChange={(e) => updateSetting('smtp_port', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    placeholder="your-email@domain.com"
                    value={settings.smtp_username}
                    onChange={(e) => updateSetting('smtp_username', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    placeholder="••••••••"
                    value={settings.smtp_password}
                    onChange={(e) => updateSetting('smtp_password', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    placeholder="noreply@lynixdevs.us"
                    value={settings.from_email}
                    onChange={(e) => updateSetting('from_email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    placeholder="LynixDevs"
                    value={settings.from_name}
                    onChange={(e) => updateSetting('from_name', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="smtpReplyTo">Reply-To Email</Label>
                <Input
                  id="smtpReplyTo"
                  placeholder="support@lynixdevs.us"
                  value={settings.smtp_reply_to}
                  onChange={(e) => updateSetting('smtp_reply_to', e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Email address where replies will be sent (optional)
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Use TLS/SSL</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable secure connection for SMTP
                  </p>
                </div>
                <Switch
                  checked={settings.smtp_use_tls}
                  onCheckedChange={(checked) => updateSetting('smtp_use_tls', checked)}
                />
              </div>

              <Button 
                onClick={handleTestSmtp}
                disabled={isTestingSmtp || !settings.smtp_host}
                variant="outline"
              >
                <TestTube className="h-4 w-4 mr-2" />
                {isTestingSmtp ? 'Testing...' : 'Test SMTP Connection'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.session_timeout_hours}
                    onChange={(e) => updateSetting('session_timeout_hours', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.max_login_attempts}
                    onChange={(e) => updateSetting('max_login_attempts', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="lockoutDuration">Account Lockout Duration (minutes)</Label>
                <Input
                  id="lockoutDuration"
                  type="number"
                  value={settings.account_lockout_duration_minutes}
                  onChange={(e) => updateSetting('account_lockout_duration_minutes', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Feature Toggles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'user_registration_enabled', label: 'User Registration', description: 'Allow new users to register' },
                { key: 'email_notifications_enabled', label: 'Email Notifications', description: 'Send email notifications to users' },
                { key: 'newsletter_enabled', label: 'Newsletter', description: 'Enable newsletter functionality' },
                { key: 'contact_form_enabled', label: 'Contact Form', description: 'Enable contact form submissions' },
              ].map((feature) => (
                <div key={feature.key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{feature.label}</Label>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <Switch
                    checked={settings[feature.key as keyof AdminSettings] as boolean}
                    onCheckedChange={(checked) => updateSetting(feature.key as keyof AdminSettings, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                File Upload Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={settings.file_upload_max_size_mb}
                  onChange={(e) => updateSetting('file_upload_max_size_mb', parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="allowedTypes">Allowed File Types (comma-separated)</Label>
                <Input
                  id="allowedTypes"
                  placeholder="jpg,jpeg,png,gif,pdf,doc,docx,txt"
                  value={settings.allowed_file_types}
                  onChange={(e) => updateSetting('allowed_file_types', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Put the system in maintenance mode to prevent user access
                  </p>
                </div>
                <Switch
                  checked={settings.maintenance_mode}
                  onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          disabled={updateSettingsMutation.isPending}
          className="min-w-[120px]"
        >
          <Save className="h-4 w-4 mr-2" />
          {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default SettingsAdmin;
