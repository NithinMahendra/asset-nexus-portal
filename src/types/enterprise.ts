
import { User, AssetStatus, AssetCategory } from './index';

export interface Vendor {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AssetLifecycleStage = 'acquisition' | 'deployment' | 'maintenance' | 'retirement';

export interface EnhancedAsset {
  id: string;
  name: string;
  category: AssetCategory;
  status: AssetStatus;
  purchaseDate: string;
  purchasePrice?: number;
  vendor?: string;
  vendorId?: string;
  vendorDetails?: Vendor;
  deprecationRate?: number;
  expectedLifetimeYears?: number;
  lifecycleStage: AssetLifecycleStage;
  warrantyExpiry?: string;
  location?: string;
  assignedTo?: User;
  assignedDate?: string;
  serialNumber?: string;
  model?: string;
  description?: string;
  value?: number;
}

export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
export type MaintenanceType = 'preventive' | 'corrective' | 'predictive' | 'inspection';

export interface MaintenanceSchedule {
  id: string;
  assetId: string;
  assetName?: string;
  scheduleDate: string;
  maintenanceType: string;
  description?: string;
  status: MaintenanceStatus;
  assignedTo?: User;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  tableName: string;
  recordId: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  oldData?: any;
  newData?: any;
  changedBy?: string;
  changedAt: string;
}

export interface AssetLifecycleStats {
  lifecycleStage: AssetLifecycleStage;
  totalCount: number;
  avgAgeYears: number;
  totalValue: number;
}
