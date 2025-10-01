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

  const [scenario, setScenario] = useState<'inquiries' | 'proactive'>('inquiries');

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
            {/* Scenario Selector */}
            <Card>
              <CardContent className="pt-6">
                <Label className="mb-3 block font-semibold">Choose Your Scenario:</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={scenario === 'inquiries' ? 'default' : 'outline'}
                    onClick={() => setScenario('inquiries')}
                    className="h-auto py-4 flex flex-col items-start gap-1"
                  >
                    <span className="font-semibold">Responding to Inquiries</span>
                    <span className="text-xs opacity-80">Warm leads who asked questions</span>
                  </Button>
                  <Button
                    variant={scenario === 'proactive' ? 'default' : 'outline'}
                    onClick={() => setScenario('proactive')}
                    className="h-auto py-4 flex flex-col items-start gap-1"
                  >
                    <span className="font-semibold">Proactive Advisory</span>
                    <span className="text-xs opacity-80">Reaching out to educate all leads</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

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
    </div>
  );
};

export default BuilderImpact;
