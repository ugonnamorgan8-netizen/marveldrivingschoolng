import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { blogPosts as fallbackPosts, getPostBySlug } from "@/data/blogPosts";

type DbPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  image_url: string | null;
  published_at: string;
};

type DisplayPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
  content: string[];
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const fromDb = (p: DbPost): DisplayPost => ({
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  image: p.image_url || fallbackPosts[0].image,
  date: formatDate(p.published_at),
  category: p.category,
  readTime: p.read_time,
  content: p.content.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
});

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<DisplayPost | null | undefined>(undefined);
  const [related, setRelated] = useState<DisplayPost[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("slug, title, excerpt, content, category, read_time, image_url, published_at")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (!active) return;

      if (data) {
        setPost(fromDb(data as DbPost));
        const { data: rel } = await supabase
          .from("blog_posts")
          .select("slug, title, excerpt, content, category, read_time, image_url, published_at")
          .eq("published", true)
          .neq("slug", slug)
          .order("published_at", { ascending: false })
          .limit(2);
        if (active && rel) setRelated(rel.map((r) => fromDb(r as DbPost)));
        return;
      }

      // fallback to local data
      const local = getPostBySlug(slug);
      if (local) {
        setPost({
          slug: local.slug,
          title: local.title,
          excerpt: local.excerpt,
          image: local.image,
          date: local.date,
          category: local.category,
          readTime: local.readTime,
          content: local.content,
        });
        setRelated(
          fallbackPosts
            .filter((p) => p.slug !== slug)
            .slice(0, 2)
            .map((p) => ({
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt,
              image: p.image,
              date: p.date,
              category: p.category,
              readTime: p.readTime,
              content: p.content,
            }))
        );
      } else {
        setPost(null);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (post === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center pt-24">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

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
