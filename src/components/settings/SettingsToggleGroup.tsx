
import { ReactNode } from 'react';
import SettingsToggle from './SettingsToggle';

interface ToggleItem {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: ReactNode;
  secondaryIcon?: ReactNode;
  disabled?: boolean;
}

interface SettingsToggleGroupProps {
  title: string;
  description?: string;
  items: ToggleItem[];
  className?: string;
}

const SettingsToggleGroup = ({
  title,
  description,
  items,
  className
}: SettingsToggleGroupProps) => {
  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="space-y-1">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      
      <div className="space-y-2">
        {items.map((item) => (
          <SettingsToggle
            key={item.id}
            id={item.id}
            label={item.label}
            description={item.description}
            checked={item.checked}
            onCheckedChange={item.onCheckedChange}
            icon={item.icon}
            secondaryIcon={item.secondaryIcon}
            disabled={item.disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default SettingsToggleGroup;
