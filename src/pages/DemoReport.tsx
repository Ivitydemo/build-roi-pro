import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Download, Mail, TrendingUp, DollarSign, Home, BarChart3, Calculator, ImageIcon, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DemoReport = () => {
  const navigate = useNavigate();
  // Data structures updated to support low/expected/best scenarios

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
      afterValue: { low: 1750000, expected: 1850000, best: 1950000 },
      roi: { low: 125000, expected: 225000, best: 325000 },
      roiPercent: { low: 100, expected: 180, best: 260 },
      monthly: { heloc: 1423, refinance: 289 }
    },
    {
      name: 'Complete Transformation',
      investment: 225000,
      afterValue: { low: 1950000, expected: 2100000, best: 2250000 },
      roi: { low: 350000, expected: 500000, best: 650000 },
      roiPercent: { low: 156, expected: 222, best: 289 },
      monthly: { heloc: 2562, refinance: 521 }
    },
    {
      name: 'Luxury Upgrade',
      investment: 350000,
      afterValue: { low: 2250000, expected: 2450000, best: 2650000 },
      roi: { low: 650000, expected: 850000, best: 1050000 },
      roiPercent: { low: 186, expected: 243, best: 300 },
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
                <div>
                  <span className="text-xl font-bold">Sample Deliverable</span>
                  <div className="text-xs text-muted-foreground">Package-Based View</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/demo/itemized')}
                className="text-xs"
              >
                Switch to Itemized View →
              </Button>
              <div className="h-4 w-px bg-border" />
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
                    <div className="text-2xl font-bold text-success">{packages[1].roiPercent.expected}%</div>
                    <div className="text-sm text-muted-foreground">Expected ROI</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">${packages[1].afterValue.expected.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Expected Value</div>
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
              <div key={idx} className={`border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer ${idx === 1 ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
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
                    <div className="text-3xl font-bold text-success">+${pkg.roi.expected.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Expected Equity Gain</div>
                  </div>
                </div>
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-background rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Investment Required</div>
                    <div className="text-lg font-bold">${pkg.investment.toLocaleString()}</div>
                  </div>
                  <div className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-lg p-3">
                    <div className="text-xs font-semibold text-success mb-1">After Renovation Value</div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Low:</span>
                        <span className="text-sm font-bold text-success">${pkg.afterValue.low.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-success font-semibold">Expected:</span>
                        <span className="text-base font-bold text-success">${pkg.afterValue.expected.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Best:</span>
                        <span className="text-sm font-bold text-success">${pkg.afterValue.best.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Return on Investment</div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Low:</span>
                        <span className="text-sm font-bold text-success">{pkg.roiPercent.low}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-success font-semibold">Expected:</span>
                        <span className="text-base font-bold text-success">{pkg.roiPercent.expected}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Best:</span>
                        <span className="text-sm font-bold text-success">{pkg.roiPercent.best}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">New $/sqft</div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Low:</span>
                        <span className="text-sm font-bold">${Math.round(pkg.afterValue.low / propertyData.sqft)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold">Expected:</span>
                        <span className="text-base font-bold">${Math.round(pkg.afterValue.expected / propertyData.sqft)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Best:</span>
                        <span className="text-sm font-bold">${Math.round(pkg.afterValue.best / propertyData.sqft)}</span>
                      </div>
                    </div>
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
              Financial Analysis & Transparency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              We believe in complete transparency. Here's the full financial picture for each scenario, so you can make an informed decision with absolute confidence.
            </p>
            {packages.map((pkg, idx) => {
              const valueAdd = pkg.afterValue.expected - propertyData.currentValue;
              const netBenefit = valueAdd - pkg.investment;
              const isPositiveROI = netBenefit > 0;
              
              return (
                <div key={idx} className="mb-8 last:mb-0 border-2 border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary/50 cursor-pointer">
                  <div className="mb-4">
                    <h3 className="font-bold text-xl mb-3">{pkg.name}</h3>
                    
                    {/* Value Add Breakdown */}
                    <div className="bg-muted/30 rounded-lg p-4 mb-4">
                      <div className="text-sm font-semibold mb-3">Financial Breakdown (Expected Scenario)</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Current Property Value:</span>
                          <span className="font-mono font-semibold">${propertyData.currentValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Target Value After Remodel:</span>
                          <span className="font-mono font-semibold">${pkg.afterValue.expected.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between items-center">
                          <span className="font-semibold">Total Value Added:</span>
                          <span className="font-mono font-bold text-lg text-success">+${valueAdd.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Your Investment:</span>
                          <span className="font-mono font-semibold">-${pkg.investment.toLocaleString()}</span>
                        </div>
                        <div className={`border-t pt-2 flex justify-between items-center ${isPositiveROI ? 'bg-success/10' : 'bg-muted/50'} -mx-4 px-4 py-2 rounded`}>
                          <span className="font-bold">Net Financial Benefit:</span>
                          <span className={`font-mono font-bold text-xl ${isPositiveROI ? 'text-success' : 'text-foreground'}`}>
                            {isPositiveROI ? '+' : ''}${netBenefit.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Contextual Messaging */}
                      <div className="mt-4 pt-4 border-t">
                        {isPositiveROI ? (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-success">Positive Return:</span> This scenario adds ${valueAdd.toLocaleString()} in value while you invest ${pkg.investment.toLocaleString()}, resulting in a net gain of ${netBenefit.toLocaleString()}. You improve your home and build equity.
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">Quality of Life Investment:</span> While this scenario has a ${Math.abs(netBenefit).toLocaleString()} net cost, you're investing in your daily living experience. The true cost is ${Math.abs(netBenefit).toLocaleString()}—not the full ${pkg.investment.toLocaleString()} investment—and you get a home worth ${pkg.afterValue.expected.toLocaleString()}.
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Financing Options */}
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
                </div>
              );
            })}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6 text-sm">
              <p className="font-semibold mb-2">💡 Our Commitment to Transparency:</p>
              <p className="text-muted-foreground">
                We show you the complete math because we believe informed clients make the best decisions. Whether the ROI is positive or not, you deserve to know the true financial impact. Many homeowners use a HELOC for construction, then refinance into the improved value after completion for better long-term rates.
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
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => navigate('/demo/partners')}
              >
                See Our Preferred Partners →
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Discover exclusive benefits before scheduling your consultation
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
