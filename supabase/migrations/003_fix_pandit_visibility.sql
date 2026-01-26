-- Migration: Fix Pandit Visibility Issues
-- Ensures pandits are visible on the public pages

-- Update RLS policy to match the query requirements
-- The policy should allow viewing published pandits regardless of verification status
-- (We can filter by verification in the UI, but RLS should be permissive)

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view published pandits" ON pandit_profiles;

-- Create new policy that allows viewing published pandits
-- This matches what the frontend queries for
CREATE POLICY "Public can view published pandits"
ON pandit_profiles FOR SELECT
TO public
USING (profile_status = 'published');

-- Also ensure that if pandits exist but have wrong status, we can see them
-- This is a helper query to check current status
-- Run this separately to see what status your pandits have:
-- SELECT id, profile_status, verification_status, 
--        (SELECT full_name FROM profiles WHERE id = pandit_profiles.id) as name
-- FROM pandit_profiles;

-- Optional: Update existing pandits to be published if they're not
-- Uncomment and run if needed:
-- UPDATE pandit_profiles 
-- SET profile_status = 'published' 
-- WHERE profile_status = 'draft' 
-- AND id IN (SELECT id FROM profiles WHERE role = 'pandit');

