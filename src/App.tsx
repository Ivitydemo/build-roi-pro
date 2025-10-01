import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Setup from "./pages/Setup";
import DemoReport from "./pages/DemoReport";
import DemoReportItemized from "./pages/DemoReportItemized";
import BuilderImpact from "./pages/BuilderImpact";
import CRMIntegrations from "./pages/CRMIntegrations";
import Pricing from "./pages/Pricing";
import VideoGenerator from "./pages/VideoGenerator";
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
          <Route path="/demo" element={<DemoReport />} />
          <Route path="/demo-itemized" element={<DemoReportItemized />} />
          <Route path="/builder-impact" element={<BuilderImpact />} />
          <Route path="/crm-integrations" element={<CRMIntegrations />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/video-generator" element={<VideoGenerator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
