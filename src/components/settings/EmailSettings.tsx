
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SettingsCard from './SettingsCard';

const EmailSettings = () => {
  return (
    <SettingsCard
      title="Email Settings"
      description="Configure email notifications and templates"
    >
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
    </SettingsCard>
  );
};

export default EmailSettings;
