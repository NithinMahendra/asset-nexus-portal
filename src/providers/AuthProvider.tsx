
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { checkAdminRole, getUserRole } from "@/lib/auth-utils";
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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  userRole: null,
  isLoading: true
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          setSession(session);
          
          const rolePromise = getUserRole(session.user.id);
          const adminStatusPromise = checkAdminRole(session.user.id);
          
          const [role, adminStatus] = await Promise.all([rolePromise, adminStatusPromise]);
          
          setUserRole(role);
          setIsAdmin(adminStatus);
          
          // Role-based redirects
          const isAuthPage = location.pathname.startsWith('/auth');
          if (!isAuthPage && role) {
            if (role === 'admin' && !location.pathname.includes('admin-dashboard')) {
              navigate('/admin-dashboard');
            } else if (role === 'employee' && !location.pathname.includes('employee-dashboard')) {
              navigate('/employee-dashboard');
            }
          } else if (!isAuthPage && !role) {
            navigate('/auth/login');
          }
        } else {
          setUser(null);
          setSession(null);
          setIsAdmin(false);
          setUserRole(null);
          
          const isAuthPage = location.pathname.startsWith('/auth');
          if (!isAuthPage) {
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
        
        const isAuthPage = location.pathname.startsWith('/auth');
        if (!isAuthPage) {
          navigate('/auth/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    const handleAuthChange = async (event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        setUser(session.user);
        setSession(session);
        
        const role = await getUserRole(session.user.id);
        setUserRole(role);
        
        const adminStatus = await checkAdminRole(session.user.id);
        setIsAdmin(adminStatus);
        
        if (event === 'SIGNED_UP' as AuthChangeEvent) {
          return;
        }
        
        // Role-based navigation after auth change
        const isAuthPage = location.pathname.startsWith('/auth');
        if (!isAuthPage && role) {
          if (role === 'admin') {
            navigate('/admin-dashboard');
          } else if (role === 'employee') {
            navigate('/employee-dashboard');
          }
        } else if (!isAuthPage && !role) {
          navigate('/auth/login');
        }
      } else {
        setUser(null);
        setSession(null);
        setIsAdmin(false);
        setUserRole(null);
        
        const isAuthPage = location.pathname.startsWith('/auth');
        if (!isAuthPage) {
          navigate('/auth/login');
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setTimeout(() => handleAuthChange(event, session), 0);
      }
    );

    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, userRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
