import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Building2, Check, ArrowLeft, Sparkles, Crown } from 'lucide-react';

const Pricing = () => {
  const navigate = useNavigate();

  const professionalFeatures = [
    '50 professional ROI reports per month',
    'Unlimited revisions and edits',
    '2-minute report generation',
    'Automatic market comparable sales',
    'HELOC & refinance calculators',
    'Before/after photo library (unlimited storage)',
    'Up to 5 custom remodel packages',
    'Branded PDF reports',
    'Excel spreadsheet exports',
    'Email delivery system',
    'Shareable proposal links',
    'CRM integration (Zapier/webhook)',
    'White-label branding',
    'Email support (24-hour response)',
    'Onboarding call & setup',
    'Video training library',
    'Template proposals'
  ];

  const enterpriseFeatures = [
    'Everything in Professional, plus:',
    'UNLIMITED reports per month',
    '5+ team member seats',
    'Priority phone support',
    'Custom API integrations',
    'Dedicated account manager',
    'Custom feature development',
    'Advanced analytics dashboard',
    'Multi-location support',
    'Custom training sessions',
    'Quarterly strategy calls'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Pricing</span>
              </div>
            </div>
            <Button onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that fits your business. Both plans pay for themselves with just 2-3 extra projects per year.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {/* Professional Plan */}
          <Card className="relative overflow-hidden p-8 border-2 hover:shadow-2xl transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-bold">Professional</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Perfect for individual builders and small teams
              </p>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">$997</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Billed monthly • Cancel anytime
                </p>
              </div>

              <Button className="w-full mb-8" size="lg" onClick={() => navigate('/auth')}>
                Start Free Trial
              </Button>

              <div className="space-y-3">
                {professionalFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm font-semibold mb-2">ROI Calculation:</p>
                <p className="text-xs text-muted-foreground">
                  Close just 2-3 extra projects per year and watch your revenue multiply. Platform pays for itself many times over.
                </p>
              </div>
            </div>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative overflow-hidden p-8 border-2 border-primary hover:shadow-2xl transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-bold">Enterprise</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                For growing companies and larger teams
              </p>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">$2,997</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Billed monthly • Priority support
                </p>
              </div>

              <Button 
                className="w-full mb-8 bg-gradient-to-r from-primary to-accent hover:opacity-90" 
                size="lg"
                onClick={() => navigate('/auth')}
              >
                Start Free Trial
              </Button>

              <div className="space-y-3">
                {enterpriseFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`text-sm ${idx === 0 ? 'font-semibold' : ''}`}>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-lg">
                <p className="text-sm font-semibold mb-2">Perfect for:</p>
                <p className="text-xs text-muted-foreground">
                  Teams doing 100+ projects/year, multi-location businesses, or builders wanting unlimited reports and dedicated support
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">What happens if I exceed 50 reports?</h3>
              <p className="text-muted-foreground">
                You can purchase additional report credits at $25 per report, or upgrade to Enterprise for unlimited reports.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                Yes! We offer a 14-day free trial with full access to all features. No credit card required.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Absolutely. Cancel anytime with no penalties or hidden fees. Your data remains accessible for 30 days after cancellation.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Do you offer custom plans?</h3>
              <p className="text-muted-foreground">
                Yes! For very large operations or specific needs, contact us for a custom Enterprise+ plan tailored to your requirements.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Ready to dominate your market?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your free trial today. No credit card required.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/demo')}>
              See Sample Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
