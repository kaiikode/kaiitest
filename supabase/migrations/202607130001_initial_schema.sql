-- Padua Wedding Planning
-- Initial production schema, authorization helpers, indexes and RLS policies.

create extension if not exists pgcrypto;

create type public.app_role as enum ('couple', 'staff', 'administrator');
create type public.member_role as enum ('owner', 'partner', 'coordinator', 'sales', 'viewer');
create type public.task_status as enum ('not_started', 'in_progress', 'waiting', 'completed');
create type public.rsvp_status as enum ('not_invited', 'invited', 'attending', 'declined', 'no_response');
create type public.message_visibility as enum ('couple_and_staff', 'staff_only');

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  avatar_path text,
  role public.app_role not null default 'couple',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.weddings (
  id uuid primary key default gen_random_uuid(),
  couple_names text not null,
  wedding_date date,
  date_precision text not null default 'exact' check (date_precision in ('exact', 'month', 'undecided')),
  guest_count integer check (guest_count between 0 and 5000),
  target_budget numeric(12,2) check (target_budget >= 0),
  booking_status text not null default 'exploring' check (booking_status in ('exploring', 'not_booked', 'tour_requested', 'estimate_received', 'booked', 'cancelled')),
  planning_stage text not null default 'just_started',
  ceremony_preference text,
  reception_preference text,
  priorities text[] not null default '{}',
  coordinator_id uuid references public.profiles(id) on delete set null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.wedding_members (
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  member_role public.member_role not null default 'partner',
  assigned_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (wedding_id, user_id)
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'administrator'
  );
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('staff', 'administrator')
  );
$$;

create or replace function public.can_access_wedding(target_wedding_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select public.is_admin() or exists (
    select 1 from public.wedding_members
    where wedding_id = target_wedding_id and user_id = auth.uid()
  );
$$;

create or replace function public.can_manage_wedding(target_wedding_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select public.is_admin() or exists (
    select 1 from public.wedding_members
    where wedding_id = target_wedding_id
      and user_id = auth.uid()
      and member_role in ('owner', 'partner', 'coordinator', 'sales')
  );
$$;

create or replace function public.is_wedding_creator(target_wedding_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.weddings
    where id = target_wedding_id and created_by = auth.uid()
  );
$$;

create or replace function public.can_manage_membership(target_wedding_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select public.is_admin() or exists (
    select 1 from public.wedding_members
    where wedding_id = target_wedding_id
      and user_id = auth.uid()
      and member_role in ('owner', 'coordinator')
  );
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, coalesce(new.email, ''), new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.protect_profile_role()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is not null
    and new.role is distinct from old.role
    and not public.is_admin()
  then
    raise exception 'Only administrators may change profile roles';
  end if;
  return new;
end;
$$;

create trigger protect_profile_role_before_update
before update on public.profiles
for each row execute function public.protect_profile_role();

create table public.checklist_tasks (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 240),
  description text,
  due_date date,
  category text not null,
  priority smallint not null default 2 check (priority between 1 and 3),
  status public.task_status not null default 'not_started',
  notes text,
  vendor_id uuid,
  document_id uuid,
  sort_order integer not null default 0,
  completed_at timestamptz,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.timeline_items (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  timeline_type text not null check (timeline_type in ('planning', 'wedding_day')),
  title text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  due_date date,
  location text,
  assigned_people text[] not null default '{}',
  vendor_id uuid,
  notes text,
  status public.task_status not null default 'not_started',
  sort_order integer not null default 0,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at >= starts_at)
);

create table public.budget_categories (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  name text not null,
  target_amount numeric(12,2) not null default 0 check (target_amount >= 0),
  sort_order integer not null default 0,
  is_padua boolean not null default false,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (wedding_id, name)
);

create table public.budget_items (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  category_id uuid references public.budget_categories(id) on delete set null,
  name text not null,
  estimated_amount numeric(12,2) not null default 0 check (estimated_amount >= 0),
  actual_amount numeric(12,2) not null default 0 check (actual_amount >= 0),
  paid_amount numeric(12,2) not null default 0 check (paid_amount >= 0),
  due_date date,
  payment_status text not null default 'not_scheduled' check (payment_status in ('not_scheduled', 'scheduled', 'partially_paid', 'paid', 'overdue')),
  vendor_id uuid,
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  first_name text not null,
  last_name text not null default '',
  household text,
  email text,
  phone text,
  address_line_1 text,
  address_line_2 text,
  city text,
  region text,
  postal_code text,
  rsvp_status public.rsvp_status not null default 'not_invited',
  meal_preference text,
  dietary_restrictions text,
  plus_one boolean not null default false,
  is_child boolean not null default false,
  table_assignment text,
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid references public.weddings(id) on delete cascade,
  business_name text not null,
  contact_name text,
  email text,
  phone text,
  website text,
  instagram text,
  category text not null,
  contract_status text not null default 'researching',
  deposit numeric(12,2) not null default 0 check (deposit >= 0),
  total_cost numeric(12,2) not null default 0 check (total_cost >= 0),
  notes text,
  rating smallint check (rating between 1 and 5),
  is_padua_preferred boolean not null default false,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (wedding_id is not null and is_padua_preferred = false)
    or (wedding_id is null and is_padua_preferred = true)
  )
);

create table public.vendor_payments (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  amount numeric(12,2) not null check (amount >= 0),
  due_date date,
  paid_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled', 'paid', 'overdue', 'cancelled')),
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inspiration_items (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  image_path text,
  image_url text,
  title text not null,
  category text not null,
  notes text,
  source_url text,
  tags text[] not null default '{}',
  colors text[] not null default '{}',
  is_favorite boolean not null default false,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (image_path is not null or image_url is not null)
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  title text not null,
  content text not null,
  category text,
  is_pinned boolean not null default false,
  is_internal boolean not null default false,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  name text not null,
  storage_path text not null unique,
  mime_type text,
  size_bytes bigint check (size_bytes >= 0),
  category text not null,
  uploaded_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.venue_preferences (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  section text not null,
  responses jsonb not null default '{}',
  favorite_locations text[] not null default '{}',
  coordinator_confirmed_at timestamptz,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (wedding_id, section)
);

create table public.tour_preparation (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  questions text[] not null default '{}',
  notes text,
  guest_count_estimate integer,
  preferred_date date,
  budget_range text,
  ceremony_priorities text,
  reception_priorities text,
  food_priorities text,
  photography_priorities text,
  accessibility_needs text,
  must_haves text,
  concerns text,
  tour_status text not null default 'not_requested' check (tour_status in ('not_requested', 'requested', 'completed', 'estimate_received', 'follow_up_requested', 'ready_to_book', 'still_comparing')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (wedding_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  category text not null,
  subject text,
  body text not null check (char_length(body) between 1 and 10000),
  visibility public.message_visibility not null default 'couple_and_staff',
  parent_id uuid references public.messages(id) on delete set null,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activity_log (
  id bigint generated always as identity primary key,
  wedding_id uuid references public.weddings(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_name text not null,
  entity_type text,
  entity_id text,
  properties jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Administrative content tables support configurable planning content.
create table public.checklist_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,
  months_before integer,
  applies_when jsonb not null default '{}',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.venue_content (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  title text not null,
  body text,
  field_config jsonb not null default '{}',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add circular optional foreign keys after their referenced tables exist.
alter table public.checklist_tasks add constraint checklist_tasks_vendor_fk foreign key (vendor_id) references public.vendors(id) on delete set null;
alter table public.checklist_tasks add constraint checklist_tasks_document_fk foreign key (document_id) references public.documents(id) on delete set null;
alter table public.timeline_items add constraint timeline_items_vendor_fk foreign key (vendor_id) references public.vendors(id) on delete set null;
alter table public.budget_items add constraint budget_items_vendor_fk foreign key (vendor_id) references public.vendors(id) on delete set null;

-- High-value lookup and dashboard indexes.
create index wedding_members_user_idx on public.wedding_members(user_id, wedding_id);
create index weddings_date_idx on public.weddings(wedding_date) where wedding_date is not null;
create index weddings_booking_stage_idx on public.weddings(booking_status, planning_stage);
create index checklist_wedding_due_idx on public.checklist_tasks(wedding_id, due_date);
create index checklist_wedding_status_idx on public.checklist_tasks(wedding_id, status);
create index timeline_wedding_type_order_idx on public.timeline_items(wedding_id, timeline_type, sort_order);
create index budget_items_wedding_due_idx on public.budget_items(wedding_id, due_date);
create index guests_wedding_name_idx on public.guests(wedding_id, last_name, first_name);
create index guests_wedding_rsvp_idx on public.guests(wedding_id, rsvp_status);
create index vendors_wedding_category_idx on public.vendors(wedding_id, category);
create index preferred_vendors_idx on public.vendors(category) where is_padua_preferred = true and is_active = true;
create index vendor_payments_wedding_due_idx on public.vendor_payments(wedding_id, due_date);
create index inspiration_wedding_category_idx on public.inspiration_items(wedding_id, category);
create index notes_wedding_pinned_idx on public.notes(wedding_id, is_pinned desc, updated_at desc);
create index documents_wedding_category_idx on public.documents(wedding_id, category);
create index messages_wedding_created_idx on public.messages(wedding_id, created_at desc);
create index activity_wedding_created_idx on public.activity_log(wedding_id, created_at desc);
create index activity_event_created_idx on public.activity_log(event_name, created_at desc);

-- Updated timestamp triggers.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles', 'weddings', 'checklist_tasks', 'timeline_items',
    'budget_categories', 'budget_items', 'guests', 'vendors',
    'vendor_payments', 'inspiration_items', 'notes', 'documents',
    'venue_preferences', 'tour_preparation', 'messages',
    'checklist_templates', 'venue_content'
  ]
  loop
    execute format(
      'create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name, table_name
    );
  end loop;
end $$;

-- RLS: profiles and wedding roots.
alter table public.profiles enable row level security;
alter table public.weddings enable row level security;
alter table public.wedding_members enable row level security;

create policy "profiles read self or authorized staff" on public.profiles
for select using (
  id = auth.uid() or public.is_admin() or (
    public.is_staff() and exists (
      select 1 from public.wedding_members mine
      join public.wedding_members theirs on theirs.wedding_id = mine.wedding_id
      where mine.user_id = auth.uid() and theirs.user_id = profiles.id
    )
  )
);
create policy "profiles update self" on public.profiles
for update using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());
create policy "weddings read members" on public.weddings
for select using (public.can_access_wedding(id));
create policy "weddings insert authenticated" on public.weddings
for insert to authenticated with check (created_by = auth.uid());
create policy "weddings update managers" on public.weddings
for update using (public.can_manage_wedding(id)) with check (public.can_manage_wedding(id));
create policy "weddings delete administrators" on public.weddings
for delete using (public.is_admin());
create policy "members read wedding" on public.wedding_members
for select using (public.can_access_wedding(wedding_id));
create policy "members insert owners or admins" on public.wedding_members
for insert with check (
  public.can_manage_membership(wedding_id)
  or (
    user_id = auth.uid()
    and public.is_wedding_creator(wedding_id)
    and member_role = 'owner'
  )
);
create policy "members update owners or admins" on public.wedding_members
for update using (public.can_manage_membership(wedding_id))
with check (public.can_manage_membership(wedding_id));
create policy "members delete owners or admins" on public.wedding_members
for delete using (public.can_manage_membership(wedding_id));

-- Standard wedding-owned records.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'checklist_tasks', 'timeline_items', 'budget_categories', 'budget_items',
    'guests', 'vendor_payments', 'inspiration_items',
    'venue_preferences', 'tour_preparation'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format(
      'create policy "%1$s read members" on public.%1$I for select using (public.can_access_wedding(wedding_id))',
      table_name
    );
    execute format(
      'create policy "%1$s insert managers" on public.%1$I for insert with check (public.can_manage_wedding(wedding_id) and created_by = auth.uid())',
      table_name
    );
    execute format(
      'create policy "%1$s update managers" on public.%1$I for update using (public.can_manage_wedding(wedding_id)) with check (public.can_manage_wedding(wedding_id))',
      table_name
    );
    execute format(
      'create policy "%1$s delete managers" on public.%1$I for delete using (public.can_manage_wedding(wedding_id))',
      table_name
    );
  end loop;
end $$;

-- Documents use uploaded_by rather than created_by.
alter table public.documents enable row level security;
create policy "documents read members" on public.documents
for select using (public.can_access_wedding(wedding_id));
create policy "documents insert managers" on public.documents
for insert with check (public.can_manage_wedding(wedding_id) and uploaded_by = auth.uid());
create policy "documents update managers" on public.documents
for update using (public.can_manage_wedding(wedding_id))
with check (public.can_manage_wedding(wedding_id));
create policy "documents delete managers" on public.documents
for delete using (public.can_manage_wedding(wedding_id));

-- Vendors include global preferred-vendor records.
alter table public.vendors enable row level security;
create policy "vendors read wedding or preferred" on public.vendors
for select using (
  (wedding_id is not null and public.can_access_wedding(wedding_id))
  or (is_padua_preferred = true and is_active = true)
);
create policy "vendors insert wedding managers" on public.vendors
for insert with check (
  (wedding_id is not null and public.can_manage_wedding(wedding_id) and created_by = auth.uid())
  or (wedding_id is null and is_padua_preferred and public.is_admin())
);
create policy "vendors update managers" on public.vendors
for update using (
  (wedding_id is not null and public.can_manage_wedding(wedding_id))
  or (wedding_id is null and public.is_admin())
);
create policy "vendors delete managers" on public.vendors
for delete using (
  (wedding_id is not null and public.can_manage_wedding(wedding_id))
  or (wedding_id is null and public.is_admin())
);

-- Couple notes hide staff-only records from couple roles.
alter table public.notes enable row level security;
create policy "notes read authorized" on public.notes
for select using (
  public.can_access_wedding(wedding_id)
  and (is_internal = false or public.is_staff())
);
create policy "notes insert authorized" on public.notes
for insert with check (
  public.can_manage_wedding(wedding_id)
  and created_by = auth.uid()
  and (is_internal = false or public.is_staff())
);
create policy "notes update author or admin" on public.notes
for update using (created_by = auth.uid() or public.is_admin());
create policy "notes delete author or admin" on public.notes
for delete using (created_by = auth.uid() or public.is_admin());

-- Messages allow wedding members, with staff-only visibility enforced.
alter table public.messages enable row level security;
create policy "messages read authorized" on public.messages
for select using (
  public.can_access_wedding(wedding_id)
  and (visibility = 'couple_and_staff' or public.is_staff())
);
create policy "messages insert authorized" on public.messages
for insert with check (
  public.can_access_wedding(wedding_id)
  and sender_id = auth.uid()
  and (visibility = 'couple_and_staff' or public.is_staff())
);
create policy "messages update sender" on public.messages
for update using (sender_id = auth.uid() or public.is_admin());

-- Activity is append-only for members and globally readable to admins.
alter table public.activity_log enable row level security;
create policy "activity read authorized" on public.activity_log
for select using (public.is_admin() or (wedding_id is not null and public.can_access_wedding(wedding_id)));
create policy "activity insert own" on public.activity_log
for insert with check (
  actor_id = auth.uid()
  and (wedding_id is null or public.can_access_wedding(wedding_id))
);

-- Configurable platform content.
alter table public.checklist_templates enable row level security;
alter table public.venue_content enable row level security;
create policy "templates read authenticated" on public.checklist_templates for select to authenticated using (is_active or public.is_admin());
create policy "templates admin write" on public.checklist_templates for all using (public.is_admin()) with check (public.is_admin());
create policy "venue content read authenticated" on public.venue_content for select to authenticated using (is_active or public.is_admin());
create policy "venue content admin write" on public.venue_content for all using (public.is_admin()) with check (public.is_admin());

-- Private storage bucket. Paths must begin with the wedding UUID.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wedding-documents',
  'wedding-documents',
  false,
  26214400,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/csv', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do nothing;

create policy "wedding files read members" on storage.objects
for select to authenticated using (
  bucket_id = 'wedding-documents'
  and public.can_access_wedding(((storage.foldername(name))[1])::uuid)
);
create policy "wedding files upload managers" on storage.objects
for insert to authenticated with check (
  bucket_id = 'wedding-documents'
  and public.can_manage_wedding(((storage.foldername(name))[1])::uuid)
);
create policy "wedding files update managers" on storage.objects
for update to authenticated using (
  bucket_id = 'wedding-documents'
  and public.can_manage_wedding(((storage.foldername(name))[1])::uuid)
);
create policy "wedding files delete managers" on storage.objects
for delete to authenticated using (
  bucket_id = 'wedding-documents'
  and public.can_manage_wedding(((storage.foldername(name))[1])::uuid)
);

grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.can_access_wedding(uuid) to authenticated;
grant execute on function public.can_manage_wedding(uuid) to authenticated;
grant execute on function public.is_wedding_creator(uuid) to authenticated;
grant execute on function public.can_manage_membership(uuid) to authenticated;
