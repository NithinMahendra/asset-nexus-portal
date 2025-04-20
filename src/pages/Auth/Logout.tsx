
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await supabase.auth.signOut();
        navigate('/auth/login');
      } catch (error) {
        console.error('Error during logout:', error);
        navigate('/auth/login');
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Logging out...</p>
      </div>
    </div>
  );
};

export default Logout;
