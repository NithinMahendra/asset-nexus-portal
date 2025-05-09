
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Bell, 
  FileText, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  CreditCard,
  Shield
} from 'lucide-react';
import RoleBasedAccess from '../RoleBasedAccess';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Assets', path: '/assets', icon: <Package className="h-5 w-5" /> },
    { name: 'Users', path: '/users', icon: <Users className="h-5 w-5" /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell className="h-5 w-5" /> },
    { name: 'Reports', path: '/reports', icon: <FileText className="h-5 w-5" /> },
    { 
      name: 'Enterprise', 
      path: '/enterprise', 
      icon: <Shield className="h-5 w-5" />,
      roles: ['admin', 'employee']
    },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <div 
      className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <div className={cn("flex items-center", isOpen ? "justify-between w-full" : "justify-center")}>
          {isOpen && (
            <Link to="/" className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6 text-sidebar-primary" />
              <span className="text-xl font-bold">AssetNexus</span>
            </Link>
          )}
          {!isOpen && (
            <Link to="/" className="flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-sidebar-primary" />
            </Link>
          )}
          
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-sidebar-accent text-sidebar-foreground focus:outline-none"
          >
            {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {navigationItems.map((item) => (
            <React.Fragment key={item.path}>
              {item.roles ? (
                <RoleBasedAccess allowedRoles={item.roles}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md transition-all",
                      location.pathname === item.path
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent",
                      !isOpen && "justify-center"
                    )}
                  >
                    {item.icon}
                    {isOpen && <span className="ml-3">{item.name}</span>}
                  </Link>
                </RoleBasedAccess>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-all",
                    location.pathname === item.path
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent",
                    !isOpen && "justify-center"
                  )}
                >
                  {item.icon}
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-all w-full",
            !isOpen && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5" />
          {isOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
