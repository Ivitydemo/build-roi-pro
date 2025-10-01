import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Download, FileText, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DemoReport = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    address: '1810 Ivy Crest Drive',
    city: 'Brentwood',
    state: 'TN',
    sqft: '4843',
    currentValue: '1600000'
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = () => {
    setShowPreview(true);
    toast({
      title: 'Sample Report Generated',
      description: 'This is a demo showing how reports are customized for each client'
    });
  };

  const conservativeROI = 101000;
  const targetROI = 231000;
  const premiumROI = 378000;
  const investment = 169000;
  const monthlyHELOC = 1924;
  const refinanceIncrease = 312;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => window.location.href = '/'}>
            ← Back to Home
          </Button>
          <div className="flex items-center gap-3 mt-4">
            <Building2 className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Interactive Demo Report</h1>
              <p className="text-muted-foreground">See how to CREATE client budgets instead of waiting to bid</p>
            </div>
          </div>
          
          {/* Advisory Positioning Banner */}
          <Card className="mt-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">You're Not Bidding. You're Advising.</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    When YOU bring this analysis to a homeowner, you're the trusted advisor showing them an investment opportunity they didn't know existed. You're not competing with other contractors - you created the opportunity.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold">60-75%</span>
                      <span className="text-muted-foreground">close rate (vs 15-25% when bidding)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold">$0</span>
                      <span className="text-muted-foreground">competitors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold">100%</span>
                      <span className="text-muted-foreground">premium pricing</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
              <CardDescription>
                Enter basic details - the system will automatically pull market data and calculate ROI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Property Address</Label>
                <Input 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="123 Main Street"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input 
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Square Footage</Label>
                  <Input 
                    type="number"
                    value={formData.sqft}
                    onChange={(e) => setFormData({...formData, sqft: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Value</Label>
                  <Input 
                    type="number"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({...formData, currentValue: e.target.value})}
                  />
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handleGenerate}>
                <FileText className="mr-2 h-5 w-5" />
                Generate Sample Report
              </Button>

              <div className="bg-accent/50 p-4 rounded-lg text-sm">
                <p className="font-semibold mb-2">✨ Fully Customized Output:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Your company branding & logo</li>
                  <li>• Live market comparable sales</li>
                  <li>• Your remodel packages & pricing</li>
                  <li>• Your before/after project photos</li>
                  <li>• Current HELOC & refinance rates</li>
                  <li>• Professional PDF + Excel export</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <div className="space-y-6">
            {showPreview && (
              <>
                <Card className="border-2 border-primary/20">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                    <div className="flex items-center justify-between">
                      <CardTitle>Sample Report Preview</CardTitle>
                      <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full">
                        CUSTOMIZED FOR EACH CLIENT
                      </span>
                    </div>
                    <CardDescription>
                      This shows what your clients receive - fully branded with your company info
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* Sample Report Content */}
                    <div className="space-y-6">
                      {/* Executive Summary */}
                      <div className="relative">
                        <div className="absolute top-2 right-2 text-xs text-muted-foreground opacity-50 rotate-[-15deg]">
                          SAMPLE
                        </div>
                        <div className="bg-card border rounded-lg p-4">
                          <h3 className="font-bold text-lg mb-3">Investment Summary</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Property</p>
                              <p className="font-semibold">{formData.address}</p>
                              <p className="text-sm">{formData.city}, {formData.state}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Current Value</p>
                              <p className="font-semibold text-xl">
                                ${parseInt(formData.currentValue).toLocaleString()}
                              </p>
                              <p className="text-sm">${Math.round(parseInt(formData.currentValue) / parseInt(formData.sqft))}/sqft</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ROI Scenarios - Partially Visible */}
                      <div className="relative overflow-hidden">
                        <div className="bg-gradient-to-b from-transparent via-background/50 to-background absolute inset-0 z-10 flex items-end justify-center pb-4">
                          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                            🔒 Full Analysis Available in Your Branded Report
                          </div>
                        </div>
                        <div className="bg-card border rounded-lg p-4 blur-[2px]">
                          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-success" />
                            ROI Analysis - 3 Scenarios
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-success/10 rounded">
                              <div>
                                <p className="font-semibold">Conservative Scenario</p>
                                <p className="text-sm text-muted-foreground">Target: $355/sqft</p>
                              </div>
                              <p className="text-2xl font-bold text-success">+${conservativeROI.toLocaleString()}</p>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-primary/10 rounded">
                              <div>
                                <p className="font-semibold">Target Scenario</p>
                                <p className="text-sm text-muted-foreground">Target: $385/sqft</p>
                              </div>
                              <p className="text-2xl font-bold text-primary">+${targetROI.toLocaleString()}</p>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-accent/20 rounded">
                              <div>
                                <p className="font-semibold">Premium Scenario</p>
                                <p className="text-sm text-muted-foreground">Target: $425/sqft</p>
                              </div>
                              <p className="text-2xl font-bold">+${premiumROI.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Financing Options - Teaser */}
                      <div className="relative">
                        <div className="bg-card border rounded-lg p-4 opacity-60">
                          <h3 className="font-bold text-lg mb-3">Financing Options</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-muted/50 rounded">
                              <p className="text-sm text-muted-foreground mb-1">HELOC (10 years)</p>
                              <p className="text-xl font-bold">${monthlyHELOC}/month</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded">
                              <p className="text-sm text-muted-foreground mb-1">Refinance Impact</p>
                              <p className="text-xl font-bold">+${refinanceIncrease}/month</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Includes detailed payment schedules and break-even analysis
                          </p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Comparable Sales - Hidden */}
                      <div className="bg-muted/30 border-2 border-dashed rounded-lg p-6 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="font-semibold mb-2">Market Comparable Sales</p>
                        <p className="text-sm text-muted-foreground">
                          Full report includes 5-8 recent comparable sales with photos, prices, and detailed analysis
                        </p>
                      </div>

                      {/* Before/After Photos - Placeholder */}
                      <div className="bg-muted/30 border-2 border-dashed rounded-lg p-6 text-center">
                        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="font-semibold mb-2">Your Project Photos</p>
                        <p className="text-sm text-muted-foreground">
                          Showcase your best before/after transformations from your photo library
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-6 border-t space-y-3">
                      <Button className="w-full" size="lg" variant="outline" disabled>
                        <Download className="mr-2 h-4 w-4" />
                        Download Full PDF Report
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Sample preview only - Full reports include 8-12 pages with complete analysis, your branding, and professional formatting
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Value Proposition */}
                <Card className="bg-gradient-to-br from-success/10 to-primary/10 border-success/20">
                  <CardHeader>
                    <CardTitle>Why This Changes Everything</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-card rounded-lg p-4 border">
                      <p className="font-bold text-lg mb-2">You Own the Narrative</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        When you bring THIS to a homeowner, you're not one of five contractors bidding. You're the expert who showed them a $231,000 equity opportunity they didn't know existed.
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="bg-primary/20 text-primary px-2 py-1 rounded font-semibold">Result:</span>
                        <span>No price shopping. No negotiation. Just trust.</span>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex gap-3">
                        <div className="text-success text-xl">✓</div>
                        <div>
                          <p className="font-semibold">Educated Buyers Don't Cheap Out</p>
                          <p className="text-muted-foreground">They understand it's an investment with 148% ROI, not an expense</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="text-success text-xl">✓</div>
                        <div>
                          <p className="font-semibold">You Control Your Pipeline</p>
                          <p className="text-muted-foreground">Generate opportunities based on YOUR capacity, not market timing</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="text-success text-xl">✓</div>
                        <div>
                          <p className="font-semibold">Premium Pricing Justified</p>
                          <p className="text-muted-foreground">When they see $231K gain, your $169K price feels like a steal</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="text-success text-xl">✓</div>
                        <div>
                          <p className="font-semibold">Fully Customized = Credibility</p>
                          <p className="text-muted-foreground">Your branding + their specific property = instant trust</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary/10 rounded-lg p-4 border border-primary/30 mt-4">
                      <p className="font-bold text-center mb-2">The Math is Simple</p>
                      <p className="text-sm text-center text-muted-foreground">
                        15% close rate (bidding) → 60% close rate (advisory) = <span className="text-primary font-bold">4x more revenue</span> from the same leads
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!showPreview && (
              <Card className="border-2 border-dashed h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Enter property details and generate a sample report to see the customization in action
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoReport;
