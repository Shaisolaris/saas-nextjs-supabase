-- ─── Teams ──────────────────────────────────────────────

create table public.teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  plan text default 'free' check (plan in ('free', 'pro', 'enterprise')),
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  trial_ends_at timestamptz,
  created_at timestamptz default now()
);

alter table public.teams enable row level security;

create policy "Team members can view their team"
  on public.teams for select
  using (id in (select team_id from public.profiles where id = auth.uid()));

create policy "Team owners can update their team"
  on public.teams for update
  using (id in (select team_id from public.profiles where id = auth.uid() and role = 'owner'));

-- ─── Profiles ───────────────────────────────────────────

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  avatar_url text,
  team_id uuid references public.teams(id),
  role text default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Team members can view team profiles"
  on public.profiles for select
  using (team_id in (select team_id from public.profiles where id = auth.uid()));

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- ─── Projects ───────────────────────────────────────────

create table public.projects (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  name text not null,
  description text,
  status text default 'active' check (status in ('active', 'archived')),
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.projects enable row level security;

create policy "Team members can view projects"
  on public.projects for select
  using (team_id in (select team_id from public.profiles where id = auth.uid()));

create policy "Team members can create projects"
  on public.projects for insert
  with check (team_id in (select team_id from public.profiles where id = auth.uid()));

create policy "Team admins can update projects"
  on public.projects for update
  using (team_id in (select team_id from public.profiles where id = auth.uid() and role in ('owner', 'admin')));

-- ─── Invitations ────────────────────────────────────────

create table public.invitations (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  email text not null,
  role text default 'member',
  token text unique not null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz default now()
);

alter table public.invitations enable row level security;

create policy "Team admins can manage invitations"
  on public.invitations for all
  using (team_id in (select team_id from public.profiles where id = auth.uid() and role in ('owner', 'admin')));

-- ─── Storage ────────────────────────────────────────────

insert into storage.buckets (id, name, public) values ('project-files', 'project-files', false);

create policy "Team members can upload files"
  on storage.objects for insert
  with check (bucket_id = 'project-files');

create policy "Team members can view files"
  on storage.objects for select
  using (bucket_id = 'project-files');

-- ─── Functions ──────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
