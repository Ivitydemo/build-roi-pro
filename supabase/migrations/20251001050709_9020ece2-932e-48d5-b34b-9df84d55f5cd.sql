-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create builder profiles table
CREATE TABLE public.builder_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  website TEXT,
  service_areas TEXT[], -- Array of cities/regions they serve
  default_heloc_rate DECIMAL(5,2) DEFAULT 8.50, -- Current HELOC rate
  default_refinance_rate DECIMAL(5,2) DEFAULT 7.25, -- Current refinance rate
  branding_color TEXT DEFAULT '#000000',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create remodel packages table
CREATE TABLE public.remodel_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  builder_id UUID REFERENCES public.builder_profiles(id) ON DELETE CASCADE NOT NULL,
  package_name TEXT NOT NULL, -- e.g. "Tier 1: Kitchen & Flooring"
  package_description TEXT,
  base_price DECIMAL(12,2) NOT NULL,
  price_per_sqft DECIMAL(8,2), -- Optional price per square foot adjustment
  included_items TEXT[], -- Array of items included
  package_order INTEGER DEFAULT 0, -- For sorting
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create photo library table
CREATE TABLE public.photo_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  builder_id UUID REFERENCES public.builder_profiles(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  photo_type TEXT CHECK (photo_type IN ('before', 'after')),
  project_name TEXT,
  room_type TEXT, -- e.g. "kitchen", "bathroom", "exterior"
  tags TEXT[], -- Searchable tags
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create properties table (for saved property data)
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  builder_id UUID REFERENCES public.builder_profiles(id) ON DELETE CASCADE NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  square_footage INTEGER,
  bedrooms INTEGER,
  bathrooms DECIMAL(3,1),
  year_built INTEGER,
  current_value DECIMAL(12,2),
  zillow_data JSONB, -- Store full Zillow response
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create comparable sales table
CREATE TABLE public.comparable_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  sale_price DECIMAL(12,2) NOT NULL,
  sale_date DATE,
  square_footage INTEGER,
  price_per_sqft DECIMAL(8,2),
  distance_miles DECIMAL(5,2), -- Distance from target property
  data_source TEXT DEFAULT 'manual', -- 'manual', 'zillow', 'mls'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  builder_id UUID REFERENCES public.builder_profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  report_data JSONB NOT NULL, -- Full report configuration and results
  pdf_url TEXT, -- Generated PDF location
  excel_url TEXT, -- Generated Excel location
  share_token TEXT UNIQUE, -- For shareable links (Phase 3)
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.builder_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remodel_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparable_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for builder_profiles
CREATE POLICY "Builders can view own profile"
  ON public.builder_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Builders can update own profile"
  ON public.builder_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Builders can insert own profile"
  ON public.builder_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for remodel_packages
CREATE POLICY "Builders can view own packages"
  ON public.remodel_packages FOR SELECT
  USING (builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Builders can insert own packages"
  ON public.remodel_packages FOR INSERT
  WITH CHECK (builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Builders can update own packages"
  ON public.remodel_packages FOR UPDATE
  USING (builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Builders can delete own packages"
  ON public.remodel_packages FOR DELETE
  USING (builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid()));

-- RLS Policies for photo_library
CREATE POLICY "Builders can view own photos"
  ON public.photo_library FOR SELECT
  USING (builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Builders can insert own photos"
  ON public.photo_library FOR INSERT
  WITH CHECK (builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Builders can delete own photos"
  ON public.photo_library FOR DELETE
  USING (builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid()));

-- RLS Policies for properties
CREATE POLICY "Builders can view own properties"
  ON public.properties FOR SELECT
  USING (builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Builders can insert own properties"
  ON public.properties FOR INSERT
  WITH CHECK (builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Builders can update own properties"
  ON public.properties FOR UPDATE
  USING (builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Builders can delete own properties"
  ON public.properties FOR DELETE
  USING (builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid()));

-- RLS Policies for comparable_sales
CREATE POLICY "Builders can view comps for their properties"
  ON public.comparable_sales FOR SELECT
  USING (property_id IN (
    SELECT id FROM public.properties 
    WHERE builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid())
  ));

CREATE POLICY "Builders can insert comps for their properties"
  ON public.comparable_sales FOR INSERT
  WITH CHECK (property_id IN (
    SELECT id FROM public.properties 
    WHERE builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid())
  ));

CREATE POLICY "Builders can update comps for their properties"
  ON public.comparable_sales FOR UPDATE
  USING (property_id IN (
    SELECT id FROM public.properties 
    WHERE builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid())
  ));

CREATE POLICY "Builders can delete comps for their properties"
  ON public.comparable_sales FOR DELETE
  USING (property_id IN (
    SELECT id FROM public.properties 
    WHERE builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid())
  ));

-- RLS Policies for reports
CREATE POLICY "Builders can view own reports"
  ON public.reports FOR SELECT
  USING (builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Builders can insert own reports"
  ON public.reports FOR INSERT
  WITH CHECK (builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Builders can update own reports"
  ON public.reports FOR UPDATE
  USING (builder_id IN (SELECT id FROM public.builder_profiles WHERE user_id = auth.uid()));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_builder_profiles_updated_at
  BEFORE UPDATE ON public.builder_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_remodel_packages_updated_at
  BEFORE UPDATE ON public.remodel_packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();