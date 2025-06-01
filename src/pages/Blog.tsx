
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import SEOHead from "@/components/SEOHead";

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

const Blog = () => {
  const { toast } = useToast();

  // Fetch published blog posts from backend server
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["publishedBlogPosts"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'}/api/blog/published`);
      
      if (!response.ok) {
        console.error("Error fetching blog posts:", response.statusText);
        return [];
      }

      const data = await response.json();
      return data as BlogPost[];
    },
    retry: 1,
  });

  if (error) {
    console.error("Blog query error:", error);
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <div className="pt-20">
      <SEOHead
        title="Blog | LynixDevs - Latest Articles & Insights"
        description="Read our latest articles about web development, design trends, and technology insights. Stay updated with industry best practices."
        url={`${window.location.origin}/blog`}
      />

      {/* Hero Section */}
      <section className="bg-lynix-dark text-white py-20 md:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-1 mb-6">Our Blog</h1>
            <p className="body-text text-gray-300">
              Stay updated with the latest insights, trends, and best practices in web development and design.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="section-padding">
        <div className="container-custom">
          {isLoading ? (
            <div className="flex justify-center my-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article 
                  key={post.id} 
                  className="group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
                >
                  <div className="relative h-64 overflow-hidden">
                    {post.image_url ? (
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-lynix-purple to-lynix-secondary-purple flex items-center justify-center">
                        <h3 className="text-white text-xl font-bold text-center px-4">
                          {post.title}
                        </h3>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar size={14} className="mr-2" />
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                      <User size={14} className="ml-4 mr-2" />
                      <span>Admin</span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-3 group-hover:text-lynix-purple transition-colors">
                      {post.title}
                    </h2>
                    
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-lynix-purple font-medium hover:underline"
                    >
                      Read More <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blog posts available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 mb-6">Stay Updated</h2>
            <p className="body-text text-gray-600 mb-8">
              Subscribe to our newsletter to get the latest articles delivered to your inbox.
            </p>
            <Button asChild className="bg-lynix-purple hover:bg-lynix-secondary-purple text-white px-8">
              <Link to="/contact">Subscribe</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
