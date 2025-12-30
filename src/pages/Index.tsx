import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import BalanceCard from '@/components/BalanceCard';
import SurvivalMeter from '@/components/SurvivalMeter';
import StatusBadge from '@/components/StatusBadge';
import InputForm from '@/components/InputForm';
import ExpenseForm from '@/components/ExpenseForm';
import TransactionHistory from '@/components/TransactionHistory';
import BudgetInsights from '@/components/BudgetInsights';
import RecurringExpenses from '@/components/RecurringExpenses';
import BudgetLimits from '@/components/BudgetLimits';
import BudgetAlerts from '@/components/BudgetAlerts';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import { useRecurringExpenses } from '@/hooks/useRecurringExpenses';
import { useBudgetLimits } from '@/hooks/useBudgetLimits';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { 
    currentBalance, 
    dailySpending, 
    daysRemaining, 
    survivalDays, 
    status, 
    loading: dataLoading,
    updateData 
  } = useFinancialData();
  
  const {
    transactions,
    loading: txLoading,
    addTransaction,
    deleteTransaction,
    getSpendingByCategory,
    getDailySpending,
    getTotalSpending,
  } = useTransactions();

  const {
    recurringExpenses,
    addRecurringExpense,
    toggleRecurringExpense,
    deleteRecurringExpense,
    getMonthlyTotal,
  } = useRecurringExpenses();

  const categorySpending = getSpendingByCategory();

  const {
    budgetLimits,
    setBudgetLimit,
    removeBudgetLimit,
    getBudgetAlerts,
  } = useBudgetLimits(categorySpending);

  const budgetAlerts = getBudgetAlerts();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Show loading while checking auth
  if (authLoading || dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your finances...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6 pb-24">
        <div className="mx-auto max-w-lg space-y-4">
          {/* Budget Alerts - Show at top when there are warnings */}
          <BudgetAlerts alerts={budgetAlerts} />
          
          {/* Balance Card */}
          <BalanceCard 
            balance={currentBalance} 
            survivalDays={survivalDays}
            status={status}
          />
          
          {/* Survival Progress */}
          <SurvivalMeter 
            survivalDays={survivalDays} 
            daysRemaining={daysRemaining}
            status={status}
          />
          
          {/* Status Badge */}
          <StatusBadge 
            survivalDays={survivalDays}
            status={status}
          />
          
          {/* Input Form */}
          <InputForm
            currentBalance={currentBalance}
            dailySpending={dailySpending}
            daysRemaining={daysRemaining}
            onUpdate={updateData}
          />
          
          {/* Expense Form */}
          <ExpenseForm onSubmit={addTransaction} />
          
          {/* Transaction History */}
          <TransactionHistory 
            transactions={transactions}
            onDelete={deleteTransaction}
          />
          
          {/* Recurring Expenses */}
          <RecurringExpenses
            expenses={recurringExpenses}
            monthlyTotal={getMonthlyTotal()}
            onAdd={addRecurringExpense}
            onToggle={toggleRecurringExpense}
            onDelete={deleteRecurringExpense}
          />
          
          {/* Budget Limits */}
          <BudgetLimits
            limits={budgetLimits}
            alerts={budgetAlerts}
            onSetLimit={setBudgetLimit}
            onRemoveLimit={removeBudgetLimit}
          />
          
          {/* Budget Insights */}
          <BudgetInsights
            categorySpending={categorySpending}
            dailySpending={getDailySpending()}
            totalSpending={getTotalSpending()}
          />
        </div>
        
        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Built for Nigerian students 🇳🇬
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Your data is synced to the cloud
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
