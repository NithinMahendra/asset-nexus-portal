
import { useState } from 'react';
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
  Users
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('asset-inventory');
  
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
            {[
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
                icon: <FileText className="h-8 w-8" />
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
                icon: <FileText className="h-8 w-8" />
              },
            ].map((report) => (
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
                    <Select defaultValue="pdf">
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
                    <Select defaultValue="all">
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
                    <Select defaultValue="none">
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
                
                <div className="flex justify-end">
                  <Button className="bg-primary">
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
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
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <input 
                        type="text" 
                        placeholder="Enter description" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Select Data Source</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center">
                        <input type="radio" name="dataSource" className="mr-2" checked />
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
                  <Button variant="outline">
                    Save Report
                  </Button>
                  <Button className="bg-primary">
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
