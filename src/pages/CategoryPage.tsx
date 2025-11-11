import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PromptCard } from "@/components/PromptCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "writing": "Discover prompts for creative writing, content creation, copywriting, and storytelling.",
  "code": "Explore coding prompts, algorithm challenges, debugging helpers, and development tips.",
  "business": "Find prompts for productivity, business strategy, management, and professional growth.",
  "education": "Browse educational prompts, learning resources, study guides, and teaching aids.",
  "creative": "Unleash creativity with design prompts, artistic inspiration, and creative challenges.",
  "data": "Access data analysis prompts, visualization ideas, and analytical problem-solving.",
  "personal": "Personal development, lifestyle improvement, and self-growth prompts.",
  "other": "Explore miscellaneous prompts that don't fit traditional categories."
};

const CATEGORY_NAMES: Record<string, string> = {
  "writing": "Writing & Content",
  "code": "Code & Development",
  "business": "Business & Productivity",
  "education": "Education & Learning",
  "creative": "Creative & Design",
  "data": "Data & Analysis",
  "personal": "Personal & Lifestyle",
  "other": "Other"
};

export default function CategoryPage() {
  const { category } = useParams();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryKey = category || "writing";
  const categoryName = CATEGORY_NAMES[categoryKey] || "Category";
  const categoryDescription = CATEGORY_DESCRIPTIONS[categoryKey] || "";

  useEffect(() => {
    fetchCategoryPrompts();
  }, [category]);

  const fetchCategoryPrompts = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("prompts")
        .select(`
          *,
          profiles:user_id (username)
        `)
        .eq("category", categoryName)
        .order("created_at", { ascending: false });

      setPrompts(data || []);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link to="/">
            <Button variant="ghost" className="mb-6 gap-2 hover-lift">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="space-y-4 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              {categoryName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              {categoryDescription}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></span>
                {prompts.length} prompts available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Prompts Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : prompts.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <p className="text-muted-foreground text-lg mb-4">No prompts found in this category yet.</p>
              <Link to="/upload">
                <Button className="hover-lift hover-glow">
                  Be the first to contribute!
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {prompts.map((prompt, index) => (
                <div 
                  key={prompt.id} 
                  className="animate-fade-in-up" 
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PromptCard 
                    id={prompt.id}
                    title={prompt.title}
                    content={prompt.content}
                    category={prompt.category}
                    username={prompt.profiles?.username || 'Anonymous'}
                    starCount={prompt.star_count}
                    copyCount={prompt.copy_count}
                    createdAt={prompt.created_at}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
