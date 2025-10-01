import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Download, Mail, Home, Package, Layers, ChefHat, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DemoReportItemized = () => {
  const navigate = useNavigate();

  const propertyData = {
    address: '1810 Ivy Crest Drive',
    city: 'Brentwood',
    state: 'TN',
    sqft: 4843,
    currentValue: 1600000,
  };

  const floorPackages = [
    {
      tier: 'Select',
      investment: 28000,
      pricePerSqft: '5.78',
      afterValue: 1635000,
      roi: 7000,
      roiPercent: 25,
      features: [
        'Luxury Vinyl Plank (LVP)',
        'Premium residential grade',
        'Waterproof core technology',
        '20-year warranty',
      ],
      brands: ['COREtec Plus', 'LifeProof', 'Shaw Floorte'],
      finishes: ['Natural Oak', 'Gray Wash', 'Weathered Pine'],
    },
    {
      tier: 'Premium',
      investment: 48000,
      pricePerSqft: '9.91',
      afterValue: 1670000,
      roi: 22000,
      roiPercent: 46,
      features: [
        'Engineered Hardwood',
        '5-6" wide planks',
        'Hand-scraped or wire-brushed texture',
        '50-year finish warranty',
      ],
      brands: ['Mullican', 'Somerset', 'Armstrong'],
      finishes: ['European Oak', 'Hickory Saddle', 'Walnut Natural'],
    },
    {
      tier: 'Luxury',
      investment: 72000,
      pricePerSqft: '14.87',
      afterValue: 1710000,
      roi: 38000,
      roiPercent: 53,
      features: [
        'Solid Hardwood',
        '7-9" wide planks',
        'Premium grade selection',
        'Custom stain options available',
        'Lifetime structural warranty',
      ],
      brands: ['Carlisle Wide Plank', 'Vintage Hardwood', 'Monarch Plank'],
      finishes: ['White Oak Natural', 'Walnut Espresso', 'Maple Linen'],
    },
  ];

  const kitchenPackages = [
    {
      tier: 'Select',
      investment: 65000,
      afterValue: 1685000,
      roi: 20000,
      roiPercent: 31,
      cabinets: {
        type: 'Semi-Custom',
        brands: ['KraftMaid', 'Diamond NOW'],
        features: ['Soft-close hinges', 'Standard depth', 'Limited finish options'],
      },
      countertops: {
        material: 'Quartz - Builder Grade',
        brands: ['MSI Q Premium', 'Silestone Essential'],
        features: ['3cm thickness', '2" edge profile', 'Standard colors'],
      },
      appliances: {
        package: 'Stainless Steel Package',
        brands: ['Whirlpool', 'Frigidaire Gallery', 'GE Profile'],
        includes: [
          'French door refrigerator',
          'Gas or electric range',
          'Microwave hood combination',
          'Dishwasher with stainless tub',
        ],
      },
      sink: 'Stainless steel undermount',
      backsplash: 'Subway tile or simple mosaic (up to $15/sqft)',
    },
    {
      tier: 'Premium',
      investment: 95000,
      afterValue: 1730000,
      roi: 35000,
      roiPercent: 37,
      cabinets: {
        type: 'Full Custom',
        brands: ['Wellborn', 'Dura Supreme', 'Crystal Cabinets'],
        features: ['Soft-close doors & drawers', 'Extended depth options', 'Designer finish selection', 'Crown molding included'],
      },
      countertops: {
        material: 'Quartz - Premium Grade or Granite',
        brands: ['Cambria', 'Caesarstone', 'Natural Granite Select'],
        features: ['3cm thickness', 'Decorative edge options', 'Premium color selection', 'Extended patterns'],
      },
      appliances: {
        package: 'Professional Grade',
        brands: ['KitchenAid', 'Bosch', 'Samsung Bespoke'],
        includes: [
          'Counter-depth refrigerator with WiFi',
          '5-burner gas range or induction',
          'Built-in microwave drawer',
          'Third rack dishwasher (ultra-quiet)',
          'Range hood with blower',
        ],
      },
      sink: 'Farmhouse or undermount composite (Blanco, Kraus)',
      backsplash: 'Designer tile up to $25/sqft or natural stone',
    },
    {
      tier: 'Luxury',
      investment: 145000,
      afterValue: 1800000,
      roi: 55000,
      roiPercent: 38,
      cabinets: {
        type: 'Luxury Custom',
        brands: ['Plain & Fancy', 'Wood-Mode', 'SieMatic'],
        features: [
          'Full-extension soft-close hardware',
          'Inset or full-overlay doors',
          'Hand-applied finishes',
          'Interior drawer organization systems',
          'Specialty storage solutions',
        ],
      },
      countertops: {
        material: 'Natural Stone or Ultra-Premium Quartz',
        brands: ['Calacatta Marble', 'Quartzite', 'Dekton', 'Neolith'],
        features: ['Waterfall edges available', 'Book-matched slabs', 'Exotic stone options', 'Designer edges'],
      },
      appliances: {
        package: 'Chef-Grade Professional',
        brands: ['Wolf', 'Sub-Zero', 'Thermador', 'Miele'],
        includes: [
          '48" built-in refrigerator/freezer columns',
          '36"-48" professional range (6+ burners)',
          'Built-in coffee system',
          'Steam oven or speed oven',
          'Panel-ready dishwasher',
          'Professional hood with custom panel',
        ],
      },
      sink: 'Premium options: Fireclay farmhouse (Rohl, Shaws) or integrated stone',
      backsplash: 'Custom: Natural stone slabs, handmade tile, or book-matched marble',
    },
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
                <span className="text-xl font-bold">Itemized Options Report</span>
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
        {/* Header */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-sm text-muted-foreground mb-2">ITEMIZED REMODEL OPTIONS</div>
                <h1 className="text-4xl font-bold mb-2">{propertyData.address}</h1>
                <p className="text-xl text-muted-foreground">{propertyData.city}, {propertyData.state}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current Value</div>
                <div className="text-3xl font-bold">${propertyData.currentValue.toLocaleString()}</div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4">
              <p className="text-muted-foreground">
                This report breaks down individual component options—flooring and kitchen—so you can see exactly what's included at each investment level and mix-and-match to create your ideal remodel package.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Flooring Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              Flooring Options - {propertyData.sqft.toLocaleString()} sq ft
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {floorPackages.map((pkg, idx) => (
              <div key={idx} className="border-2 rounded-xl p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-2">
                      {pkg.tier.toUpperCase()}
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{pkg.tier} Flooring Package</h3>
                    <div className="text-sm text-muted-foreground">${pkg.pricePerSqft}/sq ft installed</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">${pkg.investment.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Investment</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <div className="font-semibold mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      Product Features
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {pkg.features.map((feature, i) => (
                        <li key={i}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Brand Examples</div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {pkg.brands.map((brand, i) => (
                        <span key={i} className="bg-muted px-3 py-1 rounded-full text-xs font-medium">
                          {brand}
                        </span>
                      ))}
                    </div>
                    <div className="font-semibold mb-2">Popular Finishes</div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {pkg.finishes.map((finish, i) => (
                        <div key={i}>• {finish}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-sm text-muted-foreground mb-1">After Value</div>
                      <div className="text-xl font-bold text-success">${pkg.afterValue.toLocaleString()}</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-sm text-muted-foreground mb-1">Value Add</div>
                      <div className="text-xl font-bold text-success">+${pkg.roi.toLocaleString()}</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-sm text-muted-foreground mb-1">ROI</div>
                      <div className="text-xl font-bold text-success">{pkg.roiPercent}%</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Kitchen Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-primary" />
              Kitchen Remodel Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {kitchenPackages.map((pkg, idx) => (
              <div key={idx} className="border-2 rounded-xl p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-2">
                      {pkg.tier.toUpperCase()}
                    </div>
                    <h3 className="text-2xl font-bold">{pkg.tier} Kitchen Package</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">${pkg.investment.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Investment</div>
                  </div>
                </div>

                {/* Cabinets */}
                <div className="mb-4 bg-muted/20 rounded-lg p-4">
                  <div className="font-bold mb-2 text-primary">Cabinetry - {pkg.cabinets.type}</div>
                  <div className="mb-2">
                    <span className="text-sm font-semibold">Brands: </span>
                    <span className="text-sm text-muted-foreground">{pkg.cabinets.brands.join(', ')}</span>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {pkg.cabinets.features.map((feature, i) => (
                      <li key={i}>• {feature}</li>
                    ))}
                  </ul>
                </div>

                {/* Countertops */}
                <div className="mb-4 bg-muted/20 rounded-lg p-4">
                  <div className="font-bold mb-2 text-primary">Countertops - {pkg.countertops.material}</div>
                  <div className="mb-2">
                    <span className="text-sm font-semibold">Brands: </span>
                    <span className="text-sm text-muted-foreground">{pkg.countertops.brands.join(', ')}</span>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {pkg.countertops.features.map((feature, i) => (
                      <li key={i}>• {feature}</li>
                    ))}
                  </ul>
                </div>

                {/* Appliances */}
                <div className="mb-4 bg-muted/20 rounded-lg p-4">
                  <div className="font-bold mb-2 text-primary">Appliances - {pkg.appliances.package}</div>
                  <div className="mb-2">
                    <span className="text-sm font-semibold">Brands: </span>
                    <span className="text-sm text-muted-foreground">{pkg.appliances.brands.join(', ')}</span>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {pkg.appliances.includes.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Additional Details */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="text-sm">
                    <span className="font-semibold">Sink: </span>
                    <span className="text-muted-foreground">{pkg.sink}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Backsplash: </span>
                    <span className="text-muted-foreground">{pkg.backsplash}</span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="border-t pt-4">
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-sm text-muted-foreground mb-1">After Value</div>
                      <div className="text-xl font-bold text-success">${pkg.afterValue.toLocaleString()}</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-sm text-muted-foreground mb-1">Value Add</div>
                      <div className="text-xl font-bold text-success">+${pkg.roi.toLocaleString()}</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-sm text-muted-foreground mb-1">ROI</div>
                      <div className="text-xl font-bold text-success">{pkg.roiPercent}%</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mix & Match Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              Create Your Custom Package
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Combine any flooring option with any kitchen option to create a package that fits your budget and vision. Our team will work with you to refine the details and provide exact pricing.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">Example Custom Package</div>
                <div className="text-sm text-muted-foreground mb-4">Premium Flooring + Luxury Kitchen</div>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">${(48000 + 145000).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Combined Investment</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">${(1710000).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Estimated Value</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">+${(110000).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Net Benefit</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Discuss Your Options?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Schedule a consultation to walk through these options, see samples, and create a custom package that's perfect for your home and budget.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">Schedule Consultation</Button>
              <Button size="lg" variant="outline">Request More Information</Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground space-y-2">
          <p>
            All values and ROI projections are estimates based on current market conditions in {propertyData.city}, {propertyData.state}.
          </p>
          <p>
            Brand availability may vary. Final pricing subject to site inspection and detailed scope review.
          </p>
          <p className="font-semibold">Premier Builders Co. | License #123456 | (615) 555-0123</p>
        </div>
      </div>
    </div>
  );
};

export default DemoReportItemized;
