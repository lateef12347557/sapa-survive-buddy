import { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  survivalDays: number;
  status: 'safe' | 'warning' | 'critical';
}

const BalanceCard = ({ balance, survivalDays, status }: BalanceCardProps) => {
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate balance changes
  useEffect(() => {
    if (displayBalance !== balance) {
      setIsAnimating(true);
      const diff = balance - displayBalance;
      const steps = 20;
      const increment = diff / steps;
      let current = displayBalance;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current += increment;
        if (step >= steps) {
          setDisplayBalance(balance);
          setIsAnimating(false);
          clearInterval(timer);
        } else {
          setDisplayBalance(Math.round(current));
        }
      }, 30);

      return () => clearInterval(timer);
    }
  }, [balance, displayBalance]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const glowClass = {
    safe: 'glow-safe',
    warning: 'glow-warning',
    critical: 'glow-critical',
  }[status];

  const textGradientClass = {
    safe: 'text-gradient-safe',
    warning: 'text-gradient-warning',
    critical: 'text-gradient-critical',
  }[status];

  return (
    <div className={`glass-card p-6 animate-slide-up ${glowClass}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="text-xs text-muted-foreground/70">Your financial runway</p>
        </div>
      </div>

      <div className="space-y-1">
        <div className={`flex items-baseline gap-1 ${isAnimating ? 'animate-number' : ''}`}>
          <span className="text-2xl font-medium text-muted-foreground">₦</span>
          <span className={`stat-value ${textGradientClass}`}>
            {formatCurrency(displayBalance)}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {survivalDays > 0 ? (
            <>
              Can survive for <span className="font-semibold text-foreground">{survivalDays} days</span>
            </>
          ) : (
            <span className="text-critical">No funds remaining</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default BalanceCard;
