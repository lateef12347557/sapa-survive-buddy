import { Zap } from 'lucide-react';

const Header = () => {
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
        
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-safe animate-pulse-slow" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
