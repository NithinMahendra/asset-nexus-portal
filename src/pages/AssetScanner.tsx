
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Asset, AssetCategory, AssetStatus } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { 
  AlertTriangle, 
  Clock, 
  Wrench, // Replace Tool with Wrench icon
  User,
  Calendar,
  Package,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/providers/AuthProvider';

const statusColors: Record<string, string> = {
  available: 'bg-green-500',
  assigned: 'bg-blue-500',
  repair: 'bg-yellow-500',
  retired: 'bg-gray-500',
  lost: 'bg-red-500',
};

const requestSchema = z.object({
  type: z.enum(['maintenance', 'issue', 'return']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type RequestFormValues = z.infer<typeof requestSchema>;

const AssetScannerPage = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      type: 'maintenance',
      description: '',
    },
  });
  
  useEffect(() => {
    const fetchAsset = async () => {
      if (!assetId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('assets')
          .select('*, assignedTo:assigned_to(id, name, email)')
          .eq('id', assetId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setAsset({
            id: data.id,
            name: data.name,
            category: data.category as AssetCategory, // Add type casting
            status: data.status as AssetStatus, // Add type casting
            purchaseDate: data.purchase_date,
            warrantyExpiry: data.warranty_expiry,
            location: data.location,
            assignedTo: data.assignedTo ? {
              id: data.assignedTo.id,
              name: data.assignedTo.name,
              email: data.assignedTo.email,
              role: 'employee' // Add default role to match User type
            } : undefined,
            assignedDate: data.assigned_date,
            serialNumber: data.serial_number,
            model: data.model,
            description: data.description,
            value: data.value,
          });
        }
      } catch (error) {
        console.error('Error fetching asset:', error);
        toast({
          title: "Error",
          description: "Failed to load asset information",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAsset();
  }, [assetId]);

  const onSubmit = async (data: RequestFormValues) => {
    if (!asset || !user) return;
    
    setIsSubmitting(true);
    
    try {
      // Create new record in asset_history
      const { error } = await supabase
        .from('asset_history')
        .insert({
          asset_id: asset.id,
          action: `request_${data.type}`,
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email,
          details: data.description
        });
      
      if (error) throw error;
      
      toast({
        title: "Request Submitted",
        description: "Your request has been submitted successfully and will be reviewed by the admin team.",
      });
      
      form.reset();
      
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h3 className="mt-4 text-lg font-medium">Loading asset information...</h3>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center">
              <AlertTriangle className="mr-2" />
              Asset Not Found
            </CardTitle>
            <CardDescription>
              The asset you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => window.history.back()} className="w-full">
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Asset Details</h1>
        <Badge className={statusColors[asset.status] || 'bg-gray-500'}>
          {asset.status}
        </Badge>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">{asset.name}</CardTitle>
          <CardDescription>
            {asset.category} • ID: {asset.id}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Serial Number</h3>
                <p>{asset.serialNumber || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Model</h3>
                <p>{asset.model || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p>{asset.location || 'N/A'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">Purchase Date</h3>
                <p className="ml-auto">{asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">Warranty Expiry</h3>
                <p className="ml-auto">
                  {asset.warrantyExpiry ? new Date(asset.warrantyExpiry).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">Assigned To</h3>
                <p className="ml-auto">
                  {asset.assignedTo ? asset.assignedTo.name : 'Not assigned'}
                </p>
              </div>
            </div>
          </div>
          
          {asset.description && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p className="text-sm">{asset.description}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submit a Request</CardTitle>
            <CardDescription>
              Report an issue or request maintenance for this asset
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Type</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant={field.value === 'maintenance' ? 'default' : 'outline'}
                            onClick={() => field.onChange('maintenance')}
                            className="flex-1"
                          >
                            <Wrench className="mr-2 h-4 w-4" />
                            Maintenance
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 'issue' ? 'default' : 'outline'}
                            onClick={() => field.onChange('issue')}
                            className="flex-1"
                          >
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Report Issue
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 'return' ? 'default' : 'outline'}
                            onClick={() => field.onChange('return')}
                            className="flex-1"
                          >
                            <Package className="mr-2 h-4 w-4" />
                            Return Asset
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={
                            form.watch('type') === 'maintenance' 
                              ? 'Describe what maintenance is needed...'
                              : form.watch('type') === 'issue'
                              ? 'Describe the issue in detail...'
                              : 'Reason for returning the asset...'
                          }
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Submit Request
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssetScannerPage;
