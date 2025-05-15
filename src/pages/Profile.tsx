
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Mock save profile function
  const handleSaveProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      setIsLoading(false);
    }, 1000);
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user?.user_metadata?.full_name) {
      return user?.email?.substring(0, 2).toUpperCase() || "U";
    }
    
    const nameParts = user.user_metadata.full_name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div className="container max-w-3xl py-12">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <div className="space-y-8">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
          <Avatar className="h-24 w-24">
            <AvatarImage 
              src={user?.user_metadata?.avatar_url || ""} 
              alt={user?.user_metadata?.full_name || user?.email || "User"} 
            />
            <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </h2>
            <p className="text-muted-foreground">{user?.email}</p>
            <Button variant="outline" size="sm" disabled>
              Change Avatar
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                defaultValue={user?.user_metadata?.full_name?.split(' ')[0] || ''} 
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                defaultValue={user?.user_metadata?.full_name?.split(' ')[1] || ''} 
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ''} disabled />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed directly. Contact support if you need to update your email.
            </p>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="e.g. +1 (555) 123-4567" />
          </div>

          <div>
            <Label htmlFor="company">Company (Optional)</Label>
            <Input id="company" placeholder="Company name" />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              placeholder="Tell us a bit about yourself" 
              className="min-h-32" 
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleSaveProfile} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2"></div>
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </div>
      </div>

      <p className="text-center text-muted-foreground mt-12">
        This is a placeholder profile page. Full implementation coming soon.
      </p>
    </div>
  );
};

export default Profile;
