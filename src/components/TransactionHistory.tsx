import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Transaction,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '@/hooks/useTransactions';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onDelete: (id: string) => Promise<void>;
}

const TransactionHistory = ({ transactions, onDelete }: TransactionHistoryProps) => {
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
        {recentTransactions.map((tx) => (
          <div 
            key={tx.id}
            className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div 
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[tx.category] }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    ₦{Number(tx.amount).toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {CATEGORY_LABELS[tx.category]}
                  </span>
                </div>
                {tx.description && (
                  <p className="text-xs text-muted-foreground truncate">
                    {tx.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground/60">
                  {format(new Date(tx.created_at), 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(tx.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
