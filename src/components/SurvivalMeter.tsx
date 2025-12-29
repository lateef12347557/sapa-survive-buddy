import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

interface SurvivalMeterProps {
  survivalDays: number;
  daysRemaining: number;
  status: 'safe' | 'warning' | 'critical';
}

const SurvivalMeter = ({ survivalDays, daysRemaining, status }: SurvivalMeterProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Calculate survival percentage (how much of the semester you can cover)
  const survivalPercentage = daysRemaining > 0 
    ? Math.min(100, (survivalDays / daysRemaining) * 100) 
    : 0;

  // Animate progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(survivalPercentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [survivalPercentage]);

  const progressColorClass = {
    safe: 'progress-safe',
    warning: 'progress-warning',
    critical: 'progress-critical',
  }[status];

  const bgColorClass = {
    safe: 'bg-safe/20',
    warning: 'bg-warning/20',
    critical: 'bg-critical/20',
  }[status];

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Survival Meter</p>
            <p className="text-xs text-muted-foreground">Semester coverage</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">{Math.round(survivalPercentage)}%</p>
          <p className="text-xs text-muted-foreground">covered</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`relative h-4 w-full overflow-hidden rounded-full ${bgColorClass}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${progressColorClass}`}
          style={{ width: `${animatedProgress}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="h-full w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
      </div>

      {/* Scale markers */}
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>

      {/* Survival info */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3">
        <div>
          <p className="text-xs text-muted-foreground">Your funds can last</p>
          <p className="text-lg font-semibold text-foreground">{survivalDays} days</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Days in semester</p>
          <p className="text-lg font-semibold text-foreground">{daysRemaining} days</p>
        </div>
      </div>
    </div>
  );
};

export default SurvivalMeter;
