import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import AuditLogStub from "@/components/AuditLogStub";

const Enterprise: React.FC = () => {
  const { userRole, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-72" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  // If employee, display audit log section at bottom (stub for now)
  if (userRole === "employee") {
    return (
      <div>
        <UserDashboard />
        <div className="mt-6">
          <AuditLogStub />
        </div>
      </div>
    );
  }
  // If admin, show original
  return <AdminDashboard />;
};

export default Enterprise;
