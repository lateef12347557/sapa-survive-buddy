import { format } from 'date-fns';
import { Trash2, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Transaction,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '@/hooks/useTransactions';
import { getExpensePainLevel } from '@/lib/financialUtils';
import { Badge } from '@/components/ui/badge';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onDelete: (id: string) => Promise<void>;
  dailyBalance: number;
}

const TransactionHistory = ({ transactions, onDelete, dailyBalance }: TransactionHistoryProps) => {
  const recentTransactions = transactions.slice(0, 10);

  if (recentTransactions.length === 0) {
    return (
      <div className="glass-card p-5 animate-fade-in">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Recent Transactions</h3>
        <p className="text-center text-muted-foreground py-8 text-sm">
          No transactions yet. Add your first expense above!
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 animate-fade-in">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Recent Transactions ({transactions.length})
      </h3>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {recentTransactions.map((tx) => {
          const painLevel = getExpensePainLevel(Number(tx.amount), dailyBalance);
          
          return (
            <div 
              key={tx.id}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors group ${
                painLevel.isPainful 
                  ? 'bg-destructive/10 border border-destructive/20 hover:bg-destructive/15' 
                  : 'bg-secondary/50 hover:bg-secondary/70'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div 
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[tx.category] }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">
                      ₦{Number(tx.amount).toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {CATEGORY_LABELS[tx.category]}
                    </span>
                    {painLevel.isPainful && (
                      <Badge 
                        variant="destructive" 
                        className="text-xs py-0 px-1.5 h-5 animate-pulse"
                      >
                        <Flame className="h-3 w-3 mr-0.5" />
                        Ouch! 💸
                      </Badge>
                    )}
                  </div>
                  {tx.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {tx.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground/60">
                      {format(new Date(tx.created_at), 'MMM d, h:mm a')}
                    </p>
                    {painLevel.isPainful && (
                      <p className="text-xs text-destructive">
                        {painLevel.percentage}% of daily budget
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => onDelete(tx.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionHistory;
