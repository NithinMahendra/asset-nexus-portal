
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Asset, AssetCategory, AssetStatus } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { 
  AlertTriangle, 
  Clock, 
  Wrench, // Using Wrench instead of Tool
  User,
  Calendar,
  Package,
  MapPin,
  Tag,
  Info,
  FileText,
  Clipboard,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import RoleBasedAccess from '@/components/RoleBasedAccess';
import AssetMaintenanceRequest from '@/components/assets/AssetMaintenanceRequest';

const AssetScanner = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const { user, userRole } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      issue: '',
      issueType: 'issue'
    }
  });

  // Fetch asset data when component mounts or assetId changes
  useEffect(() => {
    if (!assetId) return;
    
    const fetchAssetData = async () => {
      setLoading(true);
      try {
        // Fetch asset details
        const { data, error } = await supabase
          .from('assets')
          .select(`
            id,
            name,
            category,
            status,
            purchase_date,
            warranty_expiry,
            location,
            assigned_to,
            assigned_date,
            serial_number,
            model,
            description,
            value
          `)
          .eq('id', assetId)
          .single();

        if (error) throw error;
        if (data) {
          // Fix the assigned_to handling by properly checking its type
          const assignedToData = data.assigned_to;
          
          setAsset({
            id: data.id,
            name: data.name,
            category: data.category as AssetCategory,
            status: data.status as AssetStatus,
            purchaseDate: data.purchase_date,
            warrantyExpiry: data.warranty_expiry,
            location: data.location,
            // Check if assigned_to is an object with the needed properties
            assignedTo: assignedToData && 
              typeof assignedToData === 'object' && 
              assignedToData !== null && 
              'id' in assignedToData && 
              'name' in assignedToData && 
              'email' in assignedToData
                ? {
                    id: assignedToData.id,
                    name: assignedToData.name,
                    email: assignedToData.email,
                    role: 'employee' // Default role if not specified
                  } 
                : undefined,
            assignedDate: data.assigned_date,
            serialNumber: data.serial_number,
            model: data.model,
            description: data.description,
            value: data.value,
          });
        }

        // Fetch asset history
        const { data: historyData, error: historyError } = await supabase
          .from('asset_history')
          .select('*')
          .eq('asset_id', assetId)
          .order('date', { ascending: false });

        if (historyError) throw historyError;
        setHistory(historyData || []);
      } catch (error) {
        console.error('Error fetching asset data:', error);
        toast({
          title: "Error",
          description: "Failed to load asset data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssetData();
  }, [assetId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const onSubmitIssue = async (data: { issue: string, issueType: 'issue' | 'maintenance' | 'loss' }) => {
    if (!asset) return;
    
    try {
      const { error } = await supabase
        .from('asset_history')
        .insert([
          {
            asset_id: asset.id,
            action: `reported_${data.issueType}`,
            date: new Date().toISOString(),
            user_id: user?.id || null,
            user_name: user?.email || 'Anonymous User',
            details: data.issue
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Report Submitted",
        description: "Your report has been submitted successfully.",
      });
      
      // Refresh history
      const { data: historyData, error: historyError } = await supabase
        .from('asset_history')
        .select('*')
        .eq('asset_id', asset.id)
        .order('date', { ascending: false });

      if (historyError) throw historyError;
      setHistory(historyData || []);
      
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
        <h2 className="mt-4 text-2xl font-semibold">Asset Not Found</h2>
        <p className="mt-2 text-muted-foreground">The asset you're looking for doesn't exist or you don't have access to view it.</p>
      </div>
    );
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-green-500 text-white';
      case 'assigned': return 'bg-blue-500 text-white';
      case 'repair': return 'bg-orange-500 text-white';
      case 'retired': return 'bg-gray-500 text-white';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">{asset.name}</h1>
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(asset.status)}`}>
            {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
          </span>
          <span className="ml-2 text-sm text-muted-foreground">
            Asset ID: {asset.id}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Asset Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Category</span>
                  </div>
                  <p>{asset.category}</p>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Model</span>
                  </div>
                  <p>{asset.model || 'N/A'}</p>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Location</span>
                  </div>
                  <p>{asset.location || 'N/A'}</p>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Serial Number</span>
                  </div>
                  <p>{asset.serialNumber || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Description</span>
                </div>
                <p className="text-sm">{asset.description || 'No description available'}</p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="timeline" className="mt-6">
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="report">Report Issue</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Timeline</CardTitle>
                  <CardDescription>History of events for this asset</CardDescription>
                </CardHeader>
                <CardContent className="max-h-80 overflow-y-auto">
                  {history.length > 0 ? (
                    <div className="space-y-4">
                      {history.map((event, index) => (
                        <div key={index} className="border-l-2 border-primary pl-4 pb-4">
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="font-medium capitalize">
                            {event.action.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm">{event.user_name}</p>
                          {event.details && (
                            <p className="text-sm mt-1">{event.details}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">
                      No history available for this asset.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="report">
              <Card>
                <CardHeader>
                  <CardTitle>Report an Issue</CardTitle>
                  <CardDescription>
                    Submit a report about this asset
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmitIssue)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Issue Type</label>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            type="button" 
                            {...register("issueType")}
                            onClick={() => setIsMaintenanceModalOpen(true)}
                            className="flex-1"
                          >
                            <Wrench className="mr-2 h-4 w-4" />
                            Maintenance
                          </Button>
                          <Button 
                            type="button" 
                            {...register("issueType")}
                            onClick={() => setIsMaintenanceModalOpen(true)}
                            className="flex-1"
                          >
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Issue Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dates & Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Purchase Date</span>
                </div>
                <p>{formatDate(asset.purchaseDate)}</p>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Warranty Expiry</span>
                </div>
                <p>{formatDate(asset.warrantyExpiry)}</p>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Assigned To</span>
                </div>
                <p>{asset.assignedTo ? asset.assignedTo.name : 'Unassigned'}</p>
                {asset.assignedTo && (
                  <p className="text-sm text-muted-foreground">{asset.assignedTo.email}</p>
                )}
                {asset.assignedDate && asset.assignedTo && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Since {formatDate(asset.assignedDate)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Buttons for actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => setIsMaintenanceModalOpen(true)}
                className="w-full"
              >
                <Wrench className="mr-2 h-4 w-4" />
                Request Maintenance
              </Button>
              
              <RoleBasedAccess allowedRoles={['admin']}>
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm font-medium mb-2">Admin Actions</p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <Clipboard className="mr-2 h-4 w-4" />
                      Edit Asset
                    </Button>
                  </div>
                </div>
              </RoleBasedAccess>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Maintenance Request Modal */}
      <AssetMaintenanceRequest 
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        assetId={asset.id}
        assetName={asset.name}
      />
    </div>
  );
};

export default AssetScanner;
