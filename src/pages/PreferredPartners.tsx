import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building2, Palette, Home, ShieldCheck, Wrench, DollarSign } from "lucide-react";

const PreferredPartners = () => {
  const navigate = useNavigate();

  const partners = [
    {
      icon: Building2,
      category: "HELOC & Refinance Lenders",
      benefit: "Rates 0.5% below market average",
      description: "Pre-vetted lenders who understand investment properties and offer expedited approvals for our clients.",
      color: "text-blue-600"
    },
    {
      icon: Palette,
      category: "Interior Design Consultants",
      benefit: "Free initial consultation + 15% off",
      description: "Design experts who specialize in maximizing ARV through strategic, cost-effective renovations.",
      color: "text-purple-600"
    },
    {
      icon: Home,
      category: "Appliance Partners",
      benefit: "20% off complete packages",
      description: "Premium appliance packages at contractor pricing with white-glove delivery and installation.",
      color: "text-green-600"
    },
    {
      icon: Wrench,
      category: "Material Suppliers",
      benefit: "Contractor-level pricing access",
      description: "Direct access to wholesale flooring, cabinetry, and fixtures at prices typically reserved for pros.",
      color: "text-orange-600"
    },
    {
      icon: ShieldCheck,
      category: "Insurance Specialists",
      benefit: "Priority underwriting + bundled discounts",
      description: "Insurance experts who understand renovation projects and offer comprehensive coverage options.",
      color: "text-red-600"
    },
    {
      icon: DollarSign,
      category: "Project Financing",
      benefit: "Flexible payment terms available",
      description: "Alternative financing options including progress-based payment plans for qualified clients.",
      color: "text-indigo-600"
    }
  ];

  const handleContinue = () => {
    navigate("/dashboard");
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-semibold text-primary">Exclusive Network</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Preferred Partner Network
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We've negotiated exclusive benefits with industry-leading vendors to ensure your project's success—from financing to final finishes.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {partners.map((partner, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-2">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-3 rounded-lg bg-muted/50 ${partner.color}`}>
                    <partner.icon className="h-6 w-6" />
                  </div>
                </div>
                <CardTitle className="text-xl mb-2">{partner.category}</CardTitle>
                <div className="bg-primary/10 px-3 py-2 rounded-md">
                  <p className="text-sm font-semibold text-primary">{partner.benefit}</p>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {partner.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Value Proposition */}
        <Card className="mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
          <CardContent className="py-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Why Our Partner Network Matters</h2>
              <p className="text-lg text-muted-foreground mb-6">
                These aren't random vendors—they're carefully vetted partners who understand investment properties and have proven track records with our clients. Together, we streamline your project from financing to completion.
              </p>
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">$15K+</div>
                  <div className="text-sm text-muted-foreground">Average Savings</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">30%</div>
                  <div className="text-sm text-muted-foreground">Faster Completion</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">100%</div>
                  <div className="text-sm text-muted-foreground">Vetted Partners</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            onClick={handleContinue}
            className="min-w-[200px] text-lg h-12"
          >
            Connect Me With Partners
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="lg"
            onClick={handleSkip}
            className="min-w-[200px] text-lg h-12"
          >
            Skip for Now
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          You can access partner information anytime from your dashboard
        </p>
      </div>
    </div>
  );
};

export default PreferredPartners;
