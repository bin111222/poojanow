# 🚨 QUICK ADMIN FIX - Do This Now!

## The Problem
You're seeing "Access Denied" because your profile doesn't have `role = 'admin'`.

## The Solution (3 Steps - 2 Minutes)

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run This SQL (Copy & Paste)

**First, run this to fix RLS:**
```sql
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

**Then, find your email:**
```sql
SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 5;
```

**Finally, grant admin (replace YOUR_EMAIL with your actual email from above):**
```sql
UPDATE profiles
SET role = 'admin', is_active = true
WHERE email = 'YOUR_EMAIL@example.com';
```

**If the UPDATE says "0 rows affected", your profile doesn't exist. Create it:**
```sql
-- First, get your user ID from the SELECT above, then:
INSERT INTO profiles (id, email, full_name, role, is_active)
VALUES (
  'PASTE_YOUR_USER_ID_HERE',
  'YOUR_EMAIL@example.com',
  'Admin User',
  'admin',
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  is_active = true;
```

### Step 3: Verify & Refresh

**Check it worked:**
```sql
SELECT id, email, role, is_active 
FROM profiles 
WHERE email = 'YOUR_EMAIL@example.com';
```

You should see `role = 'admin'`.

**Then:**
1. Go back to your browser
2. Refresh the page (Cmd+R or F5)
3. Try accessing `/admin/data` again

## Still Not Working?

1. **Make sure you're logged in with the correct email**
   - Check the email shown in the top right of the page
   - Make sure it matches the email you used in the SQL

2. **Check browser console for errors**
   - Press F12
   - Look at the Console tab
   - Share any red error messages

3. **Try logging out and back in**
   - Sometimes the session needs to refresh

4. **Nuclear option (grant admin to ALL users):**
   ```sql
   UPDATE profiles SET role = 'admin', is_active = true;
   ```
   ⚠️ Only use this in development!

## Need More Help?

Check the file `GRANT_ADMIN_NOW.sql` for a complete script with all options.


