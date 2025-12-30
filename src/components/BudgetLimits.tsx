import { useState } from 'react';
import { Settings, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { TransactionCategory, CATEGORY_LABELS, CATEGORY_COLORS } from '@/hooks/useTransactions';
import { BudgetLimit, BudgetAlert } from '@/hooks/useBudgetLimits';

interface BudgetLimitsProps {
  limits: BudgetLimit[];
  alerts: BudgetAlert[];
  onSetLimit: (category: TransactionCategory, limit: number) => Promise<void>;
  onRemoveLimit: (category: TransactionCategory) => Promise<void>;
}

const BudgetLimits = ({ limits, alerts, onSetLimit, onRemoveLimit }: BudgetLimitsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<TransactionCategory>('food');
  const [limit, setLimit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get categories that don't have limits yet
  const availableCategories = (Object.keys(CATEGORY_LABELS) as TransactionCategory[]).filter(
    (cat) => !limits.some((l) => l.category === cat)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numLimit = parseFloat(limit);
    if (isNaN(numLimit) || numLimit <= 0) return;

    setIsSubmitting(true);
    try {
      await onSetLimit(category, numLimit);
      setLimit('');
      setCategory(availableCategories[0] || 'food');
      setShowForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgressColor = (status: 'safe' | 'warning' | 'exceeded') => {
    switch (status) {
      case 'exceeded':
        return 'bg-destructive';
      case 'warning':
        return 'bg-warning';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="glass-card p-5 animate-fade-in">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-muted-foreground">
                Budget Limits
              </h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Active Limits</p>
              <p className="font-bold text-foreground">{limits.length}</p>
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4 space-y-4">
          {/* Budget Alerts */}
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.category}
                  className="p-3 rounded-xl bg-secondary/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[alert.category] }}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {CATEGORY_LABELS[alert.category]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        ₦{alert.spent.toLocaleString()} / ₦{alert.limit.toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => onRemoveLimit(alert.category)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress
                      value={Math.min(alert.percentage, 100)}
                      className="h-2"
                    />
                    <div
                      className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(alert.status)}`}
                      style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                    />
                  </div>
                  {alert.status !== 'safe' && (
                    <p className={`text-xs mt-2 ${
                      alert.status === 'exceeded' ? 'text-destructive' : 'text-warning'
                    }`}>
                      {alert.status === 'exceeded'
                        ? `⚠️ Over budget by ₦${(alert.spent - alert.limit).toLocaleString()}`
                        : `⚡ ${Math.round(alert.percentage)}% used - approaching limit`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4 text-sm">
              No budget limits set yet
            </p>
          )}

          {/* Add Form */}
          {showForm && availableCategories.length > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-border">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as TransactionCategory)}>
                    <SelectTrigger className="input-field">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {CATEGORY_LABELS[cat]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Monthly Limit (₦)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    className="input-field"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 btn-primary"
                  disabled={isSubmitting || !limit}
                >
                  {isSubmitting ? 'Setting...' : 'Set Limit'}
                </Button>
              </div>
            </form>
          ) : availableCategories.length > 0 ? (
            <Button
              variant="ghost"
              className="w-full border border-dashed border-border hover:border-primary/50"
              onClick={() => {
                setCategory(availableCategories[0]);
                setShowForm(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Budget Limit
            </Button>
          ) : (
            <p className="text-center text-xs text-muted-foreground py-2">
              All categories have limits set
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default BudgetLimits;
