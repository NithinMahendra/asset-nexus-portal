
import { 
  Asset, 
  AssetHistory, 
  AssetStatus, 
  CategoryBreakdown, 
  DashboardStats, 
  Notification, 
  User, 
  UserRole 
} from '@/types';

// Mock users
export const users: User[] = [
  {
    id: 'user1',
    name: 'John Admin',
    email: 'john@nexusassets.com',
    phone: '123-456-7890',
    department: 'IT',
    role: 'super_admin',
    profileImageUrl: '/placeholder.svg',
  },
  {
    id: 'user2',
    name: 'Sarah Manager',
    email: 'sarah@nexusassets.com',
    phone: '123-456-7891',
    department: 'Operations',
    role: 'admin',
    profileImageUrl: '/placeholder.svg',
  },
  {
    id: 'user3',
    name: 'Mark Employee',
    email: 'mark@nexusassets.com',
    phone: '123-456-7892',
    department: 'Marketing',
    role: 'viewer',
    profileImageUrl: '/placeholder.svg',
  },
  {
    id: 'user4',
    name: 'Lisa Employee',
    email: 'lisa@nexusassets.com',
    phone: '123-456-7893',
    department: 'Sales',
    role: 'viewer',
    profileImageUrl: '/placeholder.svg',
  },
  {
    id: 'user5',
    name: 'Alex Manager',
    email: 'alex@nexusassets.com',
    phone: '123-456-7894',
    department: 'Finance',
    role: 'admin',
    profileImageUrl: '/placeholder.svg',
  },
];

// Generate mock assets
export const assets: Asset[] = [
  {
    id: 'asset1',
    name: 'MacBook Pro 16" 2023',
    category: 'laptop',
    status: 'assigned',
    purchaseDate: '2023-01-15',
    warrantyExpiry: '2026-01-15',
    location: 'Main Office',
    assignedTo: users[0],
    assignedDate: '2023-01-20',
    serialNumber: 'MB-2023-001',
    model: 'MacBook Pro 16 M2',
    description: 'High-performance laptop with 32GB RAM, 1TB SSD',
    value: 2499,
  },
  {
    id: 'asset2',
    name: 'Dell XPS 15',
    category: 'laptop',
    status: 'available',
    purchaseDate: '2022-11-10',
    warrantyExpiry: '2025-11-10',
    location: 'Storage Room',
    serialNumber: 'DL-2022-001',
    model: 'XPS 15 9520',
    description: '16GB RAM, 512GB SSD, Intel i7',
    value: 1799,
  },
  {
    id: 'asset3',
    name: 'iPhone 14 Pro',
    category: 'mobile',
    status: 'assigned',
    purchaseDate: '2023-02-05',
    warrantyExpiry: '2024-02-05',
    location: 'Main Office',
    assignedTo: users[2],
    assignedDate: '2023-02-10',
    serialNumber: 'IP-2023-001',
    model: 'iPhone 14 Pro 128GB',
    description: 'Space Black, 128GB storage',
    value: 999,
  },
  {
    id: 'asset4',
    name: 'Dell Monitor UltraSharp 27"',
    category: 'monitor',
    status: 'assigned',
    purchaseDate: '2022-10-18',
    warrantyExpiry: '2025-10-18',
    location: 'Main Office',
    assignedTo: users[1],
    assignedDate: '2022-10-25',
    serialNumber: 'MON-2022-001',
    model: 'U2720Q',
    description: '4K UHD, 27 inch monitor',
    value: 599,
  },
  {
    id: 'asset5',
    name: 'HP LaserJet Pro',
    category: 'printer',
    status: 'repair',
    purchaseDate: '2022-07-12',
    warrantyExpiry: '2024-07-12',
    location: 'Service Center',
    serialNumber: 'PR-2022-001',
    model: 'M404dn',
    description: 'Monochrome laser printer, paper jam issue',
    value: 349,
  },
  {
    id: 'asset6',
    name: 'Surface Pro 8',
    category: 'tablet',
    status: 'assigned',
    purchaseDate: '2023-03-05',
    warrantyExpiry: '2025-03-05',
    location: 'Main Office',
    assignedTo: users[3],
    assignedDate: '2023-03-10',
    serialNumber: 'SP-2023-001',
    model: 'Surface Pro 8 i7',
    description: '16GB RAM, 256GB SSD with keyboard cover',
    value: 1399,
  },
  {
    id: 'asset7',
    name: 'Adobe Creative Cloud License',
    category: 'software',
    status: 'assigned',
    purchaseDate: '2023-01-01',
    warrantyExpiry: '2024-01-01',
    assignedTo: users[2],
    assignedDate: '2023-01-05',
    serialNumber: 'SW-2023-001',
    description: 'Annual license for design team',
    value: 599,
  },
  {
    id: 'asset8',
    name: 'Logitech MX Master 3',
    category: 'peripheral',
    status: 'assigned',
    purchaseDate: '2023-04-10',
    warrantyExpiry: '2024-04-10',
    location: 'Main Office',
    assignedTo: users[0],
    assignedDate: '2023-04-15',
    serialNumber: 'PER-2023-001',
    model: 'MX Master 3',
    description: 'Wireless mouse',
    value: 99,
  },
  {
    id: 'asset9',
    name: 'Cisco Switch 24-Port',
    category: 'networking',
    status: 'available',
    purchaseDate: '2022-09-15',
    warrantyExpiry: '2027-09-15',
    location: 'Server Room',
    serialNumber: 'NET-2022-001',
    model: 'Catalyst 9200L',
    description: '24-port Gigabit Ethernet switch',
    value: 1899,
  },
  {
    id: 'asset10',
    name: 'Conference Room Table',
    category: 'other',
    status: 'available',
    purchaseDate: '2021-12-01',
    warrantyExpiry: '2026-12-01',
    location: 'Conference Room A',
    serialNumber: 'FUR-2021-001',
    model: 'Large oval conference table with cable management',
    description: 'Large oval conference table with cable management',
    value: 2499,
  },
  {
    id: 'asset11',
    name: 'Lenovo ThinkPad X1',
    category: 'laptop',
    status: 'assigned',
    purchaseDate: '2022-08-22',
    warrantyExpiry: '2025-08-22',
    location: 'Main Office',
    assignedTo: users[4],
    assignedDate: '2022-08-25',
    serialNumber: 'LT-2022-002',
    model: 'ThinkPad X1 Carbon Gen 10',
    description: '16GB RAM, 512GB SSD, Intel i7',
    value: 1699,
  },
  {
    id: 'asset12',
    name: 'Samsung Galaxy S23',
    category: 'mobile',
    status: 'repair',
    purchaseDate: '2023-03-01',
    warrantyExpiry: '2024-03-01',
    location: 'Service Center',
    serialNumber: 'SM-2023-001',
    model: 'Galaxy S23 Ultra',
    description: 'Screen cracked, sent for repair',
    value: 1199,
  },
  {
    id: 'asset13',
    name: 'Microsoft Office 365',
    category: 'software',
    status: 'available',
    purchaseDate: '2023-01-01',
    warrantyExpiry: '2024-01-01',
    serialNumber: 'SW-2023-002',
    description: 'Annual license for 50 users',
    value: 2500,
  },
  {
    id: 'asset14',
    name: 'Projector Epson',
    category: 'other',
    status: 'retired',
    purchaseDate: '2018-05-10',
    warrantyExpiry: '2020-05-10',
    location: 'Storage Room',
    serialNumber: 'PRJ-2018-001',
    model: 'PowerLite 1795F',
    description: 'Outdated projector, lamp issues',
    value: 899,
  },
  {
    id: 'asset15',
    name: 'Dell Precision Tower',
    category: 'desktop',
    status: 'assigned',
    purchaseDate: '2022-11-15',
    warrantyExpiry: '2025-11-15',
    location: 'Design Department',
    assignedTo: users[2],
    assignedDate: '2022-11-20',
    serialNumber: 'DT-2022-001',
    model: 'Precision 5820',
    description: 'Workstation with 64GB RAM, RTX 3080',
    value: 2999,
  },
];

// Mock asset history
export const assetHistory: AssetHistory[] = [
  {
    id: 'history1',
    assetId: 'asset1',
    action: 'created',
    date: '2023-01-15T10:30:00Z',
    userId: 'user1',
    userName: 'John Admin',
    details: 'Asset created and added to inventory',
  },
  {
    id: 'history2',
    assetId: 'asset1',
    action: 'assigned',
    date: '2023-01-20T14:45:00Z',
    userId: 'user1',
    userName: 'John Admin',
    details: 'Assigned to John Admin',
  },
  {
    id: 'history3',
    assetId: 'asset3',
    action: 'created',
    date: '2023-02-05T09:15:00Z',
    userId: 'user1',
    userName: 'John Admin',
    details: 'Asset created and added to inventory',
  },
  {
    id: 'history4',
    assetId: 'asset3',
    action: 'assigned',
    date: '2023-02-10T11:20:00Z',
    userId: 'user1',
    userName: 'John Admin',
    details: 'Assigned to Mark Employee',
  },
  {
    id: 'history5',
    assetId: 'asset5',
    action: 'status_changed',
    date: '2023-05-12T15:30:00Z',
    userId: 'user2',
    userName: 'Sarah Manager',
    details: 'Status changed from available to repair',
  },
  {
    id: 'history6',
    assetId: 'asset12',
    action: 'status_changed',
    date: '2023-04-05T10:15:00Z',
    userId: 'user2',
    userName: 'Sarah Manager',
    details: 'Status changed from assigned to repair',
  },
  {
    id: 'history7',
    assetId: 'asset12',
    action: 'unassigned',
    date: '2023-04-05T10:14:00Z',
    userId: 'user2',
    userName: 'Sarah Manager',
    details: 'Unassigned from Alex Manager due to damage',
  },
  {
    id: 'history8',
    assetId: 'asset14',
    action: 'status_changed',
    date: '2022-06-30T09:45:00Z',
    userId: 'user1',
    userName: 'John Admin',
    details: 'Status changed from repair to retired',
  },
];

// Mock notifications
export const notifications: Notification[] = [
  {
    id: 'notif1',
    userId: 'user1',
    title: 'Warranty Expiring',
    message: 'iPhone 14 Pro warranty is expiring in 30 days',
    date: '2024-01-06T08:00:00Z',
    read: false,
    type: 'warning',
    link: '/assets/asset3',
  },
  {
    id: 'notif2',
    userId: 'user1',
    title: 'Asset Repair Complete',
    message: 'HP LaserJet Pro has been repaired and is now available',
    date: '2023-06-15T14:30:00Z',
    read: true,
    type: 'success',
    link: '/assets/asset5',
  },
  {
    id: 'notif3',
    userId: 'user2',
    title: 'New Asset Request',
    message: 'Mark Employee has requested a new monitor',
    date: '2023-05-20T11:15:00Z',
    read: false,
    type: 'info',
    link: '/requests',
  },
  {
    id: 'notif4',
    userId: 'user1',
    title: 'Critical Issue',
    message: 'Multiple network devices are offline',
    date: '2023-05-18T07:45:00Z',
    read: false,
    type: 'error',
    link: '/assets?category=networking',
  },
  {
    id: 'notif5',
    userId: 'user3',
    title: 'Asset Assigned',
    message: 'You have been assigned a Surface Pro 8',
    date: '2023-03-10T10:30:00Z',
    read: true,
    type: 'info',
    link: '/assets/asset6',
  },
];

// Dashboard statistics
export const getDashboardStats = (): DashboardStats => {
  const totalAssets = assets.length;
  const availableAssets = assets.filter(a => a.status === 'available').length;
  const assignedAssets = assets.filter(a => a.status === 'assigned').length;
  const repairAssets = assets.filter(a => a.status === 'repair').length;
  const retiredAssets = assets.filter(a => a.status === 'retired').length;
  
  // Calculate total value of all assets
  const assetsValueTotal = assets.reduce((sum, asset) => sum + (asset.value || 0), 0);
  
  // Count assets assigned in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentlyAssigned = assets.filter(a => 
    a.assignedDate && new Date(a.assignedDate) >= thirtyDaysAgo
  ).length;
  
  // Count assets with warranty expiring in the next 30 days
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);
  
  const warrantyExpiringCount = assets.filter(a => {
    if (!a.warrantyExpiry) return false;
    const warrantyDate = new Date(a.warrantyExpiry);
    return warrantyDate >= now && warrantyDate <= thirtyDaysFromNow;
  }).length;

  return {
    totalAssets,
    availableAssets,
    assignedAssets,
    repairAssets,
    retiredAssets,
    usersCount: users.length,
    assetsValueTotal,
    recentlyAssigned,
    warrantyExpiringCount
  };
};

// Get assets by category breakdown
export const getCategoryBreakdown = (): CategoryBreakdown[] => {
  const totalAssets = assets.length;
  const categoryCounts: { [key: string]: number } = {};
  
  // Count assets in each category
  assets.forEach(asset => {
    if (categoryCounts[asset.category]) {
      categoryCounts[asset.category]++;
    } else {
      categoryCounts[asset.category] = 1;
    }
  });
  
  // Convert to array of CategoryBreakdown objects
  return Object.entries(categoryCounts).map(([category, count]) => ({
    category: category as any,
    count,
    percentage: Math.round((count / totalAssets) * 100)
  }));
};

// Function to get assets by status - Properly formatted for charts
export const getAssetsByStatus = (): { name: string, value: number }[] => {
  const statusCounts: Record<string, number> = {};
  
  assets.forEach(asset => {
    if (!statusCounts[asset.status]) {
      statusCounts[asset.status] = 0;
    }
    statusCounts[asset.status]++;
  });
  
  return Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));
};

// Mock current user (for authentication simulation)
export const currentUser: User = users[0]; // Admin user by default

// Function to get asset history for a specific asset
export const getAssetHistoryById = (assetId: string): AssetHistory[] => {
  return assetHistory.filter(history => history.assetId === assetId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Function to get user notifications
export const getUserNotifications = (userId: string): Notification[] => {
  return notifications
    .filter(notif => notif.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Function to get assets by specific status
export const getAssetsBySpecificStatus = (status: AssetStatus): Asset[] => {
  return assets.filter(asset => asset.status === status);
};

// Function to get assets by category
export const getAssetsByCategory = (category: string): Asset[] => {
  return assets.filter(asset => asset.category === category);
};

// Function to get asset by id
export const getAssetById = (id: string): Asset | undefined => {
  return assets.find(asset => asset.id === id);
};

// Function to get user by id
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};
