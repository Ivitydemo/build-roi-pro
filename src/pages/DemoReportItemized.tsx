import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Download, Mail, Share2, Home, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ComparableWithAnalysis } from '@/components/ComparableWithAnalysis';
import comparable1Kitchen from '@/assets/comparable-1-kitchen.jpg';
import comparable2Kitchen from '@/assets/comparable-2-kitchen.jpg';
import comparable3Kitchen from '@/assets/comparable-3-kitchen.jpg';
import comparable4Kitchen from '@/assets/comparable-4-kitchen.jpg';

const DemoReportItemized = () => {
  const navigate = useNavigate();

  const propertyData = {
    address: '1810 Ivy Crest Drive',
    city: 'Brentwood',
    state: 'TN',
    sqft: 4843,
    currentValue: 1600000,
  };

  const packages = [
    {
      tier: 'TIER 1: Essential ROI Package',
      investment: 169000,
      recommended: true,
      components: [
        {
          name: 'Flooring',
          cost: 75000,
          specs: [
            '7" engineered oak throughout main areas',
            'High-quality carpet in bedrooms',
            'Upgraded tile in bathrooms',
            'Professional installation',
          ],
        },
        {
          name: 'Kitchen',
          cost: 89000,
          specs: [
            'Shaker-style quality cabinetry',
            'Quartz countertops',
            'Café or KitchenAid appliances',
            'Updated backsplash',
            'New hardware and lighting',
          ],
        },
        {
          name: 'Incidentals',
          cost: 5000,
          specs: [
            'Paint touch-ups',
            'Hardware updates',
            'Minor fixture replacements',
          ],
        },
      ],
      metrics: {
        totalInvestment: 169000,
        expectedARV: 1865000,
        arvPerSqft: 385,
        projectedProfit: 101000,
        roi: 60,
        downsideProtection: 'Break-even at $355/sf (only $44K loss)',
      },
    },
    {
      tier: 'TIER 2: Premium ROI Package',
      investment: 283000,
      recommended: false,
      tagline: 'For targeting ultra-luxury buyers at premium pricing',
      components: [
        {
          name: 'Flooring',
          cost: 94000,
          specs: [
            'Walnut or high-end engineered hardwood',
            'Premium porcelain tile in wet areas',
            'Luxury carpet in bedrooms',
          ],
        },
        {
          name: 'Kitchen',
          cost: 182000,
          specs: [
            'Custom inset cabinetry',
            'Quartzite or exotic stone countertops',
            'Wolf/Sub-Zero appliance suite',
            'Designer backsplash',
            'Premium fixtures and lighting',
          ],
        },
        {
          name: 'Incidentals',
          cost: 7000,
          specs: [
            'Designer paint throughout',
            'Premium hardware',
            'Upgraded fixtures',
          ],
        },
      ],
      metrics: {
        totalInvestment: 283000,
        targetARV: 2058000,
        arvPerSqft: 425,
        projectedProfit: 180000,
        roi: 64,
        riskFactor: 'Requires exceptional execution & premium buyer',
      },
    },
  ];

  const comparables = [
    { 
      address: '1825 Mallory Lane', 
      price: 2150000, 
      sqft: 5200, 
      priceSqft: 413, 
      distance: 0.3,
      analysis: {
        quality: 'Premium' as const,
        renovationStatus: 'Fully Renovated' as const,
        renovatedAreas: ['Kitchen', 'All Bathrooms (3)', 'Flooring Throughout', 'Lighting', 'Paint'],
        materials: ['Quartzite countertops', 'Custom cabinetry', 'Wide-plank oak flooring', 'Wolf appliances'],
        valueDrivers: [
          'High-end stone countertops add $30-45/sqft value',
          'Custom cabinetry vs. stock adds $20-30/sqft',
          'Premium appliances increase buyer appeal and price point'
        ],
        estimatedImpact: 350000,
        photoUrl: comparable1Kitchen
      }
    },
    { 
      address: '205 Carriage House Ln', 
      price: 1950000, 
      sqft: 4950, 
      priceSqft: 394, 
      distance: 0.5,
      analysis: {
        quality: 'Premium' as const,
        renovationStatus: 'Partially Updated' as const,
        renovatedAreas: ['Kitchen', 'Master Bath', 'Main Floor Flooring'],
        materials: ['Quartz countertops', 'Shaker cabinetry', 'Engineered hardwood', 'KitchenAid appliances'],
        valueDrivers: [
          'Quartz countertops provide modern appeal at $25-35/sqft premium',
          'Quality shaker cabinets add timeless value',
          'Strategic focus on high-impact areas maximizes ROI'
        ],
        estimatedImpact: 280000,
        photoUrl: comparable2Kitchen
      }
    },
    { 
      address: '9301 Anson Way', 
      price: 2250000, 
      sqft: 5400, 
      priceSqft: 417, 
      distance: 0.7,
      analysis: {
        quality: 'Luxury' as const,
        renovationStatus: 'Fully Renovated' as const,
        renovatedAreas: ['Kitchen', 'All Bathrooms (4)', 'Flooring Throughout', 'Lighting', 'Paint', 'Fixtures'],
        materials: ['Exotic stone countertops', 'Inset custom cabinetry', 'Walnut flooring', 'Sub-Zero/Wolf suite'],
        valueDrivers: [
          'Exotic stone like marble adds $40-60/sqft to value',
          'Inset cabinetry is the highest-end construction',
          'Walnut flooring commands top-tier pricing'
        ],
        estimatedImpact: 450000,
        photoUrl: comparable3Kitchen
      }
    },
    { 
      address: '308 Radnor Ct', 
      price: 1875000, 
      sqft: 4700, 
      priceSqft: 399, 
      distance: 0.8,
      analysis: {
        quality: 'Premium' as const,
        renovationStatus: 'Partially Updated' as const,
        renovatedAreas: ['Kitchen', 'Master & Guest Baths', 'Paint & Lighting'],
        materials: ['Quartz countertops', 'Semi-custom cabinets', 'Oak flooring', 'Bosch appliances'],
        valueDrivers: [
          'Quality quartz provides durability and modern aesthetics',
          'Semi-custom cabinets balance cost and customization',
          'Strategic bathroom updates increase perceived value'
        ],
        estimatedImpact: 300000,
        photoUrl: comparable4Kitchen
      }
    }
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
                  <span className="text-xl font-bold">Component Breakdown Report</span>
                  <div className="text-xs text-muted-foreground">Detailed Package Analysis</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Button 
                variant="default" 
                size="sm"
                onClick={() => navigate('/comparables-analysis')}
              >
                Get REAL Comp Data & Photos →
              </Button>
              <div className="h-4 w-px bg-border" />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/property-analysis')}
                className="text-xs"
              >
                Get Real Data for This Property →
              </Button>
              <div className="h-4 w-px bg-border" />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/demo/package')}
                className="text-xs"
              >
                Switch to Package View →
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
        {/* Header */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-sm text-muted-foreground mb-2">COMPONENT BREAKDOWN ANALYSIS</div>
                <h1 className="text-4xl font-bold mb-2">{propertyData.address}</h1>
                <p className="text-xl text-muted-foreground">{propertyData.city}, {propertyData.state}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current Value</div>
                <div className="text-3xl font-bold">${propertyData.currentValue.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Comparables Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              Market Comparables Analysis
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-2">
              Recent sales within 0.8 miles • Analysis shows exactly what drives higher pricing
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              All sales within the last 90 days. <strong className="text-foreground">Analysis reveals specific materials, renovation scope, and value drivers that justify premium pricing.</strong>
            </p>
            <div className="space-y-4">
              {comparables.map((comp, idx) => (
                <ComparableWithAnalysis
                  key={idx}
                  address={comp.address}
                  price={comp.price}
                  sqft={comp.sqft}
                  priceSqft={comp.priceSqft}
                  distance={comp.distance}
                  analysis={comp.analysis}
                />
              ))}
            </div>
            <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="text-sm text-muted-foreground mb-1">Average Comparable Price</div>
                <div className="text-3xl font-bold text-primary">${Math.round(comparables.reduce((sum, c) => sum + c.priceSqft, 0) / comparables.length)}/sqft</div>
              </div>
              <div className="border-t pt-4">
                <div className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Key Takeaways - What Drives Value:
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-background rounded p-3">
                    <div className="font-medium mb-1">Premium Countertops</div>
                    <div className="text-muted-foreground text-xs">Quartz/Quartzite: $25-60/sqft value add</div>
                  </div>
                  <div className="bg-background rounded p-3">
                    <div className="font-medium mb-1">Custom Cabinetry</div>
                    <div className="text-muted-foreground text-xs">Upgraded cabinets: $20-40/sqft premium</div>
                  </div>
                  <div className="bg-background rounded p-3">
                    <div className="font-medium mb-1">Quality Flooring</div>
                    <div className="text-muted-foreground text-xs">Hardwood/engineered: $15-50/sqft</div>
                  </div>
                  <div className="bg-background rounded p-3">
                    <div className="font-medium mb-1">Premium Appliances</div>
                    <div className="text-muted-foreground text-xs">High-end brands signal luxury</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Package Details */}
        {packages.map((pkg, idx) => (
          <Card key={idx} className="mb-8 transition-all duration-300 hover:shadow-xl">
            <CardHeader className={pkg.recommended ? 'bg-primary/10 border-b-2 border-primary' : ''}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {pkg.tier} - ${pkg.investment.toLocaleString()}
                  </CardTitle>
                  {pkg.tagline && (
                    <p className="text-sm text-muted-foreground italic mt-1">{pkg.tagline}</p>
                  )}
                </div>
                {pkg.recommended && (
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-sm">
                    RECOMMENDED
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Component Breakdown Table */}
              <div className="mb-6 overflow-hidden rounded-lg border-2 border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary hover:bg-primary">
                      <TableHead className="text-primary-foreground font-bold">Component</TableHead>
                      <TableHead className="text-primary-foreground font-bold">Investment</TableHead>
                      <TableHead className="text-primary-foreground font-bold">Specifications</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pkg.components.map((component, cIdx) => (
                      <TableRow key={cIdx} className="hover:bg-muted/50">
                        <TableCell className="font-semibold">{component.name}</TableCell>
                        <TableCell className="font-semibold">${component.cost.toLocaleString()}</TableCell>
                        <TableCell>
                          <ul className="space-y-1">
                            {component.specs.map((spec, sIdx) => (
                              <li key={sIdx} className="text-sm">• {spec}</li>
                            ))}
                          </ul>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Metrics Table */}
              <div className="overflow-hidden rounded-lg border-2 border-success/30">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-success hover:bg-success">
                      <TableHead className="text-success-foreground font-bold">Metric</TableHead>
                      <TableHead className="text-success-foreground font-bold">Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-success/5 hover:bg-success/10">
                      <TableCell className="font-semibold">Total Investment</TableCell>
                      <TableCell className="font-semibold">${pkg.metrics.totalInvestment.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow className="bg-success/5 hover:bg-success/10">
                      <TableCell className="font-semibold">
                        {pkg.metrics.expectedARV ? 'Expected ARV' : 'Target ARV'}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${(pkg.metrics.expectedARV || pkg.metrics.targetARV).toLocaleString()} (${pkg.metrics.arvPerSqft}/sf)
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-success/5 hover:bg-success/10">
                      <TableCell className="font-semibold">
                        {pkg.metrics.projectedProfit && 'Projected Profit'}
                      </TableCell>
                      <TableCell className="font-semibold">${pkg.metrics.projectedProfit.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow className="bg-success/5 hover:bg-success/10">
                      <TableCell className="font-semibold">ROI</TableCell>
                      <TableCell className="font-semibold">{pkg.metrics.roi}%</TableCell>
                    </TableRow>
                    {pkg.metrics.downsideProtection && (
                      <TableRow className="bg-success/5 hover:bg-success/10">
                        <TableCell className="font-semibold">Downside Protection</TableCell>
                        <TableCell className="text-sm">{pkg.metrics.downsideProtection}</TableCell>
                      </TableRow>
                    )}
                    {pkg.metrics.riskFactor && (
                      <TableRow className="bg-success/5 hover:bg-success/10">
                        <TableCell className="font-semibold">Risk Factor</TableCell>
                        <TableCell className="text-sm">{pkg.metrics.riskFactor}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Before we connect, discover our exclusive network of vetted partners who can help maximize your investment returns.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/demo/partners')}
              className="text-lg px-8 py-6 h-auto"
            >
              See Our Preferred Partners →
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground space-y-2">
          <p>
            All values and ROI projections are estimates based on current market conditions in {propertyData.city}, {propertyData.state}.
          </p>
          <p className="font-semibold">Premier Builders Co. | License #123456 | (615) 555-0123</p>
        </div>
      </div>
    </div>
  );
};

export default DemoReportItemized;
