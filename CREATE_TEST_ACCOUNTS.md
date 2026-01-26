# 🚀 Quick Test Accounts Setup

## The Problem
You're seeing "Invalid login credentials" because the test accounts don't exist in Supabase Auth yet.

## Solution: Create Accounts in 2 Steps

### Step 1: Create Users in Supabase Auth Dashboard

1. **Go to your Supabase Dashboard**
   - Navigate to: **Authentication** → **Users**
   - Click the **"Add User"** button (top right)

2. **Create 3 users one by one:**

   **User 1 - Regular User:**
   - Email: `user@test.com`
   - Password: `test123456`
   - ✅ Check **"Auto Confirm User"** (important!)
   - Click **"Create User"**

   **User 2 - Pandit:**
   - Email: `pandit@test.com`
   - Password: `test123456`
   - ✅ Check **"Auto Confirm User"**
   - Click **"Create User"**

   **User 3 - Admin:**
   - Email: `admin@test.com`
   - Password: `test123456`
   - ✅ Check **"Auto Confirm User"**
   - Click **"Create User"**

### Step 2: Create Profiles in Database

1. **Go to SQL Editor** in Supabase Dashboard
2. **Get the User UUIDs** - Run this first:

```sql
SELECT id, email FROM auth.users 
WHERE email IN ('user@test.com', 'pandit@test.com', 'admin@test.com')
ORDER BY email;
```

3. **Copy the UUIDs** from the results
4. **Run this SQL** (replace the UUIDs with the ones you copied):

```sql
-- Replace these UUIDs with the actual ones from Step 2
DO $$
DECLARE
  v_user_id uuid;
  v_pandit_id uuid;
  v_admin_id uuid;
BEGIN
  -- Get UUIDs
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'user@test.com';
  SELECT id INTO v_pandit_id FROM auth.users WHERE email = 'pandit@test.com';
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@test.com';

  -- Create User Profile
  IF v_user_id IS NOT NULL THEN
    INSERT INTO profiles (id, full_name, email, phone, role, is_active)
    VALUES (v_user_id, 'Test User', 'user@test.com', '+91 98765 43210', 'user', true)
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      role = EXCLUDED.role,
      is_active = EXCLUDED.is_active;
  END IF;

  -- Create Pandit Profile
  IF v_pandit_id IS NOT NULL THEN
    INSERT INTO profiles (id, full_name, email, phone, role, is_active)
    VALUES (v_pandit_id, 'Test Pandit', 'pandit@test.com', '+91 98765 43211', 'pandit', true)
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      role = EXCLUDED.role,
      is_active = EXCLUDED.is_active;

    -- Create Pandit Profile Details
    INSERT INTO pandit_profiles (
      id, bio, languages, specialties, city, state,
      verification_status, profile_status
    )
    VALUES (
      v_pandit_id,
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
  END IF;

  -- Create Admin Profile
  IF v_admin_id IS NOT NULL THEN
    INSERT INTO profiles (id, full_name, email, phone, role, is_active)
    VALUES (v_admin_id, 'Test Admin', 'admin@test.com', '+91 98765 43212', 'admin', true)
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      role = EXCLUDED.role,
      is_active = EXCLUDED.is_active;
  END IF;

  RAISE NOTICE 'Test accounts created successfully!';
END $$;
```

## ✅ Verify It Worked

After running the SQL, verify the accounts:

```sql
SELECT p.id, p.email, p.role, p.is_active, 
       CASE WHEN pp.id IS NOT NULL THEN 'Yes' ELSE 'No' END as has_pandit_profile
FROM profiles p
LEFT JOIN pandit_profiles pp ON pp.id = p.id
WHERE p.email IN ('user@test.com', 'pandit@test.com', 'admin@test.com')
ORDER BY p.email;
```

You should see:
- `user@test.com` with role `user`
- `pandit@test.com` with role `pandit` and `has_pandit_profile = Yes`
- `admin@test.com` with role `admin`

## 🎯 Now Try Logging In

Go back to your app and try logging in with:
- **Email:** `admin@test.com`
- **Password:** `test123456`

It should work now! 🎉

## Troubleshooting

### Still getting "Invalid login credentials"?
1. Make sure you checked **"Auto Confirm User"** when creating the account
2. Double-check the email and password are exactly: `admin@test.com` / `test123456`
3. Check if the user exists: Run `SELECT * FROM auth.users WHERE email = 'admin@test.com';`

### "User not found" or role issues?
1. Make sure you ran the profile creation SQL
2. Check the profile exists: `SELECT * FROM profiles WHERE email = 'admin@test.com';`
3. Verify the role: `SELECT email, role FROM profiles WHERE email = 'admin@test.com';`

