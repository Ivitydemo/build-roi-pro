import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CRMWebhookRequest {
  webhookUrl: string;
  data: {
    event: string;
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
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { webhookUrl, data }: CRMWebhookRequest = await req.json();

    if (!webhookUrl) {
      throw new Error('Webhook URL is required');
    }

    console.log('Sending data to CRM webhook:', webhookUrl);
    console.log('Data payload:', JSON.stringify(data, null, 2));

    // Add timestamp to data
    const payload = {
      ...data,
      timestamp: new Date().toISOString(),
      source: 'ValueBuilder Pro',
    };

    // Send data to the webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webhook response error:', response.status, errorText);
      throw new Error(`Webhook failed with status ${response.status}: ${errorText}`);
    }

    const responseData = await response.text();
    console.log('Webhook response:', responseData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Data sent to CRM successfully',
        response: responseData 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in send-crm-webhook function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
