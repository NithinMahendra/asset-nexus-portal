
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ReactNode } from 'react';

interface SettingsToggleProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: ReactNode;
  secondaryIcon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

const SettingsToggle = ({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  icon,
  secondaryIcon,
  className,
  disabled = false
}: SettingsToggleProps) => {
  return (
    <div className={`flex items-center justify-between space-x-4 border p-4 rounded-md ${className || ''}`}>
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          {icon}
          <Label className="text-base" htmlFor={id}>{label}</Label>
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center space-x-2">
        {secondaryIcon && secondaryIcon}
        <Switch 
          id={id} 
          checked={checked} 
          onCheckedChange={onCheckedChange} 
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default SettingsToggle;
