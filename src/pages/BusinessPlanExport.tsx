import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileSpreadsheet } from "lucide-react";

const BusinessPlanExport = () => {
  const generateComprehensiveCSV = () => {
    const csvContent = `ValueBuilder Pro - Comprehensive Business Plan & Pro Forma
Generated: ${new Date().toLocaleDateString()}

=============================================
SECTION 1: REVENUE PROJECTIONS BY SCENARIO
=============================================

Scenario,Year 1 Revenue,Year 2 Revenue,Year 3 Revenue,Exit Valuation Min,Exit Valuation Max,Multiple
Conservative,$1200000,$3600000,$7200000,$29000000,$43000000,4-6x
Expected,$2400000,$7200000,$18000000,$108000000,$144000000,6-8x
Aggressive,$4800000,$14400000,$36000000,$288000000,$432000000,8-12x

ASSUMPTIONS:
- Professional tier: $997/month
- Enterprise tier: $2997/month
- Partner commission: 3-10% based on tier
- Average customer LTV: $23928 (Professional) to $71892 (Enterprise)

=============================================
SECTION 2: SALES FUNNEL & LEAD GENERATION
=============================================

CONSERVATIVE SCENARIO
Year,Target Customers,Demos Required,Contacts Needed,Demo-to-Close %,Contact-to-Demo %
1,50,500,5000,10%,10%
2,150,1500,15000,10%,10%
3,300,3000,30000,10%,10%

EXPECTED SCENARIO
Year,Target Customers,Demos Required,Contacts Needed,Demo-to-Close %,Contact-to-Demo %
1,100,800,8000,12.5%,10%
2,300,2400,24000,12.5%,10%
3,750,6000,60000,12.5%,10%

AGGRESSIVE SCENARIO
Year,Target Customers,Demos Required,Contacts Needed,Demo-to-Close %,Contact-to-Demo %
1,200,1333,13333,15%,10%
2,600,4000,40000,15%,10%
3,1500,10000,100000,15%,10%

=============================================
SECTION 3: LEAD SOURCE STRATEGY & ROI
=============================================

Channel,Cost per Lead,Demo Conversion %,Close Rate %,Cost per Customer,ROI %,Active Phase (Months),Priority
Cold Email,$50,2%,12.5%,$2000,400%,1-6,IMMEDIATE
LinkedIn Outreach,$75,3%,12.5%,$2000,350%,1-6,IMMEDIATE
SEO/Content Marketing,$25,8%,12.5%,$313,800%,1-18,HIGH
Partner Referrals,$0,25%,20%,$0,999%,6-36,HIGH
Google Ads,$150,5%,12.5%,$2400,280%,3-12,MEDIUM
LinkedIn Ads,$200,3%,12.5%,$5333,180%,6-18,MEDIUM
Industry Events,$500,10%,15%,$3333,200%,12-36,LOW
Paid Social (Facebook),$200,3%,10%,$6667,180%,6-18,LOW

WEEKLY ACTIVITY TARGETS (Expected Scenario)
Month,Cold Emails/Week,LinkedIn Messages/Week,Demos Booked/Week,Expected Closes/Month
1-3,500,250,4-6,4-5
4-6,700,350,8-10,8-10
7-12,1000,500,15-20,15-20
13-18,1500,750,25-30,25-30
19-24,2000,1000,35-40,35-40
25-36,2500,1250,50+,50+

=============================================
SECTION 4: MONTHLY BUDGET ALLOCATION
=============================================

Category,Month 1-3,Month 4-6,Month 7-12,Month 13-18,Month 19-36,Notes
Sales Tools (Apollo Apollo LinkedIn Navigator),$500,$500,$500,$1000,$1500,Essential from day 1
Cold Email Infrastructure,$200,$300,$500,$500,$500,Warmup domains sequencing
Google Ads,$0,$2000,$5000,$8000,$10000,Start Month 3
LinkedIn Ads,$0,$0,$2000,$3000,$5000,Start Month 7
Content Creation,$1000,$2000,$2000,$3000,$4000,Blog SEO video
SEO/Website,$500,$1000,$1500,$2000,$2500,Ongoing optimization
Events/Trade Shows,$0,$0,$1000,$2000,$3000,Start Month 7
CRM/Sales Software,$500,$500,$1000,$1500,$2000,HubSpot/Salesforce
Marketing Automation,$0,$300,$500,$1000,$1500,Drip campaigns
**Subtotal Marketing/Sales**,$2700,$6600,$14000,$22000,$29000,

SDR #1,$0,$0,$6000,$6000,$6000,Hire Month 6-7
SDR #2,$0,$0,$0,$6000,$6000,Hire Month 12
Sales Director,$0,$0,$10000,$10000,$10000,Hire Month 7
Customer Success Manager,$0,$0,$0,$6000,$6000,Hire Month 9
Marketing Manager,$0,$0,$0,$8000,$8000,Hire Month 15
**Subtotal Team**,$0,$0,$16000,$36000,$36000,

**TOTAL MONTHLY BURN**,$2700,$6600,$30000,$58000,$65000,

Year 1 Total Investment,$43200,,,,
Year 2 Total Investment,$558000,,,,
Year 3 Total Investment,$720000,,,,

=============================================
SECTION 5: TEAM BUILDING TIMELINE
=============================================

Role,Start Month,Monthly Salary,Annual Cost (First Year),Annual Cost (Full Year),Phase,Responsibilities
Founder/CEO,1,$0,$0,$0,Bootstrap,Sales product strategy fundraising
SDR #1,6,$6000,$42000,$72000,Scale,Outbound prospecting demo booking
Sales Director,7,$10000,$60000,$120000,Scale,Close deals manage SDRs sales process
Customer Success Manager,9,$6000,$24000,$72000,Scale,Onboarding retention upsells
SDR #2,12,$6000,$6000,$72000,Scale,Outbound prospecting demo booking
Engineering Lead,13,$12000,$0,$144000,Growth,Product development technical architecture
Marketing Manager,15,$8000,$0,$96000,Growth,Content SEO paid acquisition
Developer #1,15,$10000,$0,$120000,Growth,Feature development bug fixes
VP Sales,19,$15000,$0,$180000,Dominance,Enterprise sales team leadership
VP Engineering,22,$15000,$0,$180000,Dominance,Engineering team product roadmap
Operations Manager,24,$8000,$0,$96000,Dominance,Systems processes efficiency

Year 1 Total Payroll: $132000
Year 2 Total Payroll: $1152000
Year 3 Total Payroll: $1152000+

=============================================
SECTION 6: AUTOMATION SYSTEMS TIMELINE
=============================================

System,Implementation Month,Monthly Cost,Purpose,Priority
Email Sequencing (Lemlist/Instantly),1,$200,Cold outreach automation,CRITICAL
CRM (HubSpot/Pipedrive),1,$500,Lead tracking pipeline management,CRITICAL
LinkedIn Automation (Expandi),2,$100,Connection requests follow-ups,HIGH
Meeting Scheduler (Calendly),1,$20,Demo booking automation,HIGH
Proposal Software (PandaDoc),3,$50,Quote generation e-signatures,HIGH
Customer Onboarding (Userflow),9,$300,Self-service onboarding,MEDIUM
Marketing Automation (ActiveCampaign),6,$200,Email nurture sequences,MEDIUM
Analytics Dashboard (Mixpanel),7,$300,Product usage tracking,MEDIUM
Partner Portal Automation,12,$500,Self-service partner management,MEDIUM
AI Lead Scoring,15,$400,Predictive lead qualification,LOW
Chatbot (Intercom),18,$500,Automated customer support,LOW
Advanced Analytics (Tableau),24,$1000,Business intelligence reporting,LOW

=============================================
SECTION 7: GO-TO-MARKET STRATEGY
=============================================

PHASE 1: LAUNCH & VALIDATION (Months 1-6)
Objective: Prove product-market fit establish revenue base
Target: 10-20 builder customers 25-50 partners
Revenue Goal: $25K MRR subscriptions + $10K commissions

Key Activities:
- Leverage warm network for first 5-10 customers
- Launch cold email campaign: 100 emails/day
- LinkedIn outreach: 50 messages/day
- Create case studies from early customers
- Recruit initial partner network (lenders designers)
- Basic SEO and website optimization

Milestones:
Month 1: First paying customer
Month 2: 5 customers $5K MRR
Month 3: Launch partner program 15 partners
Month 4: 10 customers $10K MRR
Month 5: 15 customers 30 partners
Month 6: 20 customers $25K MRR 50 partners

Team: Founder-led no additional hires

PHASE 2: SCALE & OPTIMIZE (Months 7-18)
Objective: Scale customer acquisition optimize operations
Target: 100-200 customers 200+ partners
Revenue Goal: $100K MRR by Month 9 $250K MRR by Month 18

Key Activities:
- Launch Google Ads campaign ($5K/month budget)
- Build inside sales team (SDR + Sales Director)
- Implement marketing automation
- Expand partner categories (materials contractors inspectors)
- Start content marketing and SEO
- Develop customer success program

Milestones:
Month 7: Hire Sales Director launch Google Ads
Month 9: $100K MRR hire Customer Success Manager
Month 12: 100 customers 150 partners 2nd SDR hire
Month 15: Launch enterprise sales motion
Month 18: $250K MRR 200 customers 250+ partners

Team: Sales Director 2 SDRs Customer Success Manager Marketing Manager (Month 15)

PHASE 3: MARKET DOMINANCE (Months 19-36)
Objective: National expansion category leadership
Target: 500+ customers 1000+ partners
Revenue Goal: Multi-million ARR

Key Activities:
- Geographic expansion beyond initial markets
- Enterprise sales team and processes
- Advanced product features and integrations
- Thought leadership and PR
- Strategic partnerships with industry leaders
- International expansion exploration

Milestones:
Month 24: 400 customers $1M+ MRR
Month 30: 600 customers national presence
Month 36: 750-1500 customers (depending on scenario)

Team: Full executive team department heads

=============================================
SECTION 8: KEY SUCCESS METRICS TO TRACK
=============================================

Metric,Target,Measurement Frequency,Dashboard Location
Monthly Recurring Revenue (MRR),$25K → $250K → $1M+,Weekly,Executive Dashboard
MRR Growth Rate,15-20% monthly,Weekly,Sales Dashboard
New Customers,4-5 → 15-20 → 50+ per month,Weekly,Sales Dashboard
Demos Booked,4-6 → 15-20 → 50+ per week,Daily,Sales Dashboard
Demo-to-Trial Conversion,40-50%,Weekly,Sales Dashboard
Trial-to-Paid Conversion,25-30%,Weekly,Sales Dashboard
Customer Acquisition Cost (CAC),$2000-$3000,Monthly,Finance Dashboard
Lifetime Value (LTV),$24K (Pro) $72K (Ent),Monthly,Finance Dashboard
CAC:LTV Ratio,1:8 to 1:24,Monthly,Finance Dashboard
Monthly Churn Rate,<5%,Monthly,Customer Success Dashboard
Partner Network Size,50 → 250 → 1000+,Weekly,Partner Dashboard
Partner Conversion Rate,2-3%,Monthly,Partner Dashboard
Lead Response Time,<5 minutes,Daily,Sales Dashboard
Sales Cycle Length,30-45 days,Monthly,Sales Dashboard

=============================================
SECTION 9: IMMEDIATE ACTION PLAN (Next 30 Days)
=============================================

WEEK 1: INFRASTRUCTURE SETUP
- Set up Apollo.io account (lead database)
- Get LinkedIn Sales Navigator subscription
- Set up email warmup domains
- Create initial cold email sequences (3 variants)
- Design simple landing page with demo booking
- Set up basic CRM (HubSpot free tier)

WEEK 2: INITIAL OUTREACH
- Build list of 500 target general contractors/builders
- Build list of 200 potential partners (lenders remodelers)
- Send 50 LinkedIn connection requests daily
- Start cold email campaign: 100 emails/day
- Track all responses in CRM

WEEK 3: OPTIMIZATION & SCALE
- Analyze response rates optimize messaging
- Book first 5-10 demos
- Create simple pitch deck/demo
- Launch second email sequence
- Increase LinkedIn outreach to 75 messages/day

WEEK 4: CLOSE & ITERATE
- Close first 1-3 customers
- Collect detailed feedback
- Refine value proposition and messaging
- Plan Month 2 scaling strategy
- Begin partner recruitment outreach

=============================================
SECTION 10: EXIT STRATEGY & VALUATION
=============================================

Exit Option 1: Strategic Acquisition (24-36 months)
Potential Acquirers:
- Buildertrend BuilderCRM Co-Construct (construction management)
- ServiceTitan Jobber (field service software)
- Zillow Redfin (real estate tech)
- Private equity firms focused on construction tech

Typical Valuation Multiples:
- 4-6x revenue (early stage low growth)
- 6-8x revenue (proven business moderate growth)
- 8-12x revenue (market leader high growth)

Exit Option 2: Private Equity Growth Capital (36-48 months)
- Retain majority ownership
- Use capital for aggressive expansion
- Potential follow-on exit in 3-5 years at higher valuation

Exit Option 3: IPO Track (48-60+ months)
- Requires $50M+ ARR with strong growth
- Multi-year preparation process
- Highest potential returns but longest timeline

Valuation Drivers to Maximize:
- Recurring revenue percentage (target 90%+)
- Net revenue retention (target 120%+)
- Gross margins (target 80%+)
- Growth rate (target 3x year-over-year)
- Market position (#1 or #2 in category)

=============================================
END OF BUSINESS PLAN
=============================================

NEXT STEPS:
1. Import this CSV into Google Sheets
2. Create tabs for each major section
3. Add formulas for scenario modeling
4. Set up weekly tracking sheets
5. Share with advisors/investors for feedback

For questions or to update projections contact: [Your contact info]`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ValueBuilder-Pro-Business-Plan-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateGoogleSheetsInstructions = () => {
    const instructions = `HOW TO IMPORT THIS BUSINESS PLAN INTO GOOGLE SHEETS

Step 1: Download the CSV File
- Click the "Download Complete Business Plan CSV" button
- Save the file to your computer

Step 2: Create a New Google Sheet
- Go to sheets.google.com
- Click "+ Blank" to create a new spreadsheet
- Name it "ValueBuilder Pro - Business Plan"

Step 3: Import the CSV
- In Google Sheets, click File > Import
- Click "Upload" tab
- Select the CSV file you downloaded
- Choose "Replace spreadsheet" or "Insert new sheet(s)"
- Click "Import data"

Step 4: Format and Organize
- The CSV will import with all sections clearly labeled
- Recommended: Split into separate tabs for each section:
  * Executive Dashboard
  * Revenue Projections
  * Sales Funnel & Leads
  * Lead Sources
  * Budget Allocation
  * Team Timeline
  * Automation Systems
  * Go-to-Market Strategy
  * Success Metrics
  * Exit Strategy

Step 5: Make It Interactive
- Add formulas for automatic calculations
- Create charts/graphs for visual representation
- Set up scenario toggles (Conservative/Expected/Aggressive)
- Add conditional formatting for metrics tracking
- Create weekly/monthly tracking tabs

Step 6: Share and Collaborate
- Click "Share" button in top right
- Add team members, advisors, or investors
- Set appropriate permissions (Editor/Viewer)
- Use comments for collaborative planning

TIPS FOR MAXIMUM EFFECTIVENESS:
- Update weekly with actual vs projected numbers
- Color code: Green = on target, Yellow = attention needed, Red = action required
- Link to your actual CRM data for real-time updates
- Create a separate tab for assumptions so you can model different scenarios
- Set up Google Sheets notifications for key milestone achievements

Need help? Contact [your email] or refer to Google Sheets Help Center.`;

    const blob = new Blob([instructions], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Google-Sheets-Import-Instructions.txt");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">ValueBuilder Pro Business Plan Export</h1>
          <p className="text-muted-foreground">
            Download your comprehensive business plan and pro forma analysis ready for Google Sheets
          </p>
        </div>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
              Complete Business Plan Package
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h3 className="font-semibold mb-2">What's Included:</h3>
                <ul className="space-y-1 text-sm">
                  <li>✓ Revenue projections for 3 scenarios (Conservative, Expected, Aggressive)</li>
                  <li>✓ Detailed sales funnel metrics and lead generation strategy</li>
                  <li>✓ Lead source breakdown with ROI analysis</li>
                  <li>✓ Monthly budget allocation by phase</li>
                  <li>✓ Team building timeline with salary projections</li>
                  <li>✓ Automation systems priority and implementation schedule</li>
                  <li>✓ Complete go-to-market strategy (3 phases)</li>
                  <li>✓ Key success metrics and tracking framework</li>
                  <li>✓ 30-day immediate action plan</li>
                  <li>✓ Exit strategy options with valuation multiples</li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={generateComprehensiveCSV}
                  size="lg"
                  className="w-full"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Complete Business Plan CSV
                </Button>

                <Button 
                  onClick={generateGoogleSheetsInstructions}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <FileSpreadsheet className="h-5 w-5 mr-2" />
                  Download Google Sheets Import Instructions
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Quick Start Guide:</h3>
              <ol className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="font-semibold min-w-[24px]">1.</span>
                  <span>Click "Download Complete Business Plan CSV" above</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold min-w-[24px]">2.</span>
                  <span>Go to <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">sheets.google.com</a> and create a new spreadsheet</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold min-w-[24px]">3.</span>
                  <span>Click File → Import → Upload and select your downloaded CSV</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold min-w-[24px]">4.</span>
                  <span>Organize into separate tabs for each section (Revenue, Sales, Budget, etc.)</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold min-w-[24px]">5.</span>
                  <span>Add formulas and charts to make it interactive</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold min-w-[24px]">6.</span>
                  <span>Share with your team for collaborative planning</span>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm">
                <strong>Pro Tip:</strong> After importing, create a "Weekly Tracker" tab to monitor actual performance against these projections. Update it every Monday to stay on track with your growth targets.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>What to Do Next</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Immediate Actions (This Week):</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Set up Apollo.io and LinkedIn Sales Navigator accounts</li>
                  <li>• Build your first list of 500 target builder contacts</li>
                  <li>• Create 3 cold email sequence variants</li>
                  <li>• Start daily outreach: 50 LinkedIn + 100 emails</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">First 30 Days:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Book 4-6 demos per week</li>
                  <li>• Close first 3-5 customers</li>
                  <li>• Recruit initial 15-20 partners</li>
                  <li>• Achieve $5K-10K MRR</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">First 90 Days:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Reach 20+ customers and $25K MRR</li>
                  <li>• Build partner network to 50+ partners</li>
                  <li>• Plan for first sales hire (Month 6-7)</li>
                  <li>• Prepare to launch Google Ads (Month 3)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessPlanExport;
