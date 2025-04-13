
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, FileText } from 'lucide-react';
import SettingsCard from './SettingsCard';

const DataManagementSettings = () => {
  return (
    <SettingsCard
      title="Data Management"
      description="Configure backup and data settings"
    >
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
    </SettingsCard>
  );
};

export default DataManagementSettings;
