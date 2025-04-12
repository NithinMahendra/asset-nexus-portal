
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        setError(error.message);
        return;
      }
      
      // Redirect to home page after successful auth
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Authentication</CardTitle>
          <CardDescription className="text-center">
            {error ? 'There was a problem authenticating you' : 'Processing your authentication'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pt-4">
          {error ? (
            <div className="text-center text-red-500">
              <p>{error}</p>
              <button
                onClick={() => navigate('/auth/login')}
                className="mt-4 text-primary underline"
              >
                Go back to login
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Redirecting you to the dashboard...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
