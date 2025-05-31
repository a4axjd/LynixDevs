
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import NewsletterTemplate from "@/components/email-templates/NewsletterTemplate";

interface NewsletterComposerProps {
  onSent?: () => void;
}

const NewsletterComposer = ({ onSent }: NewsletterComposerProps) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedBlogPosts, setSelectedBlogPosts] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const { toast } = useToast();

  // Fetch blog posts
  const { data: blogPosts = [] } = useQuery({
    queryKey: ["blog-posts-for-newsletter"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, excerpt, published_at, image_url, slug")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch projects
  const { data: projects = [] } = useQuery({
    queryKey: ["projects-for-newsletter"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, description, client, status, image_url")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const handleSendNewsletter = async () => {
    if (!subject.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Subject and content are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get selected blog posts and projects
      const selectedBlogPostsData = blogPosts.filter(post => 
        selectedBlogPosts.includes(post.id)
      );
      const selectedProjectsData = projects.filter(project => 
        selectedProjects.includes(project.id)
      );

      // Create newsletter record
      const { data: newsletter, error: newsletterError } = await supabase
        .from("newsletters")
        .insert({
          subject,
          content,
        })
        .select()
        .single();

      if (newsletterError) throw newsletterError;

      // Send to server endpoint
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'}/api/newsletter/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          html: generateNewsletterHtml(selectedBlogPostsData, selectedProjectsData),
          newsletter_id: newsletter.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Newsletter Sent!",
          description: `Successfully sent to ${result.sentCount} subscribers`,
        });
        
        // Reset form
        setSubject("");
        setContent("");
        setSelectedBlogPosts([]);
        setSelectedProjects([]);
        
        onSent?.();
      } else {
        throw new Error(result.error || "Failed to send newsletter");
      }
    } catch (error) {
      console.error("Error sending newsletter:", error);
      toast({
        title: "Error",
        description: "Failed to send newsletter",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewsletterHtml = (selectedBlogPostsData: any[], selectedProjectsData: any[]) => {
    // In a real implementation, you'd render the React component to HTML
    // For now, we'll create a simple HTML template
    const unsubscribeUrl = "https://lynixdevs.us/unsubscribe";
    
    let html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); color: white; padding: 32px; text-align: center;">
              <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: bold;">${subject}</h1>
              <p style="margin: 0; color: #dbeafe;">Updates from LynixDevs</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px;">
              <div style="margin-bottom: 32px;">
                ${content.replace(/\n/g, '<br>')}
              </div>
    `;

    // Add blog posts if selected
    if (selectedBlogPostsData.length > 0) {
      html += `
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 24px; color: #111827;">Latest Blog Posts</h2>
      `;
      
      selectedBlogPostsData.forEach(post => {
        html += `
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;">` : ''}
            <h3 style="margin: 0 0 8px 0; font-size: 18px;">
              <a href="https://lynixdevs.us/blog/${post.slug}" style="color: #2563eb; text-decoration: none;">${post.title}</a>
            </h3>
            ${post.excerpt ? `<p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">${post.excerpt}</p>` : ''}
            <a href="https://lynixdevs.us/blog/${post.slug}" style="color: #2563eb; text-decoration: none; font-size: 14px; font-weight: 500;">Read More →</a>
          </div>
        `;
      });
      
      html += `</div>`;
    }

    // Add projects if selected
    if (selectedProjectsData.length > 0) {
      html += `
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 24px; color: #111827;">Recent Projects</h2>
          <div style="display: grid; gap: 16px;">
      `;
      
      selectedProjectsData.forEach(project => {
        html += `
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
            ${project.image_url ? `<img src="${project.image_url}" alt="${project.title}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;">` : ''}
            <h3 style="margin: 0 0 8px 0; font-size: 18px;">${project.title}</h3>
            <div style="margin-bottom: 8px;">
              <span style="background-color: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: uppercase;">${project.status.replace('_', ' ')}</span>
              ${project.client ? `<span style="color: #6b7280; font-size: 14px; margin-left: 8px;">for ${project.client}</span>` : ''}
            </div>
            ${project.description ? `<p style="margin: 0; color: #6b7280; font-size: 14px;">${project.description}</p>` : ''}
          </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    }

    // Footer
    html += `
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 32px; text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0 0 16px 0;">Thank you for subscribing to our newsletter!</p>
              <p style="margin: 0 0 8px 0;">
                <a href="https://lynixdevs.us" style="color: #2563eb; text-decoration: none;">Visit our website</a>
              </p>
              <p style="margin: 0 0 16px 0;">
                <a href="${unsubscribeUrl}" style="color: #6b7280; text-decoration: none;">Unsubscribe from this newsletter</a>
              </p>
              <p style="margin: 0; font-size: 12px;">© ${new Date().getFullYear()} LynixDevs. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return html;
  };

  const getSelectedBlogPostsData = () => {
    return blogPosts.filter(post => selectedBlogPosts.includes(post.id));
  };

  const getSelectedProjectsData = () => {
    return projects.filter(project => selectedProjects.includes(project.id));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Newsletter Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Newsletter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Newsletter content..."
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Blog Posts Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Include Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {blogPosts.map((post) => (
                  <div key={post.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={`blog-${post.id}`}
                      checked={selectedBlogPosts.includes(post.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBlogPosts([...selectedBlogPosts, post.id]);
                        } else {
                          setSelectedBlogPosts(selectedBlogPosts.filter(id => id !== post.id));
                        }
                      }}
                    />
                    <Label htmlFor={`blog-${post.id}`} className="text-sm flex-1 cursor-pointer">
                      {post.title}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Projects Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Include Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={`project-${project.id}`}
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProjects([...selectedProjects, project.id]);
                        } else {
                          setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                        }
                      }}
                    />
                    <Label htmlFor={`project-${project.id}`} className="text-sm flex-1 cursor-pointer">
                      {project.title}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => setShowPreview(!showPreview)}
          variant="outline"
          disabled={!subject.trim() || !content.trim()}
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
        
        <Button
          onClick={handleSendNewsletter}
          disabled={isLoading || !subject.trim() || !content.trim()}
        >
          {isLoading ? "Sending..." : "Send Newsletter"}
        </Button>
      </div>

      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Newsletter Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-gray-50">
              <NewsletterTemplate
                subject={subject}
                content={content}
                blogPosts={getSelectedBlogPostsData()}
                projects={getSelectedProjectsData()}
                unsubscribeUrl="https://lynixdevs.us/unsubscribe"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewsletterComposer;
