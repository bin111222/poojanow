-- RLS Policy to Allow Users to Update Their Own Profile (Including Role)
-- This is for development purposes - allows users to grant themselves admin access
-- In production, you should restrict this or remove it entirely

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create policy that allows users to update their own profile
-- This includes the role field for development convenience
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Alternative: If you want to restrict role updates, use this instead:
-- CREATE POLICY "Users can update own profile (except role)"
-- ON profiles FOR UPDATE
-- TO authenticated
-- USING (auth.uid() = id)
-- WITH CHECK (
--   auth.uid() = id 
--   AND (
--     -- Allow role update only if current role is not admin (self-promotion for dev)
--     (OLD.role != 'admin' AND NEW.role = 'admin')
--     OR
--     -- Allow all other field updates
--     (OLD.role = NEW.role)
--   )
-- );


