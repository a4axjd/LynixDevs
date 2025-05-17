
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserPlus, Shield, ShieldAlert, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
  created_at: string;
}

interface User {
  id: string;
  email?: string;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
  created_at: string;
  last_sign_in_at?: string | null;
  isAdmin?: boolean;
}

const UsersAdmin = () => {
  const { toast } = useToast();
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      try {
        console.log("Fetching profiles from database");
        
        // Fetch profiles from the database
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) {
          console.error("Profiles error:", profilesError);
          throw new Error(`Error fetching profiles: ${profilesError.message}`);
        }
        
        if (!profiles) {
          throw new Error("No profiles data returned");
        }

        // For each profile, check if they are an admin
        const usersWithRoles = await Promise.all(profiles.map(async (profile) => {
          const { data: isAdmin, error: roleError } = await supabase.rpc(
            "has_role",
            {
              _user_id: profile.id,
              _role: "admin",
            }
          );
          
          // Get user email if needed (additional query)
          // This is simplified and might not work depending on your Supabase setup
          // Email typically isn't directly accessible from public schemas
          
          return {
            id: profile.id,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            username: profile.username,
            created_at: profile.created_at,
            isAdmin: !!isAdmin,
          };
        }));
        
        return usersWithRoles as User[];
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setErrorDetails(`Error: ${err.message}`);
        throw err;
      }
    },
    retry: 1,
  });

  const makeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('make_user_admin', { _user_id: userId });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "User has been made an admin",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading users",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="container py-8">
      <AdminPageHeader 
        title="Users Management" 
        description="View and manage user accounts" 
        actionLabel="Invite User"
        actionHref="/admin/users/invite"
      />
      
      {errorDetails && (
        <Alert variant="destructive" className="my-4">
          <AlertTitle>Error loading users</AlertTitle>
          <AlertDescription>
            <p className="mb-2">{errorDetails}</p>
            <p className="mb-2">We're fetching users from the profiles table instead of directly from auth.</p>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="rounded-md border mt-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-64 text-center px-4">
            <div className="text-destructive font-medium mb-2">Failed to load users</div>
            <p className="text-muted-foreground mb-4">{(error as Error).message}</p>
            {errorDetails && (
              <div className="bg-muted p-4 rounded-md text-sm mb-4 max-w-md">
                <p>{errorDetails}</p>
              </div>
            )}
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar_url || ''} />
                        <AvatarFallback>
                          {(user.full_name || "User")
                            .split(" ")
                            .map(name => name[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {user.full_name || "Unnamed User"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.username || "-"}</TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        <Shield className="mr-1 h-3 w-3" />
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline">User</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.created_at && format(new Date(user.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {!user.isAdmin && (
                          <DropdownMenuItem onClick={() => makeAdmin(user.id)}>
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            Make Admin
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default UsersAdmin;
