import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Users, QrCode, BarChart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '@/lib/audit-utils';
import { getMaintenanceSchedules } from '@/lib/maintenance-utils';
import { useToast } from '@/components/ui/use-toast';
import RoleBasedAccess from '@/components/RoleBasedAccess';

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  
  const { data: auditLogs, isLoading: isLoadingAuditLogs, error: auditLogsError } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: getAuditLogs,
  });
  
  const { data: maintenanceSchedules, isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ['maintenanceSchedules'],
    queryFn: getMaintenanceSchedules,
  });
  
  return (
    <RoleBasedAccess
      allowedRoles={['admin']}
      fallback={
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access the admin dashboard.
          </AlertDescription>
        </Alert>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="asset-workflow">Asset Workflow</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="qr-codes">QR Code Generator</TabsTrigger>
            <TabsTrigger value="analytics">System Analytics</TabsTrigger>
            <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12</div>
                  <p className="text-xs text-muted-foreground">
                    Active users in system
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Maintenance Items</CardTitle>
                  <QrCode className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoadingMaintenance ? '...' : maintenanceSchedules?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Scheduled maintenance items
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Audit Items</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoadingAuditLogs ? '...' : auditLogs?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Audit log entries
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Recent system-wide activity and changes
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[300px]">
                {isLoadingAuditLogs ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Loading audit logs...</p>
                  </div>
                ) : auditLogsError ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-destructive">Error loading audit logs</p>
                  </div>
                ) : auditLogs && auditLogs.length > 0 ? (
                  <ul className="space-y-2">
                    {auditLogs.slice(0, 5).map((log) => (
                      <li key={log.id} className="border-b pb-2">
                        <p className="text-sm font-medium">{log.operation} on {log.tableName}</p>
                        <p className="text-xs text-muted-foreground">
                          Record ID: {log.recordId} • {new Date(log.changedAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No audit logs found</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">View All Logs</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage system users, assign roles, and set permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management panel will be implemented here</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Export Users</Button>
                <Button>Add New User</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="asset-workflow" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Asset Workflow Approvals</CardTitle>
                <CardDescription>
                  Approve or reject pending asset assignment requests from employees.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Workflow approvals UI will allow admins to review, approve, or reject requests here.
                </p>
                <div className="mt-4 flex gap-2">
                  <Button disabled>Approve</Button>
                  <Button variant="destructive" disabled>Reject</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Asset Financial Overview</CardTitle>
                <CardDescription>
                  See aggregate purchase cost, depreciation, and budget highlights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Financial reporting UI coming soon. This will show purchase costs, depreciation, and budgets.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="qr-codes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Generator</CardTitle>
                <CardDescription>
                  Generate QR codes for assets in bulk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">QR code generation panel will be implemented here</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Select Assets</Button>
                <Button>Generate QR Codes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Analytics</CardTitle>
                <CardDescription>
                  View system-wide analytics and metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[300px]">
                <p className="text-muted-foreground">Analytics dashboard will be implemented here</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Export Reports</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="audit-logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>
                  View and export system audit logs
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[300px]">
                {isLoadingAuditLogs ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Loading audit logs...</p>
                  </div>
                ) : auditLogsError ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-destructive">Error loading audit logs</p>
                  </div>
                ) : auditLogs && auditLogs.length > 0 ? (
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted">
                        <tr>
                          <th scope="col" className="px-6 py-3">Operation</th>
                          <th scope="col" className="px-6 py-3">Table</th>
                          <th scope="col" className="px-6 py-3">Record ID</th>
                          <th scope="col" className="px-6 py-3">Changed By</th>
                          <th scope="col" className="px-6 py-3">Changed At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogs.map((log) => (
                          <tr key={log.id} className="bg-card border-b">
                            <td className="px-6 py-4">{log.operation}</td>
                            <td className="px-6 py-4">{log.tableName}</td>
                            <td className="px-6 py-4">{log.recordId}</td>
                            <td className="px-6 py-4">{log.changedBy || 'System'}</td>
                            <td className="px-6 py-4">{new Date(log.changedAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No audit logs found</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline">Export Logs</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  Generate and export system reports by asset, user, or time period.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Custom reporting builder and export options coming soon.
                </p>
                <Button variant="outline" size="sm" disabled>
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleBasedAccess>
  );
};

export default AdminDashboard;
