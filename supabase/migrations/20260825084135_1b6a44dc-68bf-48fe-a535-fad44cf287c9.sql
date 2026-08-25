-- roles
create type public.app_role as enum ('admin', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

create policy "profiles_select_own" on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "profiles_update_own" on public.profiles for update to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  with check (id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "user_roles_select_own" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- signup trigger: profile + role
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (
    new.id,
    case when lower(new.email) = 'shahglassy26@gmail.com' then 'admin'::public.app_role
         else 'user'::public.app_role end
  )
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- contact submissions
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  brand text,
  service text not null,
  message text not null,
  status text not null default 'new',
  admin_notes text,
  email_delivery text not null default 'pending'
);
grant select on public.contact_submissions to authenticated;
grant all on public.contact_submissions to service_role;
alter table public.contact_submissions enable row level security;

create policy "submissions_select_own_or_admin" on public.contact_submissions for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "submissions_admin_update" on public.contact_submissions for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "submissions_admin_delete" on public.contact_submissions for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- replies
create table public.submission_replies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  submission_id uuid not null references public.contact_submissions(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  subject text not null,
  body text not null,
  delivery_status text not null default 'pending',
  delivery_error text,
  provider_id text
);
grant select on public.submission_replies to authenticated;
grant all on public.submission_replies to service_role;
alter table public.submission_replies enable row level security;

create policy "replies_select_own_or_admin" on public.submission_replies for select to authenticated
  using (
    public.has_role(auth.uid(), 'admin')
    or exists (
      select 1 from public.contact_submissions s
      where s.id = submission_id and s.user_id = auth.uid()
    )
  );

-- editable site content
create table public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
grant select on public.site_content to anon, authenticated;
grant all on public.site_content to service_role;
alter table public.site_content enable row level security;

create policy "site_content_public_read" on public.site_content for select to anon, authenticated using (true);
create policy "site_content_admin_write" on public.site_content for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger submissions_touch before update on public.contact_submissions for each row execute function public.touch_updated_at();
create trigger site_content_touch before update on public.site_content for each row execute function public.touch_updated_at();

-- seed editable homepage content
insert into public.site_content (key, value) values
  ('home.hero', '{"eyebrow":"Cleaner fabrics. Better business.","title":"Professional garment washing solutions","body":"Glassy Washing Plant provides washing, drying, dyeing and transport for fashion brands, garment manufacturers and textile companies across Bangladesh.","primaryLabel":"Explore our services","secondaryLabel":"Request a quote"}'::jsonb),
  ('home.stats', '{"eyebrow":"A wash house with real capacity","title":"Built for quality at commercial scale.","items":[{"value":"11,500","label":"sq ft under one roof"},{"value":"120+","label":"skilled operators & technicians"},{"value":"$2.5M+","label":"last-year volume"},{"value":"650K","label":"pieces washed every month"}]}'::jsonb),
  ('home.statement', '{"eyebrow":"02 / The Glassy standard","title":"A better wash is measured in the details you can feel."}'::jsonb),
  ('home.cta', '{"eyebrow":"Ready to get started?","title":"Bring us the reference.","copy":"Tell us what you are making, where it needs to go, and how it should feel. We will take it from there."}'::jsonb),
  ('site.contact', '{"phone":"01819195026","email":"Shahglassy26@gmail.com","address":"House 13, Wazuddin Rd, Vatara, Dhaka 1212, Bangladesh","notifyEmail":"Shahglassy26@gmail.com","fromEmail":"onboarding@resend.dev","fromName":"Glassy Washing Plant"}'::jsonb)
on conflict (key) do nothing;