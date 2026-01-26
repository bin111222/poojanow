-- Quick Test Accounts Creation Script
-- Run this AFTER creating users in Supabase Auth Dashboard

-- Step 1: First, get the UUIDs (run this query first)
-- SELECT id, email FROM auth.users 
-- WHERE email IN ('user@test.com', 'pandit@test.com', 'admin@test.com')
-- ORDER BY email;

-- Step 2: Then run this script (it will automatically find the UUIDs)

DO $$
DECLARE
  v_user_id uuid;
  v_pandit_id uuid;
  v_admin_id uuid;
BEGIN
  -- Get UUIDs from auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'user@test.com' LIMIT 1;
  SELECT id INTO v_pandit_id FROM auth.users WHERE email = 'pandit@test.com' LIMIT 1;
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@test.com' LIMIT 1;

  -- Create User Profile
  IF v_user_id IS NOT NULL THEN
    INSERT INTO profiles (id, full_name, email, phone, role, is_active)
    VALUES (v_user_id, 'Test User', 'user@test.com', '+91 98765 43210', 'user', true)
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      role = EXCLUDED.role,
      is_active = EXCLUDED.is_active;
    
    RAISE NOTICE 'User profile created: %', v_user_id;
  ELSE
    RAISE WARNING 'User user@test.com not found in auth.users. Create it first in Auth Dashboard!';
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
    
    RAISE NOTICE 'Pandit profile created: %', v_pandit_id;
  ELSE
    RAISE WARNING 'User pandit@test.com not found in auth.users. Create it first in Auth Dashboard!';
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
    
    RAISE NOTICE 'Admin profile created: %', v_admin_id;
  ELSE
    RAISE WARNING 'User admin@test.com not found in auth.users. Create it first in Auth Dashboard!';
  END IF;

  RAISE NOTICE '✅ Test accounts setup complete!';
  RAISE NOTICE 'You can now login with:';
  RAISE NOTICE '  - user@test.com / test123456';
  RAISE NOTICE '  - pandit@test.com / test123456';
  RAISE NOTICE '  - admin@test.com / test123456';
END $$;

-- Verify the accounts were created
SELECT 
  p.email,
  p.role,
  p.is_active,
  CASE WHEN pp.id IS NOT NULL THEN 'Yes' ELSE 'No' END as has_pandit_profile
FROM profiles p
LEFT JOIN pandit_profiles pp ON pp.id = p.id
WHERE p.email IN ('user@test.com', 'pandit@test.com', 'admin@test.com')
ORDER BY p.email;


