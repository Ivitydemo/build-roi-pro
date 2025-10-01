import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, TrendingUp, Clock, CheckCircle, Sparkles, DollarSign, Users, Target, ArrowRight, BarChart3, Shield } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ValueBuilder Pro
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/demo')}>
                Demo
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Transform How You Win Projects
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Stop Competing on Price.
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow-pulse">
                Lead with Value.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              The first platform that shows homeowners the complete financial picture—from before/after value to cash flow impact—so you close at premium pricing without competing.
            </p>
            <div className="flex gap-4 justify-center flex-wrap mb-12">
              <Button size="lg" className="h-14 px-8 text-lg shadow-xl hover:shadow-2xl transition-all" onClick={() => navigate('/demo')}>
                See Interactive Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg" onClick={() => navigate('/builder-impact')}>
                Calculate Your ROI
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 animate-fade-in">
            {[
              { value: '3-5x', label: 'Higher Close Rate', icon: TrendingUp },
              { value: '$0', label: 'Competition', icon: Target },
              { value: '60-75%', label: 'Win Rate', icon: BarChart3 },
              { value: '2 min', label: 'To Generate', icon: Clock }
            ].map((stat, idx) => (
              <div key={idx} className="bg-card border rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paradigm Shift */}
      <section className="container mx-auto px-4 py-24 bg-gradient-to-br from-card/50 to-muted/20 rounded-3xl my-12 border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">The Fundamental Shift</h2>
            <p className="text-xl text-muted-foreground">
              From reactive bidding to proactive value creation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Old Way */}
            <div className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-2 border-destructive/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                    <span className="text-2xl">❌</span>
                  </div>
                  <h3 className="text-2xl font-bold text-destructive">The Old Way</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    'Wait for RFPs and compete with 5+ contractors',
                    'Race to the bottom on price',
                    'Deal with uneducated buyers',
                    'Beg for work you may never get',
                    'Close 15-25% if you\'re lucky'
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <div className="mt-1 h-2 w-2 rounded-full bg-destructive flex-shrink-0" />
                      <span className="text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* New Way */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/10 border-2 border-primary/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h3 className="text-2xl font-bold text-primary">The New Way</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    'YOU bring the opportunity with data',
                    'Educate homeowners on investment value',
                    'Position as trusted financial advisor',
                    'Create budgets based on YOUR capacity',
                    'Close 60-75% when you own the narrative'
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <CheckCircle className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground/90 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="mt-12 bg-card rounded-2xl p-8 border shadow-lg">
            <h4 className="font-bold text-2xl mb-8 text-center">Real Business Impact</h4>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                  3-5x
                </div>
                <p className="text-muted-foreground">Higher close rate when YOU educate the client</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                  Zero
                </div>
                <p className="text-muted-foreground">Competitors when you create the opportunity</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                  100%
                </div>
                <p className="text-muted-foreground">Control of your revenue pipeline</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Incredibly Simple to Use</h2>
            <p className="text-xl text-muted-foreground">
              From address to branded proposal in 2 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: '2-Minute Generation',
                description: 'Enter an address, select packages. Get a professional ROI analysis with market comps instantly.'
              },
              {
                icon: DollarSign,
                title: 'Complete Financial Picture',
                description: 'Show before/after value, monthly cash flow impact, equity gain, and multiple financing scenarios.'
              },
              {
                icon: Shield,
                title: 'Close at Premium Pricing',
                description: 'No negotiation needed when clients understand the investment return. You become the obvious choice.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-card border rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-2">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24 bg-gradient-to-br from-muted/30 to-card/50 rounded-3xl my-12 border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground">
              Professional tools to dominate your market
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: TrendingUp, text: 'Automatic market comparable sales' },
              { icon: DollarSign, text: 'HELOC and refinance calculators' },
              { icon: Users, text: 'Before/after photo library' },
              { icon: Target, text: 'Custom remodel packages' },
              { icon: CheckCircle, text: 'Branded PDF reports' },
              { icon: BarChart3, text: 'Excel spreadsheet exports' },
              { icon: Sparkles, text: 'Email delivery system' },
              { icon: Shield, text: 'Shareable proposal links' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-card border rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-lg font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary via-accent to-primary p-[2px] rounded-3xl">
            <div className="bg-background rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Calculate exactly how many additional projects and revenue this platform will generate for YOUR business
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button size="lg" className="h-14 px-8 text-lg shadow-xl" onClick={() => navigate('/builder-impact')}>
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Builder Impact Calculator
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg" onClick={() => navigate('/demo')}>
                  See Sample Delivery
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-lg mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-5 w-5" />
              <span className="text-sm">© 2025 ValueBuilder Pro</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <button onClick={() => navigate('/auth')} className="hover:text-primary transition-colors">
                Sign In
              </button>
              <button onClick={() => navigate('/demo')} className="hover:text-primary transition-colors">
                Demo
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
