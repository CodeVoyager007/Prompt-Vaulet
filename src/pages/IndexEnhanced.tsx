import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PromptCard } from "@/components/PromptCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, TrendingUp, Clock, Upload, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const CATEGORY_LIST = [
  "All",
  "Writing & Content",
  "Code & Development",
  "Business & Productivity",
  "Education & Learning",
  "Creative & Design",
  "Data & Analysis",
  "Personal & Lifestyle",
  "Other"
];

const IndexEnhanced = () => {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [featuredPrompts, setFeaturedPrompts] = useState<any[]>([]);
  const [trendingPrompts, setTrendingPrompts] = useState<any[]>([]);
  const [recentPrompts, setRecentPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category");
  const sectionParam = searchParams.get("section");
  const { user } = useAuth();

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    fetchAllPrompts();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (sectionParam) {
      scrollToSection(sectionParam);
    }
  }, [sectionParam]);

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchAllPrompts = async () => {
    setLoading(true);
    try {
      // Fetch featured prompts (most starred overall)
      const { data: featured } = await supabase
        .from("prompts")
        .select(`
          *,
          profiles:user_id (username)
        `)
        .order("star_count", { ascending: false })
        .limit(30);

      // Fetch trending prompts (most starred in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data: trending } = await supabase
        .from("prompts")
        .select(`
          *,
          profiles:user_id (username)
        `)
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("star_count", { ascending: false })
        .limit(30);

      // Fetch recent prompts
      const { data: recent } = await supabase
        .from("prompts")
        .select(`
          *,
          profiles:user_id (username)
        `)
        .order("created_at", { ascending: false })
        .limit(30);

      // Fetch main prompts with filters
      let query = supabase
        .from("prompts")
        .select(`
          *,
          profiles:user_id (username)
        `)
        .order("created_at", { ascending: false });

      if (selectedCategory !== "All") {
        query = query.eq("category", selectedCategory);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const { data: mainPrompts } = await query;

      setFeaturedPrompts(featured || []);
      setTrendingPrompts(trending || []);
      setRecentPrompts(recent || []);
      setPrompts(mainPrompts || []);
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
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-pulse-glow">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Community-Powered AI Prompts</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary-foreground to-primary bg-clip-text text-transparent animate-gradient">
              PromptVault
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in stagger-1">
              Discover, share, and elevate your AI conversations with curated prompts from the community
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center animate-fade-in stagger-2">
              <Button 
                size="lg" 
                className="hover-lift hover-glow"
                onClick={() => window.location.href = user ? "/upload" : "/auth"}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Prompt
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="hover-lift"
                onClick={() => scrollToSection("browse")}
              >
                Browse Collection
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in stagger-3">
            <Card className="p-6 text-center hover-glow hover-lift bg-gradient-to-br from-card to-card/80">
              <div className="text-3xl font-bold text-primary mb-2">{prompts.length}+</div>
              <div className="text-muted-foreground">Total Prompts</div>
            </Card>
            <Card className="p-6 text-center hover-glow hover-lift bg-gradient-to-br from-card to-card/80">
              <div className="text-3xl font-bold text-primary mb-2">{CATEGORY_LIST.length - 1}</div>
              <div className="text-muted-foreground">Categories</div>
            </Card>
            <Card className="p-6 text-center hover-glow hover-lift bg-gradient-to-br from-card to-card/80">
              <div className="text-3xl font-bold text-primary mb-2">Growing</div>
              <div className="text-muted-foreground">Community</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Prompts Section */}
      {!searchQuery && !sectionParam && (
        <section id="featured" className="py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-8 animate-slide-in-left">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold">Featured Prompts</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPrompts.map((prompt, index) => (
                <div key={prompt.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
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
          </div>
        </section>
      )}

      {/* Trending Section */}
      {!searchQuery && !sectionParam && (
        <section id="trending" className="py-16 px-4 bg-muted/20">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-8 animate-slide-in-left">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold">Trending This Week</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingPrompts.map((prompt, index) => (
                <div key={prompt.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
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
          </div>
        </section>
      )}

      {/* Recent Prompts Section */}
      {!searchQuery && !sectionParam && (
        <section id="recent" className="py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-8 animate-slide-in-left">
              <Clock className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold">Recently Added</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPrompts.map((prompt, index) => (
                <div key={prompt.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
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
          </div>
        </section>
      )}

      {/* Browse All Prompts Section */}
      <section id="browse" className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold mb-8 animate-fade-in">Browse All Prompts</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 animate-fade-in stagger-1">
            {CATEGORY_LIST.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="hover-lift"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Prompts Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : prompts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No prompts found. Be the first to upload!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {prompts.map((prompt, index) => (
                <div key={prompt.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
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
};

export default IndexEnhanced;
