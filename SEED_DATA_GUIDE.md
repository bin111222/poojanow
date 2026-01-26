# Comprehensive Seed Data Guide

## Overview

The `seed_mega_comprehensive.sql` file blasts your PoojaNow site with realistic mock data for testing and development.

## What Gets Created

### Temples (150)
- Each temple has a unique slug and full details
- 80% are verified
- All are published
- Each has 2-5 services
- Each has 3-8 offerings

### Services
- **At least one active bookable service per temple** (marked with `is_active_single_pooja = true`)
- Mix of pooja, consultation, and live darshan services
- Realistic pricing (₹99 - ₹2999)
- Proper durations (15-120 minutes)

### Pandits (200)
- Assigned to temples
- 90% verified, 95% published
- Realistic bios, languages, and specialties
- Profile images from Unsplash

### Bookings (500)
- Mix of statuses:
  - 30% completed
  - 20% confirmed
  - 20% payment_pending
  - 15% in_progress
  - 10% created
  - 5% cancelled
- Past bookings for completed/cancelled
- Future bookings for others
- Payments created for confirmed/completed/in_progress bookings

### Live Streams (50)
- Mix of public/private
- Some live, some ended, some hidden
- Assigned to temples and pandits

### Events (100)
- Festival celebrations
- Past and future dates
- Published/archived status

### Availability Slots
- 5 slots per pandit on average
- Mix of open, booked, and blocked

## How to Run

### Option 1: Supabase Dashboard
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy and paste the entire `seed_mega_comprehensive.sql` file
4. Click "Run"

### Option 2: Supabase CLI
```bash
supabase db reset
psql -h your-db-host -U postgres -d postgres -f supabase/seed_mega_comprehensive.sql
```

### Option 3: Direct PostgreSQL
```bash
psql -h your-db-host -U postgres -d your-database -f supabase/seed_mega_comprehensive.sql
```

## Important Notes

⚠️ **This script will DELETE all existing data** in:
- profiles (except auth.users)
- temples
- services
- pandits
- bookings
- offerings
- streams
- events
- availability_slots

⚠️ **Foreign Key Constraints**
- The script temporarily drops some FK constraints to allow seed data
- It attempts to re-add them at the end
- Some constraints (like `profiles.id -> auth.users`) may fail if the UUIDs don't exist in auth.users - this is expected for seed data

## After Running

You'll have:
- ✅ 150 temples with full booking routes
- ✅ 200+ pandits ready to serve
- ✅ 500+ bookings for testing workflows
- ✅ Live streams and events
- ✅ Complete offerings for each temple

## Verification Queries

Run these to verify the seed:

```sql
-- Count everything
SELECT 'Temples' as entity, count(*) as count FROM temples
UNION ALL
SELECT 'Active Services', count(*) FROM services WHERE is_active_single_pooja = true
UNION ALL
SELECT 'Bookings', count(*) FROM bookings
UNION ALL
SELECT 'Pandits', count(*) FROM pandit_profiles WHERE profile_status = 'published';

-- Check temples with active services
SELECT t.name, COUNT(s.id) as active_services
FROM temples t
LEFT JOIN services s ON s.temple_id = t.id AND s.is_active_single_pooja = true
GROUP BY t.id, t.name
HAVING COUNT(s.id) = 0; -- Should return 0 rows
```

## Customization

Want more/less data? Edit these variables at the top of the DO block:

```sql
v_temple_count  int := 150;  -- Change to your desired count
v_pandit_count  int := 200;
v_booking_count int := 500;
v_stream_count  int := 50;
v_event_count   int := 100;
```

## Troubleshooting

**Error: "relation does not exist"**
- Make sure you've run the migrations first (`001_phase1_foundation.sql`)

**Error: "constraint violation"**
- The script handles FK constraints automatically
- If you see warnings about constraints, they're expected for seed data

**No active services showing**
- Check that `is_active_single_pooja = true` on services
- Verify temple status is 'published'

