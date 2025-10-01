import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Download, Mail, TrendingUp, DollarSign, Home, BarChart3, Calculator, ImageIcon, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DemoReport = () => {
  const navigate = useNavigate();

  const propertyData = {
    address: '1810 Ivy Crest Drive',
    city: 'Brentwood',
    state: 'TN',
    sqft: 4843,
    currentValue: 1600000,
    pricePerSqft: 330
  };

  const packages = [
    {
      name: 'Essential Remodel',
      investment: 125000,
      afterValue: 1850000,
      roi: 225000,
      roiPercent: 180,
      monthly: { heloc: 1423, refinance: 289 }
    },
    {
      name: 'Complete Transformation',
      investment: 225000,
      afterValue: 2100000,
      roi: 500000,
      roiPercent: 222,
      monthly: { heloc: 2562, refinance: 521 }
    },
    {
      name: 'Luxury Upgrade',
      investment: 350000,
      afterValue: 2450000,
      roi: 850000,
      roiPercent: 243,
      monthly: { heloc: 3986, refinance: 810 }
    }
  ];

  const comparables = [
    { address: '1825 Mallory Lane', price: 2150000, sqft: 5200, priceSqft: 413, distance: 0.3 },
    { address: '205 Carriage House Ln', price: 1950000, sqft: 4950, priceSqft: 394, distance: 0.5 },
    { address: '9301 Anson Way', price: 2250000, sqft: 5400, priceSqft: 417, distance: 0.7 },
    { address: '308 Radnor Ct', price: 1875000, sqft: 4700, priceSqft: 399, distance: 0.8 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                ← Back
              </Button>
              <div className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Sample Deliverable</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Email Client
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-sm text-muted-foreground mb-2">INVESTMENT OPPORTUNITY ANALYSIS</div>
                <h1 className="text-4xl font-bold mb-2">{propertyData.address}</h1>
                <p className="text-xl text-muted-foreground">{propertyData.city}, {propertyData.state}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Prepared By</div>
                <div className="font-bold text-lg">Premier Builders Co.</div>
                <div className="text-sm text-muted-foreground">License #123456</div>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-card rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Current Value</div>
                <div className="text-2xl font-bold">${propertyData.currentValue.toLocaleString()}</div>
              </div>
              <div className="bg-card rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Square Footage</div>
                <div className="text-2xl font-bold">{propertyData.sqft.toLocaleString()} sq ft</div>
              </div>
              <div className="bg-card rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Current $/sqft</div>
                <div className="text-2xl font-bold">${propertyData.pricePerSqft}</div>
              </div>
              <div className="bg-card rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Report Date</div>
                <div className="text-2xl font-bold">Jan 15, 2025</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Executive Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground mb-4">
              Based on current market conditions in Brentwood, TN and recent comparable sales, your property has significant untapped equity potential. This analysis presents three strategic remodel scenarios designed to maximize your return on investment while maintaining quality and market competitiveness.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">RECOMMENDED SCENARIO</div>
                <div className="text-4xl font-bold text-primary mb-2">$500,000</div>
                <div className="text-lg text-muted-foreground mb-4">Projected Equity Gain</div>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">${packages[1].investment.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Investment</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">{packages[1].roiPercent}%</div>
                    <div className="text-sm text-muted-foreground">ROI</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">${packages[1].afterValue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">After Value</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Remodel Package Scenarios */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              Three Strategic Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {packages.map((pkg, idx) => (
              <div key={idx} className={`border-2 rounded-xl p-6 ${idx === 1 ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{pkg.name}</h3>
                    {idx === 1 && (
                      <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-success">+${pkg.roi.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Equity Gain</div>
                  </div>
                </div>
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-background rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Investment Required</div>
                    <div className="text-lg font-bold">${pkg.investment.toLocaleString()}</div>
                  </div>
                  <div className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-lg p-3">
                    <div className="text-xs font-semibold text-success mb-1">After Renovation Value</div>
                    <div className="text-lg font-bold text-success">${pkg.afterValue.toLocaleString()}</div>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Return on Investment</div>
                    <div className="text-lg font-bold text-success">{pkg.roiPercent}%</div>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">New $/sqft</div>
                    <div className="text-lg font-bold">${Math.round(pkg.afterValue / propertyData.sqft)}</div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="text-sm font-semibold mb-2">Included Features:</div>
                  <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    {idx === 0 && (
                      <>
                        <div>• Kitchen renovation</div>
                        <div>• Primary bath update</div>
                        <div>• Fresh paint throughout</div>
                        <div>• New flooring</div>
                        <div>• Updated fixtures & lighting</div>
                        <div>• Landscaping refresh</div>
                      </>
                    )}
                    {idx === 1 && (
                      <>
                        <div>• Complete kitchen remodel</div>
                        <div>• All bathroom updates</div>
                        <div>• Hardwood flooring upgrade</div>
                        <div>• Designer lighting package</div>
                        <div>• Outdoor living space</div>
                        <div>• Premium landscaping</div>
                        <div>• Smart home integration</div>
                        <div>• Energy efficiency upgrades</div>
                      </>
                    )}
                    {idx === 2 && (
                      <>
                        <div>• Chef\'s kitchen w/ premium appliances</div>
                        <div>• Spa-quality bathrooms</div>
                        <div>• Wide-plank hardwood floors</div>
                        <div>• Custom millwork & built-ins</div>
                        <div>• Outdoor kitchen & pool area</div>
                        <div>• Professional landscaping design</div>
                        <div>• Home automation system</div>
                        <div>• Wine cellar or bonus room</div>
                        <div>• Premium finishes throughout</div>
                        <div>• Architectural enhancements</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Financing Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary" />
              Financing Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Multiple financing options available to fund your remodel investment. All scenarios assume current market rates.
            </p>
            {packages.map((pkg, idx) => (
              <div key={idx} className="mb-6 last:mb-0">
                <h3 className="font-bold text-lg mb-3">{pkg.name}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold mb-1">HELOC Option</div>
                        <div className="text-xs text-muted-foreground">Home Equity Line of Credit @ 8.5%</div>
                      </div>
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">${pkg.monthly.heloc.toLocaleString()}/mo</div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• 10-year term</div>
                      <div>• Interest-only available</div>
                      <div>• Tax-deductible interest*</div>
                      <div>• Total cost: ${(pkg.monthly.heloc * 120).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold mb-1">Cash-Out Refinance</div>
                        <div className="text-xs text-muted-foreground">30-year fixed @ 7.25%</div>
                      </div>
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">+${pkg.monthly.refinance.toLocaleString()}/mo</div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• Increase to mortgage payment</div>
                      <div>• Lower overall rate vs HELOC</div>
                      <div>• Single payment convenience</div>
                      <div>• Long-term fixed rate security</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-muted/50 rounded-lg p-4 mt-6 text-sm">
              <p className="font-semibold mb-2">💡 Smart Financing Tip:</p>
              <p className="text-muted-foreground">
                Many homeowners use a HELOC for construction, then refinance into the improved value after completion for better long-term rates and to unlock additional equity.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Market Comparables */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              Recent Comparable Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Recent sales of similar properties in your area support the projected after-renovation values. All sales within the last 90 days.
            </p>
            <div className="space-y-3">
              {comparables.map((comp, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-lg">{comp.address}</div>
                      <div className="text-sm text-muted-foreground">{comp.distance} miles away • {comp.sqft.toLocaleString()} sq ft</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${comp.price.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">${comp.priceSqft}/sqft</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Average Comparable Price</div>
                <div className="text-3xl font-bold text-primary">${Math.round(comparables.reduce((sum, c) => sum + c.priceSqft, 0) / comparables.length)}/sqft</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Your target after remodel: $385-$434/sqft (well-supported by market data)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Photos Showcase */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-6 w-6 text-primary" />
              Our Recent Transformations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Examples of our work on similar homes in your area. Your project will receive the same attention to detail and quality craftsmanship.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="space-y-2">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">Project {item} - {['Kitchen', 'Primary Bath', 'Outdoor Living', 'Full Renovation'][item - 1]}</div>
                    <div className="text-muted-foreground">Brentwood, TN • Completed 2024</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps & CTA */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-6">
            <h2 className="text-3xl font-bold mb-4 text-center">Next Steps</h2>
            <p className="text-lg text-muted-foreground text-center mb-6">
              Ready to unlock your home\'s full potential? Let\'s schedule a consultation to discuss your vision and timeline.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-2">1</div>
                <div className="font-semibold mb-1">Schedule Consultation</div>
                <div className="text-sm text-muted-foreground">Review options & answer questions</div>
              </div>
              <div className="bg-card rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-2">2</div>
                <div className="font-semibold mb-1">Finalize Design & Budget</div>
                <div className="text-sm text-muted-foreground">Customize to your preferences</div>
              </div>
              <div className="bg-card rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-2">3</div>
                <div className="font-semibold mb-1">Begin Construction</div>
                <div className="text-sm text-muted-foreground">Professional project management</div>
              </div>
            </div>
            <div className="text-center">
              <Button size="lg" className="text-lg px-8">
                Schedule Your Consultation
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Premier Builders Co. • (615) 555-1234 • contact@premierbuilders.com
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Disclaimer */}
        <div className="mt-8 text-xs text-muted-foreground text-center space-y-2">
          <p>
            *This analysis is provided for informational purposes and represents projected values based on current market conditions. Actual results may vary.
          </p>
          <p>
            Financing options subject to credit approval and current market rates. Consult with your financial advisor and tax professional.
          </p>
          <p className="font-semibold">
            Premier Builders Co. • License #123456 • Bonded & Insured • BBB A+ Rated
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoReport;
