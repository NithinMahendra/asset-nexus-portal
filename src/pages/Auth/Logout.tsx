
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const Logout = () => {
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState<string | null>(null);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          setLogoutError(error.message);
          toast({
            title: "Logout failed",
            description: error.message,
            variant: "destructive"
          });
          // Navigate to dashboard even if logout fails
          setTimeout(() => navigate('/'), 1500);
          return;
        }
        
        // Navigation should happen regardless of success/failure
        navigate('/auth/login');
      } catch (error) {
        console.error('Error during logout:', error);
        setLogoutError('An unexpected error occurred during logout');
        toast({
          title: "Logout failed",
          description: 'An unexpected error occurred during logout',
          variant: "destructive"
        });
        // Navigate to dashboard if error
        setTimeout(() => navigate('/'), 1500);
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        {logoutError ? (
          <div className="text-destructive mb-4">
            <p>Error: {logoutError}</p>
            <p className="mt-2">Redirecting you back...</p>
          </div>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Logging out...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Logout;
