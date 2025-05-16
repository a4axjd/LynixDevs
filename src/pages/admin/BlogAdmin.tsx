
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Loader2, Edit, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the Blog Post type based on the Supabase schema
interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  slug: string;
  published: boolean | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_id: string | null;
}

// Form schema for blog post validation
const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  published: z.boolean().default(false),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

const BlogAdmin = () => {
  const { toast } = useToast();
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      published: false,
    },
  });

  // Fetch blog posts
  const { data: blogPosts, isLoading, error, refetch } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Error fetching blog posts: ${error.message}`);
      }

      return data as BlogPost[];
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading blog posts",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Reset the form when opening create new blog
  const handleCreateBlog = () => {
    form.reset({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      published: false,
    });
    setSelectedBlog(null);
    setIsFormOpen(true);
  };

  // Set form values when editing an existing blog
  const handleEditBlog = (blog: BlogPost) => {
    form.reset({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || "",
      content: blog.content,
      published: blog.published || false,
    });
    setSelectedBlog(blog);
    setIsFormOpen(true);
  };

  // Close form sheet
  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  // Submit form handler
  const onSubmit = async (values: BlogFormValues) => {
    try {
      if (selectedBlog) {
        // Update existing blog
        const { data, error } = await supabase
          .from("blog_posts")
          .update({
            title: values.title,
            slug: values.slug,
            excerpt: values.excerpt || null,
            content: values.content,
            published: values.published,
            published_at: values.published ? selectedBlog.published_at || new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedBlog.id)
          .select();

        if (error) throw error;

        toast({
          title: "Blog post updated",
          description: "The blog post was successfully updated.",
        });
      } else {
        // Create new blog
        const { data, error } = await supabase
          .from("blog_posts")
          .insert({
            title: values.title,
            slug: values.slug,
            excerpt: values.excerpt || null,
            content: values.content,
            published: values.published,
            published_at: values.published ? new Date().toISOString() : null,
          })
          .select();

        if (error) throw error;

        toast({
          title: "Blog post created",
          description: "The blog post was successfully created.",
        });
      }

      // Close form and refetch data
      setIsFormOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${selectedBlog ? "update" : "create"} blog post: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  // Delete blog handler
  const handleDeleteBlog = async (id: string) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Blog post deleted",
        description: "The blog post was successfully deleted.",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete blog post: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-6">
      <AdminPageHeader
        title="Blog Management"
        description="Manage your blog posts"
        actionLabel="Create Blog Post"
        actionHref="#"
        // We use a button instead of a link because we want to open the form sheet
        actionButton={
          <Button onClick={handleCreateBlog}>
            <Plus className="mr-2 h-4 w-4" />
            Create Blog Post
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts && blogPosts.length > 0 ? (
                blogPosts.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell>{blog.slug}</TableCell>
                    <TableCell>
                      {blog.published ? (
                        <Badge variant="success">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(blog.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBlog(blog)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No blog posts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Blog post form in a sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {selectedBlog ? "Edit Blog Post" : "Create Blog Post"}
            </SheetTitle>
            <SheetDescription>
              {selectedBlog
                ? "Update the details of your blog post"
                : "Add a new blog post to your website"}
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Blog post title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="my-blog-post" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL-friendly version of the title. Use lowercase letters,
                        numbers, and hyphens only.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief summary of the blog post"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A short summary that appears in blog listings.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Blog post content"
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Published</FormLabel>
                        <FormDescription>
                          When checked, the blog post will be visible on your
                          website.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseForm}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BlogAdmin;
