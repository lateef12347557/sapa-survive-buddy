import { useState, useEffect } from 'react';
import { Settings, Coins, Calendar, PiggyBank } from 'lucide-react';

interface InputFormProps {
  currentBalance: number;
  dailySpending: number;
  daysRemaining: number;
  onUpdate: (balance: number, spending: number, days: number) => void;
}

const InputForm = ({ currentBalance, dailySpending, daysRemaining, onUpdate }: InputFormProps) => {
  const [balance, setBalance] = useState(currentBalance.toString());
  const [spending, setSpending] = useState(dailySpending.toString());
  const [days, setDays] = useState(daysRemaining.toString());
  const [isExpanded, setIsExpanded] = useState(false);

  // Sync with props
  useEffect(() => {
    setBalance(currentBalance.toString());
    setSpending(dailySpending.toString());
    setDays(daysRemaining.toString());
  }, [currentBalance, dailySpending, daysRemaining]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBalance = Math.max(0, parseFloat(balance) || 0);
    const newSpending = Math.max(0, parseFloat(spending) || 0);
    const newDays = Math.max(1, parseInt(days) || 1);
    
    onUpdate(newBalance, newSpending, newDays);
    setIsExpanded(false);
  };

  const formatInputValue = (value: string) => {
    // Remove non-numeric characters except decimal point
    return value.replace(/[^0-9.]/g, '');
  };

  return (
    <div className="glass-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-secondary/20"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Update Your Finances</p>
            <p className="text-xs text-muted-foreground">Tap to adjust your budget settings</p>
          </div>
        </div>
        <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expandable Form */}
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6">
          {/* Balance Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <PiggyBank className="h-4 w-4 text-primary" />
              Current Balance (₦)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
              <input
                type="text"
                inputMode="decimal"
                value={balance}
                onChange={(e) => setBalance(formatInputValue(e.target.value))}
                placeholder="50,000"
                className="input-field pl-8"
              />
            </div>
          </div>

          {/* Daily Spending Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Coins className="h-4 w-4 text-warning" />
              Daily Spending (₦)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
              <input
                type="text"
                inputMode="decimal"
                value={spending}
                onChange={(e) => setSpending(formatInputValue(e.target.value))}
                placeholder="1,500"
                className="input-field pl-8"
              />
            </div>
          </div>

          {/* Days Remaining Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar className="h-4 w-4 text-safe" />
              Days Remaining in Semester
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={days}
              onChange={(e) => setDays(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="60"
              className="input-field"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary w-full">
            Update Budget
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
