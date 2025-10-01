import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, FileText, Image, Package, Settings, LogOut, PlusCircle, Webhook } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [builderProfile, setBuilderProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    reports: 0,
    packages: 0,
    photos: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load builder profile
      const { data: profile } = await supabase
        .from('builder_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (!profile) {
        // No profile yet, redirect to setup
        navigate('/setup');
        return;
      }

      setBuilderProfile(profile);

      // Load stats
      const [reportsData, packagesData, photosData] = await Promise.all([
        supabase.from('reports').select('id', { count: 'exact' }).eq('builder_id', profile.id),
        supabase.from('remodel_packages').select('id', { count: 'exact' }).eq('builder_id', profile.id),
        supabase.from('photo_library').select('id', { count: 'exact' }).eq('builder_id', profile.id)
      ]);

      setStats({
        reports: reportsData.count || 0,
        packages: packagesData.count || 0,
        photos: photosData.count || 0
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading || !builderProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">{builderProfile.company_name}</h1>
              <p className="text-sm text-muted-foreground">Builder ROI Platform</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {builderProfile.contact_name}!</h2>
          <p className="text-muted-foreground">Generate professional ROI proposals for your clients</p>
        </div>

        {/* Quick Action */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle>Create New Proposal</CardTitle>
            <CardDescription>Generate a professional ROI analysis for your client</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" onClick={() => navigate('/generate-report')}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Generate New Report
            </Button>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.reports}</div>
              <p className="text-xs text-muted-foreground">Generated proposals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remodel Packages</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.packages}</div>
              <p className="text-xs text-muted-foreground">Active packages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Photo Library</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.photos}</div>
              <p className="text-xs text-muted-foreground">Before/after photos</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/packages')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Manage Packages
              </CardTitle>
              <CardDescription>Set up your remodel tiers and pricing</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/photos')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Photo Library
              </CardTitle>
              <CardDescription>Upload before/after project photos</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/crm-integrations')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                CRM Integrations
              </CardTitle>
              <CardDescription>Connect to Buildertrend, HubSpot, and more</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/settings')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
              <CardDescription>Update company info and preferences</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/reports')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                View Reports
              </CardTitle>
              <CardDescription>Browse all generated proposals</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
