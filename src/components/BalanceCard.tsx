import { useEffect, useState } from 'react';
import { Wallet, Shield, AlertTriangle } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  trueBalance: number;
  recurringReserve: number;
  survivalDays: number;
  status: 'safe' | 'warning' | 'critical';
}

const BalanceCard = ({ balance, trueBalance, recurringReserve, survivalDays, status }: BalanceCardProps) => {
  const [displayBalance, setDisplayBalance] = useState(trueBalance);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate balance changes
  useEffect(() => {
    if (displayBalance !== trueBalance) {
      setIsAnimating(true);
      const diff = trueBalance - displayBalance;
      const steps = 20;
      const increment = diff / steps;
      let current = displayBalance;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current += increment;
        if (step >= steps) {
          setDisplayBalance(trueBalance);
          setIsAnimating(false);
          clearInterval(timer);
        } else {
          setDisplayBalance(Math.round(current));
        }
      }, 30);

      return () => clearInterval(timer);
    }
  }, [trueBalance, displayBalance]);

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

  const hasReserve = recurringReserve > 0;

  return (
    <div className={`glass-card p-6 animate-slide-up ${glowClass}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            {hasReserve ? 'Safe-to-Spend Balance' : 'Current Balance'}
          </p>
          <p className="text-xs text-muted-foreground/70">
            {hasReserve ? 'After recurring expenses reserved' : 'Your financial runway'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className={`flex items-baseline gap-1 ${isAnimating ? 'animate-number' : ''}`}>
          <span className="text-2xl font-medium text-muted-foreground">₦</span>
          <span className={`stat-value ${textGradientClass}`}>
            {formatCurrency(displayBalance)}
          </span>
        </div>
        
        {/* Invisible Reserve indicator */}
        {hasReserve && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
            <Shield className="h-4 w-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-medium">₦{formatCurrency(recurringReserve)}</span>
                {' '}reserved for recurring bills
              </p>
              <p className="text-xs text-muted-foreground/60">
                Total: ₦{formatCurrency(balance)}
              </p>
            </div>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground">
          {survivalDays > 0 ? (
            <>
              Can survive for <span className="font-semibold text-foreground">{survivalDays} days</span>
            </>
          ) : (
            <span className="text-critical flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              No funds remaining
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default BalanceCard;
