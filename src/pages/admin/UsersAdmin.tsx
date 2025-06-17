import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Loader2, Shield, ShieldAlert, MoreHorizontal } from "lucide-react";
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

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      try {
        console.log("Fetching users from server");

        const response = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL || "http://localhost:3001"
          }/api/users`
        );

        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }

        const data = await response.json();
        // Always return an array, even if the response is not
        if (Array.isArray(data)) {
          return data as User[];
        } else if (Array.isArray(data.users)) {
          return data.users as User[];
        } else {
          // Console log to help debug
          console.warn(
            "Users API did not return array or array in 'users'. Response was:",
            data
          );
          return [];
        }
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
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL || "http://localhost:3001"
        }/api/users/${userId}/make-admin`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to make user admin");
      }

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

  // Helper function to check if a value is a valid date
  const isValidDate = (date: any) => {
    if (!date) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  };

  // Debug: log users data to help diagnose missing fields
  if (Array.isArray(users)) {
    console.log("Users data:", users);
  }

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
            <p className="mb-2">
              We're fetching users from the server instead of directly from
              Supabase.
            </p>
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
            <div className="text-destructive font-medium mb-2">
              Failed to load users
            </div>
            <p className="text-muted-foreground mb-4">
              {(error as Error).message}
            </p>
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
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url || ""} />
                          <AvatarFallback>
                            {(user.full_name || user.email || "User")
                              .split(" ")
                              .map((name) => name[0])
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
                    <TableCell>{user.email ?? "-"}</TableCell>
                    <TableCell>{user.username ?? "-"}</TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary"
                        >
                          <Shield className="mr-1 h-3 w-3" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline">User</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.created_at && isValidDate(user.created_at)
                        ? format(new Date(user.created_at), "MMM d, yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
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
                            <DropdownMenuItem
                              onClick={() => makeAdmin(user.id)}
                            >
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default UsersAdmin;
