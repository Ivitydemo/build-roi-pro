-- Create CRM integrations table to store webhook configurations
CREATE TABLE public.crm_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  builder_id UUID NOT NULL,
  webhook_url TEXT NOT NULL,
  crm_name TEXT,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_builder FOREIGN KEY (builder_id) REFERENCES public.builder_profiles(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.crm_integrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for builders to manage their own integrations
CREATE POLICY "Builders can view own integrations" 
ON public.crm_integrations 
FOR SELECT 
USING (builder_id IN (
  SELECT id FROM builder_profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Builders can insert own integrations" 
ON public.crm_integrations 
FOR INSERT 
WITH CHECK (builder_id IN (
  SELECT id FROM builder_profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Builders can update own integrations" 
ON public.crm_integrations 
FOR UPDATE 
USING (builder_id IN (
  SELECT id FROM builder_profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Builders can delete own integrations" 
ON public.crm_integrations 
FOR DELETE 
USING (builder_id IN (
  SELECT id FROM builder_profiles WHERE user_id = auth.uid()
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_crm_integrations_updated_at
BEFORE UPDATE ON public.crm_integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_crm_integrations_builder_id ON public.crm_integrations(builder_id);
CREATE INDEX idx_crm_integrations_active ON public.crm_integrations(builder_id, is_active) WHERE is_active = true;
