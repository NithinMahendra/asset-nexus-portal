
import { Card } from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const { user } = useAuth();
  
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return parts[0][0];
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex items-start space-x-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || 'User'} />
            <AvatarFallback>{getInitials(user.user_metadata?.full_name || 'User')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{user.user_metadata?.full_name || 'User'}</h1>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Last Sign In:</span> {new Date(user.last_sign_in_at || '').toLocaleString()}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
