
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Download, File, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface ProjectFile {
  id: string;
  client_project_id: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  description: string | null;
  is_public_to_client: boolean;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string | null;
  } | null;
}

const fileFormSchema = z.object({
  description: z.string().optional(),
  is_public_to_client: z.boolean().default(true),
});

type FileFormValues = z.infer<typeof fileFormSchema>;

interface ClientProjectFilesProps {
  clientProjectId: string;
}

const ClientProjectFiles = ({ clientProjectId }: ClientProjectFilesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const form = useForm<FileFormValues>({
    resolver: zodResolver(fileFormSchema),
    defaultValues: {
      description: "",
      is_public_to_client: true,
    },
  });

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin',
      });
      
      if (!error) {
        setIsAdmin(!!data);
      }
    };
    
    checkAdminStatus();
  }, [user?.id]);

  // Fetch project files
  const { data: files, isLoading, error, refetch } = useQuery({
    queryKey: ["projectFiles", clientProjectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_files")
        .select(`
          *,
          profiles:uploaded_by (
            full_name
          )
        `)
        .eq("client_project_id", clientProjectId)
        .eq("is_public_to_client", true)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Error fetching project files: ${error.message}`);
      }

      return data as ProjectFile[];
    },
  });

  // Set up real-time subscription for files
  useEffect(() => {
    const channel = supabase
      .channel('project-files-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_files',
          filter: `client_project_id=eq.${clientProjectId}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientProjectId, refetch]);

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const onSubmit = async (values: FileFormValues) => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload file to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${clientProjectId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(fileName);

      // Save file record to database
      const { error: dbError } = await supabase
        .from("project_files")
        .insert({
          client_project_id: clientProjectId,
          file_name: selectedFile.name,
          file_url: publicUrl,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
          description: values.description || null,
          is_public_to_client: values.is_public_to_client,
          uploaded_by: user?.id,
        });

      if (dbError) throw dbError;

      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully.",
      });

      form.reset();
      setSelectedFile(null);
      setIsUploadDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to upload file: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (file: ProjectFile) => {
    try {
      const response = await fetch(file.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (file: ProjectFile) => {
    if (!isAdmin) return;

    try {
      // Delete from storage
      const filePath = file.file_url.split('/').pop();
      if (filePath) {
        await supabase.storage
          .from('project-files')
          .remove([`${clientProjectId}/${filePath}`]);
      }

      // Delete from database
      const { error } = await supabase
        .from("project_files")
        .delete()
        .eq("id", file.id);

      if (error) throw error;

      toast({
        title: "File deleted",
        description: "The file has been deleted successfully.",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete file: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown size";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading files: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Project Files</h3>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Project File</DialogTitle>
              <DialogDescription>
                Upload a file to share with the project team.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select File
                  </label>
                  <Input
                    type="file"
                    onChange={onFileSelect}
                    className="cursor-pointer"
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="File description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!selectedFile || isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : files && files.length > 0 ? (
        <div className="space-y-3">
          {files.map((file) => (
            <Card key={file.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <File className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">{file.file_name}</CardTitle>
                      <CardDescription>
                        {formatFileSize(file.file_size)} • Uploaded by {file.profiles?.full_name || "Unknown"} • {format(new Date(file.created_at), "MMM d, yyyy")}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(file)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              {file.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{file.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <File className="h-8 w-8 mx-auto mb-2" />
          <p>No files uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default ClientProjectFiles;
