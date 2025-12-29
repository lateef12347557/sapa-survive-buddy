import { Trophy, AlertTriangle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  survivalDays: number;
  status: 'safe' | 'warning' | 'critical';
}

const StatusBadge = ({ survivalDays, status }: StatusBadgeProps) => {
  const statusConfig = {
    safe: {
      label: 'Senior Man',
      emoji: '🥂',
      description: 'You\'re financially stable for this semester!',
      tip: 'Keep maintaining your spending habits.',
      icon: Trophy,
      bgClass: 'bg-safe/10 border-safe/30',
      textClass: 'text-safe',
      glowClass: 'glow-safe',
    },
    warning: {
      label: 'Manageable',
      emoji: '🍛',
      description: 'Your finances are getting tight.',
      tip: 'Consider reducing daily spending.',
      icon: AlertTriangle,
      bgClass: 'bg-warning/10 border-warning/30',
      textClass: 'text-warning',
      glowClass: 'glow-warning',
    },
    critical: {
      label: 'Critical Sapa!',
      emoji: '🍞',
      description: 'Danger zone! Funds critically low.',
      tip: 'Time to cut expenses or find extra income.',
      icon: AlertCircle,
      bgClass: 'bg-critical/10 border-critical/30',
      textClass: 'text-critical',
      glowClass: 'glow-critical',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div 
      className={`glass-card overflow-hidden animate-slide-up ${config.glowClass}`} 
      style={{ animationDelay: '0.2s' }}
    >
      {/* Status Header */}
      <div className={`flex items-center justify-between border-b px-6 py-4 ${config.bgClass}`}>
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.bgClass}`}>
            <Icon className={`h-6 w-6 ${config.textClass}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-bold ${config.textClass}`}>
                {config.label}
              </span>
              <span className="text-2xl">{config.emoji}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {survivalDays}+ days of survival
            </p>
          </div>
        </div>
      </div>

      {/* Status Details */}
      <div className="p-6 space-y-4">
        <p className="text-sm text-foreground">{config.description}</p>
        
        <div className="rounded-xl bg-secondary/50 p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            💡 Pro Tip
          </p>
          <p className="text-sm text-foreground">{config.tip}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-secondary/30 p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{survivalDays}</p>
            <p className="text-xs text-muted-foreground">Days Left</p>
          </div>
          <div className="rounded-xl bg-secondary/30 p-3 text-center">
            <p className={`text-2xl font-bold ${config.textClass}`}>
              {status === 'safe' ? '✓' : status === 'warning' ? '!' : '!!'}
            </p>
            <p className="text-xs text-muted-foreground">Status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBadge;
