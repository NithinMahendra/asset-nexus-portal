
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Lock, Mail, Shield, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { getUserRole } from "@/lib/auth-utils";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type UserRole = 'admin' | 'employee' | null;

const RoleBasedLogin = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      if (authData.user) {
        const userRole = await getUserRole(authData.user.id);
        
        // Verify that the user's actual role matches their selected role
        if (userRole !== selectedRole) {
          await supabase.auth.signOut();
          toast({
            title: "Access denied",
            description: `You don't have ${selectedRole} permissions. Please select the correct role.`,
            variant: "destructive",
          });
          return;
        }

        if (userRole) {
          toast({
            title: "Login successful",
            description: `Welcome back, ${userRole}!`,
          });
          navigate("/");
        } else {
          toast({
            title: "Access denied",
            description: "No role assigned. Please contact an administrator.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
        }
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetSelection = () => {
    setSelectedRole(null);
    form.reset();
  };

  // Role selection view
  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Please select your role to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            {/* Employee Section */}
            <div 
              onClick={() => setSelectedRole('employee')}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <Card className="h-full border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-600 transition-colors">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-800">Employee</h3>
                  <p className="text-sm text-blue-600">
                    Access your assigned assets, submit requests, and manage your profile
                  </p>
                  <div className="text-xs text-blue-500 space-y-1">
                    <div>• View assigned assets</div>
                    <div>• Submit maintenance requests</div>
                    <div>• Update profile information</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Section */}
            <div 
              onClick={() => setSelectedRole('admin')}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <Card className="h-full border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto group-hover:bg-purple-600 transition-colors">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-purple-800">Administrator</h3>
                  <p className="text-sm text-purple-600">
                    Full system access to manage users, assets, and configurations
                  </p>
                  <div className="text-xs text-purple-500 space-y-1">
                    <div>• Manage all assets</div>
                    <div>• User administration</div>
                    <div>• System configuration</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Login form view
  const isAdmin = selectedRole === 'admin';
  const roleColors = isAdmin 
    ? { 
        gradient: 'from-purple-50 to-purple-100',
        card: 'border-purple-200',
        primary: 'text-purple-800',
        secondary: 'text-purple-600',
        icon: 'text-purple-500',
        button: 'bg-purple-600 hover:bg-purple-700'
      }
    : { 
        gradient: 'from-blue-50 to-blue-100',
        card: 'border-blue-200',
        primary: 'text-blue-800',
        secondary: 'text-blue-600',
        icon: 'text-blue-500',
        button: 'bg-blue-600 hover:bg-blue-700'
      };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${roleColors.gradient} p-4`}>
      <Card className={`w-full max-w-md border-2 ${roleColors.card} shadow-lg`}>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetSelection}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className={`w-12 h-12 ${isAdmin ? 'bg-purple-500' : 'bg-blue-500'} rounded-full flex items-center justify-center`}>
              {isAdmin ? (
                <Shield className="h-6 w-6 text-white" />
              ) : (
                <Users className="h-6 w-6 text-white" />
              )}
            </div>
            <div></div>
          </div>
          <div className="text-center">
            <CardTitle className={`text-2xl font-bold ${roleColors.primary}`}>
              {isAdmin ? 'Administrator' : 'Employee'} Login
            </CardTitle>
            <CardDescription className={roleColors.secondary}>
              {isAdmin 
                ? 'Access the admin dashboard with full permissions' 
                : 'Access your employee dashboard and assigned resources'
              }
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className={`absolute left-3 top-3 h-4 w-4 ${roleColors.icon}`} />
                        <Input 
                          placeholder="Enter your email" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className={`absolute left-3 top-3 h-4 w-4 ${roleColors.icon}`} />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Enter your password" 
                          className="pl-10 pr-10" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className={`w-full text-white ${roleColors.button}`}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : `Login as ${isAdmin ? 'Administrator' : 'Employee'}`}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/auth/signup" className={`${roleColors.primary} underline font-medium`}>
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleBasedLogin;
