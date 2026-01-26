# 🔐 Grant Admin Access - Quick Fix

You're seeing "Access Denied" because your user account doesn't have the `admin` role. Here's how to fix it:

## 🚀 Easiest Method: Use the Web Interface

1. **Go to:** `http://localhost:3001/admin/grant-access`
2. **Click "Grant Admin Access"** button (your email should be pre-filled)
3. **Done!** Refresh the page and you should have admin access

## 📝 Alternative: SQL Method

## Quick Solution

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**

### Step 2: Run This SQL

Replace `YOUR_EMAIL@example.com` with your actual email address:

```sql
-- Grant admin access to your account
UPDATE profiles
SET role = 'admin', is_active = true
WHERE email = 'YOUR_EMAIL@example.com';
```

### Step 3: Verify It Worked

Run this to check:

```sql
SELECT id, email, role, is_active 
FROM profiles 
WHERE email = 'YOUR_EMAIL@example.com';
```

You should see `role = 'admin'` and `is_active = true`.

### Step 4: Refresh Your Browser

1. Log out of the app (if you're logged in)
2. Log back in
3. Try accessing `/admin/data` again

## Alternative: Grant Admin to All Users (Development Only!)

If you want to grant admin to ALL users (useful for development):

```sql
UPDATE profiles
SET role = 'admin', is_active = true
WHERE role != 'admin';
```

⚠️ **Warning:** Only use this in development, not in production!

## Still Not Working?

1. **Check if your profile exists:**
   ```sql
   SELECT * FROM profiles WHERE email = 'YOUR_EMAIL@example.com';
   ```

2. **If no profile exists, create one:**
   ```sql
   -- First, get your user ID
   SELECT id, email FROM auth.users WHERE email = 'YOUR_EMAIL@example.com';
   
   -- Then create the profile (replace UUID with the ID from above)
   INSERT INTO profiles (id, full_name, email, role, is_active)
   VALUES (
     'YOUR_UUID_HERE',
     'Your Name',
     'YOUR_EMAIL@example.com',
     'admin',
     true
   );
   ```

3. **Clear your browser cache and cookies**
4. **Log out and log back in**

## Need Help?

If you're still having issues, check:
- Are you logged in with the correct email?
- Does the profile exist in the `profiles` table?
- Is the role set to `'admin'` (not `'Admin'` or `'ADMIN'`)?

