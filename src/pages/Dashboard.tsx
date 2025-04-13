
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardStats, getCategoryBreakdown, getAssetsByStatus, assets } from '@/services/mockData';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Package, Users, AlertTriangle, Check, Clock, TrendingUp } from 'lucide-react';
import { AssetStatus, AssetCategory, CategoryBreakdown } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getAllAssets } from '@/lib/supabase-utils';
import MonthlyAcquisitionChart from '@/components/dashboard/MonthlyAcquisitionChart';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B'];

const statusColors = {
  available: 'bg-green-500',
  assigned: 'bg-blue-500',
  maintenance: 'bg-yellow-500',
  retired: 'bg-gray-500',
  lost: 'bg-red-500',
};

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalUsers: 0,
    needsAttention: 0,
    utilization: 0
  });
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([]);
  const [statusData, setStatusData] = useState<{ name: string, value: number }[]>([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch real assets from Supabase
        const realAssets = await getAllAssets();
        
        if (realAssets && realAssets.length > 0) {
          // Calculate stats
          const totalAssets = realAssets.length;
          const assignedAssets = realAssets.filter(asset => asset.status === 'assigned').length;
          // Fix: Change 'maintenance' to 'repair' to match AssetStatus type
          const maintenanceAssets = realAssets.filter(asset => asset.status === 'repair').length;
          const utilization = Math.round((assignedAssets / totalAssets) * 100);
          
          setStats({
            totalAssets,
            totalUsers: assignedAssets, // This is an approximation; you might want to fetch actual users
            needsAttention: maintenanceAssets,
            utilization
          });
          
          // Calculate status breakdown
          const statusCounts: Record<string, number> = {};
          
          realAssets.forEach(asset => {
            if (!statusCounts[asset.status]) {
              statusCounts[asset.status] = 0;
            }
            statusCounts[asset.status]++;
          });
          
          const newStatusData = Object.entries(statusCounts).map(([name, value]) => ({
            name,
            value
          }));
          
          setStatusData(newStatusData);
          
          // Calculate category breakdown
          const categories: Record<string, number> = {};
          
          realAssets.forEach(asset => {
            if (!categories[asset.category]) {
              categories[asset.category] = 0;
            }
            categories[asset.category]++;
          });
          
          // Fix: Properly cast the category to AssetCategory type
          const newCategoryData: CategoryBreakdown[] = Object.entries(categories).map(([category, count]) => ({
            category: category as AssetCategory,
            count: count,
            percentage: Math.round((count / totalAssets) * 100)
          }));
          
          setCategoryData(newCategoryData);
        } else {
          // If no real data, fall back to mock data
          const mockStats = getDashboardStats();
          setStats({
            totalAssets: mockStats.totalAssets,
            totalUsers: mockStats.usersCount,
            needsAttention: mockStats.repairAssets,
            utilization: Math.round((mockStats.assignedAssets / mockStats.totalAssets) * 100)
          });
          setCategoryData(getCategoryBreakdown());
          setStatusData(getAssetsByStatus());
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Fall back to mock data on error
        const mockStats = getDashboardStats();
        setStats({
          totalAssets: mockStats.totalAssets,
          totalUsers: mockStats.usersCount,
          needsAttention: mockStats.repairAssets,
          utilization: Math.round((mockStats.assignedAssets / mockStats.totalAssets) * 100)
        });
        setCategoryData(getCategoryBreakdown());
        setStatusData(getAssetsByStatus());
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's a summary of your asset management system.
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
              <p className="text-3xl font-bold">{stats.totalAssets}</p>
            </div>
            <Package className="h-10 w-10 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users className="h-10 w-10 text-purple-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Needs Attention</p>
              <p className="text-3xl font-bold">{stats.needsAttention}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-yellow-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Utilization</p>
              <p className="text-3xl font-bold">{stats.utilization}%</p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-500" />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Monthly Acquisition Chart */}
        <MonthlyAcquisitionChart />
        
        <Card className="col-span-3 lg:col-span-1">
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
            <CardDescription>Distribution of assets by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} assets`, 'Count']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Distribution of assets by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => {
                      return [`${value} assets (${props.payload.percentage}%)`, 'Count'];
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Assets</CardTitle>
            <CardDescription>Recently added or updated assets</CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-auto">
            <div className="space-y-4">
              {assets.slice(0, 5).map((asset) => (
                <div key={asset.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-muted-foreground text-sm">{asset.serialNumber || 'No serial'}</p>
                  </div>
                  <Badge className={cn(statusColors[asset.status as keyof typeof statusColors] || 'bg-gray-500')}>
                    {asset.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
