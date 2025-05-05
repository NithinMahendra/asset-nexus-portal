
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getCategoryBreakdown } from '@/services/mockData';
import { DashboardStats } from '@/types';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { QrCode } from 'lucide-react';
import MonthlyAcquisitionChart from '@/components/dashboard/MonthlyAcquisitionChart';
import AssetQRScanner from '@/components/assets/AssetQRScanner';
import { useAuth } from '@/providers/AuthProvider';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const { userRole } = useAuth();
  
  // Listen for the custom event to open the scanner
  useEffect(() => {
    const handleOpenScanner = () => {
      setIsQRScannerOpen(true);
    };
    
    window.addEventListener('openAssetScanner', handleOpenScanner);
    
    return () => {
      window.removeEventListener('openAssetScanner', handleOpenScanner);
    };
  }, []);
  
  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats
  });

  const { data: categoryBreakdown } = useQuery({
    queryKey: ['categoryBreakdown'],
    queryFn: getCategoryBreakdown
  });

  useEffect(() => {
    if (dashboardStats) {
      setStats(dashboardStats);
    }
  }, [dashboardStats]);

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
    '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
  ];

  if (isLoading || !stats) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Status cards data
  const statusCards = [
    { title: 'Available', value: stats.availableAssets, color: 'bg-green-100' },
    { title: 'Assigned', value: stats.assignedAssets, color: 'bg-blue-100' },
    { title: 'In Repair', value: stats.repairAssets, color: 'bg-orange-100' },
    { title: 'Retired', value: stats.retiredAssets, color: 'bg-gray-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your asset management dashboard
          </p>
        </div>
        
        {/* QR Code Scanner Button */}
        <Button 
          onClick={() => setIsQRScannerOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <QrCode className="mr-2 h-5 w-5" />
          Scan Asset QR Code
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statusCards.map((card) => (
          <Card key={card.title} className={`${card.color}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{card.title} Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Asset Value Card */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Asset Value</CardTitle>
            <CardDescription>Total value of all assets</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-4xl font-bold mb-4">
              {formatCurrency(stats.assetsValueTotal)}
            </div>
            <MonthlyAcquisitionChart />
          </CardContent>
        </Card>

        {/* Asset Categories */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Asset Categories</CardTitle>
            <CardDescription>Breakdown by category</CardDescription>
          </CardHeader>
          <CardContent className="p-1">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <div className="flex">
                  <div className="w-1/2">
                    <PieChart width={200} height={300}>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="category"
                      >
                        {categoryBreakdown?.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip
                        formatter={(value, name) => {
                          return [`${value} assets`, name];
                        }}
                      />
                    </PieChart>
                  </div>
                  <div className="w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={categoryBreakdown}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 60,
                          bottom: 5,
                        }}
                      >
                        <XAxis type="number" />
                        <YAxis 
                          dataKey="category" 
                          type="category" 
                          width={100} 
                          tick={{ fontSize: 12 }} 
                        />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8">
                          {categoryBreakdown?.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Users and Recent Activity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="text-muted-foreground">Total Users</span>
                <p className="text-2xl font-bold">{stats.usersCount}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Recently Assigned</span>
                <p className="text-2xl font-bold">{stats.recentlyAssigned}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warranty Expiring */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Warranty Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="text-muted-foreground">Expiring Soon</span>
                <p className="text-2xl font-bold">{stats.warrantyExpiringCount}</p>
              </div>
              <Button variant="outline" className="w-full">View Details</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Scanner Modal */}
      <AssetQRScanner 
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
