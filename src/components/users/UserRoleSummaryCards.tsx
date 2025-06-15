
import { Card, CardContent } from "@/components/ui/card";
import { Shield, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { User, UserRole } from "@/types";
import React from "react";

const roleColors: Record<UserRole, string> = {
  admin: "bg-amber-500",
  employee: "bg-blue-500",
};

interface Props {
  users: User[];
}
const roles = [
  { role: "admin", icon: <Shield className="h-5 w-5" />, label: "Admins" },
  { role: "employee", icon: <UserPlus className="h-5 w-5" />, label: "Employees" },
];

const UserRoleSummaryCards: React.FC<Props> = ({ users }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {roles.map((item) => {
      const count = users.filter((u) => u.role === item.role).length;
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
);

export default UserRoleSummaryCards;
