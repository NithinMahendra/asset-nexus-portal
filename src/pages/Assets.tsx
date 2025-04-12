
import { useState, useEffect } from 'react';
import { getAllAssets } from '@/lib/supabase-utils';
import { 
  Badge, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  Input, 
  Button, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { AssetCategory, AssetStatus, Asset } from '@/types';
import { 
  Search, 
  FileDown, 
  FileUp, 
  Plus, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash,
  User,
  History,
  AlertTriangle,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import AddAssetForm from '@/components/assets/AddAssetForm';

const statusColors: Record<AssetStatus, string> = {
  available: 'bg-status-available',
  assigned: 'bg-status-assigned',
  repair: 'bg-status-repair',
  retired: 'bg-status-retired'
};

const AssetList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  
  // Load assets from Supabase
  useEffect(() => {
    loadAssets();
  }, []);

  async function loadAssets() {
    setIsLoading(true);
    try {
      const assetList = await getAllAssets();
      setAssets(assetList);
    } catch (error) {
      console.error("Error loading assets:", error);
    } finally {
      setIsLoading(false);
    }
  }
  
  // Category options
  const categories: { value: string; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'monitor', label: 'Monitor' },
    { value: 'printer', label: 'Printer' },
    { value: 'networking', label: 'Networking' },
    { value: 'peripheral', label: 'Peripheral' },
    { value: 'software', label: 'Software' },
    { value: 'other', label: 'Other' },
  ];
  
  // Status options
  const statuses: { value: string; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'available', label: 'Available' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'repair', label: 'Under Repair' },
    { value: 'retired', label: 'Retired' },
  ];
  
  // Filter assets based on search term and filters
  useEffect(() => {
    let result = [...assets];
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(asset => 
        asset.name.toLowerCase().includes(lowercasedSearch) ||
        asset.id.toLowerCase().includes(lowercasedSearch) ||
        (asset.serialNumber && asset.serialNumber.toLowerCase().includes(lowercasedSearch)) ||
        (asset.model && asset.model.toLowerCase().includes(lowercasedSearch))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(asset => asset.status === statusFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(asset => asset.category === categoryFilter);
    }
    
    setFilteredAssets(result);
  }, [searchTerm, statusFilter, categoryFilter, assets]);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">
            Manage and track all company assets
          </p>
        </div>
        <Button className="bg-primary" onClick={() => setIsAddAssetOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Asset
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search assets..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-40">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex-shrink-0">
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" className="flex-shrink-0">
              <FileUp className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
                        <p>Loading assets...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">
                        <Link to={`/assets/${asset.id}`} className="hover:text-primary">
                          {asset.name}
                        </Link>
                      </TableCell>
                      <TableCell className="capitalize">{asset.category}</TableCell>
                      <TableCell>
                        <Badge className={cn(statusColors[asset.status], "text-white")}>
                          {asset.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{asset.serialNumber || '-'}</TableCell>
                      <TableCell>{asset.location || '-'}</TableCell>
                      <TableCell>
                        {asset.assignedTo ? (
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">
                              {asset.assignedTo.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span>{asset.assignedTo.name}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <User className="mr-2 h-4 w-4" /> Assign
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <History className="mr-2 h-4 w-4" /> View History
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Search className="h-10 w-10 mb-2" />
                        <h3 className="font-medium mb-1">No assets found</h3>
                        <p>Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { status: 'available', icon: <Check className="h-5 w-5" />, label: 'Available' },
          { status: 'assigned', icon: <User className="h-5 w-5" />, label: 'Assigned' },
          { status: 'repair', icon: <AlertTriangle className="h-5 w-5" />, label: 'Under Repair' },
          { status: 'retired', icon: <Trash className="h-5 w-5" />, label: 'Retired' },
        ].map((item) => {
          const count = assets.filter(a => a.status === item.status).length;
          return (
            <Card key={item.status}>
              <CardContent className="flex items-center p-6">
                <div className={cn("p-2 rounded-full mr-4", statusColors[item.status as AssetStatus])}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Asset Form Dialog */}
      <AddAssetForm 
        isOpen={isAddAssetOpen} 
        onClose={() => setIsAddAssetOpen(false)} 
        onSuccess={loadAssets}
      />
    </div>
  );
};

export default AssetList;
