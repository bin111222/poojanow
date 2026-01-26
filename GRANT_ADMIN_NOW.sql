-- ============================================
-- QUICK FIX: Grant Admin Access to Your Account
-- ============================================
-- Run this in Supabase SQL Editor
-- Replace 'YOUR_EMAIL@example.com' with your actual email

-- Step 1: First, check what your email is in auth.users
-- Run this to see all users:
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- Step 2: Grant admin access (replace with your email)
UPDATE profiles
SET role = 'admin', is_active = true
WHERE email = 'YOUR_EMAIL@example.com';

-- Step 3: If profile doesn't exist, create it first
-- Get your user ID from Step 1, then run:
-- INSERT INTO profiles (id, email, full_name, role, is_active)
-- VALUES (
--   'YOUR_USER_ID_HERE',
--   'YOUR_EMAIL@example.com',
--   'Admin User',
--   'admin',
--   true
-- )
-- ON CONFLICT (id) DO UPDATE SET
--   role = 'admin',
--   is_active = true;

-- Step 4: Verify it worked
SELECT id, email, role, is_active 
FROM profiles 
WHERE email = 'YOUR_EMAIL@example.com';

-- ============================================
-- ALTERNATIVE: Grant Admin to ALL Users (Dev Only!)
-- ============================================
-- WARNING: Only use in development!
-- UPDATE profiles
-- SET role = 'admin', is_active = true;

-- ============================================
-- Fix RLS Policy (Run this first if updates fail)
-- ============================================
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


