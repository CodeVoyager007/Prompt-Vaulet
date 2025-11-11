import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { PromptCard } from '@/components/PromptCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Profile() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [uploadedPrompts, setUploadedPrompts] = useState<any[]>([]);
  const [starredPrompts, setStarredPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const profileId = id || user?.id;
  const defaultTab = searchParams.get('tab') === 'starred' ? 'starred' : 'uploaded';
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (profileId) {
      fetchProfile();
      fetchPrompts();
    }
  }, [profileId, activeTab]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (data) {
      setProfile(data);
    }
  };

  const fetchPrompts = async () => {
    setLoading(true);

    if (activeTab === 'uploaded') {
      const { data } = await supabase
        .from('prompts')
        .select(`
          *,
          profiles:user_id (username)
        `)
        .eq('user_id', profileId)
        .order('created_at', { ascending: false });

      if (data) {
        setUploadedPrompts(data);
      }
    } else {
      const { data } = await supabase
        .from('prompt_stars')
        .select(`
          prompts (
            *,
            profiles:user_id (username)
          )
        `)
        .eq('user_id', profileId)
        .order('created_at', { ascending: false });

      if (data) {
        setStarredPrompts(data.map((item: any) => item.prompts));
      }
    }

    setLoading(false);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === profileId;
  const prompts = activeTab === 'uploaded' ? uploadedPrompts : starredPrompts;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile.username}</h1>
              <p className="text-muted-foreground">
                Member since {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="uploaded">
                {isOwnProfile ? 'My Prompts' : 'Uploaded'}
              </TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
            </TabsList>

            <TabsContent value="uploaded" className="mt-6">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : prompts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-muted-foreground">
                    {isOwnProfile ? "You haven't uploaded any prompts yet" : 'No prompts uploaded yet'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {prompts.map((prompt) => (
                    <PromptCard
                      key={prompt.id}
                      id={prompt.id}
                      title={prompt.title}
                      content={prompt.content}
                      category={prompt.category}
                      username={prompt.profiles?.username || 'Anonymous'}
                      starCount={prompt.star_count}
                      copyCount={prompt.copy_count}
                      createdAt={prompt.created_at}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="starred" className="mt-6">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : prompts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-muted-foreground">
                    {isOwnProfile ? "You haven't starred any prompts yet" : 'No starred prompts'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {prompts.map((prompt) => (
                    <PromptCard
                      key={prompt.id}
                      id={prompt.id}
                      title={prompt.title}
                      content={prompt.content}
                      category={prompt.category}
                      username={prompt.profiles?.username || 'Anonymous'}
                      starCount={prompt.star_count}
                      copyCount={prompt.copy_count}
                      createdAt={prompt.created_at}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
