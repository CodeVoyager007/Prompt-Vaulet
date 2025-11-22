import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PromptCard } from '@/components/PromptCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, User, Star, Settings as SettingsIcon, Eye, EyeOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => (
  <aside className="w-1/4 pr-8">
    <nav className="sticky top-24 space-y-2">
      <Button
        variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setActiveTab('profile')}
      >
        <User className="w-4 h-4 mr-2" />
        Profile
      </Button>
      <Button
        variant={activeTab === 'uploaded' ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setActiveTab('uploaded')}
      >
        <Star className="w-4 h-4 mr-2" />
        My Prompts
      </Button>
      <Button
        variant={activeTab === 'starred' ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setActiveTab('starred')}
      >
        <Star className="w-4 h-4 mr-2" />
        Starred Prompts
      </Button>
    </nav>
  </aside>
);

const SettingsContent = () => {
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("contain at least one number");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push("contain at least one special character");
    }
    return errors;
  };

  const handleChangePassword = async () => {
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      toast({
        title: "Invalid Password",
        description: `Password must ${passwordErrors.join(", ")}.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Password updated successfully.",
      });
      setNewPassword("");
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.rpc("delete_user");
      if (error) {
        toast({
          title: "Error deleting account",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account deleted",
          description: "Your account has been successfully deleted.",
        });
        await supabase.auth.signOut();
        window.location.href = "/";
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to reset your password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email!!);
    if (error) {
      toast({
        title: "Error sending reset email",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password reset email sent",
        description: "Check your email for a password reset link.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 mt-8">
      <div>
        <h3 className="text-lg font-medium">Change Password</h3>
        <div className="mt-4 flex gap-4">
          <div className="relative flex-grow">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <Button onClick={handleChangePassword} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Forgot Password</h3>
        <p className="text-sm text-muted-foreground">
          Can't remember your current password? Send a password reset email.
        </p>
        <Button onClick={handleForgotPassword} variant="outline" className="mt-4" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Email"}
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-medium">Delete Account</h3>
        <p className="text-sm text-muted-foreground">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="mt-4">
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} disabled={loading}>
                {loading ? "Deleting..." : "Continue"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};


const ProfileContent = ({ profile, prompts, loading, isOwnProfile, activeTab, setActiveTab }: any) => (
  <>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
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
      {isOwnProfile && (
        <Button
          variant="outline"
          onClick={() => setActiveTab(activeTab === 'settings' ? 'profile' : 'settings')}
        >
          <SettingsIcon className="w-4 h-4 mr-2" />
          {activeTab === 'settings' ? 'View Profile' : 'Settings'}
        </Button>
      )}
    </div>

    {activeTab === 'settings' ? (
      <SettingsContent />
    ) : loading ? (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    ) : prompts.length === 0 ? (
      <div className="text-center py-20">
        <p className="text-xl text-muted-foreground">
          {isOwnProfile ? `You haven't ${activeTab === 'uploaded' ? 'uploaded any' : 'starred any'} prompts yet.` : `No ${activeTab} prompts yet.`}
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt: any) => (
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
  </>
);


export default function Dashboard() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [uploadedPrompts, setUploadedPrompts] = useState<any[]>([]);
  const [starredPrompts, setStarredPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const profileId = id || user?.id;
  const defaultTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  useEffect(() => {
    if (profileId && (activeTab === 'uploaded' || activeTab === 'starred')) {
      fetchPrompts();
    }
  }, [profileId, activeTab]);

  const fetchProfile = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const fetchPrompts = async () => {
    setLoading(true);

    if (activeTab === 'uploaded') {
      const { data } = await supabase
        .from('prompts')
        .select(`*, profiles:user_id (username)`)
        .eq('user_id', profileId)
        .order('created_at', { ascending: false });

      if (data) setUploadedPrompts(data);
    } else if (activeTab === 'starred') {
      const { data } = await supabase
        .from('prompt_stars')
        .select(`prompts (*, profiles:user_id (username))`)
        .eq('user_id', profileId)
        .order('created_at', { ascending: false });

      if (data) setStarredPrompts(data.map((item: any) => item.prompts));
    }

    setLoading(false);
  };

  const isOwnProfile = user?.id === profileId;
  const prompts = activeTab === 'uploaded' ? uploadedPrompts : starredPrompts;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="w-3/d-4 pl-8">
            {loading && !profile ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {profile && (
                  <ProfileContent 
                    profile={profile} 
                    prompts={prompts} 
                    loading={loading} 
                    isOwnProfile={isOwnProfile}
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
