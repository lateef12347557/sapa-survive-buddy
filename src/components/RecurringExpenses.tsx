import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2, Pause, Play, RefreshCw } from 'lucide-react';
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
import { TransactionCategory, CATEGORY_LABELS, CATEGORY_COLORS } from '@/hooks/useTransactions';
import {
  RecurringExpense,
  Frequency,
  FREQUENCY_LABELS,
} from '@/hooks/useRecurringExpenses';

interface RecurringExpensesProps {
  expenses: RecurringExpense[];
  monthlyTotal: number;
  onAdd: (amount: number, category: TransactionCategory, description: string, frequency: Frequency) => Promise<void>;
  onToggle: (id: string, isActive: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const RecurringExpenses = ({
  expenses,
  monthlyTotal,
  onAdd,
  onToggle,
  onDelete,
}: RecurringExpensesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('utilities');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || !description.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd(numAmount, category, description.trim(), frequency);
      setAmount('');
      setDescription('');
      setCategory('utilities');
      setFrequency('monthly');
      setShowForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-5 animate-fade-in">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-muted-foreground">
                Recurring Expenses
              </h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Est. Monthly</p>
              <p className="font-bold text-foreground">₦{monthlyTotal.toLocaleString()}</p>
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4 space-y-4">
          {/* Expense List */}
          {expenses.length > 0 ? (
            <div className="space-y-2">
              {expenses.map((exp) => (
                <div
                  key={exp.id}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors group ${
                    exp.is_active ? 'bg-secondary/50' : 'bg-secondary/20 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[exp.category] }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          ₦{Number(exp.amount).toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {FREQUENCY_LABELS[exp.frequency]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {exp.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onToggle(exp.id, !exp.is_active)}
                    >
                      {exp.is_active ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(exp.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4 text-sm">
              No recurring expenses yet
            </p>
          )}

          {/* Add Form */}
          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-border">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Amount (₦)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-field"
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Frequency</Label>
                  <Select value={frequency} onValueChange={(v) => setFrequency(v as Frequency)}>
                    <SelectTrigger className="input-field">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(FREQUENCY_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as TransactionCategory)}>
                  <SelectTrigger className="input-field">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <Input
                  type="text"
                  placeholder="e.g., Netflix subscription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                  maxLength={100}
                  required
                />
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
                  disabled={isSubmitting || !amount || !description.trim()}
                >
                  {isSubmitting ? 'Adding...' : 'Add'}
                </Button>
              </div>
            </form>
          ) : (
            <Button
              variant="ghost"
              className="w-full border border-dashed border-border hover:border-primary/50"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Recurring Expense
            </Button>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default RecurringExpenses;
