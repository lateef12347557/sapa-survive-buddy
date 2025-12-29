import { Zap, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/auth', { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">SapaFlow</h1>
            <p className="text-xs text-muted-foreground -mt-0.5">Financial Survival Tracker</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {user && (
            <>
              <div className="hidden sm:flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-1.5">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          )}
          {!user && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-safe animate-pulse-slow" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
