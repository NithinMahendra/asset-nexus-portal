
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardStats, getCategoryBreakdown, getAssetsByStatus, assets } from '@/services/mockData';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Package, Users, AlertTriangle, Check, Clock, TrendingUp } from 'lucide-react';
import { AssetStatus, AssetCategory, CategoryBreakdown } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getAllAssets } from '@/lib/supabase-utils';
import { getAllUsers } from '@/lib/supabase-utils';

const statusColors: Record<AssetStatus, string> = {
  available: 'bg-status-available',
  assigned: 'bg-status-assigned',
  repair: 'bg-status-repair',
  retired: 'bg-status-retired'
};

const statusTextColors: Record<AssetStatus, string> = {
  available: 'text-status-available',
  assigned: 'text-status-assigned',
  repair: 'text-status-repair',
  retired: 'text-status-retired'
};

const Dashboard = () => {
  const [stats, setStats] = useState(getDashboardStats());
  const [categoryData, setCategoryData] = useState(getCategoryBreakdown());
  const [recentAssets, setRecentAssets] = useState(
    [...assets].sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()).slice(0, 5)
  );
  const [loading, setLoading] = useState(true);

  // Fetch live data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get assets and users from Supabase
        const assetsData = await getAllAssets();
        const usersData = await getAllUsers();
        
        if (assetsData && usersData) {
          // Calculate new stats based on real data
          const totalAssets = assetsData.length;
          const availableAssets = assetsData.filter(asset => asset.status === 'available').length;
          const assignedAssets = assetsData.filter(asset => asset.status === 'assigned').length;
          const repairAssets = assetsData.filter(asset => asset.status === 'repair').length;
          const retiredAssets = assetsData.filter(asset => asset.status === 'retired').length;
          
          // Calculate total value
          const assetsValueTotal = assetsData.reduce((sum, asset) => sum + (asset.value || 0), 0);
          
          // Calculate recent assignments (last 30 days)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const recentlyAssigned = assetsData.filter(asset => 
            asset.assignedDate && new Date(asset.assignedDate) > thirtyDaysAgo
          ).length;
          
          // Calculate expiring warranties
          const today = new Date();
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(today.getDate() + 30);
          
          const warrantyExpiringCount = assetsData.filter(asset =>
            asset.warrantyExpiry && 
            new Date(asset.warrantyExpiry) > today && 
            new Date(asset.warrantyExpiry) < thirtyDaysFromNow
          ).length;
          
          // Update stats
          setStats({
            totalAssets,
            availableAssets,
            assignedAssets, 
            repairAssets,
            retiredAssets,
            assetsValueTotal,
            recentlyAssigned,
            usersCount: usersData.length,
            warrantyExpiringCount
          });
          
          // Update recent assets
          const sortedRecentAssets = [...assetsData]
            .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
            .slice(0, 5);
          setRecentAssets(sortedRecentAssets);
          
          // Update category breakdown
          const categories = {};
          assetsData.forEach(asset => {
            if (!categories[asset.category]) {
              categories[asset.category] = 0;
            }
            categories[asset.category]++;
          });
          
          // Fix: Cast the string category to AssetCategory type to satisfy TypeScript
          const newCategoryData = Object.entries(categories).map(([category, count]) => ({
            category: category as AssetCategory, // Type casting here
            count: count as number,
            percentage: Math.round(((count as number) / totalAssets) * 100)
          }));
          
          setCategoryData(newCategoryData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Status distribution data for pie chart
  const statusData = [
    { name: 'Available', value: stats.availableAssets, color: '#10b981' },
    { name: 'Assigned', value: stats.assignedAssets, color: '#3b82f6' },
    { name: 'Repair', value: stats.repairAssets, color: '#f59e0b' },
    { name: 'Retired', value: stats.retiredAssets, color: '#6b7280' },
  ];

  // Mock data for monthly assets acquisition (for bar chart)
  const monthlyData = [
    { name: 'Jan', assets: 5 },
    { name: 'Feb', assets: 8 },
    { name: 'Mar', assets: 3 },
    { name: 'Apr', assets: 10 },
    { name: 'May', assets: 7 },
    { name: 'Jun', assets: 5 },
    { name: 'Jul', assets: 9 },
    { name: 'Aug', assets: 12 },
    { name: 'Sep', assets: 6 },
    { name: 'Oct', assets: 8 },
    { name: 'Nov', assets: 15 },
    { name: 'Dec', assets: 4 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all asset management statistics and recent activity.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssets}</div>
            <p className="text-xs text-muted-foreground">Total inventory value: ${stats.assetsValueTotal.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recently Assigned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentlyAssigned}</div>
            <p className="text-xs text-muted-foreground">Assets assigned in the last 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usersCount}</div>
            <p className="text-xs text-muted-foreground">Active users in the system</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Warranty Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.warrantyExpiringCount}</div>
            <p className="text-xs text-muted-foreground">Warranties expiring in 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Asset Status Distribution</CardTitle>
            <CardDescription>Overview of all assets by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} Assets`, name]}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Monthly Asset Acquisition</CardTitle>
            <CardDescription>New assets added each month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} Assets`, 'Acquired']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Bar dataKey="assets" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assets */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Added Assets</CardTitle>
          <CardDescription>The latest additions to your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left font-medium">Name</th>
                  <th className="py-3 px-4 text-left font-medium">Category</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-left font-medium">Purchase Date</th>
                  <th className="py-3 px-4 text-left font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {recentAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-border">
                    <td className="py-3 px-4">{asset.name}</td>
                    <td className="py-3 px-4 capitalize">{asset.category}</td>
                    <td className="py-3 px-4">
                      <Badge className={cn(statusColors[asset.status as AssetStatus], "text-white")}>
                        {asset.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{new Date(asset.purchaseDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">${asset.value?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Assets by Category</CardTitle>
          <CardDescription>Distribution of assets across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryData.map((category) => (
              <div key={category.category} className="bg-secondary rounded-lg p-4">
                <div className="text-sm font-medium capitalize">{category.category}</div>
                <div className="mt-1 text-2xl font-bold">{category.count}</div>
                <div className="text-xs text-muted-foreground">{category.percentage}% of total</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
