
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import SettingsCard from './SettingsCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

const TabsNavigationSettings = () => {
  const [activeTab, setActiveTab] = useState('primary');
  const [defaultPage, setDefaultPage] = useState('/dashboard');
  
  return (
    <SettingsCard
      title="Navigation Settings"
      description="Configure sidebar and navigation menu behavior"
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="primary">Primary Navigation</TabsTrigger>
            <TabsTrigger value="sidebar">Sidebar Settings</TabsTrigger>
            <TabsTrigger value="defaults">Default Pages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="primary" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Main Navigation Items</h3>
              <p className="text-sm text-muted-foreground">
                Configure which items appear in the main navigation
              </p>
              
              <div className="space-y-2 mt-4">
                {[
                  { name: 'Dashboard', enabled: true },
                  { name: 'Assets', enabled: true },
                  { name: 'Users', enabled: true },
                  { name: 'Notifications', enabled: true },
                  { name: 'Reports', enabled: true },
                  { name: 'Settings', enabled: true },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 border rounded-md">
                    <span>{item.name}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button variant={item.enabled ? "default" : "secondary"} size="sm">
                        {item.enabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sidebar" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Sidebar Display</h3>
              <p className="text-sm text-muted-foreground">
                Configure how the sidebar behaves
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Default State</h4>
                  <div className="flex gap-2">
                    <Button variant="outline">Collapsed</Button>
                    <Button>Expanded</Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Remember State</h4>
                  <div className="flex gap-2">
                    <Button>On</Button>
                    <Button variant="outline">Off</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="defaults" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Default Pages</h3>
              <p className="text-sm text-muted-foreground">
                Set which page loads by default in different scenarios
              </p>
              
              <div className="space-y-4 mt-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">After Login</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['/dashboard', '/assets', '/users', '/reports'].map((page) => (
                      <Button
                        key={page}
                        variant={defaultPage === page ? "default" : "outline"}
                        onClick={() => setDefaultPage(page)}
                        className="justify-start"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">Navigation Menu Preview</h3>
          <div className="border rounded-md p-4 bg-card">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">Asset Management</div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Track and manage your organization's assets.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {[
                        { title: "Assets", description: "Manage your organization's assets" },
                        { title: "Users", description: "Manage system users and permissions" },
                      ].map((component) => (
                        <li key={component.title}>
                          <NavigationMenuLink asChild>
                            <a
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              href="/"
                            >
                              <div className="text-sm font-medium leading-none">{component.title}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {component.description}
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
};

export default TabsNavigationSettings;
