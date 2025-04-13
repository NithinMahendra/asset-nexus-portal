
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import SettingsCard from './SettingsCard';

const NotificationSettings = () => {
  return (
    <SettingsCard
      title="Notification Settings"
      description="Configure when and how you receive notifications"
    >
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
    </SettingsCard>
  );
};

export default NotificationSettings;
