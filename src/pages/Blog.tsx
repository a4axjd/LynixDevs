
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Search, Calendar, ArrowRight, User, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

// Define blog post type based on Supabase schema
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
  image_url: string | null;
}

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  // Fetch published blog posts
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ["publicBlogPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });

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

  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("subscribers")
        .insert({ email });

      if (error) {
        if (error.code === "23505") { // Unique violation
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Subscription successful",
          description: "Thank you for subscribing to our newsletter!",
        });
        setEmail("");
      }
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  // Filter posts based on search term
  const filteredPosts = blogPosts?.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const featuredPost = blogPosts && blogPosts.length > 0 ? blogPosts[0] : null;
  const regularPosts = blogPosts && blogPosts.length > 1 ? blogPosts.slice(1) : [];

  // Helper function to format date or return placeholder
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-lynix-dark text-white py-20 md:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-1 mb-6">Our Blog</h1>
            <p className="body-text text-gray-300">
              Insights, tutorials, and industry updates from our team of experts.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Search and Categories */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="w-full md:w-1/3 relative">
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 focus:border-lynix-purple"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-end w-full md:w-auto">
              <Button variant="outline" className="border-gray-300 hover:border-lynix-purple hover:text-lynix-purple">
                All
              </Button>
              <Button variant="outline" className="border-gray-300 hover:border-lynix-purple hover:text-lynix-purple">
                Design
              </Button>
              <Button variant="outline" className="border-gray-300 hover:border-lynix-purple hover:text-lynix-purple">
                Development
              </Button>
              <Button variant="outline" className="border-gray-300 hover:border-lynix-purple hover:text-lynix-purple">
                Business
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center my-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg mb-12">
                  <div className="grid grid-cols-1 lg:grid-cols-5">
                    <div className="lg:col-span-3 p-8 md:p-12">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-lynix-purple/10 text-lynix-purple font-medium text-sm mb-4">
                        Featured
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        <Link to={`/blog/${featuredPost.slug}`} className="hover:text-lynix-purple transition-colors">
                          {featuredPost.title}
                        </Link>
                      </h2>
                      <p className="text-gray-600 mb-6 line-clamp-3 md:line-clamp-4">
                        {featuredPost.excerpt || "No excerpt available"}
                      </p>
                      <div className="flex items-center text-gray-500 text-sm mb-6">
                        <div className="flex items-center mr-4">
                          <Calendar size={16} className="mr-2" />
                          <span>{formatDate(featuredPost.published_at || featuredPost.created_at)}</span>
                        </div>
                        <span>5 min read</span>
                      </div>
                      <Button asChild className="bg-lynix-purple hover:bg-lynix-secondary-purple text-white">
                        <Link to={`/blog/${featuredPost.slug}`}>Read Article</Link>
                      </Button>
                    </div>
                    <div 
                      className="lg:col-span-2 min-h-[300px]" 
                      style={{ 
                        backgroundImage: featuredPost.image_url ? `url(${featuredPost.image_url})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: featuredPost.image_url ? 'transparent' : 'var(--lynix-purple)'
                      }}
                    >
                      {!featuredPost.image_url && (
                        <div className="w-full h-full bg-gradient-to-br from-lynix-purple to-lynix-secondary-purple"></div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Blog Posts Grid */}
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all hover:shadow-xl">
                      <div 
                        className="h-48 flex items-center justify-center"
                        style={{ 
                          backgroundImage: post.image_url ? `url(${post.image_url})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: post.image_url ? 'transparent' : 'var(--lynix-purple)'
                        }}
                      >
                        {!post.image_url && (
                          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">{post.title.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            <span>{formatDate(post.published_at || post.created_at)}</span>
                          </div>
                          <span>5 min read</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-lynix-purple transition-colors">
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt || "No excerpt available"}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <User size={14} className="mr-1" />
                            <span>Admin</span>
                          </div>
                          <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-lynix-purple font-medium hover:underline">
                            Read More <ArrowRight size={16} className="ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No blog posts found matching your search criteria.</p>
                </div>
              )}
            </>
          )}

          {/* Pagination - only show if we have more than 6 posts */}
          {filteredPosts.length > 6 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <Button variant="outline" className="border-gray-300 hover:border-lynix-purple hover:text-lynix-purple">
                  1
                </Button>
                <Button variant="outline" className="border-gray-300 hover:border-lynix-purple hover:text-lynix-purple">
                  2
                </Button>
                <Button variant="outline" className="border-gray-300 hover:border-lynix-purple hover:text-lynix-purple">
                  3
                </Button>
                <Button variant="outline" className="border-gray-300 hover:border-lynix-purple hover:text-lynix-purple">
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-lynix-dark py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-300 mb-8">
              Stay updated with our latest insights, articles, and industry news.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Your email address" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-transparent text-white placeholder:text-gray-400 focus:border-lynix-purple"
              />
              <Button type="submit" className="bg-lynix-purple hover:bg-lynix-secondary-purple text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
