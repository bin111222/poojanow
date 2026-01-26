# Debug: Pandits Not Visible

## Quick Diagnostic Steps

### 1. Check Server Console
Look at your terminal where `npm run dev` is running. You should see:
```
Pandits found: [number]
```

If you see `Pandits found: 0`, the query is returning empty.

### 2. Run This SQL in Supabase Dashboard

```sql
-- Check if pandits exist with published status
SELECT 
  COUNT(*) as total_pandits,
  COUNT(*) FILTER (WHERE profile_status = 'published') as published_count,
  COUNT(*) FILTER (WHERE verification_status = 'verified') as verified_count
FROM pandit_profiles;

-- See actual pandits
SELECT 
  id,
  profile_status,
  verification_status,
  city,
  state,
  (SELECT full_name FROM profiles WHERE id = pandit_profiles.id) as name
FROM pandit_profiles
LIMIT 10;
```

### 3. Check RLS Policies

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'pandit_profiles';

-- Check existing policies
SELECT * FROM pg_policies 
WHERE tablename = 'pandit_profiles';
```

### 4. Quick Fix: Update All Pandits to Published

If your pandits have `profile_status = 'draft'`, run:

```sql
-- Make all pandits published (for testing)
UPDATE pandit_profiles 
SET profile_status = 'published'
WHERE profile_status IN ('draft', 'suspended');
```

### 5. Verify Profiles Exist

```sql
-- Check if profiles exist for pandits
SELECT 
  pp.id,
  pp.profile_status,
  p.id as profile_exists,
  p.full_name,
  p.role
FROM pandit_profiles pp
LEFT JOIN profiles p ON p.id = pp.id
WHERE pp.profile_status = 'published'
LIMIT 10;
```

### 6. Test the Query Directly

```sql
-- Test the exact query the app uses
SELECT *
FROM pandit_profiles
WHERE profile_status = 'published'
LIMIT 10;
```

## Common Issues

### Issue 1: All Pandits Have `profile_status = 'draft'`
**Solution:**
```sql
UPDATE pandit_profiles SET profile_status = 'published';
```

### Issue 2: RLS Policy Blocking
**Solution:** Run migration `003_fix_pandit_visibility.sql`

### Issue 3: No Profiles Linked
**Solution:** Ensure profiles exist with matching IDs

### Issue 4: Services Join Failing
**Solution:** I've removed the services join - now fetches separately

## What I Changed

1. **Removed services join** - Was causing query to fail silently
2. **Fetch services separately** - More reliable
3. **Added better error logging** - Check console for details
4. **Added fallback** - `formattedPandits || []` to prevent crashes

## Next Steps

1. Check your server console for the debug logs
2. Run the SQL queries above in Supabase
3. Share the results so I can help fix the specific issue


