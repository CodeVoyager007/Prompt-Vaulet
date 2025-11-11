import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Sparkles, Users, Target, Rocket } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-pulse-glow">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">About PromptVault</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              Empowering AI Conversations
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
              PromptVault is a community-driven platform dedicated to discovering, sharing, and perfecting AI prompts that unlock the full potential of artificial intelligence.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 hover-glow hover-lift animate-fade-in-up">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-float">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                <p className="text-muted-foreground">
                  To democratize AI by providing everyone access to high-quality prompts that enhance productivity and creativity.
                </p>
              </Card>

              <Card className="p-6 hover-glow hover-lift animate-fade-in-up stagger-1">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 animate-float">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Our Community</h3>
                <p className="text-muted-foreground">
                  A diverse group of AI enthusiasts, creators, and professionals sharing their expertise to help others succeed.
                </p>
              </Card>

              <Card className="p-6 hover-glow hover-lift animate-fade-in-up stagger-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-float">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
                <p className="text-muted-foreground">
                  To become the world's largest repository of curated AI prompts, making AI accessible to everyone.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center animate-slide-in-left">Our Story</h2>
            <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground animate-fade-in-up">
              <p>
                PromptVault was born from a simple observation: while AI tools were becoming increasingly powerful, many users struggled to communicate effectively with them. The difference between a mediocre result and an exceptional one often came down to how well the prompt was crafted.
              </p>
              <p>
                We realized that there was a need for a centralized platform where prompt engineers, content creators, developers, and AI enthusiasts could share their best prompts, learn from each other, and collaboratively improve the art of prompt engineering.
              </p>
              <p>
                Today, PromptVault serves thousands of users worldwide, hosting prompts across multiple categories from creative writing to code development, from business productivity to educational content. Every prompt in our vault represents real-world experience and proven results.
              </p>
              <p>
                Join us in our mission to make AI more accessible and effective for everyone. Whether you're a seasoned prompt engineer or just starting your AI journey, PromptVault is here to help you unlock the full potential of artificial intelligence.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center animate-slide-in-right">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 hover-glow animate-fade-in-up">
                <h3 className="text-lg font-semibold mb-2 text-primary">Community First</h3>
                <p className="text-muted-foreground">We believe in the power of collective intelligence and shared knowledge.</p>
              </Card>
              <Card className="p-6 hover-glow animate-fade-in-up stagger-1">
                <h3 className="text-lg font-semibold mb-2 text-primary">Quality Over Quantity</h3>
                <p className="text-muted-foreground">Every prompt is curated to ensure it provides real value to our users.</p>
              </Card>
              <Card className="p-6 hover-glow animate-fade-in-up stagger-2">
                <h3 className="text-lg font-semibold mb-2 text-primary">Continuous Learning</h3>
                <p className="text-muted-foreground">We're always evolving as AI technology advances and new use cases emerge.</p>
              </Card>
              <Card className="p-6 hover-glow animate-fade-in-up stagger-3">
                <h3 className="text-lg font-semibold mb-2 text-primary">Open & Transparent</h3>
                <p className="text-muted-foreground">We operate with transparency and encourage open collaboration.</p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
