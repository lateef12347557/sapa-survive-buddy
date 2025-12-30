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
import { useFinancialData } from '@/hooks/useFinancialData';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';

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
          
          {/* Budget Insights */}
          <BudgetInsights
            categorySpending={getSpendingByCategory()}
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
