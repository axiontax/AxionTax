-- ============================================
-- AxionTax — Database Setup (Etapa 2)
-- Execute no SQL Editor do Supabase
-- ============================================

-- 1. PROFILES (auto-created on user signup via trigger)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. ORGANIZATIONS
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plan TEXT DEFAULT 'starter',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can read their org" ON organizations
  FOR SELECT USING (
    id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Authenticated users can create orgs" ON organizations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Org owners can update their org" ON organizations
  FOR UPDATE USING (
    id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role = 'owner')
  );


-- 3. ORG_MEMBERS
CREATE TABLE IF NOT EXISTS org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read their org members" ON org_members
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM org_members AS om WHERE om.user_id = auth.uid())
  );

CREATE POLICY "Authenticated users can create membership" ON org_members
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Org owners/admins can delete members" ON org_members
  FOR DELETE USING (
    org_id IN (SELECT org_id FROM org_members AS om WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin'))
  );


-- 4. COMPANIES (CNPJs)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  cnpj TEXT NOT NULL,
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT,
  status TEXT DEFAULT 'ativo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, cnpj)
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can read their companies" ON companies
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Org members can insert companies" ON companies
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Org members can update companies" ON companies
  FOR UPDATE USING (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Org owners/admins can delete companies" ON companies
  FOR DELETE USING (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
  );


-- 5. DEBTS
CREATE TABLE IF NOT EXISTS debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  tributo TEXT NOT NULL,
  valor_original NUMERIC(15,2) NOT NULL,
  vencimento DATE,
  esfera TEXT CHECK (esfera IN ('federal', 'estadual', 'municipal')),
  status TEXT DEFAULT 'ativo',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can read debts of their companies" ON debts
  FOR SELECT USING (
    company_id IN (
      SELECT c.id FROM companies c
      JOIN org_members om ON om.org_id = c.org_id
      WHERE om.user_id = auth.uid()
    )
  );

CREATE POLICY "Org members can insert debts" ON debts
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT c.id FROM companies c
      JOIN org_members om ON om.org_id = c.org_id
      WHERE om.user_id = auth.uid()
    )
  );

CREATE POLICY "Org members can update debts" ON debts
  FOR UPDATE USING (
    company_id IN (
      SELECT c.id FROM companies c
      JOIN org_members om ON om.org_id = c.org_id
      WHERE om.user_id = auth.uid()
    )
  );


-- 6. PROGRAMS
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  esfera TEXT CHECK (esfera IN ('federal', 'estadual', 'municipal')),
  desconto_multa NUMERIC(5,2) DEFAULT 0,
  desconto_juros NUMERIC(5,2) DEFAULT 0,
  max_parcelas INT DEFAULT 1,
  inicio DATE,
  fim DATE,
  ativo BOOLEAN DEFAULT TRUE,
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Programs are public read (all authenticated users can see available programs)
CREATE POLICY "Authenticated users can read programs" ON programs
  FOR SELECT USING (auth.uid() IS NOT NULL);


-- 7. MATCHES
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debt_id UUID NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  economia_estimada NUMERIC(15,2),
  valor_final NUMERIC(15,2),
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(debt_id, program_id)
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can read their matches" ON matches
  FOR SELECT USING (
    debt_id IN (
      SELECT d.id FROM debts d
      JOIN companies c ON c.id = d.company_id
      JOIN org_members om ON om.org_id = c.org_id
      WHERE om.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert matches" ON matches
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);


-- ============================================
-- Done! All tables created with RLS policies.
-- ============================================
