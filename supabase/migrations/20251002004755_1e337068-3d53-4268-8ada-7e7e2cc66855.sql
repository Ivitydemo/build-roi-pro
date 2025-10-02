-- Create property search campaigns table
CREATE TABLE IF NOT EXISTS public.property_search_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  builder_id UUID NOT NULL,
  campaign_name TEXT NOT NULL,
  search_type TEXT NOT NULL, -- 'address', 'subdivision', 'radius', 'zip_code'
  search_parameters JSONB NOT NULL, -- stores the specific search criteria
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  total_properties INTEGER DEFAULT 0,
  analyzed_properties INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.property_search_campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Builders can view own campaigns"
  ON public.property_search_campaigns
  FOR SELECT
  USING (builder_id IN (
    SELECT id FROM builder_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Builders can insert own campaigns"
  ON public.property_search_campaigns
  FOR INSERT
  WITH CHECK (builder_id IN (
    SELECT id FROM builder_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Builders can update own campaigns"
  ON public.property_search_campaigns
  FOR UPDATE
  USING (builder_id IN (
    SELECT id FROM builder_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Builders can delete own campaigns"
  ON public.property_search_campaigns
  FOR DELETE
  USING (builder_id IN (
    SELECT id FROM builder_profiles WHERE user_id = auth.uid()
  ));

-- Create targeted properties table
CREATE TABLE IF NOT EXISTS public.targeted_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  listing_data JSONB, -- raw data from API
  photo_urls TEXT[], -- array of photo URLs from listing
  analysis_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'analyzing', 'completed', 'failed'
  analysis_summary JSONB, -- compiled analysis results
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.targeted_properties ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Builders can view properties from own campaigns"
  ON public.targeted_properties
  FOR SELECT
  USING (campaign_id IN (
    SELECT id FROM property_search_campaigns 
    WHERE builder_id IN (
      SELECT id FROM builder_profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Builders can insert properties to own campaigns"
  ON public.targeted_properties
  FOR INSERT
  WITH CHECK (campaign_id IN (
    SELECT id FROM property_search_campaigns 
    WHERE builder_id IN (
      SELECT id FROM builder_profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Builders can update properties in own campaigns"
  ON public.targeted_properties
  FOR UPDATE
  USING (campaign_id IN (
    SELECT id FROM property_search_campaigns 
    WHERE builder_id IN (
      SELECT id FROM builder_profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Builders can delete properties from own campaigns"
  ON public.targeted_properties
  FOR DELETE
  USING (campaign_id IN (
    SELECT id FROM property_search_campaigns 
    WHERE builder_id IN (
      SELECT id FROM builder_profiles WHERE user_id = auth.uid()
    )
  ));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_property_search_campaigns_updated_at
  BEFORE UPDATE ON public.property_search_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_targeted_properties_updated_at
  BEFORE UPDATE ON public.targeted_properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();