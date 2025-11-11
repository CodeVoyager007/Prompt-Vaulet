import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { CategoryBadge } from '@/components/CategoryBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Copy, User, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function PromptDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isStarred, setIsStarred] = useState(false);
  const [starLoading, setStarLoading] = useState(false);

  useEffect(() => {
    fetchPrompt();
    if (user) {
      checkIfStarred();
    }
  }, [id, user]);

  const fetchPrompt = async () => {
    const { data, error } = await supabase
      .from('prompts')
      .select(`
        *,
        profiles:user_id (id, username)
      `)
      .eq('id', id)
      .single();

    if (!error && data) {
      setPrompt(data);
    }
    setLoading(false);
  };

  const checkIfStarred = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('prompt_stars')
      .select('id')
      .eq('prompt_id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    setIsStarred(!!data);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content);
    toast.success('Copied to clipboard!');

    await supabase
      .from('prompts')
      .update({ copy_count: prompt.copy_count + 1 })
      .eq('id', id);

    setPrompt({ ...prompt, copy_count: prompt.copy_count + 1 });
  };

  const handleStar = async () => {
    if (!user) {
      toast.error('Please sign in to star prompts');
      return;
    }

    setStarLoading(true);

    if (isStarred) {
      await supabase
        .from('prompt_stars')
        .delete()
        .eq('prompt_id', id)
        .eq('user_id', user.id);
      
      setIsStarred(false);
      toast.success('Removed from starred');
    } else {
      await supabase
        .from('prompt_stars')
        .insert({ prompt_id: id, user_id: user.id });
      
      setIsStarred(true);
      toast.success('Added to starred');
    }

    fetchPrompt();
    setStarLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Prompt not found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="gap-2 hover-lift"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Prompts
          </Button>
        </div>
        
        <Card className="max-w-4xl mx-auto animate-fade-in-up">
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-3">{prompt.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <Link
                    to={`/profile/${prompt.profiles?.id}`}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{prompt.profiles?.username}</span>
                  </Link>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(prompt.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <CategoryBadge category={prompt.category} />
            </div>

            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {prompt.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button onClick={handleCopy} variant="default" className="gap-2">
                <Copy className="w-4 h-4" />
                Copy ({prompt.copy_count})
              </Button>
              <Button
                onClick={handleStar}
                variant={isStarred ? 'default' : 'outline'}
                className="gap-2"
                disabled={starLoading}
              >
                <Star className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`} />
                {isStarred ? 'Starred' : 'Star'} ({prompt.star_count})
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="bg-muted/50 rounded-lg p-6 border border-border">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {prompt.content}
              </pre>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
