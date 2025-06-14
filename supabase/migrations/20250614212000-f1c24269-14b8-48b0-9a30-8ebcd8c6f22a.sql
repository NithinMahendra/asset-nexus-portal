
-- Allow email to be nullable for code-based invitations
ALTER TABLE public.invitations
  ALTER COLUMN email DROP NOT NULL;
