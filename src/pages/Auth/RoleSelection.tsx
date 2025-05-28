
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-4xl font-bold text-gray-900">Welcome to AssetNexus</CardTitle>
          <CardDescription className="text-xl text-gray-600">
            Please select your role to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8 p-8">
          {/* Employee Section */}
          <div 
            onClick={() => navigate('/auth/employee-login')}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <Card className="h-full border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-600 transition-colors shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-800">Employee Portal</h3>
                <p className="text-blue-600 text-lg">
                  Access your assigned assets, submit requests, and manage your profile
                </p>
                <div className="text-sm text-blue-500 space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>View assigned assets</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Submit maintenance requests</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Update profile information</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Section */}
          <div 
            onClick={() => navigate('/auth/admin-login')}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <Card className="h-full border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto group-hover:from-purple-700 group-hover:to-purple-900 transition-all shadow-lg">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-purple-800">Administrator Panel</h3>
                <p className="text-purple-600 text-lg">
                  Full system access to manage users, assets, and configurations
                </p>
                <div className="text-sm text-purple-500 space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Manage all assets</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>User administration</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>System configuration</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelection;
