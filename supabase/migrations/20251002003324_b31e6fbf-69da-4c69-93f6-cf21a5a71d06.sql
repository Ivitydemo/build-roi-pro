-- Create table for AI photo analysis results
CREATE TABLE public.photo_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  analysis_data JSONB NOT NULL,
  renovation_quality TEXT,
  estimated_value_impact NUMERIC,
  materials_detected TEXT[],
  rooms_identified TEXT[],
  confidence_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.photo_analyses ENABLE ROW LEVEL SECURITY;

-- Builders can view analyses for their properties
CREATE POLICY "Builders can view own photo analyses"
ON public.photo_analyses
FOR SELECT
USING (property_id IN (
  SELECT id FROM public.properties 
  WHERE builder_id IN (
    SELECT id FROM public.builder_profiles 
    WHERE user_id = auth.uid()
  )
));

-- Builders can insert analyses for their properties
CREATE POLICY "Builders can insert own photo analyses"
ON public.photo_analyses
FOR INSERT
WITH CHECK (property_id IN (
  SELECT id FROM public.properties 
  WHERE builder_id IN (
    SELECT id FROM public.builder_profiles 
    WHERE user_id = auth.uid()
  )
));

-- Builders can delete analyses for their properties
CREATE POLICY "Builders can delete own photo analyses"
ON public.photo_analyses
FOR DELETE
USING (property_id IN (
  SELECT id FROM public.properties 
  WHERE builder_id IN (
    SELECT id FROM public.builder_profiles 
    WHERE user_id = auth.uid()
  )
));

-- Add trigger for updated_at
CREATE TRIGGER update_photo_analyses_updated_at
BEFORE UPDATE ON public.photo_analyses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();