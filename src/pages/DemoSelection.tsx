import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Package, Layers, ChefHat, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DemoSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <nav className="border-b bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              ← Back
            </Button>
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Sample Deliverables</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Report Format</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            We've created two different presentation styles for your client deliverables. Each serves a different purpose and client conversation.
          </p>
          <p className="text-sm text-muted-foreground italic">
            Most builders find value in both approaches - let's explore each one.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Package-Based Report */}
          <Card className="border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Package-Based Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Present complete remodel scenarios with clear ROI projections. Perfect for clients who want to see the big picture and understand total investment options.
                </p>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">BEST FOR:</div>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Initial consultations</li>
                    <li>• Budget-conscious clients</li>
                    <li>• Quick decision makers</li>
                    <li>• Complete home transformations</li>
                  </ul>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <div className="text-xs font-semibold mb-1">Shows:</div>
                  <div className="text-sm text-muted-foreground">
                    3 complete scenarios (Essential, Complete, Luxury) with investment, value projections, ROI, and financing options
                  </div>
                </div>

                <Button 
                  className="w-full group-hover:scale-105 transition-transform"
                  onClick={() => navigate('/demo/package')}
                >
                  View Package Format
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Itemized Report */}
          <Card className="border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-6 w-6 text-primary" />
                Itemized Options Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Break down individual components (flooring, kitchen) into tiers with specific brands, finishes, and appliance options. Ideal for detail-oriented clients.
                </p>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">BEST FOR:</div>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Detail-oriented clients</li>
                    <li>• Mix-and-match preferences</li>
                    <li>• Specific component upgrades</li>
                    <li>• Brand-conscious buyers</li>
                  </ul>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <div className="text-xs font-semibold mb-1">Shows:</div>
                  <div className="text-sm text-muted-foreground">
                    Flooring tiers (Select/Premium/Luxury) and Kitchen packages with specific brands, finishes, appliances, and mix-match flexibility
                  </div>
                </div>

                <Button 
                  className="w-full group-hover:scale-105 transition-transform"
                  onClick={() => navigate('/demo/itemized')}
                >
                  View Itemized Format
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Both Option */}
        <Card className="border-2 border-primary bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold">+</span>
                <ChefHat className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Compare Both Formats</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-xl mx-auto">
                Open both reports in separate tabs to compare presentation styles and determine which works best for your client conversations.
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => {
                    window.open('/demo/package', '_blank');
                    window.open('/demo/itemized', '_blank');
                  }}
                >
                  Open Both Reports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guidance Box */}
        <div className="mt-8 bg-muted/30 rounded-lg p-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">💡 Pro Tip:</p>
            <p>
              Start with the <strong>Package-Based Report</strong> in your initial meeting to establish budget ranges and overall vision. 
              Then use the <strong>Itemized Options Report</strong> in follow-up discussions to refine specific selections and finishes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoSelection;
