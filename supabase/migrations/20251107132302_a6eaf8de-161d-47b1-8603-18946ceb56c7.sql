-- Create profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  created_at timestamp with time zone default now(),
  constraint username_length check (char_length(username) >= 3 and char_length(username) <= 30)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create prompts table
create table public.prompts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text not null,
  tags text[] default '{}',
  user_id uuid not null references public.profiles(id) on delete cascade,
  star_count integer default 0,
  copy_count integer default 0,
  created_at timestamp with time zone default now(),
  constraint title_length check (char_length(title) >= 3 and char_length(title) <= 200),
  constraint content_length check (char_length(content) >= 10)
);

-- Enable RLS
alter table public.prompts enable row level security;

-- Prompts policies
create policy "Prompts are viewable by everyone"
  on public.prompts for select
  using (true);

create policy "Authenticated users can create prompts"
  on public.prompts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own prompts"
  on public.prompts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own prompts"
  on public.prompts for delete
  using (auth.uid() = user_id);

-- Create prompt_stars junction table
create table public.prompt_stars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, prompt_id)
);

-- Enable RLS
alter table public.prompt_stars enable row level security;

-- Star policies
create policy "Stars are viewable by everyone"
  on public.prompt_stars for select
  using (true);

create policy "Authenticated users can star prompts"
  on public.prompt_stars for insert
  with check (auth.uid() = user_id);

create policy "Users can unstar prompts"
  on public.prompt_stars for delete
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index idx_prompts_user_id on public.prompts(user_id);
create index idx_prompts_category on public.prompts(category);
create index idx_prompts_created_at on public.prompts(created_at desc);
create index idx_prompt_stars_user_id on public.prompt_stars(user_id);
create index idx_prompt_stars_prompt_id on public.prompt_stars(prompt_id);

-- Create function to update star count
create or replace function public.update_prompt_star_count()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    update public.prompts
    set star_count = star_count + 1
    where id = NEW.prompt_id;
  elsif TG_OP = 'DELETE' then
    update public.prompts
    set star_count = star_count - 1
    where id = OLD.prompt_id;
  end if;
  return null;
end;
$$;

-- Trigger to update star count
create trigger on_prompt_star_change
  after insert or delete on public.prompt_stars
  for each row execute procedure public.update_prompt_star_count();