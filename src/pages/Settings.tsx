
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Globe, Layers, Bell, Shield, Database, Mail } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import GeneralSettings from '@/components/settings/GeneralSettings';
import CompanySettings from '@/components/settings/CompanySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import DataManagementSettings from '@/components/settings/DataManagementSettings';
import EmailSettings from '@/components/settings/EmailSettings';

const SettingsPage = () => {
  const [isSettingsSaved, setIsSettingsSaved] = useState(false);
  const [tabValue, setTabValue] = useState('general');

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your system preferences and settings
          </p>
        </div>
        
        {/* Always show top tabs for general/company sections */}
        <Tabs value={tabValue} onValueChange={setTabValue} className="mt-4 md:mt-0">
          <TabsList className="flex justify-end gap-2 bg-white dark:bg-gray-900 rounded-lg border border-border px-2 py-1 shadow-sm">
            <TabsTrigger 
              value="general" 
              className={`flex items-center px-3 ${tabValue==='general' ? 'font-bold' : ''}`}
            >
              <Globe className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger 
              value="company" 
              className={`flex items-center px-3 ${tabValue==='company' ? 'font-bold' : ''}`}
            >
              <Layers className="h-4 w-4 mr-2" />
              Company
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 flex-shrink-0 pt-6"> {/* Added padding top for spacing */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-1">
              <TabsList className="flex flex-col w-full space-y-2 md:space-y-3">
                {/* Removed General and Company tabs from the sidebar */}
                <TabsTrigger 
                  value="notifications" 
                  className="w-full justify-start text-left px-3 text-base font-semibold"
                >
                  <Bell className="h-5 w-5 mr-3" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="w-full justify-start text-left px-3 text-base font-semibold"
                >
                  <Shield className="h-5 w-5 mr-3" />
                  Security
                </TabsTrigger>
                <TabsTrigger 
                  value="data" 
                  className="w-full justify-start text-left px-3 text-base font-semibold"
                >
                  <Database className="h-5 w-5 mr-3" />
                  Data Management
                </TabsTrigger>
                <TabsTrigger 
                  value="email" 
                  className="w-full justify-start text-left px-3 text-base font-semibold"
                >
                  <Mail className="h-5 w-5 mr-3" />
                  Email Settings
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <div className="flex-1">
            <TabsContent value="general" className="mt-0 space-y-6">
              <GeneralSettings />
            </TabsContent>
            
            <TabsContent value="company" className="mt-0 space-y-6">
              <CompanySettings />
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6 mt-0">
              <NotificationSettings />
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6 mt-0">
              <SecuritySettings />
            </TabsContent>
            
            <TabsContent value="data" className="space-y-6 mt-0">
              <DataManagementSettings />
            </TabsContent>
            
            <TabsContent value="email" className="space-y-6 mt-0">
              <EmailSettings />
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
