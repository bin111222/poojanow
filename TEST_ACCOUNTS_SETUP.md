# Test Accounts Setup Guide

> ⚠️ **IMPORTANT:** If you're getting "Invalid login credentials", the accounts don't exist in Supabase Auth yet. Follow the steps below.

## Quick Setup (Recommended)

### Step 1: Create Users in Supabase Auth

1. Go to your **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add User"** and create these 3 accounts:

#### Test User (Regular Devotee)
- **Email:** `user@test.com`
- **Password:** `test123456`
- **Auto Confirm:** ✅ (check this box)

#### Test Pandit
- **Email:** `pandit@test.com`
- **Password:** `test123456`
- **Auto Confirm:** ✅ (check this box)

#### Test Admin
- **Email:** `admin@test.com`
- **Password:** `test123456`
- **Auto Confirm:** ✅ (check this box)

### Step 2: Get User UUIDs

After creating the users, run this SQL in **Supabase SQL Editor**:

```sql
SELECT id, email FROM auth.users 
WHERE email IN ('user@test.com', 'pandit@test.com', 'admin@test.com');
```

Copy the UUIDs for each email.

### Step 3: Create Profiles

Run this SQL in **Supabase SQL Editor**, replacing the UUIDs with the ones you copied:

```sql
-- Test User
INSERT INTO profiles (id, full_name, email, phone, role, is_active)
VALUES (
  'YOUR_USER_UUID_HERE', -- Replace with actual UUID
  'Test User',
  'user@test.com',
  '+91 98765 43210',
  'user',
  true
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Test Pandit
INSERT INTO profiles (id, full_name, email, phone, role, is_active)
VALUES (
  'YOUR_PANDIT_UUID_HERE', -- Replace with actual UUID
  'Test Pandit',
  'pandit@test.com',
  '+91 98765 43211',
  'pandit',
  true
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Create Pandit Profile
INSERT INTO pandit_profiles (
  id, bio, languages, specialties, city, state,
  verification_status, profile_status
)
VALUES (
  'YOUR_PANDIT_UUID_HERE', -- Replace with actual UUID
  'Experienced Vedic scholar with 15+ years of practice. Specializes in Rudrabhishek, Ganesh Pooja, and daily rituals.',
  ARRAY['Hindi', 'Sanskrit', 'English'],
  ARRAY['Rudrabhishek', 'Ganesh Pooja', 'Daily Aarti'],
  'Varanasi',
  'Uttar Pradesh',
  'verified',
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  bio = EXCLUDED.bio,
  verification_status = 'verified',
  profile_status = 'published';

-- Test Admin
INSERT INTO profiles (id, full_name, email, phone, role, is_active)
VALUES (
  'YOUR_ADMIN_UUID_HERE', -- Replace with actual UUID
  'Test Admin',
  'admin@test.com',
  '+91 98765 43212',
  'admin',
  true
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;
```

## Alternative: Automated Setup

If you prefer, you can use the helper function in `supabase/seed_test_accounts.sql`:

1. Create users in Auth Dashboard (Step 1 above)
2. Run: `SELECT create_test_accounts();` in SQL Editor

## Test Account Credentials Summary

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **User** | `user@test.com` | `test123456` | Can book poojas, view bookings |
| **Pandit** | `pandit@test.com` | `test123456` | Can view assigned bookings, upload proof |
| **Admin** | `admin@test.com` | `test123456` | Full admin access, temple ops dashboard |

## Testing Workflow

1. **As User:**
   - Login with `user@test.com`
   - Browse temples → Book Rudrabhishek
   - View bookings in `/u/bookings`

2. **As Pandit:**
   - Login with `pandit@test.com`
   - View assigned bookings in `/p/bookings`
   - Upload proof for bookings
   - Cannot complete without proof

3. **As Admin:**
   - Login with `admin@test.com`
   - Access admin dashboard at `/admin`
   - Access temple ops at `/t/ops`
   - Manage temples, pandits, bookings

## Troubleshooting

### "User not found" error
- Make sure you created the user in Supabase Auth Dashboard first
- Check that the UUID matches between `auth.users` and `profiles`

### "Access denied" error
- Verify the role is set correctly in the `profiles` table
- Check that `is_active = true` in profiles

### Pandit can't see bookings
- Make sure pandit profile is `verified` and `published`
- Assign bookings to the pandit via admin dashboard

