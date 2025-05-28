
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Package, Wrench, User } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import RoleBasedAccess from '@/components/RoleBasedAccess';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <RoleBasedAccess
      allowedRoles={['employee']}
      loadingFallback={
        <div className="flex justify-center p-4">
          <p>Loading your dashboard...</p>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Employee Dashboard</h1>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email?.split('@')[0] || 'Employee'}
            </span>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Assets</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Assets assigned to you
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Maintenance requests
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">
                Account status
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="assets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assets">My Assets</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance Requests</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Assigned Assets</CardTitle>
                <CardDescription>
                  View all assets currently assigned to you
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[400px]">
                <Alert>
                  <Package className="h-4 w-4" />
                  <AlertTitle>No assets assigned</AlertTitle>
                  <AlertDescription>
                    You don't have any assets assigned to you yet. Contact your administrator if you need access to equipment.
                  </AlertDescription>
                </Alert>
                
                <div className="text-center mt-8">
                  <p className="text-muted-foreground mb-4">Your assigned assets will appear here</p>
                  <Button variant="outline">Request Asset Assignment</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Requests</CardTitle>
                <CardDescription>
                  Submit and track maintenance requests for your assigned assets
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[400px]">
                <Alert className="mb-6">
                  <Wrench className="h-4 w-4" />
                  <AlertTitle>No maintenance requests</AlertTitle>
                  <AlertDescription>
                    You haven't submitted any maintenance requests yet.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Submit a maintenance request for any issues with your assigned assets
                    </p>
                    <Button className="w-full max-w-md">
                      <Wrench className="mr-2 h-4 w-4" />
                      Submit New Maintenance Request
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>
                  View and update your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[400px]">
                <div className="space-y-6">
                  <div className="flex flex-col items-center gap-4 py-6">
                    <div className="relative">
                      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                        <User className="h-10 w-10 text-blue-600" />
                      </span>
                    </div>
                    <div className="space-y-1 text-center">
                      <h3 className="font-medium text-lg">{user?.email?.split('@')[0] || 'Employee'}</h3>
                      <p className="text-sm text-muted-foreground">{user?.email || 'No email available'}</p>
                      <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">Employee</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 max-w-md mx-auto">
                    <div className="grid gap-2">
                      <h4 className="font-medium">Email Address</h4>
                      <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                        {user?.email || 'Not available'}
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <h4 className="font-medium">Department</h4>
                      <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                        Not set
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <h4 className="font-medium">Phone Number</h4>
                      <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                        Not set
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <h4 className="font-medium">Employee ID</h4>
                      <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                        Not set
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button>
                  <User className="mr-2 h-4 w-4" />
                  Update Profile Information
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleBasedAccess>
  );
};

export default EmployeeDashboard;
