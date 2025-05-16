
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
}

interface UserRole {
  role: string;
}

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
  profile?: Profile;
  roles?: UserRole[];
  isAdmin?: boolean;
}

const UsersAdmin = () => {
  const { toast } = useToast();
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [serviceRoleKeyError, setServiceRoleKeyError] = useState<boolean>(false);

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      try {
        console.log("Fetching users from edge function");
        // Fetch users from Supabase Auth
        const { data: users, error: usersError } = await supabase.functions.invoke('admin-get-users');
        
        if (usersError) {
          console.error("Edge function error:", usersError);
          
          // Check for service role key issues in the error message
          if (usersError.message?.includes("service role key") || 
              usersError.message?.includes("SUPABASE_SERVICE_ROLE_KEY")) {
            setServiceRoleKeyError(true);
            setErrorDetails(`The SUPABASE_SERVICE_ROLE_KEY is not properly configured. Please check the Supabase edge function secrets.`);
          }
          
          throw new Error(usersError.message);
        }

        if (!users) {
          throw new Error("No users data returned");
        }

        setServiceRoleKeyError(false);
        setErrorDetails(null);
        return users as User[];
      } catch (err: any) {
        console.error("Error fetching users:", err);
        
        // Check for service role key issues in the error message
        if (err.message?.includes("Edge") || err.message?.includes("service role key")) {
          setServiceRoleKeyError(true);
          setErrorDetails(`Edge function error - please verify that the SUPABASE_SERVICE_ROLE_KEY is correctly set in the Supabase dashboard under Settings > API > Project API keys.`);
        } else if (err.message?.includes("Auth")) {
          setErrorDetails(`Authentication error - please make sure you're logged in as an admin user.`);
        }
        
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
      
      {serviceRoleKeyError && (
        <Alert variant="destructive" className="my-4">
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>
            <p className="mb-2">The SUPABASE_SERVICE_ROLE_KEY is not configured correctly.</p>
            <p className="mb-2">To fix this issue:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Go to the Supabase dashboard</li>
              <li>Navigate to Settings &gt; API</li>
              <li>Copy the "service_role key" (not the anon key)</li>
              <li>Go to Settings &gt; Edge Functions</li>
              <li>Add or update the SUPABASE_SERVICE_ROLE_KEY secret with the copied value</li>
            </ol>
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
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.user_metadata?.avatar_url || user.profile?.avatar_url || ''} />
                        <AvatarFallback>
                          {(user.user_metadata?.full_name || user.profile?.full_name || user.email || "User")
                            .split(" ")
                            .map(name => name[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {user.user_metadata?.full_name || user.profile?.full_name || "Unnamed User"}
                        </p>
                        {user.profile?.username && (
                          <p className="text-xs text-muted-foreground">@{user.profile.username}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
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
                  <TableCell>
                    {user.last_sign_in_at ? format(new Date(user.last_sign_in_at), 'MMM d, yyyy') : "Never"}
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
