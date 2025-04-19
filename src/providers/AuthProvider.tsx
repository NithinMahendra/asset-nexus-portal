
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { checkAdminRole } from "@/lib/auth-utils";
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthChangeEvent } from '@supabase/supabase-js';

interface AuthContextType {
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ isAdmin: false, isLoading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const adminStatus = await checkAdminRole(session.user.id);
          setIsAdmin(adminStatus);
          
          // Only redirect if not on auth pages and not admin
          const isAuthPage = location.pathname.startsWith('/auth');
          if (!adminStatus && !isAuthPage) {
            navigate('/auth/login');
          }
        } else {
          setIsAdmin(false);
          
          // Only redirect if not on auth pages
          const isAuthPage = location.pathname.startsWith('/auth');
          if (!isAuthPage) {
            navigate('/auth/login');
          }
        }
      } catch (error) {
        console.error('Auth error:', error);
        setIsAdmin(false);
        
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
        const adminStatus = await checkAdminRole(session.user.id);
        setIsAdmin(adminStatus);
        
        // Don't redirect on signup
        if (event === 'SIGNED_UP' as AuthChangeEvent) {
          return;
        }
        
        // Only redirect if not on auth pages and not admin
        const isAuthPage = location.pathname.startsWith('/auth');
        if (!adminStatus && !isAuthPage) {
          navigate('/auth/login');
        }
      } else {
        setIsAdmin(false);
        
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
    <AuthContext.Provider value={{ isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
