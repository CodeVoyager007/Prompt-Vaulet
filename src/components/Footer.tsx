import { Link } from "react-router-dom";
import { Sparkles, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/50 backdrop-blur-md border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4 animate-fade-in-up">
            <Link to="/" className="flex items-center gap-2 group">
              <Sparkles className="w-6 h-6 text-primary animate-pulse-glow" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-primary-foreground to-primary bg-clip-text text-transparent">
                PromptVault
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Discover, share, and elevate your AI conversations with curated prompts from the community.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover-lift"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover-lift"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@promptvault.com"
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover-lift"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4 animate-fade-in-up stagger-1">
            <h3 className="font-semibold text-foreground">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/?section=featured" className="text-muted-foreground hover:text-primary transition-colors">
                  Featured Prompts
                </Link>
              </li>
              <li>
                <Link to="/?section=trending" className="text-muted-foreground hover:text-primary transition-colors">
                  Trending
                </Link>
              </li>
              <li>
                <Link to="/?section=recent" className="text-muted-foreground hover:text-primary transition-colors">
                  Recent
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-muted-foreground hover:text-primary transition-colors">
                  Upload Prompt
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4 animate-fade-in-up stagger-2">
            <h3 className="font-semibold text-foreground">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/?category=Writing & Content" className="text-muted-foreground hover:text-primary transition-colors">
                  Writing & Content
                </Link>
              </li>
              <li>
                <Link to="/?category=Code & Development" className="text-muted-foreground hover:text-primary transition-colors">
                  Code & Development
                </Link>
              </li>
              <li>
                <Link to="/?category=Business & Productivity" className="text-muted-foreground hover:text-primary transition-colors">
                  Business
                </Link>
              </li>
              <li>
                <Link to="/?category=Creative & Design" className="text-muted-foreground hover:text-primary transition-colors">
                  Creative & Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4 animate-fade-in-up stagger-3">
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground animate-fade-in stagger-4">
          <p>© {currentYear} PromptVault. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-accent animate-pulse-glow">♥</span> for the AI community
          </p>
        </div>
      </div>
    </footer>
  );
}
