import { useState } from 'react';
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
import { Plus } from 'lucide-react';
import {
  TransactionCategory,
  CATEGORY_LABELS,
} from '@/hooks/useTransactions';

interface ExpenseFormProps {
  onSubmit: (amount: number, category: TransactionCategory, description?: string) => Promise<void>;
}

const ExpenseForm = ({ onSubmit }: ExpenseFormProps) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('food');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(numAmount, category, description || undefined);
      setAmount('');
      setDescription('');
      setCategory('food');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-5 animate-fade-in">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Add Expense</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-xs text-muted-foreground">
              Amount (₦)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field"
              min="1"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-xs text-muted-foreground">
              Category
            </Label>
            <Select value={category} onValueChange={(v) => setCategory(v as TransactionCategory)}>
              <SelectTrigger className="input-field">
                <SelectValue placeholder="Select category" />
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
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs text-muted-foreground">
            Description (optional)
          </Label>
          <Input
            id="description"
            type="text"
            placeholder="e.g., Lunch at buka"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
            maxLength={100}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full btn-primary"
          disabled={isSubmitting || !amount}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Adding...' : 'Add Expense'}
        </Button>
      </form>
    </div>
  );
};

export default ExpenseForm;
