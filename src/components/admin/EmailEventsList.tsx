
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  UserPlus, 
  Key, 
  FolderKanban, 
  MessageSquare, 
  Send, 
  Bell,
  CheckCircle,
  AlertCircle,
  Calendar
} from "lucide-react";

interface EmailEvent {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'auth' | 'project' | 'communication' | 'system';
  variables: string[];
}

const emailEvents: EmailEvent[] = [
  {
    id: 'user_signup',
    name: 'User Signup',
    description: 'Triggered when a new user registers for an account',
    icon: UserPlus,
    category: 'auth',
    variables: ['{user_name}', '{user_email}', '{verification_link}']
  },
  {
    id: 'password_reset',
    name: 'Password Reset',
    description: 'Triggered when a user requests a password reset',
    icon: Key,
    category: 'auth',
    variables: ['{user_name}', '{user_email}', '{reset_link}', '{reset_expires}']
  },
  {
    id: 'email_verification',
    name: 'Email Verification',
    description: 'Triggered when a user needs to verify their email address',
    icon: Mail,
    category: 'auth',
    variables: ['{user_name}', '{user_email}', '{verification_link}']
  },
  {
    id: 'project_update',
    name: 'Project Update',
    description: 'Triggered when there is an update to a client project',
    icon: FolderKanban,
    category: 'project',
    variables: ['{user_name}', '{project_name}', '{update_title}', '{update_description}', '{progress_percentage}', '{dashboard_link}']
  },
  {
    id: 'project_completed',
    name: 'Project Completed',
    description: 'Triggered when a project is marked as completed',
    icon: CheckCircle,
    category: 'project',
    variables: ['{user_name}', '{project_name}', '{completion_date}', '{project_summary}']
  },
  {
    id: 'project_milestone',
    name: 'Project Milestone',
    description: 'Triggered when a project reaches a significant milestone',
    icon: Calendar,
    category: 'project',
    variables: ['{user_name}', '{project_name}', '{milestone_name}', '{milestone_description}', '{progress_percentage}']
  },
  {
    id: 'contact_form_submission',
    name: 'Contact Form Submission',
    description: 'Triggered when someone submits the contact form',
    icon: MessageSquare,
    category: 'communication',
    variables: ['{contact_name}', '{contact_email}', '{contact_subject}', '{contact_message}']
  },
  {
    id: 'newsletter_welcome',
    name: 'Newsletter Welcome',
    description: 'Triggered when someone subscribes to the newsletter',
    icon: Send,
    category: 'communication',
    variables: ['{subscriber_name}', '{subscriber_email}', '{unsubscribe_link}']
  },
  {
    id: 'newsletter_broadcast',
    name: 'Newsletter Broadcast',
    description: 'Triggered when sending a newsletter to all subscribers',
    icon: Bell,
    category: 'communication',
    variables: ['{subscriber_name}', '{newsletter_title}', '{newsletter_content}', '{unsubscribe_link}']
  },
  {
    id: 'system_notification',
    name: 'System Notification',
    description: 'Triggered for important system notifications',
    icon: AlertCircle,
    category: 'system',
    variables: ['{user_name}', '{notification_title}', '{notification_message}', '{action_link}']
  }
];

const categoryColors = {
  auth: 'bg-blue-100 text-blue-800',
  project: 'bg-green-100 text-green-800',
  communication: 'bg-purple-100 text-purple-800',
  system: 'bg-orange-100 text-orange-800'
};

const EmailEventsList = () => {
  const groupedEvents = emailEvents.reduce((acc, event) => {
    if (!acc[event.category]) {
      acc[event.category] = [];
    }
    acc[event.category].push(event);
    return acc;
  }, {} as Record<string, EmailEvent[]>);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Available Email Events</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Use these event types to automatically trigger email templates. Each event provides specific variables you can use in your templates.
        </p>
      </div>
      
      {Object.entries(groupedEvents).map(([category, events]) => (
        <div key={category} className="space-y-3">
          <h4 className="text-md font-medium capitalize text-muted-foreground">
            {category} Events
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => {
              const IconComponent = event.icon;
              return (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <IconComponent className="h-4 w-4" />
                      {event.name}
                      <Badge className={categoryColors[event.category]}>
                        {event.category}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Event ID: <code className="text-xs bg-muted px-1 py-0.5 rounded">{event.id}</code>
                      </p>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Available Variables:</p>
                      <div className="flex flex-wrap gap-1">
                        {event.variables.map((variable) => (
                          <code 
                            key={variable} 
                            className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground"
                          >
                            {variable}
                          </code>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmailEventsList;
