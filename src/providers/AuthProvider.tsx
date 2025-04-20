
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
          
          // Get user role in parallel
          const rolePromise = getUserRole(session.user.id);
          const adminStatusPromise = checkAdminRole(session.user.id);
          
          const [role, adminStatus] = await Promise.all([rolePromise, adminStatusPromise]);
          
          setUserRole(role);
          setIsAdmin(adminStatus);
          
          // Only redirect if not on auth pages and not authenticated with appropriate role
          const isAuthPage = location.pathname.startsWith('/auth');
          if (!isAuthPage && !role) {
            navigate('/auth/login');
          }
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
      if (session?.user) {
        setUser(session.user);
        setSession(session);
        
        // Get user role
        const role = await getUserRole(session.user.id);
        setUserRole(role);
        
        // Check if user is an admin
        const adminStatus = await checkAdminRole(session.user.id);
        setIsAdmin(adminStatus);
        
        // Don't redirect on signup
        if (event === 'SIGNED_UP' as AuthChangeEvent) {
          return;
        }
        
        // Only redirect if not on auth pages and not authenticated with appropriate role
        const isAuthPage = location.pathname.startsWith('/auth');
        if (!isAuthPage && !role) {
          navigate('/auth/login');
        }
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

    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, userRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
