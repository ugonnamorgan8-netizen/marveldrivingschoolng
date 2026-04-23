import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => {
  return (
    <section id="blog" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            From the Blog
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Driving tips & insights
          </h2>
          <p className="text-lg text-muted-foreground">
            Practical advice, FRSC updates, and stories from the Marvel Driving School community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card
              key={post.slug}
              className="overflow-hidden border-border/60 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-accent text-accent-foreground font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                >
                  Read more <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <a href="#contact">Get in touch for more tips</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;