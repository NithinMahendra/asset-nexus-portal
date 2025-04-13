
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SettingsCard from './SettingsCard';

const CompanySettings = () => {
  return (
    <>
      <SettingsCard
        title="Company Information"
        description="Update your company details"
      >
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
              <SelectContent position="popper" className="bg-white dark:bg-gray-900">
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
      </SettingsCard>
      
      <SettingsCard
        title="Departments"
        description="Manage company departments"
      >
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
      </SettingsCard>
    </>
  );
};

export default CompanySettings;
