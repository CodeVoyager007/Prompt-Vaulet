import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Upload, ArrowRight, TrendingUp, Zap, Code, Briefcase, GraduationCap, Palette, Database, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  { 
    name: "Writing & Content", 
    slug: "writing",
    icon: Sparkles,
    description: "Creative writing, copywriting & content creation",
    color: "from-purple-500 to-pink-500"
  },
  { 
    name: "Code & Development", 
    slug: "code",
    icon: Code,
    description: "Coding challenges, debugging & development",
    color: "from-green-500 to-emerald-500"
  },
  { 
    name: "Business & Productivity", 
    slug: "business",
    icon: Briefcase,
    description: "Strategy, management & professional growth",
    color: "from-blue-500 to-cyan-500"
  },
  { 
    name: "Education & Learning", 
    slug: "education",
    icon: GraduationCap,
    description: "Learning resources, study guides & teaching",
    color: "from-yellow-500 to-orange-500"
  },
  { 
    name: "Creative & Design", 
    slug: "creative",
    icon: Palette,
    description: "Design inspiration & artistic challenges",
    color: "from-pink-500 to-rose-500"
  },
  { 
    name: "Data & Analysis", 
    slug: "data",
    icon: Database,
    description: "Data analysis, visualization & analytics",
    color: "from-cyan-500 to-blue-500"
  },
  { 
    name: "Personal & Lifestyle", 
    slug: "personal",
    icon: Heart,
    description: "Personal development & self-growth",
    color: "from-red-500 to-pink-500"
  },
];

export default function Index() {
  const { user } = useAuth();
  const [cursorGlow, setCursorGlow] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorGlow({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Custom cursor glow */}
      <div 
        className="pointer-events-none fixed w-96 h-96 rounded-full bg-primary/20 blur-3xl transition-all duration-300 ease-out z-50"
        style={{
          left: cursorGlow.x - 192,
          top: cursorGlow.y - 192,
        }}
      />
      
      <div className="relative z-10">
        <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background py-24 px-4"
      >
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        
        {/* Glowing balls effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-20 left-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-float" 
            style={{ animationDelay: '0s' }} 
          />
          <div 
            className="absolute bottom-20 right-10 w-80 h-80 bg-accent/30 rounded-full blur-3xl animate-float" 
            style={{ animationDelay: '3s' }} 
          />
          <div 
            className="absolute top-1/2 left-1/2 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" 
            style={{ animationDelay: '1.5s' }} 
          />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 animate-pulse-glow">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm text-primary font-medium">200+ Community Prompts</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              PromptVault
            </h1>
            
            <p className="text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover, share, and elevate your AI conversations with <span className="text-foreground font-semibold">curated prompts</span> from the community
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 hover-lift hover-glow group"
                onClick={() => window.location.href = user ? "/upload" : "/auth"}
              >
                <Upload className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Start Contributing
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 hover-lift hover-glow"
                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Zap className="w-5 h-5 mr-2" />
                Explore Categories
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 space-y-4 animate-fade-in">
            <h2 className="text-5xl font-bold">Browse by Category</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the perfect prompts for your needs across various domains
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link 
                  key={category.slug} 
                  to={`/category/${category.slug}`}
                  className="group"
                >
                  <Card 
                    className="p-8 cursor-pointer h-full animate-fade-in-up border-2 border-transparent hover:border-primary/50 transition-all"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="flex flex-col items-start gap-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${category.color} shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="space-y-2 flex-1">
                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                        Explore
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container mx-auto max-w-4xl text-center space-y-8 animate-fade-in">
          <h2 className="text-5xl font-bold">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground">
            Join our growing community and discover prompts that transform your AI interactions
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 hover-lift hover-glow"
              onClick={() => window.location.href = user ? "/upload" : "/auth"}
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Your First Prompt
            </Button>
          </div>
        </div>
      </section>

        <Footer />
      </div>
    </div>
  );
}
