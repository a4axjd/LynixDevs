
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Search, Calendar, ArrowRight, User } from "lucide-react";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "10 Web Design Trends to Watch in 2023",
      excerpt: "Stay ahead of the curve with these emerging web design trends that are shaping the digital landscape in 2023.",
      date: "May 15, 2023",
      author: "Alex Johnson",
      category: "Design",
      readTime: "5 min read",
      color: "bg-lynix-purple/10",
    },
    {
      id: 2,
      title: "The Ultimate Guide to Performance Optimization",
      excerpt: "Learn how to improve your website's loading speed and overall performance with these proven techniques.",
      date: "April 28, 2023",
      author: "Sarah Williams",
      category: "Development",
      readTime: "8 min read",
      color: "bg-blue-500/10",
    },
    {
      id: 3,
      title: "Mobile-First Design: Why It Matters",
      excerpt: "Discover why designing for mobile first is essential in today's digital environment and how to implement it effectively.",
      date: "April 10, 2023",
      author: "Michael Chen",
      category: "Mobile",
      readTime: "6 min read",
      color: "bg-green-500/10",
    },
    {
      id: 4,
      title: "The Rise of Headless CMS Solutions",
      excerpt: "Explore how headless CMS platforms are changing content management and enabling more flexible development workflows.",
      date: "March 22, 2023",
      author: "Emily Rodriguez",
      category: "CMS",
      readTime: "7 min read",
      color: "bg-orange-500/10",
    },
    {
      id: 5,
      title: "Accessibility in Web Design: A Complete Guide",
      excerpt: "Learn how to make your websites accessible to all users, including those with disabilities, and why it's important.",
      date: "March 5, 2023",
      author: "David Thompson",
      category: "Accessibility",
      readTime: "10 min read",
      color: "bg-red-500/10",
    },
    {
      id: 6,
      title: "The Future of E-commerce: Trends and Predictions",
      excerpt: "Discover the emerging technologies and trends that will shape the future of online shopping and e-commerce platforms.",
      date: "February 18, 2023",
      author: "Jennifer Lee",
      category: "E-commerce",
      readTime: "9 min read",
      color: "bg-purple-500/10",
    }
  ];

  // Filter posts based on search term
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

          {/* Featured Post */}
          <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-3 p-8 md:p-12">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-lynix-purple/10 text-lynix-purple font-medium text-sm mb-4">
                  Featured
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  <Link to="/blog/featured" className="hover:text-lynix-purple transition-colors">
                    Building Scalable Web Applications with Modern Architecture
                  </Link>
                </h2>
                <p className="text-gray-600 mb-6 line-clamp-3 md:line-clamp-4">
                  Explore the best practices for creating web applications that can scale with your business needs. 
                  Learn about microservices, serverless architecture, and how to choose the right tech stack for your project.
                </p>
                <div className="flex items-center text-gray-500 text-sm mb-6">
                  <div className="flex items-center mr-4">
                    <User size={16} className="mr-2" />
                    <span>John Morrison</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <Calendar size={16} className="mr-2" />
                    <span>June 2, 2023</span>
                  </div>
                  <span>12 min read</span>
                </div>
                <Button asChild className="bg-lynix-purple hover:bg-lynix-secondary-purple text-white">
                  <Link to="/blog/featured">Read Article</Link>
                </Button>
              </div>
              <div className="lg:col-span-2 bg-gradient-to-br from-lynix-purple to-lynix-secondary-purple min-h-[300px]"></div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all hover:shadow-xl">
                <div className={`h-48 ${post.color} flex items-center justify-center`}>
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-2xl font-bold text-lynix-purple">{post.id}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>{post.date}</span>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-lynix-purple transition-colors">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User size={14} className="mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <Link to={`/blog/${post.id}`} className="inline-flex items-center text-lynix-purple font-medium hover:underline">
                      Read More <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
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
            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Your email address" 
                className="bg-white/10 border-transparent text-white placeholder:text-gray-400 focus:border-lynix-purple"
              />
              <Button className="bg-lynix-purple hover:bg-lynix-secondary-purple text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
