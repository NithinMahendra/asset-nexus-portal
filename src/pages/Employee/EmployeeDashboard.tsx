
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Wrench, User, LogOut, Users, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const EmployeeDashboard: React.FC = () => {
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

  const employeeFeatures = [
    {
      title: "My Assets",
      description: "View and manage your assigned assets",
      icon: <Package className="h-12 w-12" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      textColor: "text-blue-600"
    },
    {
      title: "Maintenance Requests",
      description: "Submit and track maintenance requests",
      icon: <Wrench className="h-12 w-12" />,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      textColor: "text-green-600"
    },
    {
      title: "My Profile",
      description: "Update your profile information",
      icon: <User className="h-12 w-12" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AssetNexus Employee</h1>
                <p className="text-gray-600">Employee Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Employee
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access your assigned assets, submit maintenance requests, and manage your profile from this portal.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {employeeFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br ${feature.bgColor} ${feature.borderColor} border-2 hover:scale-105`}
            >
              <CardContent className="p-8 text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg text-white`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </CardTitle>
                <CardDescription className={`${feature.textColor} text-lg`}>
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-blue-800">8</p>
              <p className="text-blue-600 font-medium">Assigned Assets</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-green-800">3</p>
              <p className="text-green-600 font-medium">Pending Requests</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-purple-800">95%</p>
              <p className="text-purple-600 font-medium">Profile Complete</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-gray-700">Laptop LP-001 assigned to you</p>
              <span className="text-sm text-gray-500 ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-gray-700">Maintenance request for DK-045 completed</p>
              <span className="text-sm text-gray-500 ml-auto">1 day ago</span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <p className="text-gray-700">Profile updated successfully</p>
              <span className="text-sm text-gray-500 ml-auto">3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
