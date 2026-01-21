PoojaNow Dev Handoff Document

Version: v1.0
Stack: Next.js (App Router) + Supabase (Auth, Postgres, Storage, Realtime)
Payments: Razorpay (India), optional Stripe later
Video: Phase 1 public streams via Mux or Cloudflare Stream, private sessions via Daily/Twilio later

0) Goals and scope
Goals

Public marketing site with feature pages (SEO-friendly)

Working marketplace features:

Temples list and detail

Pandits list and detail

Offerings catalogue (global + temple-specific)

Booking + payment + completion proof

Live page like Instagram showing all active streams

Role-based portals:

User area

Pandit portal

Admin console (hidden entry)

Out of scope for V1 (can be stubbed)

Ratings and reviews (UI can exist, data not required)

Prasad shipping

Multi-language content

Automated KYC

Full real-time chat

1) Architecture
Frontend

Next.js 14+ App Router

Tailwind + shadcn/ui

Supabase JS client

Server Actions for sensitive operations

Zod validation on forms

Backend

Supabase Auth with Role management

Postgres schema with RLS policies

Supabase Storage for images and proof media

Supabase Realtime for live stream list updates (optional, polling acceptable in v1)

Environments

dev: Supabase project (dev)

prod: Supabase project (prod)

Vercel deployment with env vars

2) User roles and permissions

Roles: user, pandit, admin

Role assignment

Default signup creates role user

Pandit accounts created by admin invite or user applies then admin upgrades to pandit

Admin accounts only seeded manually in DB and allowlisted by email

Access rules

Public pages accessible to all

User routes require auth with role user

Pandit routes require auth with role pandit

Admin routes require auth with role admin AND allowlisted email

3) Routes and pages
Public marketing

/ Landing page

/how-it-works

/features/live-darshan

/features/book-pooja

/features/offerings

/features/prasad (Coming soon)

/temples

/temples/[slug]

/pandits

/pandits/[slug]

/events

/live

/live/[streamId]

/legal/terms

/legal/privacy

/support

Auth

/login

/signup

/forgot-password

User area

/u/home

/u/bookings

/u/booking/[id]

/u/payments

/u/profile

Pandit portal

/p/dashboard

/p/calendar

/p/bookings

/p/booking/[id]

/p/services

/p/go-live

/p/payouts

/p/profile

Admin console (hidden)

/admin

/admin/temples

/admin/pandits

/admin/services

/admin/offerings

/admin/events

/admin/bookings

/admin/live-moderation

/admin/pricing

/admin/payouts

/admin/cms

4) Critical user flows
4.1 Browse and book (User)

User visits temple or pandit page

Selects service (live darshan or pooja)

Chooses slot (scheduled) or selects “Now” (instant request if enabled)

Adds offerings (optional)

Checkout, Razorpay payment

Booking status becomes confirmed

Pandit performs session

Pandit uploads proof (photo or short clip)

Booking marked completed

User sees proof in booking detail

4.2 Pandit schedule management

Pandit sets availability slots

Receives booking requests

Accepts or rejects (for scheduled, optional auto-accept)

Performs session

Uploads proof and marks complete

4.3 Public live streams

Admin or pandit starts a public stream (creates streams row with status live and playback url)

/live lists all streams with status live

/live/[id] shows player and offerings panel

Admin can hide or end streams

4.4 Admin moderation and payouts

Admin approves temples, pandits, services

Admin handles refunds and disputes

Admin runs payout batch weekly

Ledger entries move from pending to paid

5) Data model and schema (Supabase Postgres)

Use UUIDs for ids. Timestamps in UTC.

5.1 Core tables
profiles

Stores user profile and role.

id uuid PK references auth.users(id)

full_name text

email text

phone text

role text check in ('user','pandit','admin')

is_active boolean default true

created_at timestamptz default now()

Indexes:

role

is_active

temples

id uuid PK

name text

slug text unique

city text

state text

country text default 'India'

deity text

description text

address text

geo_lat numeric nullable

geo_lng numeric nullable

verified boolean default false

status text check in ('draft','published','suspended') default 'draft'

hero_image_path text nullable (Supabase storage)

created_by uuid references profiles(id)

created_at timestamptz default now()

Indexes:

status

verified

city, state

deity

pandit_profiles

id uuid PK references profiles(id)

bio text

languages text[] default '{}'

specialties text[] default '{}'

city text

state text

temple_id uuid references temples(id) nullable

verification_status text check in ('pending','verified','rejected') default 'pending'

profile_status text check in ('draft','published','suspended') default 'draft'

profile_image_path text nullable

created_at timestamptz default now()

Indexes:

verification_status

profile_status

city, state

services

Services can belong to a temple or a pandit or both.

id uuid PK

service_type text check in ('live_darshan','pooja','consult') default 'pooja'

title text

description text

duration_minutes int

base_price_inr int

temple_id uuid references temples(id) nullable

pandit_id uuid references profiles(id) nullable

status text check in ('draft','published','suspended') default 'draft'

created_at timestamptz default now()

Indexes:

service_type

status

temple_id

pandit_id

offerings

Offerings are add-ons and can be global or temple-specific.

id uuid PK

title text

description text

price_inr int

temple_id uuid references temples(id) nullable

active boolean default true

sort_order int default 0

created_at timestamptz default now()

Indexes:

active

temple_id

availability_slots

Pandit availability slots.

id uuid PK

pandit_id uuid references profiles(id)

start_time timestamptz

end_time timestamptz

status text check in ('open','booked','blocked') default 'open'

created_at timestamptz default now()

Indexes:

pandit_id

start_time

status

bookings

id uuid PK

user_id uuid references profiles(id)

temple_id uuid references temples(id) nullable

pandit_id uuid references profiles(id) nullable

service_id uuid references services(id)

scheduled_at timestamptz nullable (null for instant)

duration_minutes int

status text check in (
'created','payment_pending','confirmed','rejected','cancelled',
'in_progress','completed','refunded'
) default 'created'

notes text nullable (sankalp details)

currency text default 'INR'

subtotal_amount int default 0

total_amount int default 0

proof_status text check in ('none','uploaded','approved') default 'none'

created_at timestamptz default now()

Indexes:

user_id

pandit_id

temple_id

status

scheduled_at

booking_offerings

id uuid PK

booking_id uuid references bookings(id) on delete cascade

offering_id uuid references offerings(id)

qty int default 1

unit_price_inr_snapshot int

created_at timestamptz default now()

Index:

booking_id

payments

id uuid PK

booking_id uuid references bookings(id) unique

provider text check in ('razorpay','stripe') default 'razorpay'

provider_order_id text

provider_payment_id text nullable

provider_signature text nullable

amount_inr int

status text check in ('created','authorized','captured','failed','refunded') default 'created'

created_at timestamptz default now()

Index:

booking_id

status

booking_proofs

Stores proof uploads.

id uuid PK

booking_id uuid references bookings(id) on delete cascade

media_type text check in ('image','video')

storage_path text

uploaded_by uuid references profiles(id)

approved_by uuid references profiles(id) nullable

status text check in ('uploaded','approved','rejected') default 'uploaded'

created_at timestamptz default now()

Index:

booking_id

status

streams

Public or private streams.

id uuid PK

stream_type text check in ('public','private') default 'public'

temple_id uuid references temples(id) nullable

pandit_id uuid references profiles(id) nullable

title text

thumbnail_path text nullable

playback_url text

status text check in ('live','ended','hidden') default 'live'

viewer_count int default 0

started_at timestamptz default now()

ended_at timestamptz nullable

Indexes:

status

temple_id

pandit_id

events

Festival and special events.

id uuid PK

title text

description text

start_date date

end_date date

temple_id uuid references temples(id) nullable

pandit_id uuid references profiles(id) nullable

status text check in ('draft','published','archived') default 'draft'

created_at timestamptz default now()

Indexes:

status

start_date

pricing_rules

id uuid PK

key text unique (example: 'platform_commission_percent')

value jsonb

updated_by uuid references profiles(id)

updated_at timestamptz default now()

ledger_entries

id uuid PK

booking_id uuid references bookings(id) unique

pandit_id uuid references profiles(id)

gross_inr int

commission_inr int

net_inr int

payout_status text check in ('pending','processing','paid','held') default 'pending'

payout_batch_id uuid nullable

created_at timestamptz default now()

Indexes:

pandit_id

payout_status

payout_batches

id uuid PK

batch_name text

status text check in ('draft','processing','completed') default 'draft'

run_by uuid references profiles(id)

created_at timestamptz default now()

6) RLS policies (required)

Enable RLS on all tables.

profiles

Select: user can select own profile

Update: user can update own profile fields (not role)

Admin can select/update any

temples

Public can select where status = published

Admin can CRUD

Pandit can read all published

pandit_profiles

Public can select where profile_status = published and verification_status = verified

Pandit can update own row (limited fields), changes may require admin approval

Admin can CRUD

services

Public can select published services

Pandit can manage own services

Admin can manage all

offerings

Public can select active offerings, global or temple-specific

Admin can CRUD

availability_slots

Pandit can CRUD own slots

User can read slots for a given pandit only if they are open

Admin can read all

bookings

User can select own bookings

Pandit can select bookings where pandit_id = their id

Admin can select all

Updates restricted by role and state machine rules, implement via server actions

payments

User can select own payment by joining bookings, or via view

Admin select all

Insert and update only via server actions

booking_proofs

User can select proofs for own bookings

Pandit can insert proofs for bookings assigned to them

Admin can approve/reject

streams

Public can select where status = live

Pandit can create streams only for themselves (optional)

Admin can hide or end any

Note for dev: enforce booking status transitions in server actions, not RLS alone.

7) API and server actions

No separate server needed. Use Next.js server actions and route handlers.

7.1 Auth

Supabase Auth with email + OTP or email + password.

7.2 Public data endpoints (server components can query directly)

Get published temples with filters

Get published pandits with filters

Get offerings for temple

Get live streams list

7.3 Booking actions
Create booking

Action: createBooking
Input:

user_id

service_id

temple_id optional

pandit_id optional

scheduled_at optional

notes optional

offerings[] {offering_id, qty}

Logic:

Validate service published

Validate pandit availability if scheduled

Compute subtotal = service base + offerings

Insert bookings with status payment_pending

Insert booking_offerings with snapshot price

Create Razorpay order for total

Insert payments row with provider_order_id
Output:

booking_id

razorpay_order_details

Verify payment webhook

Route: /api/webhooks/razorpay
Logic:

Verify signature

Update payments status captured

Update booking status confirmed

Generate ledger entry (commission)

Lock selected availability slot as booked if scheduled

Cancel booking

Action: cancelBooking
Rules:

User can cancel only before confirmed or within defined window

Admin override allowed

Pandit accept or reject booking

Action: panditRespondBooking

sets confirmed or rejected

if rejected, trigger refund if already paid (admin or automated)

Start session

Action: startBookingSession

booking status -> in_progress

Complete session

Action: completeBooking

requires proof uploaded OR admin override

booking status -> completed

ledger entry set pending payout

7.4 Live streams actions
Create stream

Action: createStream

Only admin or pandit

Stores playback_url from Mux/Cloudflare

status live

End stream

Action: endStream

status ended

Hide stream

Action: hideStream

status hidden

Viewer count can be best-effort.

8) UI requirements
Global

Mobile-first

Fast list views with pagination

SEO:

temples and pandits pages statically rendered with revalidate

use metadata per page

Search:

basic text search using ILIKE

later add full-text index

Live page

/live grid of stream cards

card shows thumbnail, temple, title, live badge

open player page with offerings sidebar

Checkout

order summary

offerings add/remove

payment via Razorpay checkout

confirmation screen with booking id

Proof upload

Pandit uploads photo or short video

Store in Supabase storage bucket proofs

Generate signed URLs for user access

9) Storage buckets

temple-images

pandit-images

stream-thumbnails

proofs

Policy:

Public read for temple and pandit images

Proofs private, signed URL access

Only pandit/admin can upload proofs

10) Admin console requirements
Must have panels

Temple management

create, edit, publish, suspend, verify

Pandit management

approve, verify, suspend

upgrade role to pandit

Services and offerings management

Bookings management

status overrides

refunds trigger

Live moderation

hide streams

end streams

Pricing rules

commission percent

Payouts

generate payout batch

mark entries paid

Admin hidden entry:

/admin accessible only if role admin

also check email allowlist in pricing_rules or a new table admin_allowlist

11) Pricing and commission logic

Store commission percent in pricing_rules:

key: platform_commission_percent

value: { "percent": 15 }

When payment captured:

gross = booking total

commission = round(gross * percent / 100)

net = gross - commission
Insert into ledger_entries with payout_status pending

12) Non-functional requirements
Security

Strict RLS on all tables

Webhook verification mandatory

Admin routes protected on server side, not only client

Prevent IDOR by always joining bookings to user_id or pandit_id

Logging and audit

Create audit_logs table (optional but recommended)

action, actor_id, entity, entity_id, metadata, created_at

Performance

Use pagination on lists

Create indexes listed above

Avoid loading media in list pages, use thumbnails only

Timezones

Store times in UTC

UI displays in user local timezone

Default calendar creation in Asia/Kolkata

13) Delivery plan (build order)

Auth + roles + protected routing

Public pages + landing + feature pages

Temples and pandits directories + details

Admin CRUD for temples, pandits, services, offerings

Availability slots + booking flow

Razorpay checkout + webhook + booking confirmation

Proof upload + completion

Live streams pages + admin moderation

Pandit portal calendar + booking management

Payout ledger and admin payout batch

14) Open questions to decide during implementation

Instant booking allocation:

assign by “next available pandit” or temple queue

Public live streams source:

temples stream continuously or scheduled streams only

Proof requirements:

mandatory photo for all bookings or only certain services

Refund rules:

time-based window or admin-only refunds

Dev can implement defaults:

No instant allocation in v1, scheduled only

Public streams only via admin start

Proof mandatory for completion

Refunds admin-only in v1

15) Suggested additions that improve investor demo

“Verified” badges everywhere

Proof pack per booking

Festival event landing pages with packages

CMS blocks for homepage sections (simple JSON in DB)
