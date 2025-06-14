
-- Remove problematic policy first (find and drop! if any):
DROP POLICY IF EXISTS "Users can access only users in their org" ON public.users;

-- Allow users to only read their own row:
CREATE POLICY "Users can read their own user row"
  ON public.users
  FOR SELECT
  USING (id = auth.uid());
