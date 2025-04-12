
import { useState } from 'react';
import { getUserNotifications, currentUser } from '@/services/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, InfoIcon, AlertTriangle, Bell, CheckCheck } from 'lucide-react';
import { Notification } from '@/types';
import { cn } from '@/lib/utils';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(getUserNotifications(currentUser.id));
  const [filter, setFilter] = useState<Notification['type'] | 'all'>('all');
  
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);
  
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <InfoIcon className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getNotificationBackground = (type: Notification['type'], read: boolean) => {
    if (read) return '';
    
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/20';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20';
    }
  };
  
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(n => ({ ...n, read: true }))
    );
  };
  
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            View and manage your notifications
          </p>
        </div>
        <Button variant="outline" onClick={markAllAsRead}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          onClick={() => setFilter('all')}
          className="flex items-center"
        >
          <Bell className="mr-2 h-4 w-4" />
          All
        </Button>
        <Button 
          variant={filter === 'info' ? 'default' : 'outline'} 
          onClick={() => setFilter('info')}
          className="flex items-center text-blue-500"
        >
          <InfoIcon className="mr-2 h-4 w-4" />
          Info
        </Button>
        <Button 
          variant={filter === 'success' ? 'default' : 'outline'} 
          onClick={() => setFilter('success')}
          className="flex items-center text-green-500"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Success
        </Button>
        <Button 
          variant={filter === 'warning' ? 'default' : 'outline'} 
          onClick={() => setFilter('warning')}
          className="flex items-center text-amber-500"
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Warning
        </Button>
        <Button 
          variant={filter === 'error' ? 'default' : 'outline'} 
          onClick={() => setFilter('error')}
          className="flex items-center text-red-500"
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          Error
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Notifications</CardTitle>
          <CardDescription>
            {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "p-4 rounded-md border transition-colors",
                    getNotificationBackground(notification.type, notification.read)
                  )}
                >
                  <div className="flex">
                    <div className="mr-4 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        <div className="text-xs text-muted-foreground">
                          {new Date(notification.date).toLocaleString()}
                        </div>
                      </div>
                      <p className="text-sm mb-3">{notification.message}</p>
                      <div className="flex gap-3">
                        {notification.link && (
                          <Link 
                            to={notification.link} 
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            View Details
                          </Link>
                        )}
                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium mb-1">No notifications</h3>
              <p>You don't have any {filter !== 'all' ? filter : ''} notifications yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
