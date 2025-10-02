-- Add campaign_type column to property_search_campaigns table
ALTER TABLE public.property_search_campaigns 
ADD COLUMN campaign_type TEXT DEFAULT 'renovation' CHECK (campaign_type IN ('renovation', 'new_home'));

-- Add comment for clarity
COMMENT ON COLUMN public.property_search_campaigns.campaign_type IS 'Type of campaign: renovation (for contractors) or new_home (for builders/agents)';