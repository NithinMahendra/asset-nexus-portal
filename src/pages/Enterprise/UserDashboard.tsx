
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Package, QrCode, Wrench, User } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import RoleBasedAccess from '@/components/RoleBasedAccess';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-assets');
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <RoleBasedAccess
      allowedRoles={['admin', 'employee']}
      loadingFallback={
        <div className="flex justify-center p-4">
          <p>Loading your personalized dashboard...</p>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">My Dashboard</h1>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {user ? `Welcome, ${user.email}` : 'Welcome'}
            </span>
          </div>
        </div>
        
        <Tabs defaultValue="my-assets" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="my-assets">My Assets</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance Requests</TabsTrigger>
            <TabsTrigger value="qr-scanner">QR Scanner</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-assets" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    Assets assigned to you
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Maintenance Pending</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">
                    Maintenance requests
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>My Assets</CardTitle>
                <CardDescription>
                  Assets currently assigned to you
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[300px]">
                <Alert className="mb-4">
                  <AlertTitle>No assets found</AlertTitle>
                  <AlertDescription>
                    You don't have any assets assigned to you yet.
                  </AlertDescription>
                </Alert>
                
                <div className="text-center mt-8">
                  <p className="text-muted-foreground">Assigned assets will appear here</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Request New Asset</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Requests</CardTitle>
                <CardDescription>
                  Submit and track maintenance requests for your assets
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[300px]">
                <Alert className="mb-4">
                  <AlertTitle>No maintenance requests</AlertTitle>
                  <AlertDescription>
                    You don't have any maintenance requests yet.
                  </AlertDescription>
                </Alert>
                
                <div className="text-center mt-8">
                  <p className="text-muted-foreground">Maintenance requests will appear here</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button>New Maintenance Request</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="qr-scanner" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Scanner</CardTitle>
                <CardDescription>
                  Scan QR codes to quickly look up asset information
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[300px]">
                <div className="text-center mt-8">
                  <QrCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Click the button below to access the QR scanner</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Open QR Scanner</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>
                  Manage your account information
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[300px]">
                <div className="flex flex-col items-center justify-center gap-4 py-6">
                  <div className="relative">
                    <span className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                      <User className="h-12 w-12 text-foreground" />
                    </span>
                  </div>
                  <div className="space-y-1 text-center">
                    <h3 className="font-medium">{user?.email || 'User'}</h3>
                    <p className="text-sm text-muted-foreground">Employee</p>
                  </div>
                </div>
                
                <div className="space-y-4 mt-4">
                  <div className="grid gap-2">
                    <h4 className="font-medium">Email</h4>
                    <p className="text-sm text-muted-foreground">{user?.email || 'Not available'}</p>
                  </div>
                  <div className="grid gap-2">
                    <h4 className="font-medium">Department</h4>
                    <p className="text-sm text-muted-foreground">Not set</p>
                  </div>
                  <div className="grid gap-2">
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-sm text-muted-foreground">Not set</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Edit Profile</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleBasedAccess>
  );
};

export default UserDashboard;
