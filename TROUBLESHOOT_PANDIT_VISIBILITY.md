# Troubleshooting: Pandit Profiles Not Visible

## Quick Fix

### 1. Run the Migration
Go to Supabase Dashboard → SQL Editor and run:
```sql
-- File: supabase/migrations/003_fix_pandit_visibility.sql
```

### 2. Check Your Pandit Data Status

Run this diagnostic query to see what status your pandits have:

```sql
SELECT 
  pp.id,
  pp.profile_status,
  pp.verification_status,
  p.full_name,
  p.role,
  pp.city,
  pp.state
FROM pandit_profiles pp
LEFT JOIN profiles p ON p.id = pp.id
ORDER BY pp.created_at DESC;
```

### 3. Common Issues & Solutions

#### Issue: Pandits have `profile_status = 'draft'`
**Solution:** Update them to `published`:
```sql
UPDATE pandit_profiles 
SET profile_status = 'published' 
WHERE profile_status = 'draft';
```

#### Issue: Pandits exist but no profiles linked
**Solution:** Ensure profiles exist:
```sql
-- Check if profiles exist for pandits
SELECT pp.id, p.id as profile_exists
FROM pandit_profiles pp
LEFT JOIN profiles p ON p.id = pp.id
WHERE p.id IS NULL;

-- If missing, create them (adjust as needed)
-- This assumes you have auth.users entries
```

#### Issue: RLS Policy blocking access
**Solution:** The migration should fix this, but verify:
```sql
-- Check existing policies
SELECT * FROM pg_policies 
WHERE tablename = 'pandit_profiles';

-- Should see: "Public can view published pandits"
```

### 4. Quick Fix: Make All Pandits Visible

If you want to quickly make all existing pandits visible for testing:

```sql
-- Update all pandit profiles to published
UPDATE pandit_profiles 
SET profile_status = 'published'
WHERE profile_status IN ('draft', 'suspended');

-- Optional: Also set verification status
UPDATE pandit_profiles 
SET verification_status = 'verified'
WHERE verification_status = 'pending';
```

### 5. Verify the Fix

After running the fixes, check:

```sql
-- Count published pandits
SELECT 
  profile_status,
  verification_status,
  COUNT(*) as count
FROM pandit_profiles
GROUP BY profile_status, verification_status;
```

You should see at least some rows with `profile_status = 'published'`.

### 6. Test the Frontend

1. Go to `/pandits` page
2. Check browser console for any errors
3. Check network tab to see the API response
4. The debug logs I added will show:
   - How many pandits were found
   - Sample pandit data

## What Changed

1. **Query Updated**: Removed `verification_status = 'verified'` filter
   - Now shows all published pandits regardless of verification status
   - You can still show a "Verified" badge in the UI

2. **RLS Policy**: Ensured policy allows viewing published pandits

3. **Debug Logging**: Added console logs to help diagnose issues

## Next Steps

1. Run the diagnostic query to see your data
2. Update pandit statuses if needed
3. Run the migration
4. Refresh the `/pandits` page
5. Check browser console for debug output

If pandits still don't show, check:
- Are there any pandit_profiles rows in the database?
- Do they have `profile_status = 'published'`?
- Are there corresponding `profiles` rows with `role = 'pandit'`?
- Are there any RLS policy errors in Supabase logs?


