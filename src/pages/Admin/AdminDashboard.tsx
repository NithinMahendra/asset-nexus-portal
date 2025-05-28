
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Users, Package, Settings, BarChart3, Bell, FileText, CreditCard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/auth/login');
  };

  const adminFeatures = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: <Users className="h-8 w-8" />,
      color: "bg-blue-500",
      route: "/users"
    },
    {
      title: "Asset Management",
      description: "View and manage all assets",
      icon: <Package className="h-8 w-8" />,
      color: "bg-green-500",
      route: "/assets"
    },
    {
      title: "Reports & Analytics",
      description: "Generate comprehensive reports",
      icon: <BarChart3 className="h-8 w-8" />,
      color: "bg-purple-500",
      route: "/reports"
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: <Settings className="h-8 w-8" />,
      color: "bg-orange-500",
      route: "/settings"
    },
    {
      title: "Notifications",
      description: "Manage system notifications",
      icon: <Bell className="h-8 w-8" />,
      color: "bg-red-500",
      route: "/notifications"
    },
    {
      title: "Documentation",
      description: "Access system documentation",
      icon: <FileText className="h-8 w-8" />,
      color: "bg-indigo-500",
      route: "/documentation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center shadow-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AssetNexus Admin</h1>
                <p className="text-gray-600">Administrator Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Administrator
                </Badge>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
          </h2>
          <p className="text-xl text-gray-600">
            Manage your organization's assets and users from this central dashboard.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-purple-200"
              onClick={() => navigate(feature.route)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className={`${feature.color} p-3 rounded-lg text-white shadow-lg`}>
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-800">248</p>
                    <p className="text-blue-600">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-800">1,247</p>
                    <p className="text-green-600">Total Assets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-800">98.5%</p>
                    <p className="text-purple-600">System Health</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-800">12</p>
                    <p className="text-orange-600">Pending Alerts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
