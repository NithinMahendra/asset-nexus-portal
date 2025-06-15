import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllUsers } from '@/lib/supabase-utils';
import { User, UserRole } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Building2, 
  Shield, 
  UserPlus,
  Edit,
  Trash,
  Package
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import AddUserForm from '@/components/users/AddUserForm';
import InviteUserForm from "@/components/users/InviteUserForm";
import UserSearchBar from "@/components/users/UserSearchBar";
import UserRoleSummaryCards from "@/components/users/UserRoleSummaryCards";
import UserTable from "@/components/users/UserTable";
import { useCurrentUserInfo } from "@/hooks/useCurrentUserInfo";

const roleColors: Record<UserRole, string> = {
  admin: 'bg-amber-500',
  employee: 'bg-blue-500'
};

const roleTextColors: Record<UserRole, string> = {
  admin: 'text-amber-500',
  employee: 'text-blue-500'
};

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isInviteUserOpen, setIsInviteUserOpen] = useState(false);

  const { organizationId, loading: orgLoading } = useCurrentUserInfo();

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setIsLoading(true);
    try {
      const userList = await getAllUsers();
      setUsers(userList);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    let result = [...users];
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(lowercasedSearch) ||
        user.email.toLowerCase().includes(lowercasedSearch) ||
        (user.department && user.department.toLowerCase().includes(lowercasedSearch))
      );
    }
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    setFilteredUsers(result);
  }, [searchTerm, roleFilter, users]);

  const isAdmin = users.some(u => u.role === "admin");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button
              variant="secondary"
              onClick={() => setIsInviteUserOpen(true)}
              disabled={!organizationId || organizationId.trim() === "" || orgLoading}
              title={
                orgLoading
                  ? "Loading organization data..."
                  : !organizationId || organizationId.trim() === ""
                  ? "Cannot invite users without a valid organization (check organization membership)."
                  : undefined
              }
            >
              Invite User
            </Button>
          )}
          <Button className="bg-primary" onClick={() => setIsAddUserOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
      
      <UserSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      <div>
        <UserTable users={users} filteredUsers={filteredUsers} isLoading={isLoading} />
      </div>

      <UserRoleSummaryCards users={users} />

      <AddUserForm 
        isOpen={isAddUserOpen} 
        onClose={() => setIsAddUserOpen(false)} 
        onSuccess={loadUsers}
      />

      <InviteUserForm
        isOpen={isInviteUserOpen}
        onClose={() => setIsInviteUserOpen(false)}
        organizationId={organizationId || ""}
        onSuccess={loadUsers}
      />
    </div>
  )
}

export default Users;
