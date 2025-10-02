-- Create partner tiers table
CREATE TABLE public.partner_tiers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tier_name text NOT NULL UNIQUE,
  tier_level integer NOT NULL,
  conversion_fee_percentage numeric NOT NULL,
  lead_fee_flat numeric NOT NULL DEFAULT 0,
  min_monthly_leads integer NOT NULL DEFAULT 0,
  exclusive_territory boolean NOT NULL DEFAULT false,
  priority_support boolean NOT NULL DEFAULT false,
  co_marketing boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create partners table
CREATE TABLE public.partners (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_type text NOT NULL,
  company_name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  tier_id uuid REFERENCES public.partner_tiers(id),
  service_areas text[] DEFAULT ARRAY[]::text[],
  specialties text[] DEFAULT ARRAY[]::text[],
  status text NOT NULL DEFAULT 'pending',
  quality_score numeric DEFAULT 0,
  total_leads_sent integer DEFAULT 0,
  total_conversions integer DEFAULT 0,
  conversion_rate numeric DEFAULT 0,
  lifetime_value numeric DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create partner leads table
CREATE TABLE public.partner_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id uuid REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL,
  builder_id uuid REFERENCES public.builder_profiles(id) ON DELETE CASCADE,
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  lead_source text NOT NULL,
  lead_type text NOT NULL,
  homeowner_name text,
  homeowner_email text,
  homeowner_phone text,
  property_address text,
  estimated_project_value numeric,
  status text NOT NULL DEFAULT 'new',
  converted_at timestamp with time zone,
  conversion_value numeric,
  commission_amount numeric,
  commission_paid boolean DEFAULT false,
  commission_paid_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create partner commissions table
CREATE TABLE public.partner_commissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id uuid REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES public.partner_leads(id) ON DELETE CASCADE,
  commission_type text NOT NULL,
  commission_amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  paid_at timestamp with time zone,
  payment_method text,
  payment_reference text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partner_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_commissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_tiers (readable by all authenticated users)
CREATE POLICY "Anyone can view partner tiers"
  ON public.partner_tiers FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for partners
CREATE POLICY "Partners can view own profile"
  ON public.partners FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Partners can insert own profile"
  ON public.partners FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Partners can update own profile"
  ON public.partners FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for partner_leads
CREATE POLICY "Partners can view own leads"
  ON public.partner_leads FOR SELECT
  TO authenticated
  USING (partner_id IN (
    SELECT id FROM public.partners WHERE user_id = auth.uid()
  ));

CREATE POLICY "Partners can insert own leads"
  ON public.partner_leads FOR INSERT
  TO authenticated
  WITH CHECK (partner_id IN (
    SELECT id FROM public.partners WHERE user_id = auth.uid()
  ));

CREATE POLICY "Builders can view leads assigned to them"
  ON public.partner_leads FOR SELECT
  TO authenticated
  USING (builder_id IN (
    SELECT id FROM public.builder_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Builders can update leads assigned to them"
  ON public.partner_leads FOR UPDATE
  TO authenticated
  USING (builder_id IN (
    SELECT id FROM public.builder_profiles WHERE user_id = auth.uid()
  ));

-- RLS Policies for partner_commissions
CREATE POLICY "Partners can view own commissions"
  ON public.partner_commissions FOR SELECT
  TO authenticated
  USING (partner_id IN (
    SELECT id FROM public.partners WHERE user_id = auth.uid()
  ));

-- Create triggers for updated_at
CREATE TRIGGER update_partner_tiers_updated_at
  BEFORE UPDATE ON public.partner_tiers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partner_leads_updated_at
  BEFORE UPDATE ON public.partner_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partner_commissions_updated_at
  BEFORE UPDATE ON public.partner_commissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default partner tiers
INSERT INTO public.partner_tiers (tier_name, tier_level, conversion_fee_percentage, lead_fee_flat, min_monthly_leads, exclusive_territory, priority_support, co_marketing) VALUES
  ('Bronze', 1, 3.0, 0, 0, false, false, false),
  ('Silver', 2, 5.0, 25, 5, false, true, false),
  ('Gold', 3, 7.0, 50, 15, true, true, true),
  ('Platinum', 4, 10.0, 100, 25, true, true, true);