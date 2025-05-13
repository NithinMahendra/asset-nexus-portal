
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { checkAdminRole, getUserRole, setupAutoLogout } from "@/lib/auth-utils";
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { UserRole } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  userRole: UserRole | null;
  isLoading: boolean;
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  userRole: null,
  isLoading: true,
  refreshUserRole: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to refresh user role (useful after role changes)
  const refreshUserRole = async () => {
    if (user) {
      const role = await getUserRole(user.id);
      setUserRole(role);
      setIsAdmin(role === 'admin');
    }
  };

  useEffect(() => {
    console.log("Auth Provider initialized with current path:", location.pathname);
    
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("Session found for user:", session.user.email);
          setUser(session.user);
          setSession(session);
          
          // Get user role in parallel
          const rolePromise = getUserRole(session.user.id);
          const adminStatusPromise = checkAdminRole(session.user.id);
          
          const [role, adminStatus] = await Promise.all([rolePromise, adminStatusPromise]);
          
          console.log("User role from database:", role);
          console.log("User is admin:", adminStatus);
          
          setUserRole(role);
          setIsAdmin(adminStatus);
          
          // Only redirect if not on auth pages and not authenticated with appropriate role
          const isAuthPage = location.pathname.startsWith('/auth');
          if (!isAuthPage && !role) {
            console.log("No role assigned, redirecting to login");
            navigate('/auth/login');
          }
        } else {
          console.log("No session found, clearing auth state");
          setUser(null);
          setSession(null);
          setIsAdmin(false);
          setUserRole(null);
          
          // Only redirect if not on auth pages
          const isAuthPage = location.pathname.startsWith('/auth');
          if (!isAuthPage) {
            console.log("Not on auth page, redirecting to login");
            navigate('/auth/login');
          }
        }
      } catch (error) {
        console.error('Auth error:', error);
        toast({
          title: "Authentication Error",
          description: "There was a problem with authentication. Please try again.",
          variant: "destructive",
        });
        
        setUser(null);
        setSession(null);
        setIsAdmin(false);
        setUserRole(null);
        
        // Only redirect if not on auth pages
        const isAuthPage = location.pathname.startsWith('/auth');
        if (!isAuthPage) {
          navigate('/auth/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    const handleAuthChange = async (event: AuthChangeEvent, session: Session | null) => {
      console.log("Auth state change:", event);
      if (session?.user) {
        setUser(session.user);
        setSession(session);
        
        // Get user role - to prevent potential deadlocks, we use setTimeout
        setTimeout(async () => {
          const role = await getUserRole(session.user.id);
          console.log("User role after auth change:", role);
          setUserRole(role);
          
          // Check if user is an admin
          const adminStatus = await checkAdminRole(session.user.id);
          console.log("Admin status after auth change:", adminStatus);
          setIsAdmin(adminStatus);
          
          // Don't redirect on signup
          if (event === 'SIGNED_UP' as AuthChangeEvent) {
            return;
          }
          
          // Redirect based on role if not on auth pages
          const isAuthPage = location.pathname.startsWith('/auth');
          if (!isAuthPage) {
            if (role === 'admin') {
              console.log("Admin user detected, redirecting to enterprise dashboard");
              navigate('/enterprise');
            } else if (role === 'employee') {
              console.log("Employee user detected, redirecting to main dashboard");
              navigate('/');
            } else {
              console.log("No role assigned, redirecting to login");
              navigate('/auth/login');
            }
          }
        }, 0);
      } else {
        setUser(null);
        setSession(null);
        setIsAdmin(false);
        setUserRole(null);
        
        // Only redirect if not on auth pages
        const isAuthPage = location.pathname.startsWith('/auth');
        if (!isAuthPage) {
          navigate('/auth/login');
        }
      }
    };

    // Set up the subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Use setTimeout to prevent potential deadlocks
        setTimeout(() => handleAuthChange(event, session), 0);
      }
    );

    // Set up auto logout after inactivity (15 minutes)
    const cleanupAutoLogout = setupAutoLogout(15 * 60 * 1000);

    checkAuth();
    
    return () => {
      subscription.unsubscribe();
      cleanupAutoLogout();
    };
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isAdmin, 
      userRole, 
      isLoading,
      refreshUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};
