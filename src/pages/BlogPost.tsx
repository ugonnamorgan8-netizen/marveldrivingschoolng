import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { blogPosts, getPostBySlug } from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/#blog">Back to blog</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-24 md:pt-28">
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Link
            to="/#blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            <span className="inline-block px-2.5 py-1 rounded-full bg-accent text-accent-foreground font-medium">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-10 shadow-lg">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            {post.content.map((para, i) => (
              <p
                key={i}
                className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5"
              >
                {para}
              </p>
            ))}
          </div>

          <div className="mt-12 p-6 md:p-8 rounded-2xl bg-muted/40 border border-border text-center">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Ready to start driving?
            </h3>
            <p className="text-muted-foreground mb-5">
              Join Marvel Driving School and learn from FRSC-approved instructors in Umuahia.
            </p>
            <Button size="lg" asChild>
              <Link to="/#contact">Book your training</Link>
            </Button>
          </div>
        </article>

        {related.length > 0 && (
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl mt-20 mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Keep reading
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {p.category}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mt-1 group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default BlogPost;