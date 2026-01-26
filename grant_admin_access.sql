-- Grant Admin Access to Current User
-- Run this in Supabase SQL Editor to give yourself admin access
-- Replace 'YOUR_EMAIL@example.com' with your actual email address

-- Option 1: Grant admin to a specific email
UPDATE profiles
SET role = 'admin', is_active = true
WHERE email = 'YOUR_EMAIL@example.com';

-- Option 2: Grant admin to ALL existing users (use with caution!)
-- UPDATE profiles
-- SET role = 'admin', is_active = true
-- WHERE role != 'admin';

-- Option 3: Find your user ID first, then update
-- Step 1: Run this to find your user ID
-- SELECT id, email FROM auth.users WHERE email = 'YOUR_EMAIL@example.com';

-- Step 2: Then run this with your actual UUID
-- UPDATE profiles
-- SET role = 'admin', is_active = true
-- WHERE id = 'YOUR_UUID_HERE';

-- Verify it worked:
-- SELECT id, email, role, is_active FROM profiles WHERE email = 'YOUR_EMAIL@example.com';


