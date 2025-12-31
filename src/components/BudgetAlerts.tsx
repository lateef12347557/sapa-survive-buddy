import { AlertTriangle, AlertCircle, Ban, Home } from 'lucide-react';
import { CATEGORY_LABELS } from '@/hooks/useTransactions';
import { BudgetAlert } from '@/hooks/useBudgetLimits';
import { isFunCategory, getHardStopMessage } from '@/lib/financialUtils';

interface BudgetAlertsProps {
  alerts: BudgetAlert[];
}

const BudgetAlerts = ({ alerts }: BudgetAlertsProps) => {
  // Separate fun category hard stops from regular alerts
  const hardStops = alerts.filter(
    (a) => a.status === 'exceeded' && isFunCategory(a.category)
  );
  const criticalAlerts = alerts.filter(
    (a) => a.status === 'exceeded' && !isFunCategory(a.category)
  );
  const warningAlerts = alerts.filter((a) => a.status === 'warning');

  if (hardStops.length === 0 && criticalAlerts.length === 0 && warningAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 animate-fade-in">
      {/* HARD STOPS - Emergency Red for Fun Categories */}
      {hardStops.map((alert) => (
        <div
          key={alert.category}
          className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-r from-destructive/20 to-destructive/10 border-2 border-destructive animate-pulse-slow"
        >
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-destructive/10 rounded-full blur-xl" />
          <div className="relative flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20 shrink-0">
              <Ban className="h-5 w-5 text-destructive" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-bold text-destructive uppercase tracking-wide">
                  🛑 HARD STOP
                </p>
              </div>
              <p className="text-base font-semibold text-foreground mb-1">
                {CATEGORY_LABELS[alert.category]} limit hit!
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                ₦{alert.spent.toLocaleString()} spent of ₦{alert.limit.toLocaleString()}
                <span className="text-destructive font-medium ml-1">
                  (+₦{(alert.spent - alert.limit).toLocaleString()} over)
                </span>
              </p>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                <Home className="h-4 w-4 text-primary shrink-0" />
                <p className="text-xs font-medium text-foreground">
                  {getHardStopMessage(alert.category)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Regular exceeded alerts (non-fun categories) */}
      {criticalAlerts.map((alert) => (
        <div
          key={alert.category}
          className="flex items-center gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20"
        >
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              {CATEGORY_LABELS[alert.category]} budget exceeded!
            </p>
            <p className="text-xs text-muted-foreground">
              ₦{alert.spent.toLocaleString()} spent of ₦{alert.limit.toLocaleString()} limit
              <span className="text-destructive ml-1">
                (+₦{(alert.spent - alert.limit).toLocaleString()})
              </span>
            </p>
          </div>
        </div>
      ))}

      {warningAlerts.map((alert) => (
        <div
          key={alert.category}
          className="flex items-center gap-3 p-3 rounded-xl bg-warning/10 border border-warning/20"
        >
          <AlertCircle className="h-5 w-5 text-warning shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              {CATEGORY_LABELS[alert.category]} budget at {Math.round(alert.percentage)}%
            </p>
            <p className="text-xs text-muted-foreground">
              ₦{(alert.limit - alert.spent).toLocaleString()} remaining of ₦{alert.limit.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BudgetAlerts;
