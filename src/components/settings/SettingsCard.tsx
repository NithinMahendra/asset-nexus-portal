
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

interface SettingsCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footer?: ReactNode;
  actions?: ReactNode;
}

const SettingsCard = ({ 
  title, 
  description, 
  children, 
  className,
  contentClassName,
  headerClassName,
  footer,
  actions
}: SettingsCardProps) => {
  return (
    <Card className={className}>
      <CardHeader className={headerClassName}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export default SettingsCard;
