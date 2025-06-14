export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  role: UserRole;
  profileImageUrl?: string;
  organization_id?: string; // <-- Added to match db & code usage
}

export type AssetStatus = 'available' | 'assigned' | 'repair' | 'retired';

export type AssetCategory = 
  | 'laptop' 
  | 'desktop' 
  | 'mobile' 
  | 'tablet' 
  | 'monitor' 
  | 'printer' 
  | 'networking' 
  | 'peripheral' 
  | 'software' 
  | 'other';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  status: AssetStatus;
  purchaseDate: string;
  warrantyExpiry?: string;
  location?: string;
  assignedTo?: User;
  assignedDate?: string;
  serialNumber?: string;
  model?: string;
  description?: string;
  value?: number;
}

export interface AssetHistory {
  id: string;
  assetId: string;
  action: 'assigned' | 'unassigned' | 'created' | 'updated' | 'status_changed' | 'deleted';
  date: string;
  userId: string;
  userName: string;
  details?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  link?: string;
}

export interface DashboardStats {
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  repairAssets: number;
  retiredAssets: number;
  usersCount: number;
  assetsValueTotal: number;
  recentlyAssigned: number;
  warrantyExpiringCount: number;
}

export interface CategoryBreakdown {
  category: AssetCategory;
  count: number;
  percentage: number;
}
