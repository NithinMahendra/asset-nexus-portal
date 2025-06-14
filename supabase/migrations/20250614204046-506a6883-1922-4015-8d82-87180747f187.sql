
-- 1. Organizations (Companies) Table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add organization_id to users
ALTER TABLE public.users
ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 3. Add organization_id to user_roles
ALTER TABLE public.user_roles
ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 4. Add organization_id to relevant data tables (example: assets, asset_history)
ALTER TABLE public.assets
ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.asset_history
ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 5. RLS: Only allow SELECT, UPDATE, DELETE by users from same organization
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access only users in their org"
  ON public.users
  FOR SELECT USING (organization_id = (SELECT organization_id FROM public.users WHERE id=auth.uid()));

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Roles scoped to their org"
  ON public.user_roles
  FOR SELECT USING (organization_id = (SELECT organization_id FROM public.users WHERE id=auth.uid()));

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Assets scoped to org"
  ON public.assets
  FOR SELECT USING (organization_id = (SELECT organization_id FROM public.users WHERE id=auth.uid()));

ALTER TABLE public.asset_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Asset history scoped to org"
  ON public.asset_history
  FOR SELECT USING (organization_id = (SELECT organization_id FROM public.users WHERE id=auth.uid()));

-- 6. Ensure only one admin per organization
-- Enforced in code, but add unique constraint for safety
CREATE UNIQUE INDEX uniq_org_admin ON public.user_roles (organization_id) WHERE role = 'admin';

-- 7. Employee invitation table (optional, for scaling up)
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 day')
);

-- Invitation delete cascade when org is deleted
-- 8. (Recommended) Update indexes for all new foreign keys.
CREATE INDEX idx_users_organization_id ON public.users(organization_id);
CREATE INDEX idx_user_roles_organization_id ON public.user_roles(organization_id);
CREATE INDEX idx_assets_organization_id ON public.assets(organization_id);
CREATE INDEX idx_asset_history_organization_id ON public.asset_history(organization_id);
CREATE INDEX idx_invitations_organization_id ON public.invitations(organization_id);
