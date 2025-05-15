
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
}

const UsersAdmin = () => {
  const { toast } = useToast();

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      // Fetch users from Supabase Auth
      const { data: users, error: usersError } = await supabase.functions.invoke('admin-get-users');
      
      if (usersError) {
        throw new Error(usersError.message);
      }

      return users;
    },
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
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const checkIsAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('has_role', { 
        _user_id: userId,
        _role: 'admin'
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
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
      
      <div className="rounded-md border mt-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
              {users?.map((user: User) => (
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
