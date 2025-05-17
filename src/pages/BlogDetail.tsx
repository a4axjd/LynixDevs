
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  slug: string;
  image_url: string | null;
  published: boolean | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_id: string | null;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  // Fetch the specific blog post by slug
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blogPost", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) {
        throw new Error(`Error fetching blog post: ${error.message}`);
      }

      return data as BlogPost;
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading blog post",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Helper function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <div className="pt-20">
      {isLoading ? (
        <div className="flex justify-center my-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : post ? (
        <>
          {/* Hero Section */}
          <section className="relative">
            {post.image_url ? (
              <div className="h-[40vh] md:h-[60vh] w-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${post.image_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center' 
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
                </div>
              </div>
            ) : (
              <div className="h-[30vh] bg-lynix-dark"></div>
            )}

            <div className="container-custom absolute inset-0 flex items-center">
              <div className="max-w-3xl text-white z-10">
                <h1 className="heading-1 mb-4">{post.title}</h1>
                <div className="flex items-center gap-4 text-gray-200">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span>{formatDate(post.published_at || post.created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <User size={16} className="mr-2" />
                    <span>Admin</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Blog Content */}
          <section className="section-padding">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto">
                <Button variant="ghost" asChild className="mb-8">
                  <Link to="/blog" className="flex items-center">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Blog
                  </Link>
                </Button>

                {post.excerpt && (
                  <div className="text-xl text-gray-700 mb-8 font-medium border-l-4 border-lynix-purple pl-4 italic">
                    {post.excerpt}
                  </div>
                )}

                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="container-custom py-20">
          <div className="text-center">
            <h2 className="heading-2 mb-4">Blog Post Not Found</h2>
            <p className="mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/blog">Return to Blog</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
