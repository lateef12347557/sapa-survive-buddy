import { AlertTriangle, AlertCircle } from 'lucide-react';
import { CATEGORY_LABELS } from '@/hooks/useTransactions';
import { BudgetAlert } from '@/hooks/useBudgetLimits';

interface BudgetAlertsProps {
  alerts: BudgetAlert[];
}

const BudgetAlerts = ({ alerts }: BudgetAlertsProps) => {
  const criticalAlerts = alerts.filter((a) => a.status === 'exceeded');
  const warningAlerts = alerts.filter((a) => a.status === 'warning');

  if (criticalAlerts.length === 0 && warningAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 animate-fade-in">
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
