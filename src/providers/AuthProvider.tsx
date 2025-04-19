
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { checkAdminRole, getUserRole } from "@/lib/auth-utils";
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { UserRole } from "@/types";

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
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          setSession(session);
          
          // Get user role
          const role = await getUserRole(session.user.id);
          setUserRole(role);
          
          // Check if user is an admin
          const adminStatus = await checkAdminRole(session.user.id);
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, userRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
