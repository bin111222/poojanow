-- Quick Fix: Make All Pandits Visible
-- Run this in Supabase SQL Editor to make pandits visible immediately

-- 1. Check current status
SELECT 
  profile_status,
  verification_status,
  COUNT(*) as count
FROM pandit_profiles
GROUP BY profile_status, verification_status;

-- 2. Update all pandits to published (if they're draft)
UPDATE pandit_profiles 
SET profile_status = 'published'
WHERE profile_status IN ('draft', 'suspended');

-- 3. Verify the update
SELECT 
  COUNT(*) as total_published
FROM pandit_profiles
WHERE profile_status = 'published';

-- 4. Check if profiles exist for pandits
SELECT 
  COUNT(*) as pandits_with_profiles
FROM pandit_profiles pp
INNER JOIN profiles p ON p.id = pp.id
WHERE pp.profile_status = 'published';

-- 5. If profiles are missing, check what's needed
-- (This will show which pandit_profiles don't have matching profiles)
SELECT 
  pp.id,
  pp.profile_status,
  p.id as profile_exists
FROM pandit_profiles pp
LEFT JOIN profiles p ON p.id = pp.id
WHERE pp.profile_status = 'published'
AND p.id IS NULL;

-- 6. Ensure RLS policy exists (run migration 003 if not done)
-- This should already be done, but verify:
SELECT * FROM pg_policies 
WHERE tablename = 'pandit_profiles';

-- Expected result: Should see "Public can view published pandits" policy


