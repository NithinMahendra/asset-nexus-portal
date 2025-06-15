
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import React from "react";

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
}

const UserSearchBar: React.FC<Props> = ({ searchTerm, setSearchTerm, roleFilter, setRoleFilter }) => (
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
);

export default UserSearchBar;
