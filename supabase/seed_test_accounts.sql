-- Test Accounts for PoojaNow
-- Run this in Supabase SQL Editor after setting up auth
-- These accounts will be created in auth.users and profiles

-- IMPORTANT: You need to create these users in Supabase Auth first, then run this script
-- OR use Supabase Dashboard → Authentication → Add User to create them

-- After creating users in Auth, update the UUIDs below with the actual user IDs from auth.users

-- ============================================
-- OPTION 1: Manual Creation (Recommended)
-- ============================================
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add User" and create these accounts:
--    - Email: user@test.com, Password: test123456
--    - Email: pandit@test.com, Password: test123456
--    - Email: admin@test.com, Password: test123456
-- 3. Copy the UUIDs from the created users
-- 4. Update the UUIDs in the INSERT statements below
-- 5. Run this script

-- ============================================
-- OPTION 2: Use Supabase Auth Admin API
-- ============================================
-- You can also create users programmatically using the Supabase Admin API
-- But for testing, manual creation is easier

-- ============================================
-- Test User Accounts
-- ============================================

-- Test User (Regular Devotee)
-- Email: user@test.com
-- Password: test123456
-- Role: user
INSERT INTO profiles (id, full_name, email, phone, role, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid, -- REPLACE WITH ACTUAL UUID FROM auth.users
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
-- Email: pandit@test.com
-- Password: test123456
-- Role: pandit
INSERT INTO profiles (id, full_name, email, phone, role, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid, -- REPLACE WITH ACTUAL UUID FROM auth.users
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

-- Create pandit profile for test pandit
INSERT INTO pandit_profiles (
  id, bio, languages, specialties, city, state,
  verification_status, profile_status
)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid, -- REPLACE WITH ACTUAL UUID
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
-- Email: admin@test.com
-- Password: test123456
-- Role: admin
INSERT INTO profiles (id, full_name, email, phone, role, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000003'::uuid, -- REPLACE WITH ACTUAL UUID FROM auth.users
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

-- ============================================
-- Helper Function to Get User IDs
-- ============================================
-- Run this query to get the actual UUIDs after creating users in Auth:
-- SELECT id, email FROM auth.users WHERE email IN ('user@test.com', 'pandit@test.com', 'admin@test.com');

-- ============================================
-- Quick Setup Script (Alternative)
-- ============================================
-- If you want to create users and profiles in one go, use this function:

CREATE OR REPLACE FUNCTION create_test_accounts()
RETURNS void AS $$
DECLARE
  v_user_id uuid;
  v_pandit_id uuid;
  v_admin_id uuid;
BEGIN
  -- Get or create user IDs (you'll need to create these in Auth first)
  -- This assumes the users already exist in auth.users
  
  -- For User
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'user@test.com' LIMIT 1;
  IF v_user_id IS NOT NULL THEN
    INSERT INTO profiles (id, full_name, email, phone, role, is_active)
    VALUES (v_user_id, 'Test User', 'user@test.com', '+91 98765 43210', 'user', true)
    ON CONFLICT (id) DO UPDATE SET role = 'user', is_active = true;
  END IF;

  -- For Pandit
  SELECT id INTO v_pandit_id FROM auth.users WHERE email = 'pandit@test.com' LIMIT 1;
  IF v_pandit_id IS NOT NULL THEN
    INSERT INTO profiles (id, full_name, email, phone, role, is_active)
    VALUES (v_pandit_id, 'Test Pandit', 'pandit@test.com', '+91 98765 43211', 'pandit', true)
    ON CONFLICT (id) DO UPDATE SET role = 'pandit', is_active = true;
    
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
      verification_status = 'verified',
      profile_status = 'published';
  END IF;

  -- For Admin
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@test.com' LIMIT 1;
  IF v_admin_id IS NOT NULL THEN
    INSERT INTO profiles (id, full_name, email, phone, role, is_active)
    VALUES (v_admin_id, 'Test Admin', 'admin@test.com', '+91 98765 43212', 'admin', true)
    ON CONFLICT (id) DO UPDATE SET role = 'admin', is_active = true;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- To use the function:
-- 1. Create users in Supabase Auth Dashboard first
-- 2. Run: SELECT create_test_accounts();


