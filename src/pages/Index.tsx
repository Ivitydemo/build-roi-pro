import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, FileText, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Building2 className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Builder ROI Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Generate professional remodel ROI proposals in minutes. Show clients exactly how much equity they'll gain.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigate('/demo')}>
              Try Interactive Demo
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            See how reports are customized for each client →
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6 bg-card rounded-lg border">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Save Time</h3>
            <p className="text-muted-foreground">
              Generate proposals in 2 minutes instead of 2 hours
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg border">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Close More Deals</h3>
            <p className="text-muted-foreground">
              Show ROI with financing scenarios to convert 3x more leads
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg border">
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Professional Reports</h3>
            <p className="text-muted-foreground">
              Branded PDFs with market comps and investment analysis
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 bg-card/50 rounded-2xl max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-12">What's Included</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            'Automatic market comparable sales',
            'HELOC and refinance calculators',
            'Before/after photo library',
            'Custom remodel packages',
            'Branded PDF reports',
            'Excel spreadsheet exports',
            'Email delivery',
            'Shareable proposal links'
          ].map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-lg">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to close more deals?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join hundreds of builders generating professional ROI proposals that convert leads into signed contracts
        </p>
        <Button size="lg" onClick={() => navigate('/auth')}>
          Start Free Trial
        </Button>
      </section>
    </div>
  );
};

export default Index;
