import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart4, 
  PieChart, 
  Package, 
  DollarSign,
  Users,
  Loader2,
  Wrench, // Replaced Tool with Wrench
  Activity
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { generateReport, fetchReportData, saveCustomReport, getSavedReports } from '@/services/reportService';
import { toast } from "sonner";
import { useQuery } from '@tanstack/react-query';
import { AssetStatus, AssetCategory } from '@/types';
import { format } from 'date-fns';

type ReportFormat = 'pdf' | 'excel' | 'csv';
type DateRange = 'all' | 'year' | 'quarter' | 'month' | 'custom';
type GroupBy = 'none' | 'category' | 'department' | 'location' | 'status';

interface ReportOptions {
  format: ReportFormat;
  dateRange: DateRange;
  groupBy: GroupBy;
  customStartDate?: string;
  customEndDate?: string;
}

interface ReportTypeInfo {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ReportsPage = () => {
  // State for selected report and options
  const [reportType, setReportType] = useState('asset-inventory');
  const [reportOptions, setReportOptions] = useState<ReportOptions>({
    format: 'pdf',
    dateRange: 'all',
    groupBy: 'none'
  });
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Use React Query to fetch report data
  const { data: reportData, isLoading, error } = useQuery({
    queryKey: ['report-data', reportType],
    queryFn: () => fetchReportData(reportType),
    enabled: !!reportType,
  });

  // Query for saved reports
  const { data: savedReports = [] } = useQuery({
    queryKey: ['saved-reports'],
    queryFn: getSavedReports,
  });

  // Define all report types
  const reportTypes: ReportTypeInfo[] = [
    { 
      id: 'asset-inventory', 
      title: 'Asset Inventory', 
      description: 'Complete list of all assets',
      icon: <Package className="h-8 w-8" />
    },
    { 
      id: 'assigned-assets', 
      title: 'Assigned Assets', 
      description: 'Assets currently assigned to users',
      icon: <Users className="h-8 w-8" />
    },
    { 
      id: 'warranty-expiry', 
      title: 'Warranty Expiry', 
      description: 'Assets with upcoming warranty expiration',
      icon: <Calendar className="h-8 w-8" />
    },
    { 
      id: 'value-report', 
      title: 'Value Report', 
      description: 'Asset values and depreciation',
      icon: <DollarSign className="h-8 w-8" />
    },
    { 
      id: 'maintenance-history', 
      title: 'Maintenance History', 
      description: 'Repair and maintenance records',
      icon: <Wrench className="h-8 w-8" /> // Updated icon here too
    },
    { 
      id: 'category-breakdown', 
      title: 'Category Breakdown', 
      description: 'Assets grouped by category',
      icon: <PieChart className="h-8 w-8" />
    },
    { 
      id: 'asset-utilization', 
      title: 'Asset Utilization', 
      description: 'Usage and efficiency metrics',
      icon: <BarChart4 className="h-8 w-8" />
    },
    { 
      id: 'activity-log', 
      title: 'Activity Log', 
      description: 'Recent changes and actions',
      icon: <Activity className="h-8 w-8" />
    },
  ];
  
  // Handle generating a report
  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      const reportUrl = await generateReport(reportType, reportOptions);
      
      // In a real app, you'd redirect to this URL or download the file
      console.log('Report URL:', reportUrl);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle saving a custom report
  const handleSaveCustomReport = async () => {
    if (!reportName) {
      toast.error('Please enter a report name');
      return;
    }
    
    const reportConfig = {
      name: reportName,
      description: reportDescription,
      type: reportType,
      options: reportOptions
    };
    
    await saveCustomReport(reportConfig);
  };

  // Render report data preview based on report type
  const renderReportPreview = () => {
    if (!reportData || reportData.length === 0) {
      return (
        <div className="border rounded-md p-4 mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            No data available for selected report type.
          </p>
        </div>
      );
    }

    switch (reportType) {
      case 'asset-inventory':
        return (
          <div className="border rounded-md p-4 mt-4 overflow-auto">
            <h3 className="font-medium mb-2">Preview: {reportData.length} assets found</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.slice(0, 5).map((asset: any) => (
                  <TableRow key={asset.id}>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.category}</TableCell>
                    <TableCell>{asset.status}</TableCell>
                    <TableCell>{asset.purchase_date}</TableCell>
                    <TableCell>{asset.value ? `$${asset.value}` : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {reportData.length > 5 && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Showing 5 of {reportData.length} assets. Generate the report to see all.
              </p>
            )}
          </div>
        );

      case 'assigned-assets':
        return (
          <div className="border rounded-md p-4 mt-4 overflow-auto">
            <h3 className="font-medium mb-2">Preview: {reportData.length} assigned assets found</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Assigned Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.slice(0, 5).map((asset: any) => (
                  <TableRow key={asset.id}>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.category}</TableCell>
                    <TableCell>{asset.assigned_to?.name || 'N/A'}</TableCell>
                    <TableCell>{asset.assigned_date || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );

      case 'warranty-expiry':
        return (
          <div className="border rounded-md p-4 mt-4 overflow-auto">
            <h3 className="font-medium mb-2">Preview: {reportData.length} assets with warranty information</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Warranty Expires</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.slice(0, 5).map((asset: any) => (
                  <TableRow key={asset.id}>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.category}</TableCell>
                    <TableCell>{asset.warranty_expiry}</TableCell>
                    <TableCell>{asset.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );

      case 'category-breakdown':
        return (
          <div className="border rounded-md p-4 mt-4">
            <h3 className="font-medium mb-2">Category Breakdown</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((item: any) => (
                  <TableRow key={item.category}>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.count}</TableCell>
                    <TableCell>{item.percentage.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );

      case 'asset-utilization':
        return (
          <div className="border rounded-md p-4 mt-4">
            <h3 className="font-medium mb-2">Asset Utilization Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold">{reportData.total}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-muted-foreground">Assigned</p>
                <p className="text-2xl font-bold">{reportData.assigned}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">{reportData.available}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-muted-foreground">In Repair</p>
                <p className="text-2xl font-bold">{reportData.repair}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-muted-foreground">Utilization Rate</p>
                <p className="text-2xl font-bold">{reportData.utilizationRate.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-muted-foreground">Availability Rate</p>
                <p className="text-2xl font-bold">{reportData.availabilityRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        );

      case 'activity-log':
        return (
          <div className="border rounded-md p-4 mt-4 overflow-auto">
            <h3 className="font-medium mb-2">Recent Activity ({reportData.length} events)</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.slice(0, 5).map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{format(new Date(item.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{item.asset?.name || 'N/A'}</TableCell>
                    <TableCell>{item.action.replace('_', ' ')}</TableCell>
                    <TableCell>{item.user_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );

      default:
        return (
          <div className="border rounded-md p-4 mt-4 text-center">
            <p className="text-sm text-muted-foreground">Select report options above to preview data.</p>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Generate and download reports about your assets
        </p>
      </div>
      
      <Tabs defaultValue="standard">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="standard">Standard Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="standard" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {reportTypes.map((report) => (
              <Card 
                key={report.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${reportType === report.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setReportType(report.id)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-4">
                      {report.icon}
                    </div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Report Options</CardTitle>
              <CardDescription>Configure and generate your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Format</label>
                    <Select 
                      value={reportOptions.format} 
                      onValueChange={(value) => setReportOptions({...reportOptions, format: value as ReportFormat})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Date Range</label>
                    <Select 
                      value={reportOptions.dateRange}
                      onValueChange={(value) => setReportOptions({...reportOptions, dateRange: value as DateRange})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="year">Past Year</SelectItem>
                        <SelectItem value="quarter">Past Quarter</SelectItem>
                        <SelectItem value="month">Past Month</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Group By</label>
                    <Select 
                      value={reportOptions.groupBy}
                      onValueChange={(value) => setReportOptions({...reportOptions, groupBy: value as GroupBy})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grouping" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Grouping</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="department">Department</SelectItem>
                        <SelectItem value="location">Location</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center p-6">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="p-6 text-center text-red-500">
                    Error loading report data. Please try again.
                  </div>
                ) : (
                  renderReportPreview()
                )}
                
                <div className="flex justify-end">
                  <Button 
                    disabled={isGenerating}
                    onClick={handleGenerateReport}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Build your own custom reports by selecting fields and filters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Report Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Report Name</label>
                      <input 
                        type="text" 
                        placeholder="Enter report name" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <input 
                        type="text" 
                        placeholder="Enter description" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Select Data Source</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center">
                        <input type="radio" name="dataSource" className="mr-2" defaultChecked />
                        <label>Assets</label>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center">
                        <input type="radio" name="dataSource" className="mr-2" />
                        <label>Users</label>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center">
                        <input type="radio" name="dataSource" className="mr-2" />
                        <label>Asset History</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Select Columns</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      'Name', 'ID', 'Category', 'Status', 'Purchase Date', 'Warranty Date', 
                      'Location', 'Assigned To', 'Department', 'Value', 'Serial Number', 'Model'
                    ].map((field) => (
                      <div key={field} className="flex items-center">
                        <input type="checkbox" id={field} className="mr-2" defaultChecked />
                        <label htmlFor={field}>{field}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Add Filters</h3>
                  <Button variant="outline">
                    Add Filter
                  </Button>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline"
                    onClick={handleSaveCustomReport}
                  >
                    Save Report
                  </Button>
                  <Button className="bg-primary" onClick={handleGenerateReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {savedReports.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Saved Reports</CardTitle>
                <CardDescription>Your previously saved report configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedReports.map((report: any) => (
                    <div key={report.id} className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                      <h3 className="font-medium">{report.name}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-muted-foreground">
                          Created: {format(new Date(report.createdAt), 'MMM d, yyyy')}
                        </span>
                        <Button size="sm" variant="ghost">Run</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
