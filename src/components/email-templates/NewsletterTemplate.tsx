
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ExternalLink, Folder } from "lucide-react";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  published_at?: string;
  image_url?: string;
  slug: string;
}

interface Project {
  id: string;
  title: string;
  description?: string;
  client?: string;
  status: string;
  image_url?: string;
}

interface NewsletterTemplateProps {
  subject: string;
  content: string;
  blogPosts?: BlogPost[];
  projects?: Project[];
  unsubscribeUrl?: string;
  companyName?: string;
}

const NewsletterTemplate = ({ 
  subject, 
  content, 
  blogPosts = [], 
  projects = [],
  unsubscribeUrl,
  companyName = "LynixDevs"
}: NewsletterTemplateProps) => {
  return (
    <div className="max-w-2xl mx-auto bg-white text-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{subject}</h1>
        <p className="text-blue-100">Updates from {companyName}</p>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div 
          className="prose prose-gray max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Featured Blog Posts */}
        {blogPosts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <User className="h-6 w-6" />
              Latest Blog Posts
            </h2>
            <div className="space-y-6">
              {blogPosts.map((post) => (
                <Card key={post.id} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {post.image_url && (
                        <img 
                          src={post.image_url} 
                          alt={post.title}
                          className="w-full sm:w-32 h-32 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          <a 
                            href={`https://lynixdevs.us/blog/${post.slug}`}
                            className="text-blue-600 hover:text-blue-800 no-underline"
                          >
                            {post.title}
                          </a>
                        </CardTitle>
                        {post.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                        {post.published_at && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(post.published_at), 'MMM dd, yyyy')}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <a 
                      href={`https://lynixdevs.us/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium no-underline"
                    >
                      Read More <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Featured Projects */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Folder className="h-6 w-6" />
              Recent Projects
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <Card key={project.id} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    {project.image_url && (
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                    )}
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant={project.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {project.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {project.client && (
                        <span className="text-sm text-gray-500">for {project.client}</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {project.description && (
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {project.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-8 text-center text-sm text-gray-600">
        <p className="mb-4">
          Thank you for subscribing to our newsletter!
        </p>
        <div className="space-y-2">
          <p>
            <a href="https://lynixdevs.us" className="text-blue-600 hover:text-blue-800 no-underline">
              Visit our website
            </a>
          </p>
          {unsubscribeUrl && (
            <p>
              <a href={unsubscribeUrl} className="text-gray-500 hover:text-gray-700 no-underline">
                Unsubscribe from this newsletter
              </a>
            </p>
          )}
        </div>
        <p className="mt-4 text-xs">
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default NewsletterTemplate;
