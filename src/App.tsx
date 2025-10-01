import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Setup from "./pages/Setup";
import DemoSelection from "./pages/DemoSelection";
import DemoReport from "./pages/DemoReport";
import DemoReportItemized from "./pages/DemoReportItemized";
import PreferredPartners from "./pages/PreferredPartners";
import BuilderImpact from "./pages/BuilderImpact";
import CRMIntegrations from "./pages/CRMIntegrations";
import Pricing from "./pages/Pricing";
import VideoGenerator from "./pages/VideoGenerator";
import PartnerPortal from "./pages/PartnerPortal";
import PartnerLeads from "./pages/PartnerLeads";
import PartnerCommissions from "./pages/PartnerCommissions";
import PartnerComparison from "./pages/PartnerComparison";
import BusinessPlan from "./pages/BusinessPlan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/demo" element={<DemoSelection />} />
          <Route path="/demo/package" element={<DemoReport />} />
          <Route path="/demo/itemized" element={<DemoReportItemized />} />
          <Route path="/demo/partners" element={<PreferredPartners />} />
          {/* Redirect old URL */}
          <Route path="/demo-itemized" element={<DemoReportItemized />} />
          <Route path="/builder-impact" element={<BuilderImpact />} />
          <Route path="/crm-integrations" element={<CRMIntegrations />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/video-generator" element={<VideoGenerator />} />
          <Route path="/partner-portal" element={<PartnerPortal />} />
          <Route path="/partner-leads" element={<PartnerLeads />} />
          <Route path="/partner-commissions" element={<PartnerCommissions />} />
          <Route path="/partner-comparison" element={<PartnerComparison />} />
          <Route path="/business-plan" element={<BusinessPlan />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
