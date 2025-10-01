import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, TrendingUp, Users, DollarSign, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BusinessPlan = () => {
  const navigate = useNavigate();
  const [scenario, setScenario] = useState<"low" | "expected" | "best">("expected");

  const revenueProjections = {
    low: { year1: 1200000, year2: 3600000, year3: 7200000, exit: [29000000, 43000000] },
    expected: { year1: 2400000, year2: 7200000, year3: 18000000, exit: [108000000, 144000000] },
    best: { year1: 4800000, year2: 14400000, year3: 36000000, exit: [288000000, 432000000] }
  };

  const salesMetrics = {
    low: {
      year1: { customers: 50, demos: 500, contacts: 5000, closeRate: 10 },
      year2: { customers: 150, demos: 1500, contacts: 15000, closeRate: 10 },
      year3: { customers: 300, demos: 3000, contacts: 30000, closeRate: 10 }
    },
    expected: {
      year1: { customers: 100, demos: 800, contacts: 8000, closeRate: 12.5 },
      year2: { customers: 300, demos: 2400, contacts: 24000, closeRate: 12.5 },
      year3: { customers: 750, demos: 6000, contacts: 60000, closeRate: 12.5 }
    },
    best: {
      year1: { customers: 200, demos: 1333, contacts: 13333, closeRate: 15 },
      year2: { customers: 600, demos: 4000, contacts: 40000, closeRate: 15 },
      year3: { customers: 1500, demos: 10000, contacts: 100000, closeRate: 15 }
    }
  };

  const leadSources = [
    { channel: "Cold Email", cost: 50, conversionRate: 2, roi: 400, phase: "1-6" },
    { channel: "LinkedIn Outreach", cost: 75, conversionRate: 3, roi: 350, phase: "1-6" },
    { channel: "Google Ads", cost: 150, conversionRate: 5, roi: 280, phase: "3-12" },
    { channel: "SEO/Content", cost: 25, conversionRate: 8, roi: 800, phase: "1-18" },
    { channel: "Referrals", cost: 0, conversionRate: 25, roi: 999, phase: "6-36" },
    { channel: "Partner Network", cost: 20, conversionRate: 15, roi: 650, phase: "3-24" },
    { channel: "Paid Social", cost: 200, conversionRate: 3, roi: 180, phase: "6-18" },
    { channel: "Industry Events", cost: 500, conversionRate: 10, roi: 200, phase: "12-36" }
  ];

  const monthlyBudget = [
    { category: "Sales Tools", amount: 500, phase: "1-36" },
    { category: "Google Ads", amount: 5000, phase: "3-36" },
    { category: "Content Creation", amount: 2000, phase: "1-36" },
    { category: "LinkedIn Ads", amount: 3000, phase: "6-36" },
    { category: "Events/Trade Shows", amount: 2000, phase: "12-36" },
    { category: "Sales Team (per SDR)", amount: 6000, phase: "6-36" }
  ];

  const teamTimeline = [
    { role: "Founder/CEO", month: 1, salary: 0, phase: "Bootstrap" },
    { role: "Sales Director", month: 7, salary: 10000, phase: "Scale" },
    { role: "Customer Success Manager", month: 9, salary: 6000, phase: "Scale" },
    { role: "SDR #1", month: 6, salary: 6000, phase: "Scale" },
    { role: "SDR #2", month: 12, salary: 6000, phase: "Scale" },
    { role: "Marketing Manager", month: 15, salary: 8000, phase: "Growth" },
    { role: "Engineering Lead", month: 13, salary: 12000, phase: "Growth" },
    { role: "Developer #1", month: 15, salary: 10000, phase: "Growth" },
    { role: "VP Sales", month: 19, salary: 15000, phase: "Dominance" },
    { role: "VP Engineering", month: 22, salary: 15000, phase: "Dominance" }
  ];

  const exportToCSV = (tabName: string) => {
    let csvContent = "";
    
    if (tabName === "executive") {
      csvContent = "ValueBuilder Pro - Executive Dashboard\n\n";
      csvContent += "Scenario,Year 1 Revenue,Year 2 Revenue,Year 3 Revenue,Exit Valuation Min,Exit Valuation Max\n";
      Object.entries(revenueProjections).forEach(([key, data]) => {
        csvContent += `${key},${data.year1},${data.year2},${data.year3},${data.exit[0]},${data.exit[1]}\n`;
      });
    } else if (tabName === "sales") {
      csvContent = "ValueBuilder Pro - Sales Funnel & Lead Generation\n\n";
      csvContent += `${scenario.toUpperCase()} SCENARIO\n`;
      csvContent += "Year,Customers,Demos Required,Contacts Required,Close Rate %\n";
      const metrics = salesMetrics[scenario];
      csvContent += `1,${metrics.year1.customers},${metrics.year1.demos},${metrics.year1.contacts},${metrics.year1.closeRate}\n`;
      csvContent += `2,${metrics.year2.customers},${metrics.year2.demos},${metrics.year2.contacts},${metrics.year2.closeRate}\n`;
      csvContent += `3,${metrics.year3.customers},${metrics.year3.demos},${metrics.year3.contacts},${metrics.year3.closeRate}\n\n`;
      
      csvContent += "Lead Source Breakdown\n";
      csvContent += "Channel,Cost per Lead ($),Conversion Rate (%),ROI (%),Active Phase (Months)\n";
      leadSources.forEach(source => {
        csvContent += `${source.channel},${source.cost},${source.conversionRate},${source.roi},${source.phase}\n`;
      });
    } else if (tabName === "budget") {
      csvContent = "ValueBuilder Pro - Monthly Budget Allocation\n\n";
      csvContent += "Category,Monthly Amount ($),Active Phase (Months)\n";
      monthlyBudget.forEach(item => {
        csvContent += `${item.category},${item.amount},${item.phase}\n`;
      });
    } else if (tabName === "team") {
      csvContent = "ValueBuilder Pro - Team Building Timeline\n\n";
      csvContent += "Role,Start Month,Monthly Salary ($),Phase\n";
      teamTimeline.forEach(member => {
        csvContent += `${member.role},${member.month},${member.salary},${member.phase}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `valuebuilder-${tabName}-${scenario}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold">Business Plan & Pro Forma</h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive financial projections and sales strategy
              </p>
            </div>
          </div>
        </div>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Scenario Planning</span>
              <div className="flex gap-2">
                <Button
                  variant={scenario === "low" ? "default" : "outline"}
                  onClick={() => setScenario("low")}
                  size="sm"
                >
                  Conservative
                </Button>
                <Button
                  variant={scenario === "expected" ? "default" : "outline"}
                  onClick={() => setScenario("expected")}
                  size="sm"
                >
                  Expected
                </Button>
                <Button
                  variant={scenario === "best" ? "default" : "outline"}
                  onClick={() => setScenario("best")}
                  size="sm"
                >
                  Aggressive
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <DollarSign className="h-5 w-5" />
                    <span className="text-sm font-medium">Year 1 Revenue</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(revenueProjections[scenario].year1)}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-sm font-medium">Year 3 Revenue</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(revenueProjections[scenario].year3)}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Users className="h-5 w-5" />
                    <span className="text-sm font-medium">Year 1 Customers</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {salesMetrics[scenario].year1.customers}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Target className="h-5 w-5" />
                    <span className="text-sm font-medium">Exit Valuation</span>
                  </div>
                  <p className="text-xl font-bold">
                    {formatCurrency(revenueProjections[scenario].exit[0])} - {formatCurrency(revenueProjections[scenario].exit[1])}
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="executive" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="executive">Executive</TabsTrigger>
            <TabsTrigger value="sales">Sales & Leads</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="executive">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Revenue Projections by Scenario</CardTitle>
                  <Button onClick={() => exportToCSV("executive")} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export to CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Scenario</TableHead>
                      <TableHead>Year 1</TableHead>
                      <TableHead>Year 2</TableHead>
                      <TableHead>Year 3</TableHead>
                      <TableHead>Exit Valuation Range</TableHead>
                      <TableHead>Multiple</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Conservative</TableCell>
                      <TableCell>{formatCurrency(revenueProjections.low.year1)}</TableCell>
                      <TableCell>{formatCurrency(revenueProjections.low.year2)}</TableCell>
                      <TableCell>{formatCurrency(revenueProjections.low.year3)}</TableCell>
                      <TableCell>
                        {formatCurrency(revenueProjections.low.exit[0])} - {formatCurrency(revenueProjections.low.exit[1])}
                      </TableCell>
                      <TableCell>4-6x</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Expected</TableCell>
                      <TableCell>{formatCurrency(revenueProjections.expected.year1)}</TableCell>
                      <TableCell>{formatCurrency(revenueProjections.expected.year2)}</TableCell>
                      <TableCell>{formatCurrency(revenueProjections.expected.year3)}</TableCell>
                      <TableCell>
                        {formatCurrency(revenueProjections.expected.exit[0])} - {formatCurrency(revenueProjections.expected.exit[1])}
                      </TableCell>
                      <TableCell>6-8x</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Aggressive</TableCell>
                      <TableCell>{formatCurrency(revenueProjections.best.year1)}</TableCell>
                      <TableCell>{formatCurrency(revenueProjections.best.year2)}</TableCell>
                      <TableCell>{formatCurrency(revenueProjections.best.year3)}</TableCell>
                      <TableCell>
                        {formatCurrency(revenueProjections.best.exit[0])} - {formatCurrency(revenueProjections.best.exit[1])}
                      </TableCell>
                      <TableCell>8-12x</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Sales Funnel Metrics - {scenario.charAt(0).toUpperCase() + scenario.slice(1)} Scenario</CardTitle>
                  <Button onClick={() => exportToCSV("sales")} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export to CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Target Customers</TableHead>
                      <TableHead>Demos Required</TableHead>
                      <TableHead>Contacts Needed</TableHead>
                      <TableHead>Close Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Year 1</TableCell>
                      <TableCell>{salesMetrics[scenario].year1.customers}</TableCell>
                      <TableCell>{salesMetrics[scenario].year1.demos}</TableCell>
                      <TableCell>{salesMetrics[scenario].year1.contacts.toLocaleString()}</TableCell>
                      <TableCell>{salesMetrics[scenario].year1.closeRate}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Year 2</TableCell>
                      <TableCell>{salesMetrics[scenario].year2.customers}</TableCell>
                      <TableCell>{salesMetrics[scenario].year2.demos}</TableCell>
                      <TableCell>{salesMetrics[scenario].year2.contacts.toLocaleString()}</TableCell>
                      <TableCell>{salesMetrics[scenario].year2.closeRate}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Year 3</TableCell>
                      <TableCell>{salesMetrics[scenario].year3.customers}</TableCell>
                      <TableCell>{salesMetrics[scenario].year3.demos}</TableCell>
                      <TableCell>{salesMetrics[scenario].year3.contacts.toLocaleString()}</TableCell>
                      <TableCell>{salesMetrics[scenario].year3.closeRate}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Lead Source Strategy & ROI</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Channel</TableHead>
                        <TableHead>Cost per Lead</TableHead>
                        <TableHead>Conversion Rate</TableHead>
                        <TableHead>ROI</TableHead>
                        <TableHead>Active Phase</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leadSources.map((source) => (
                        <TableRow key={source.channel}>
                          <TableCell className="font-medium">{source.channel}</TableCell>
                          <TableCell>${source.cost}</TableCell>
                          <TableCell>{source.conversionRate}%</TableCell>
                          <TableCell className="text-green-600 font-medium">{source.roi}%</TableCell>
                          <TableCell>Months {source.phase}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Monthly Budget Allocation</CardTitle>
                  <Button onClick={() => exportToCSV("budget")} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export to CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Monthly Investment</TableHead>
                      <TableHead>Annual Investment</TableHead>
                      <TableHead>Active Phase</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyBudget.map((item) => (
                      <TableRow key={item.category}>
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell>{formatCurrency(item.amount)}</TableCell>
                        <TableCell>{formatCurrency(item.amount * 12)}</TableCell>
                        <TableCell>Months {item.phase}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-primary/5 font-bold">
                      <TableCell>Total (Full Scale)</TableCell>
                      <TableCell>{formatCurrency(monthlyBudget.reduce((sum, item) => sum + item.amount, 0))}</TableCell>
                      <TableCell>{formatCurrency(monthlyBudget.reduce((sum, item) => sum + item.amount, 0) * 12)}</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Team Building Timeline</CardTitle>
                  <Button onClick={() => exportToCSV("team")} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export to CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Start Month</TableHead>
                      <TableHead>Monthly Salary</TableHead>
                      <TableHead>Annual Cost</TableHead>
                      <TableHead>Phase</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamTimeline.map((member) => (
                      <TableRow key={member.role}>
                        <TableCell className="font-medium">{member.role}</TableCell>
                        <TableCell>Month {member.month}</TableCell>
                        <TableCell>{member.salary === 0 ? "Sweat Equity" : formatCurrency(member.salary)}</TableCell>
                        <TableCell>{member.salary === 0 ? "-" : formatCurrency(member.salary * 12)}</TableCell>
                        <TableCell>{member.phase}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategy">
            <Card>
              <CardHeader>
                <CardTitle>Go-to-Market Strategy & Key Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Phase 1: Launch & Validation (Months 1-6)</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Primary Focus:</strong> Warm outbound to existing network + cold email campaigns</li>
                    <li>• <strong>Target:</strong> 10-20 builder customers, 25-50 partner relationships</li>
                    <li>• <strong>Activity:</strong> 50 LinkedIn messages/day + 100 cold emails/day</li>
                    <li>• <strong>Milestone:</strong> Achieve $25K MRR from subscriptions + $10K partner commissions</li>
                    <li>• <strong>Team:</strong> Founder-led sales, no additional hires</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Phase 2: Scale & Optimize (Months 7-18)</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Primary Focus:</strong> Paid acquisition (Google Ads, LinkedIn) + partner program expansion</li>
                    <li>• <strong>Target:</strong> 100-200 customers, 200+ partners</li>
                    <li>• <strong>Activity:</strong> Launch $5K/month Google Ads, hire first SDR</li>
                    <li>• <strong>Milestone:</strong> Hit $100K MRR by Month 9, $250K MRR by Month 18</li>
                    <li>• <strong>Team:</strong> Add Sales Director (M7), SDR (M6), Customer Success Manager (M9)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Phase 3: Market Dominance (Months 19-36)</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Primary Focus:</strong> Content marketing, SEO, referral program, national expansion</li>
                    <li>• <strong>Target:</strong> 500+ customers, 1000+ partners</li>
                    <li>• <strong>Activity:</strong> Build inside sales team, enterprise sales motion</li>
                    <li>• <strong>Milestone:</strong> Category leadership, multi-million ARR</li>
                    <li>• <strong>Team:</strong> Full leadership team with department heads</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Success Metrics to Track</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <p className="font-medium">MRR Growth Rate</p>
                      <p className="text-2xl font-bold text-primary">15-20%</p>
                      <p className="text-sm text-muted-foreground">Monthly target</p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <p className="font-medium">CAC:LTV Ratio</p>
                      <p className="text-2xl font-bold text-primary">1:3+</p>
                      <p className="text-sm text-muted-foreground">Minimum target</p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <p className="font-medium">Churn Rate</p>
                      <p className="text-2xl font-bold text-primary">&lt;5%</p>
                      <p className="text-sm text-muted-foreground">Monthly maximum</p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <p className="font-medium">Partner Conversion</p>
                      <p className="text-2xl font-bold text-primary">2-3%</p>
                      <p className="text-sm text-muted-foreground">Lead to close</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessPlan;
