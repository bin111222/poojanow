-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles (Users, Pandits, Admins)
create table profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  email text,
  phone text,
  role text check (role in ('user', 'pandit', 'admin')),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 2. Temples
create table temples (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  city text,
  state text,
  country text default 'India',
  deity text,
  description text,
  address text,
  geo_lat numeric,
  geo_lng numeric,
  verified boolean default false,
  status text check (status in ('draft', 'published', 'suspended')) default 'draft',
  hero_image_path text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- 3. Pandit Profiles
create table pandit_profiles (
  id uuid references profiles(id) primary key,
  bio text,
  languages text[] default '{}',
  specialties text[] default '{}',
  city text,
  state text,
  temple_id uuid references temples(id),
  verification_status text check (verification_status in ('pending', 'verified', 'rejected')) default 'pending',
  profile_status text check (profile_status in ('draft', 'published', 'suspended')) default 'draft',
  profile_image_path text,
  created_at timestamptz default now()
);

-- 4. Services
create table services (
  id uuid primary key default uuid_generate_v4(),
  service_type text check (service_type in ('live_darshan', 'pooja', 'consult')) default 'pooja',
  title text not null,
  description text,
  duration_minutes int,
  base_price_inr int,
  temple_id uuid references temples(id),
  pandit_id uuid references profiles(id),
  status text check (status in ('draft', 'published', 'suspended')) default 'draft',
  created_at timestamptz default now()
);

-- 5. Offerings
create table offerings (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  price_inr int,
  temple_id uuid references temples(id),
  active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 6. Availability Slots
create table availability_slots (
  id uuid primary key default uuid_generate_v4(),
  pandit_id uuid references profiles(id) not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text check (status in ('open', 'booked', 'blocked')) default 'open',
  created_at timestamptz default now()
);

-- 7. Bookings
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) not null,
  temple_id uuid references temples(id),
  pandit_id uuid references profiles(id),
  service_id uuid references services(id) not null,
  scheduled_at timestamptz,
  duration_minutes int,
  status text check (status in ('created', 'payment_pending', 'confirmed', 'rejected', 'cancelled', 'in_progress', 'completed', 'refunded')) default 'created',
  notes text,
  currency text default 'INR',
  subtotal_amount int default 0,
  total_amount int default 0,
  proof_status text check (proof_status in ('none', 'uploaded', 'approved')) default 'none',
  created_at timestamptz default now()
);

-- 8. Booking Offerings
create table booking_offerings (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references bookings(id) on delete cascade not null,
  offering_id uuid references offerings(id) not null,
  qty int default 1,
  unit_price_inr_snapshot int,
  created_at timestamptz default now()
);

-- 9. Payments
create table payments (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references bookings(id) unique not null,
  provider text check (provider in ('razorpay', 'stripe')) default 'razorpay',
  provider_order_id text,
  provider_payment_id text,
  provider_signature text,
  amount_inr int,
  status text check (status in ('created', 'authorized', 'captured', 'failed', 'refunded')) default 'created',
  created_at timestamptz default now()
);

-- 10. Booking Proofs
create table booking_proofs (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references bookings(id) on delete cascade not null,
  media_type text check (media_type in ('image', 'video')),
  storage_path text not null,
  uploaded_by uuid references profiles(id) not null,
  approved_by uuid references profiles(id),
  status text check (status in ('uploaded', 'approved', 'rejected')) default 'uploaded',
  created_at timestamptz default now()
);

-- 11. Streams
create table streams (
  id uuid primary key default uuid_generate_v4(),
  stream_type text check (stream_type in ('public', 'private')) default 'public',
  temple_id uuid references temples(id),
  pandit_id uuid references profiles(id),
  title text,
  thumbnail_path text,
  playback_url text,
  status text check (status in ('live', 'ended', 'hidden')) default 'live',
  viewer_count int default 0,
  started_at timestamptz default now(),
  ended_at timestamptz
);

-- 12. Events
create table events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  start_date date,
  end_date date,
  temple_id uuid references temples(id),
  pandit_id uuid references profiles(id),
  status text check (status in ('draft', 'published', 'archived')) default 'draft',
  created_at timestamptz default now()
);

-- 13. Pricing Rules
create table pricing_rules (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value jsonb,
  updated_by uuid references profiles(id),
  updated_at timestamptz default now()
);

-- 14. Payout Batches
create table payout_batches (
  id uuid primary key default uuid_generate_v4(),
  batch_name text,
  status text check (status in ('draft', 'processing', 'completed')) default 'draft',
  run_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- 15. Ledger Entries
create table ledger_entries (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references bookings(id) unique not null,
  pandit_id uuid references profiles(id) not null,
  gross_inr int,
  commission_inr int,
  net_inr int,
  payout_status text check (payout_status in ('pending', 'processing', 'paid', 'held')) default 'pending',
  payout_batch_id uuid references payout_batches(id),
  created_at timestamptz default now()
);

-- RLS Policies (Basic Setup - to be refined)
alter table profiles enable row level security;
alter table temples enable row level security;
alter table pandit_profiles enable row level security;
alter table services enable row level security;
alter table offerings enable row level security;
alter table availability_slots enable row level security;
alter table bookings enable row level security;
alter table booking_offerings enable row level security;
alter table payments enable row level security;
alter table booking_proofs enable row level security;
alter table streams enable row level security;
alter table events enable row level security;
alter table pricing_rules enable row level security;
alter table payout_batches enable row level security;
alter table ledger_entries enable row level security;

-- Create a trigger to automatically create a profile entry when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

