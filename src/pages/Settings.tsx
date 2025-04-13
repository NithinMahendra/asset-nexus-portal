
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
