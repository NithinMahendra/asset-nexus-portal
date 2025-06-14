import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Lock, Mail, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect } from "react";

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  orgOption: z.enum(['new', 'invite']),
  orgName: z.string().optional(),
  inviteToken: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

// Helper: check or create org
async function getOrCreateOrganization(orgOption: "new" | "invite", orgName: string, inviteToken?: string) {
  if (orgOption === "invite" && inviteToken) {
    // Find pending invitation
    const { data: invite, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("id", inviteToken)
      .single();
    if (error || !invite) throw new Error("Invalid invitation");
    if (invite.status !== "pending" || !invite.organization_id) throw new Error("Invitation expired or invalid");
    return { id: invite.organization_id, role: invite.role, invite };
  } else if (orgOption === "new" && orgName) {
    // Check uniqueness or create
    let { data: orgLookup, error: lookupError } = await supabase
      .from("organizations")
      .select("id")
      .eq("name", orgName)
      .single();
    if (orgLookup?.id) throw new Error("Organization already exists");
    const { data: org, error: orgCreateError } = await supabase
      .from("organizations")
      .insert({ name: orgName })
      .select("id")
      .single();
    if (orgCreateError || !org) throw new Error("Could not create organization");
    return { id: org.id, role: "admin" }; // first user is admin
  } else {
    throw new Error("Organization selection required");
  }
}

const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      orgOption: "new",
      orgName: "",
      inviteToken: "",
    },
  });

  // Detect invite from URL
  useEffect(() => {
    const url = new URL(window.location.href);
    const inviteToken = url.searchParams.get("invite");
    if (inviteToken) {
      form.setValue("orgOption", "invite");
      form.setValue("inviteToken", inviteToken);
    }
    // eslint-disable-next-line
  }, []);

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      // ORG: New or existing
      const orgName = data.orgOption === "new" ? (data.orgName || "") : "";
      const { id: organization_id, role: newRole, invite } = await getOrCreateOrganization(data.orgOption, orgName, data.inviteToken);

      // Check user already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', data.email)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing user:", checkError);
      } else if (existingUsers) {
        toast({
          title: "Account already exists",
          description: "An account with this email already exists. Please log in instead.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // SIGNUP to auth
      const { error, data: authData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { name: data.name },
        }
      });

      if (error) throw error;

      if (authData?.user) {
        // Insert user in users table
        const { error: userError } = await supabase
          .from("users")
          .insert({
            id: authData.user.id,
            name: data.name,
            email: data.email,
            organization_id,
            role: newRole as "admin" | "employee" // FIX: role is required!
          });

        if (userError) console.error("User table insert error", userError);

        // Assign role in user_roles table
        const userRoleRow = {
          user_id: authData.user.id,
          role: (newRole as "admin" | "employee"), // FIX: correct typing for role
          organization_id,
        };
        await supabase.from("user_roles").insert(userRoleRow);

        // Attach org and user to asset tables as needed (future)
        if (invite && invite.id) {
          await supabase.from("invitations").update({ status: "accepted" }).eq("id", invite.id);
        }

        toast({
          title: "Account created successfully",
          description: "You can now login with your credentials.",
        });

        setRegistrationSuccess(true);
        form.reset();

        setTimeout(() => {
          navigate('/auth/login');
        }, 2000);
      } else {
        toast({
          title: "Registration pending",
          description: "Check your email to confirm your registration.",
        });
        setRegistrationSuccess(true);
        form.reset();
      }
    } catch (error: any) {
      console.error("Signup error:", error);

      let errorMessage = "An error occurred during signup";
      if (error.message?.includes("already exists")) {
        errorMessage = "This organization already exists. Please join via invite or choose a different name.";
      } else if (error.message?.includes("Invalid invitation")) {
        errorMessage = "Invitation is invalid or expired.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account and join or create your company.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registrationSuccess ? (
            <Alert className="mb-4">
              <AlertTitle>Registration successful!</AlertTitle>
              <AlertDescription>
                Your account has been created successfully. You will be redirected to the login page.
              </AlertDescription>
              <div className="mt-4">
                <Button asChild className="w-full">
                  <Link to="/auth/login">Go to Login</Link>
                </Button>
              </div>
            </Alert>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Enter your full name" 
                            className="pl-10" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Create a password" 
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
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Confirm your password" 
                            className="pl-10 pr-10" 
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-8 w-8 p-0"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showConfirmPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Company/Organization selection */}
                <FormField
                  control={form.control}
                  name="orgOption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                {...field}
                                value="new"
                                checked={form.watch("orgOption") === "new"}
                                onChange={() => form.setValue("orgOption", "new")}
                              />
                              <span>Create New Company</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                {...field}
                                value="invite"
                                checked={form.watch("orgOption") === "invite"}
                                onChange={() => form.setValue("orgOption", "invite")}
                              />
                              <span>Join with Invite</span>
                            </label>
                          </div>
                          {form.watch("orgOption") === "new" && (
                            <div className="relative">
                              {/* Add Building2 icon */}
                              <span className="absolute left-3 top-3">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                              </span>
                              <Input
                                placeholder="Company or organization name"
                                className="pl-10"
                                value={form.watch("orgName") || ""}
                                onChange={e => form.setValue("orgName", e.target.value)}
                                required
                              />
                            </div>
                          )}
                          {form.watch("orgOption") === "invite" && (
                            <Input
                              placeholder="Invite code"
                              value={form.watch("inviteToken") || ""}
                              onChange={e => form.setValue("inviteToken", e.target.value)}
                              required
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="mr-2">Creating account...</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    </>
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
