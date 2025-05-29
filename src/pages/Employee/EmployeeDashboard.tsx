
import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Package, Wrench, User, LogOut, Users, CreditCard, Plus, Search, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('assets');
  const [searchTerm, setSearchTerm] = useState('');
  const [maintenanceForm, setMaintenanceForm] = useState({
    assetId: '',
    description: '',
    priority: 'medium'
  });
  const [profileForm, setProfileForm] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    department: ''
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/auth/login');
  };

  // Mock data for employee's assigned assets
  const assignedAssets = [
    { id: 'LP-001', name: 'MacBook Pro 14"', type: 'Laptop', status: 'Active', assignedDate: '2024-01-15' },
    { id: 'DK-045', name: 'Standing Desk', type: 'Furniture', status: 'Active', assignedDate: '2024-01-20' },
    { id: 'MN-102', name: 'Dell Monitor 27"', type: 'Monitor', status: 'Active', assignedDate: '2024-01-15' },
    { id: 'KB-203', name: 'Mechanical Keyboard', type: 'Accessory', status: 'Active', assignedDate: '2024-01-22' },
    { id: 'MS-304', name: 'Wireless Mouse', type: 'Accessory', status: 'Active', assignedDate: '2024-01-22' }
  ];

  // Mock data for maintenance requests
  const [maintenanceRequests, setMaintenanceRequests] = useState([
    { id: 1, assetId: 'LP-001', description: 'Screen flickering issue', status: 'Pending', date: '2024-01-25' },
    { id: 2, assetId: 'DK-045', description: 'Height adjustment not working', status: 'In Progress', date: '2024-01-20' },
    { id: 3, assetId: 'MN-102', description: 'Dead pixels on screen', status: 'Completed', date: '2024-01-18' }
  ]);

  const filteredAssets = assignedAssets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintenanceForm.assetId || !maintenanceForm.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newRequest = {
      id: maintenanceRequests.length + 1,
      assetId: maintenanceForm.assetId,
      description: maintenanceForm.description,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };

    setMaintenanceRequests([newRequest, ...maintenanceRequests]);
    setMaintenanceForm({ assetId: '', description: '', priority: 'medium' });
    
    toast({
      title: "Request Submitted",
      description: "Your maintenance request has been submitted successfully.",
    });
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Active': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-gray-100 text-gray-800'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

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
                <p className="text-gray-600">Welcome, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}</p>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assets" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>My Assets</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center space-x-2">
              <Wrench className="h-4 w-4" />
              <span>Maintenance</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Assets Tab */}
          <TabsContent value="assets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>My Assigned Assets</span>
                </CardTitle>
                <CardDescription>
                  View and manage your assigned assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search assets..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="grid gap-4">
                  {filteredAssets.map((asset) => (
                    <div key={asset.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{asset.name}</h3>
                          <p className="text-gray-600">Asset ID: {asset.id}</p>
                          <p className="text-sm text-gray-500">Type: {asset.type} • Assigned: {asset.assignedDate}</p>
                        </div>
                        <Badge className={getStatusBadge(asset.status)}>
                          {asset.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <div className="grid gap-6">
              {/* Submit New Request */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Submit Maintenance Request</span>
                  </CardTitle>
                  <CardDescription>
                    Report issues with your assigned assets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Asset</label>
                      <select 
                        value={maintenanceForm.assetId}
                        onChange={(e) => setMaintenanceForm({...maintenanceForm, assetId: e.target.value})}
                        className="w-full p-2 border rounded-md"
                        required
                      >
                        <option value="">Select an asset</option>
                        {assignedAssets.map(asset => (
                          <option key={asset.id} value={asset.id}>
                            {asset.name} ({asset.id})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea 
                        placeholder="Describe the issue..."
                        value={maintenanceForm.description}
                        onChange={(e) => setMaintenanceForm({...maintenanceForm, description: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Priority</label>
                      <select 
                        value={maintenanceForm.priority}
                        onChange={(e) => setMaintenanceForm({...maintenanceForm, priority: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Submit Request
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Request History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wrench className="h-5 w-5" />
                    <span>My Maintenance Requests</span>
                  </CardTitle>
                  <CardDescription>
                    Track your submitted maintenance requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {maintenanceRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">Asset: {request.assetId}</h3>
                          <Badge className={getStatusBadge(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-2">{request.description}</p>
                        <p className="text-sm text-gray-500">Submitted: {request.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input 
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input 
                      value={profileForm.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input 
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Department</label>
                    <Input 
                      value={profileForm.department}
                      onChange={(e) => setProfileForm({...profileForm, department: e.target.value})}
                      placeholder="Enter your department"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
