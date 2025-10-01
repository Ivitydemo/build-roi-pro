import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';

const BuilderImpact = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    monthlyLeads: 50,
    currentCloseRate: 20,
    avgProjectValue: 125000,
    interestedLeadsPercent: 40, // What % of leads express genuine interest
  });

  const [scenario, setScenario] = useState<'inquiries' | 'proactive' | null>(null);
  const [scenarioSelected, setScenarioSelected] = useState(false);

  const handleScenarioSelect = (selectedScenario: 'inquiries' | 'proactive') => {
    setScenario(selectedScenario);
    setScenarioSelected(true);
  };

  // Current scenario calculations
  const currentEstimates = Math.round(inputs.monthlyLeads * 12 * (inputs.currentCloseRate / 100));
  const currentRevenue = currentEstimates * inputs.avgProjectValue;
  
  // Scenario 1: Responding to Inquiries (warm leads who expressed interest)
  const interestedLeads = Math.round(inputs.monthlyLeads * 12 * (inputs.interestedLeadsPercent / 100));
  const inquiriesCloseRate = 0.65; // 65% when educating interested buyers
  const inquiriesProjects = Math.round(interestedLeads * inquiriesCloseRate);
  const inquiriesRevenue = inquiriesProjects * inputs.avgProjectValue;
  
  // Scenario 2: Proactive Advisory (reaching out to all leads proactively)
  const proactiveReachOut = Math.round(inputs.monthlyLeads * 12 * 0.60); // Reach 60% of total leads
  const proactiveCloseRate = 0.35; // 35% close rate for proactive education
  const proactiveProjects = Math.round(proactiveReachOut * proactiveCloseRate);
  const proactiveRevenue = proactiveProjects * inputs.avgProjectValue;
  
  // Use selected scenario
  const withPlatformProjects = scenario === 'inquiries' ? inquiriesProjects : proactiveProjects;
  const withPlatformRevenue = scenario === 'inquiries' ? inquiriesRevenue : proactiveRevenue;
  const closeRate = scenario === 'inquiries' ? inquiriesCloseRate : proactiveCloseRate;
  const leadsUsed = scenario === 'inquiries' ? interestedLeads : proactiveReachOut;
  
  const additionalProjects = withPlatformProjects - currentEstimates;
  const additionalRevenue = withPlatformRevenue - currentRevenue;
  const revenueIncrease = currentRevenue > 0 ? Math.round((additionalRevenue / currentRevenue) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Back to Home
          </Button>
          <div className="flex items-center gap-3 mt-4">
            <Building2 className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Builder Impact Calculator</h1>
              <p className="text-muted-foreground">See exactly what this platform means for YOUR business</p>
            </div>
          </div>
        </div>

        {!scenarioSelected ? (
          /* Scenario Selection Screen */
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-center">First Question: How Will You Use This?</CardTitle>
                <CardDescription className="text-center text-base">
                  Different approaches yield different close rates. Choose the strategy that fits your sales model.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Responding to Inquiries */}
                  <Card 
                    className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
                    onClick={() => handleScenarioSelect('inquiries')}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Responding to Inquiries
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        You use this platform to respond to leads who <span className="font-semibold">already expressed interest</span> - they called, emailed, or filled out a form.
                      </p>
                      <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                        <p className="text-sm font-semibold text-success mb-1">Expected Close Rate: 65%</p>
                        <p className="text-xs text-muted-foreground">
                          These are warm leads who already want info. Your analysis answers their questions and positions you as the expert.
                        </p>
                      </div>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <p><span className="font-semibold text-foreground">Best for:</span></p>
                        <ul className="space-y-1 ml-4">
                          <li>• Builders with consistent inbound lead flow</li>
                          <li>• Reactive sales model (waiting for inquiries)</li>
                          <li>• Want to close MORE of existing warm leads</li>
                        </ul>
                      </div>
                      <Button className="w-full" onClick={() => handleScenarioSelect('inquiries')}>
                        Select This Approach
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Proactive Advisory */}
                  <Card 
                    className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
                    onClick={() => handleScenarioSelect('proactive')}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Proactive Advisory
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        You <span className="font-semibold">proactively reach out</span> to your entire lead database with unsolicited (but valuable) property analysis.
                      </p>
                      <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                        <p className="text-sm font-semibold text-warning mb-1">Expected Close Rate: 35%</p>
                        <p className="text-xs text-muted-foreground">
                          Lower than warm inquiries, but you're creating demand instead of waiting. You reach MORE people.
                        </p>
                      </div>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <p><span className="font-semibold text-foreground">Best for:</span></p>
                        <ul className="space-y-1 ml-4">
                          <li>• Builders wanting to activate cold pipeline</li>
                          <li>• Proactive sales approach (outbound)</li>
                          <li>• Generate demand vs waiting for it</li>
                        </ul>
                      </div>
                      <Button className="w-full" onClick={() => handleScenarioSelect('proactive')}>
                        Select This Approach
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-sm">
                  <p className="font-semibold mb-2">📊 Why Different Close Rates?</p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Warm inquiries (65%):</span> They already want info. You're just educating them on value vs bidding on price.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    <span className="font-semibold">Proactive outreach (35%):</span> They didn't ask yet, so conversion is lower. But you reach 3-5X more people, creating net more deals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Input Form & Results - Only shown after scenario selection */
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="bg-card border rounded-lg px-4 py-2">
                <p className="text-sm text-muted-foreground">Selected Strategy:</p>
                <p className="font-bold">{scenario === 'inquiries' ? 'Responding to Inquiries (65% close rate)' : 'Proactive Advisory (35% close rate)'}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setScenarioSelected(false)}>
                Change Strategy
              </Button>
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Current Business</CardTitle>
              <CardDescription>Enter your typical numbers (be honest)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Monthly Leads (calls, website, referrals)</Label>
                <Input
                  type="number"
                  value={inputs.monthlyLeads}
                  onChange={(e) => setInputs({...inputs, monthlyLeads: parseInt(e.target.value) || 0})}
                />
                <p className="text-xs text-muted-foreground">How many potential customers contact you per month?</p>
              </div>

              <div className="space-y-2">
                <Label>What % Express Genuine Interest?</Label>
                <Input
                  type="number"
                  value={inputs.interestedLeadsPercent}
                  onChange={(e) => setInputs({...inputs, interestedLeadsPercent: parseInt(e.target.value) || 0})}
                />
                <p className="text-xs text-muted-foreground">Ask questions, schedule calls, request info - not just tire-kickers</p>
              </div>

              <div className="space-y-2">
                <Label>Current Close Rate (%)</Label>
                <Input
                  type="number"
                  value={inputs.currentCloseRate}
                  onChange={(e) => setInputs({...inputs, currentCloseRate: parseInt(e.target.value) || 0})}
                />
                <p className="text-xs text-muted-foreground">Of leads that get to estimate stage, what % sign?</p>
              </div>

              <div className="space-y-2">
                <Label>Average Project Value ($)</Label>
                <Input
                  type="number"
                  value={inputs.avgProjectValue}
                  onChange={(e) => setInputs({...inputs, avgProjectValue: parseInt(e.target.value) || 0})}
                />
                <p className="text-xs text-muted-foreground">Typical remodel contract amount</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold mb-2">Your Current Performance</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Leads:</span>
                    <span className="font-semibold">{inputs.monthlyLeads * 12}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Projects Closed:</span>
                    <span className="font-semibold">{currentEstimates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Revenue:</span>
                    <span className="font-semibold text-lg">${currentRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Card */}
          <div className="space-y-6">
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {scenario === 'inquiries' ? 'Responding to Inquiries' : 'Proactive Advisory Approach'}
                </CardTitle>
                <CardDescription>
                  {scenario === 'inquiries' 
                    ? 'When you educate buyers who already expressed interest'
                    : 'When you proactively reach out to educate all qualified leads'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Projects</span>
                    </div>
                    <p className="text-3xl font-bold text-primary">+{additionalProjects}</p>
                    <p className="text-xs text-muted-foreground">additional closings</p>
                  </div>

                  <div className="bg-card rounded-lg p-4 border">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="text-sm text-muted-foreground">Close Rate</span>
                    </div>
                    <p className="text-3xl font-bold text-success">{Math.round(closeRate * 100)}%</p>
                    <p className="text-xs text-muted-foreground">
                      {scenario === 'inquiries' ? 'on warm inquiries' : 'on proactive outreach'}
                    </p>
                  </div>
                </div>

                {/* Revenue Impact */}
                <div className="bg-success/10 border-2 border-success/30 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-6 w-6 text-success" />
                    <h3 className="font-bold text-lg">Additional Annual Revenue</h3>
                  </div>
                  <p className="text-4xl font-bold text-success mb-2">
                    ${additionalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    That's a <span className="font-bold text-success">{revenueIncrease}% increase</span> from your current {currentRevenue.toLocaleString()} revenue
                  </p>
                </div>

                {/* Breakdown */}
                <div className="space-y-3">
                  <p className="font-semibold text-sm">How This Works:</p>
                  <div className="space-y-2 text-sm">
                    {scenario === 'inquiries' ? (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="text-primary font-bold">1.</span>
                          <p>
                            <span className="font-semibold">{interestedLeads} leads/year</span> express genuine interest ({inputs.interestedLeadsPercent}% of total)
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-primary font-bold">2.</span>
                          <p>
                            Send custom analysis to these <span className="font-semibold">warm, engaged prospects</span>
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-primary font-bold">3.</span>
                          <p>
                            Close <span className="font-semibold">{Math.round(closeRate * 100)}%</span> when you educate vs bid (current: {inputs.currentCloseRate}%)
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-primary font-bold">4.</span>
                          <p>
                            Result: <span className="font-semibold">{withPlatformProjects} total projects</span> (up from {currentEstimates})
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="text-primary font-bold">1.</span>
                          <p>
                            Proactively reach <span className="font-semibold">{proactiveReachOut} leads/year</span> (60% of total pipeline)
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-primary font-bold">2.</span>
                          <p>
                            Send <span className="font-semibold">unsolicited but valuable</span> property analysis (email sequence)
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-primary font-bold">3.</span>
                          <p>
                            Close <span className="font-semibold">{Math.round(closeRate * 100)}%</span> by creating demand vs waiting (current: {inputs.currentCloseRate}%)
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-primary font-bold">4.</span>
                          <p>
                            Result: <span className="font-semibold">{withPlatformProjects} total projects</span> (up from {currentEstimates})
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* ROI on Platform */}
                <div className="bg-card border rounded-lg p-4">
                  <p className="font-semibold mb-2">Platform ROI (at $997/month)</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Annual Cost:</span>
                      <span className="font-semibold">$11,964</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Additional Revenue:</span>
                      <span className="font-semibold">${additionalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-semibold">ROI:</span>
                      <span className="text-xl font-bold text-success">
                        {Math.round((additionalRevenue / 11964) * 100).toLocaleString()}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    You break even by closing just ONE additional project
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
              <CardContent className="pt-6">
                <p className="font-bold text-center mb-4">
                  These aren't hypotheticals. This is the math.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button size="lg" onClick={() => navigate('/demo')}>
                    See Demo Report
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
                    Start Free Trial
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuilderImpact;
