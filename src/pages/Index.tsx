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

      {/* Paradigm Shift Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-destructive/10 via-warning/10 to-primary/10 rounded-2xl p-8 border-2 border-primary/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Stop Bidding. Start Leading.</h2>
              <p className="text-xl text-muted-foreground">
                The fundamental difference between struggling contractors and thriving builders
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Old Way */}
              <div className="bg-destructive/5 border-2 border-destructive/20 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center text-destructive font-bold">
                    ✗
                  </div>
                  <h3 className="text-xl font-bold text-destructive">The Old Way: Reactive Bidding</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2">
                    <span className="text-destructive">→</span>
                    <span>Wait for homeowners to decide on their own</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-destructive">→</span>
                    <span>Compete with 3-5 other contractors on price</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-destructive">→</span>
                    <span>Deal with uneducated buyers who "cheap out"</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-destructive">→</span>
                    <span>Beg for work you may never get</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-destructive">→</span>
                    <span>Close rate: 15-25% (if you're lucky)</span>
                  </li>
                </ul>
              </div>

              {/* New Way */}
              <div className="bg-primary/5 border-2 border-primary/30 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-primary">The New Way: Proactive Advisory</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2">
                    <span className="text-primary">→</span>
                    <span>YOU bring the idea with sound business case</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">→</span>
                    <span>Educate homeowners on investment opportunity</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">→</span>
                    <span>Position as trusted advisor, not vendor</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">→</span>
                    <span>CREATE client budgets based on YOUR capacity</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">→</span>
                    <span>Close rate: 60-75% when you own the narrative</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-card rounded-lg p-6 border">
              <h4 className="font-bold text-lg mb-4 text-center">The Numbers Don't Lie</h4>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">3-5x</div>
                  <p className="text-sm text-muted-foreground">Higher close rate when YOU educate the client</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">$0</div>
                  <p className="text-sm text-muted-foreground">Competitors when you create the opportunity</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">100%</div>
                  <p className="text-sm text-muted-foreground">Control of your revenue pipeline</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6 bg-card rounded-lg border">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">2 Minutes to Generate</h3>
            <p className="text-muted-foreground">
              Input address, get professional ROI proposal instantly
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg border">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Show the Investment</h3>
            <p className="text-muted-foreground">
              Equity gain + financing = educated buyers who see value
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg border">
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Close at Premium Pricing</h3>
            <p className="text-muted-foreground">
              No negotiation needed when they understand ROI
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
