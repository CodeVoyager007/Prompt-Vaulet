-- Temporarily drop the foreign key constraint on profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Create a system profile for PromptVault
INSERT INTO public.profiles (id, username, created_at)
VALUES ('00000000-0000-0000-0000-000000000000', 'PromptVault', NOW())
ON CONFLICT (id) DO NOTHING;

-- Re-add the foreign key constraint but make it not validated so it allows the system account
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE 
NOT VALID;