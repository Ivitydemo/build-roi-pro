import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Building2, Webhook, Check, Copy, ExternalLink, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const CRMIntegrations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [integrationId, setIntegrationId] = useState<string | null>(null);

  // Load existing webhook configuration
  useEffect(() => {
    const loadIntegration = async () => {
      if (!user) return;

      try {
        // Get builder profile
        const { data: profile } = await supabase
          .from('builder_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          // Get active integration
          const { data: integration } = await supabase
            .from('crm_integrations')
            .select('*')
            .eq('builder_id', profile.id)
            .eq('is_active', true)
            .maybeSingle();

          if (integration) {
            setWebhookUrl(integration.webhook_url);
            setIntegrationId(integration.id);
            setWebhookSaved(true);
          }
        }
      } catch (error) {
        console.error('Error loading integration:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIntegration();
  }, [user]);

  const crms = [
    { name: 'Buildertrend', description: 'Leading construction management software', popular: true },
    { name: 'CoConstruct', description: 'Custom builder & remodeler management', popular: true },
    { name: 'BuilderPrime', description: 'All-in-one contractor software', popular: false },
    { name: 'HubSpot', description: 'CRM & marketing automation', popular: true },
    { name: 'Salesforce', description: 'Enterprise CRM platform', popular: false },
    { name: 'JobNimbus', description: 'Contractor CRM & project management', popular: false },
    { name: 'ServiceTitan', description: 'Home services management', popular: false },
  ];

  const handleSaveWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to save webhook",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get builder profile
      const { data: profile } = await supabase
        .from('builder_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        throw new Error('Builder profile not found');
      }

      if (integrationId) {
        // Update existing integration
        const { error } = await supabase
          .from('crm_integrations')
          .update({ 
            webhook_url: webhookUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', integrationId);

        if (error) throw error;
      } else {
        // Create new integration
        const { data, error } = await supabase
          .from('crm_integrations')
          .insert({
            builder_id: profile.id,
            webhook_url: webhookUrl,
            crm_name: 'Zapier',
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setIntegrationId(data.id);
      }

      toast({
        title: "Webhook Saved",
        description: "Your CRM integration webhook has been configured successfully.",
      });
      setWebhookSaved(true);
    } catch (error) {
      console.error('Error saving webhook:', error);
      toast({
        title: "Error",
        description: "Failed to save webhook configuration.",
        variant: "destructive",
      });
    }
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter and save your webhook URL first",
        variant: "destructive",
      });
      return;
    }

    setTestingWebhook(true);
    console.log("Testing webhook:", webhookUrl);

    try {
      const testData = {
        event: 'test',
        timestamp: new Date().toISOString(),
        data: {
          property_address: '123 Test Street',
          homeowner_name: 'John Doe',
          homeowner_email: 'john@example.com',
          project_value: 150000,
          report_url: `${window.location.origin}/demo`,
        }
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(testData),
      });

      // Update last_used_at
      if (integrationId) {
        await supabase
          .from('crm_integrations')
          .update({ last_used_at: new Date().toISOString() })
          .eq('id', integrationId);
      }

      toast({
        title: "Test Sent",
        description: "Test data sent to your CRM. Check your Zap history or CRM to confirm receipt.",
      });
    } catch (error) {
      console.error("Error testing webhook:", error);
      toast({
        title: "Error",
        description: "Failed to send test. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setTestingWebhook(false);
    }
  };

  const copyInstructions = () => {
    const instructions = `ValueBuilder Pro CRM Integration Setup:

1. Create a Zap in Zapier with "Webhooks by Zapier" as the trigger
2. Choose "Catch Hook" as the trigger event
3. Copy the webhook URL provided by Zapier
4. Paste it into ValueBuilder Pro CRM Integrations page
5. Test the webhook to ensure data is received
6. Connect your CRM (Buildertrend, CoConstruct, HubSpot, etc.) as the action
7. Map the fields from ValueBuilder Pro to your CRM

Data sent with each report:
- Property address
- Homeowner name & email
- Estimated project value
- Report link
- Package details
- ROI analysis`;

    navigator.clipboard.writeText(instructions);
    toast({
      title: "Copied!",
      description: "Setup instructions copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">CRM Integrations</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Connect Your CRM</h1>
            <p className="text-xl text-muted-foreground">
              Automatically send leads and project data to your existing systems
            </p>
          </div>

          {/* Popular CRMs */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Supported CRMs</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {crms.map((crm) => (
                <div 
                  key={crm.name} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{crm.name}</h3>
                      {crm.popular && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{crm.description}</p>
                  </div>
                  <Check className="h-5 w-5 text-primary" />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              + Any CRM that supports webhooks or Zapier integration
            </p>
          </Card>

          {/* Webhook Configuration */}
          <Card className="p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Webhook className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Webhook Configuration</h2>
                  <p className="text-sm text-muted-foreground">Connect via Zapier or direct webhook</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={copyInstructions}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Setup Guide
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="webhook-url"
                    type="url"
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSaveWebhook} variant={webhookSaved ? "outline" : "default"}>
                    {webhookSaved ? <Check className="h-4 w-4 mr-2" /> : null}
                    {webhookSaved ? 'Saved' : 'Save'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Get this URL from Zapier or your CRM's webhook settings
                </p>
              </div>

              <Button 
                onClick={handleTestWebhook} 
                disabled={!webhookUrl || testingWebhook}
                variant="outline"
                className="w-full"
              >
                {testingWebhook ? 'Sending Test...' : 'Send Test Data'}
              </Button>
            </div>
          </Card>

          {/* Setup Instructions */}
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <h2 className="text-2xl font-bold mb-6">Quick Setup with Zapier</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Create a Zap</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign in to Zapier and create a new Zap with "Webhooks by Zapier" as the trigger
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Get Your Webhook URL</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose "Catch Hook" and copy the webhook URL provided by Zapier
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Paste & Test</h3>
                  <p className="text-sm text-muted-foreground">
                    Paste the URL above and click "Send Test Data" to verify the connection
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Connect Your CRM</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your CRM as the action step and map the data fields
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <Button variant="outline" className="w-full" asChild>
                <a href="https://zapier.com/apps/webhook/integrations" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Zapier
                </a>
              </Button>
            </div>
          </Card>

          {/* Data Format */}
          <Card className="p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Data Sent to Your CRM</h2>
            <p className="text-muted-foreground mb-4">
              Each time you generate a report, we'll automatically send this data to your CRM:
            </p>
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre>{`{
  "event": "report_generated",
  "timestamp": "2025-01-15T10:30:00Z",
  "property_address": "123 Main Street",
  "homeowner_name": "John Smith",
  "homeowner_email": "john@example.com",
  "homeowner_phone": "(555) 123-4567",
  "estimated_project_value": 150000,
  "report_url": "https://app.valuebuilder.com/r/abc123",
  "packages": [
    {
      "name": "Essential Remodel",
      "price": 75000,
      "roi_percent": 85
    }
  ],
  "builder_name": "Your Company Name"
}`}</pre>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CRMIntegrations;
