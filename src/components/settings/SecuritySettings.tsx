
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import SettingsCard from './SettingsCard';

const SecuritySettings = () => {
  return (
    <SettingsCard
      title="Security Settings"
      description="Configure security and access controls"
    >
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
    </SettingsCard>
  );
};

export default SecuritySettings;
