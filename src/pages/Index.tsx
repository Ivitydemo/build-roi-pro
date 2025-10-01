import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, TrendingUp, Clock, CheckCircle, Sparkles, DollarSign, Users, Target, ArrowRight, BarChart3, Shield, Webhook } from 'lucide-react';

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
              <Button variant="ghost" onClick={() => navigate('/video-generator')}>
                See It In Action
              </Button>
              <Button variant="ghost" onClick={() => navigate('/pricing')}>
                Pricing
              </Button>
              <Button variant="ghost" onClick={() => navigate('/partner-portal')}>
                Partner Portal
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Video Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 bg-black">
          <div className="relative w-full h-full">
            <img 
              src="/hero-video.jpg" 
              alt="Luxury home with financial growth visualization"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          </div>
        </div>

        {/* Content */}
        <div className="container relative z-10 px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium border border-white/20 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              "We're going with someone cheaper" • Never hear it again
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white animate-fade-in-up">
              Stop Competing for Budget
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                and Start Creating It
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Stop losing deals you deserve to win. You're not too expensive—you just haven't shown them why you're worth it. Generate 2-minute ROI reports that prove massive equity gains and watch price objections vanish.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="text-lg px-8 py-6 bg-white text-black hover:bg-gray-100 shadow-2xl" onClick={() => navigate('/demo')}>
                See What You've Been Missing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 text-white border-2 border-white hover:bg-white hover:text-black backdrop-blur-sm transition-all" onClick={() => navigate('/pricing')}>
                Start Winning Today
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-8 pt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-center backdrop-blur-sm bg-white/10 rounded-2xl p-6 border-2 border-white/20">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">2 Minutes</div>
                <div className="text-white/90 text-sm md:text-base font-medium">From Address to Proposal</div>
              </div>
              <div className="text-center backdrop-blur-sm bg-white/10 rounded-2xl p-6 border-2 border-white/20">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">3-5X</div>
                <div className="text-white/90 text-sm md:text-base font-medium">Higher Close Rate</div>
              </div>
              <div className="text-center backdrop-blur-sm bg-white/10 rounded-2xl p-6 border-2 border-white/20">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">Proven ROI</div>
                <div className="text-white/90 text-sm md:text-base font-medium">Equity Value Gains</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Paradigm Shift */}
      <section className="container mx-auto px-4 py-24 bg-gradient-to-br from-card/50 to-muted/20 rounded-3xl my-12 border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">The Game Has Changed</h2>
            <p className="text-xl text-muted-foreground mb-6">
              Are you still playing the old game while your competitors have moved on?
            </p>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Every day you wait is another deal lost to contractors who prove their value instead of defending their price.
              </p>
              <p className="text-lg font-bold text-foreground mt-4">
                The question isn't IF you'll make this shift. It's WHEN—and how much money you'll lose before you do.
              </p>
            </div>
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
                    'Wait for RFPs and compete with 5+ contractors (exhausting)',
                    'Race to the bottom on price (soul-crushing)',
                    'Deal with uneducated buyers who only see cost',
                    'Beg for work you may never get (demoralizing)',
                    'Close 15-25% if you\'re lucky (barely profitable)'
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
                    'YOU bring the opportunity with undeniable data',
                    'Educate homeowners before they talk to anyone else',
                    'Position as the trusted financial advisor (not vendor)',
                    'Work only on projects that fit YOUR schedule',
                    'Close 60-75% because YOU own the entire narrative'
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
                  Minimal
                </div>
                <p className="text-muted-foreground">Competition when you create the opportunity</p>
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

          <div className="grid md:grid-cols-4 gap-8">
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
                icon: Webhook,
                title: 'Auto-Sync to Your CRM',
                description: 'Automatically send leads to Buildertrend, CoConstruct, HubSpot, or any CRM via Zapier integration.'
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
              { icon: Webhook, text: 'CRM integrations (Buildertrend, HubSpot, more)' },
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

      {/* CRM Integration Showcase */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Webhook className="h-4 w-4" />
              Seamless Integration
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Works With Your Existing CRM</h2>
            <p className="text-xl text-muted-foreground">
              Automatically send every lead to your favorite tools
            </p>
          </div>

          <div className="bg-gradient-to-br from-card to-muted/20 border-2 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Supported CRMs</h3>
                <div className="space-y-3">
                  {[
                    'Buildertrend',
                    'CoConstruct', 
                    'BuilderPrime',
                    'HubSpot',
                    'Salesforce',
                    'JobNimbus',
                    'ServiceTitan',
                    '+ Any CRM via Zapier'
                  ].map((crm, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium">{crm}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6">Auto-Sync Every Report</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Generate Report</h4>
                      <p className="text-sm text-muted-foreground">Create your professional ROI analysis</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Instant CRM Sync</h4>
                      <p className="text-sm text-muted-foreground">Lead data automatically sent to your CRM</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Follow Up & Close</h4>
                      <p className="text-sm text-muted-foreground">Your CRM has all the data to nurture the lead</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl">
                  <p className="text-sm font-medium mb-2">Data Sent to Your CRM:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Property address & details</li>
                    <li>• Homeowner contact info</li>
                    <li>• Project value & package details</li>
                    <li>• Report link & ROI analysis</li>
                  </ul>
                </div>
              </div>
            </div>
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
              <button onClick={() => navigate('/pricing')} className="hover:text-primary transition-colors">
                Pricing
              </button>
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
