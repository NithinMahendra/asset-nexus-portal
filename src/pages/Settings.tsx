import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Save, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Layers, 
  Mail, 
  AlertTriangle,
  FileText,
  Globe,
  Moon,
  Sun
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useTheme } from '@/providers/ThemeProvider';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
  const [isSettingsSaved, setIsSettingsSaved] = useState(false);

  useEffect(() => {
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    setTheme(checked ? 'dark' : 'light');
  };

  const handleSaveSettings = () => {
    setIsSettingsSaved(true);
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully."
    });

    setTimeout(() => {
      setIsSettingsSaved(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your system preferences and settings
        </p>
      </div>
      
      <Tabs defaultValue="general">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-1">
              <TabsList className="flex flex-col w-full space-y-1">
                <TabsTrigger value="general" className="w-full justify-start text-left px-3">
                  <Globe className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="company" className="w-full justify-start text-left px-3">
                  <Layers className="h-4 w-4 mr-2" />
                  Company
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full justify-start text-left px-3">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="w-full justify-start text-left px-3">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="data" className="w-full justify-start text-left px-3">
                  <Database className="h-4 w-4 mr-2" />
                  Data Management
                </TabsTrigger>
                <TabsTrigger value="email" className="w-full justify-start text-left px-3">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Settings
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <div className="flex-1">
            <TabsContent value="general" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure basic system settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="system-name">System Name</Label>
                      <Input id="system-name" defaultValue="Asset Nexus" />
                    </div>
                    
                    <div>
                      <Label htmlFor="date-format">Date Format</Label>
                      <Select defaultValue="MM/DD/YYYY">
                        <SelectTrigger id="date-format">
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="UTC">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                          <SelectItem value="CST">Central Time (CST)</SelectItem>
                          <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                          <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between space-x-4 border p-4 rounded-md">
                      <div className="space-y-0.5">
                        <Label className="text-base" htmlFor="dark-mode">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Enable dark theme for the interface</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4 text-muted-foreground" />
                        <Switch 
                          id="dark-mode" 
                          checked={isDarkMode} 
                          onCheckedChange={handleDarkModeToggle}
                        />
                        <Moon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            
            <TabsContent value="company" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Update your company details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" defaultValue="Acme Corporation" />
                    </div>
                    
                    <div>
                      <Label htmlFor="company-address">Address</Label>
                      <Input id="company-address" defaultValue="123 Business Ave." />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="company-city">City</Label>
                        <Input id="company-city" defaultValue="San Francisco" />
                      </div>
                      <div>
                        <Label htmlFor="company-state">State/Province</Label>
                        <Input id="company-state" defaultValue="CA" />
                      </div>
                      <div>
                        <Label htmlFor="company-zip">Postal Code</Label>
                        <Input id="company-zip" defaultValue="94107" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="company-country">Country</Label>
                      <Select defaultValue="us">
                        <SelectTrigger id="company-country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="company-phone">Phone</Label>
                      <Input id="company-phone" defaultValue="(555) 123-4567" />
                    </div>
                    
                    <div>
                      <Label htmlFor="company-website">Website</Label>
                      <Input id="company-website" defaultValue="https://example.com" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Departments</CardTitle>
                  <CardDescription>Manage company departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border border-border rounded-md divide-y">
                      {['IT', 'Finance', 'Marketing', 'Sales', 'Operations'].map((dept) => (
                        <div key={dept} className="flex items-center justify-between p-3">
                          <span>{dept}</span>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="outline">
                      Add Department
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure when and how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">System Notifications</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Asset Assignments</Label>
                          <p className="text-sm text-muted-foreground">Notify when assets are assigned or unassigned</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Warranty Alerts</Label>
                          <p className="text-sm text-muted-foreground">Notify before warranties expire</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Maintenance Reminders</Label>
                          <p className="text-sm text-muted-foreground">Notify about scheduled maintenance</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>System Updates</Label>
                          <p className="text-sm text-muted-foreground">Notify about system updates and changes</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Methods</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>In-App Notifications</Label>
                          <p className="text-sm text-muted-foreground">Show notifications within the application</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Send notifications to user email addresses</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Timing</h3>
                      <div>
                        <Label>Warranty Alert Days</Label>
                        <div className="flex gap-2 items-center mt-1">
                          <Input type="number" defaultValue="30" className="w-20" />
                          <span>days before expiry</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Configure security and access controls</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Password Policy</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Minimum Password Length</Label>
                        </div>
                        <div className="w-20">
                          <Input type="number" defaultValue="8" min="6" max="32" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Require Special Characters</Label>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Require Numbers</Label>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Require Mixed Case</Label>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Password Expiry</Label>
                          <p className="text-sm text-muted-foreground">Force password reset after period</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input type="number" defaultValue="90" className="w-20" />
                          <span>days</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Login Settings</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Max Login Attempts</Label>
                          <p className="text-sm text-muted-foreground">Before temporary account lock</p>
                        </div>
                        <Input type="number" defaultValue="5" className="w-20" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Session Timeout</Label>
                          <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input type="number" defaultValue="30" className="w-20" />
                          <span>minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="data" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Configure backup and data settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Backup Settings</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Automatic Backups</Label>
                          <p className="text-sm text-muted-foreground">Enable scheduled backups</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Backup Frequency</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Backup Retention</Label>
                        <div className="flex items-center gap-2">
                          <Input type="number" defaultValue="30" className="w-20" />
                          <span>days</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="mt-2">
                        Run Manual Backup
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Data Export/Import</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          Export All Data
                        </Button>
                        
                        <Button variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          Import Data
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border border-red-200 rounded-md p-4 bg-red-50 dark:bg-red-900/20">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                        <div>
                          <h4 className="font-medium text-red-600 dark:text-red-400">Danger Zone</h4>
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1 mb-3">
                            These actions are destructive and cannot be undone.
                          </p>
                          
                          <Button variant="destructive">
                            Clear All Data
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="email" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Email Settings</CardTitle>
                  <CardDescription>Configure email notifications and templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">SMTP Configuration</h3>
                      
                      <div>
                        <Label htmlFor="smtp-server">SMTP Server</Label>
                        <Input id="smtp-server" defaultValue="smtp.example.com" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="smtp-port">Port</Label>
                          <Input id="smtp-port" defaultValue="587" />
                        </div>
                        
                        <div>
                          <Label htmlFor="smtp-encryption">Encryption</Label>
                          <Select defaultValue="tls">
                            <SelectTrigger id="smtp-encryption">
                              <SelectValue placeholder="Select encryption" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="ssl">SSL</SelectItem>
                              <SelectItem value="tls">TLS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="smtp-username">Username</Label>
                        <Input id="smtp-username" defaultValue="notifications@example.com" />
                      </div>
                      
                      <div>
                        <Label htmlFor="smtp-password">Password</Label>
                        <Input id="smtp-password" type="password" defaultValue="password" />
                      </div>
                      
                      <div>
                        <Label htmlFor="smtp-from">From Email</Label>
                        <Input id="smtp-from" defaultValue="asset-nexus@example.com" />
                      </div>
                      
                      <div>
                        <Label htmlFor="smtp-from-name">From Name</Label>
                        <Input id="smtp-from-name" defaultValue="Asset Nexus" />
                      </div>
                      
                      <Button variant="outline">
                        Test SMTP Connection
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Email Templates</h3>
                      
                      <div className="border border-border rounded-md divide-y">
                        {[
                          'Asset Assignment', 
                          'Warranty Expiry', 
                          'New User Welcome', 
                          'Password Reset', 
                          'Maintenance Notification'
                        ].map((template) => (
                          <div key={template} className="flex items-center justify-between p-3">
                            <span>{template}</span>
                            <Button variant="ghost" size="sm">Edit Template</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
      
      <div className="flex justify-end">
        <Button 
          className="bg-primary" 
          onClick={handleSaveSettings}
          disabled={isSettingsSaved}
        >
          {isSettingsSaved ? (
            <>Saved</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
