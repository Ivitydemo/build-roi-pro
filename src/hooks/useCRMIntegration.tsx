import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCRMIntegration = () => {
  const { toast } = useToast();

  const sendToCRM = async (builderId: string, reportData: {
    property_address?: string;
    homeowner_name?: string;
    homeowner_email?: string;
    homeowner_phone?: string;
    estimated_project_value?: number;
    report_url?: string;
    packages?: Array<{
      name: string;
      price: number;
      roi_percent?: number;
    }>;
    builder_name?: string;
    notes?: string;
  }) => {
    try {
      // Get active webhook for this builder
      const { data: integration, error: integrationError } = await supabase
        .from('crm_integrations')
        .select('*')
        .eq('builder_id', builderId)
        .eq('is_active', true)
        .maybeSingle();

      if (integrationError) {
        console.error('Error fetching CRM integration:', integrationError);
        return { success: false, error: integrationError.message };
      }

      if (!integration) {
        console.log('No active CRM integration found for builder');
        return { success: false, error: 'No active integration' };
      }

      // Send data to webhook using edge function
      const { data, error } = await supabase.functions.invoke('send-crm-webhook', {
        body: {
          webhookUrl: integration.webhook_url,
          data: {
            event: 'report_generated',
            ...reportData,
          },
        },
      });

      if (error) {
        console.error('Error sending to CRM:', error);
        toast({
          title: "CRM Sync Failed",
          description: "Failed to send data to your CRM. The report was still created successfully.",
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      // Update last_used_at
      await supabase
        .from('crm_integrations')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', integration.id);

      console.log('Successfully sent data to CRM:', data);
      
      toast({
        title: "CRM Updated",
        description: "Report data automatically sent to your CRM.",
      });

      return { success: true, data };
    } catch (error: any) {
      console.error('Error in sendToCRM:', error);
      return { success: false, error: error.message };
    }
  };

  return { sendToCRM };
};
