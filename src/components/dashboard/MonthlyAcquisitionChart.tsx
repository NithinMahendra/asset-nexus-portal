
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMonthlyAssetAcquisitions } from '@/lib/supabase-utils';

type MonthlyData = {
  month: string;
  count: number;
}

const MonthlyAcquisitionChart = () => {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const monthlyData = await getMonthlyAssetAcquisitions(year);
      setData(monthlyData);
      setIsLoading(false);
    };

    fetchData();
  }, [year]);

  // Abbreviated month names for better display
  const formatMonth = (monthName: string) => {
    return monthName.substring(0, 3);
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Monthly Asset Acquisition</CardTitle>
        <CardDescription>Number of assets acquired each month in {year}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <p>Loading chart data...</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={formatMonth}
                  height={40}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) => `${label} ${year}`}
                  formatter={(value) => [`${value} assets`, 'Acquired']}
                />
                <Bar 
                  dataKey="count" 
                  name="Assets Acquired" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyAcquisitionChart;
