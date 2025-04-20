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
  
  // Load users from Supabase
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
  
  // Filter users based on search term and role filter
  useEffect(() => {
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(lowercasedSearch) ||
        user.email.toLowerCase().includes(lowercasedSearch) ||
        (user.department && user.department.toLowerCase().includes(lowercasedSearch))
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(result);
  }, [searchTerm, roleFilter, users]);
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return parts[0][0];
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Button className="bg-primary" onClick={() => setIsAddUserOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full sm:w-40">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
                        <p>Loading users...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.profileImageUrl} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={cn(roleColors[user.role], "text-white")}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department || '-'}</TableCell>
                      <TableCell>{user.phone || '-'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" /> Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="mr-2 h-4 w-4" /> View Assets
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Search className="h-10 w-10 mb-2" />
                        <h3 className="font-medium mb-1">No users found</h3>
                        <p>Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { role: 'admin', icon: <Shield className="h-5 w-5" />, label: 'Admins' },
          { role: 'employee', icon: <UserPlus className="h-5 w-5" />, label: 'Employees' },
        ].map((item) => {
          const count = users.filter(u => u.role === item.role).length;
          return (
            <Card key={item.role}>
              <CardContent className="flex items-center p-6">
                <div className={cn("p-2 rounded-full mr-4", roleColors[item.role as UserRole])}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add User Form Dialog */}
      <AddUserForm 
        isOpen={isAddUserOpen} 
        onClose={() => setIsAddUserOpen(false)} 
        onSuccess={loadUsers}
      />
    </div>
  );
};

export default Users;
