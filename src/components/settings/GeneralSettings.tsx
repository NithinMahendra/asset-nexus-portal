
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SettingsCard from './SettingsCard';
import SettingsToggle from './SettingsToggle';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

const GeneralSettings = () => {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');

  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <SettingsCard
      title="General Settings"
      description="Configure basic system settings"
    >
      <div className="space-y-6">
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
            <SelectContent position="popper" className="bg-white dark:bg-gray-900">
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
            <SelectContent position="popper" className="bg-white dark:bg-gray-900">
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
            <SelectContent position="popper" className="bg-white dark:bg-gray-900">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <SettingsToggle 
          id="dark-mode"
          label="Dark Mode"
          description="Enable dark theme for the interface"
          checked={isDarkMode}
          onCheckedChange={handleDarkModeToggle}
          secondaryIcon={<Sun className="h-4 w-4 text-muted-foreground" />}
          icon={<Moon className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
    </SettingsCard>
  );
};

export default GeneralSettings;
