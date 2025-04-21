
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllAssets } from "@/lib/supabase-utils";
import { useEffect, useState } from "react";
import { Asset } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Mail, Calendar, Building, User, Package } from "lucide-react";

const statusColors = {
  available: 'bg-green-500',
  assigned: 'bg-blue-500',
  repair: 'bg-yellow-500',
  retired: 'bg-gray-500',
  lost: 'bg-red-500',
};

const Profile = () => {
  const { user } = useAuth();
  const [userAssets, setUserAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return parts[0][0];
  };

  useEffect(() => {
    const fetchUserAssets = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const assets = await getAllAssets();
        // Filter assets assigned to current user
        const filteredAssets = assets.filter(
          asset => asset.assignedTo && asset.assignedTo.email === user.email
        );
        setUserAssets(filteredAssets);
      } catch (error) {
        console.error("Error fetching user assets:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserAssets();
  }, [user]);

  if (!user) return null;

  const userName = user.user_metadata?.full_name || 'User';
  const userEmail = user.email || '';
  const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A';
  const createdAt = user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A';
  
  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={userName} />
              <AvatarFallback>{getInitials(userName)}</AvatarFallback>
            </Avatar>
            <CardTitle>{userName}</CardTitle>
            <CardDescription className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              {userEmail}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">User ID:</span>
                <span className="ml-auto font-medium truncate" title={user.id}>
                  {user.id.substring(0, 8)}...
                </span>
              </div>
              
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Last Sign In:</span>
                <span className="ml-auto font-medium">{lastSignIn}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Account Created:</span>
                <span className="ml-auto font-medium">{createdAt}</span>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Assets Assigned</span>
                <Badge variant="outline" className="font-bold">
                  {userAssets.length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* User Assets */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Your Assets
            </CardTitle>
            <CardDescription>
              Assets currently assigned to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : userAssets.length > 0 ? (
              <div className="space-y-4">
                {userAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <span>Category: {asset.category}</span>
                        {asset.serialNumber && <span>• SN: {asset.serialNumber}</span>}
                      </div>
                    </div>
                    <Badge className={cn(statusColors[asset.status as keyof typeof statusColors] || 'bg-gray-500')}>
                      {asset.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No assets assigned to you yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
