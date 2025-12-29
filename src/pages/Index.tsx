import Header from '@/components/Header';
import BalanceCard from '@/components/BalanceCard';
import SurvivalMeter from '@/components/SurvivalMeter';
import StatusBadge from '@/components/StatusBadge';
import InputForm from '@/components/InputForm';
import { useFinancialData } from '@/hooks/useFinancialData';

const Index = () => {
  const { 
    currentBalance, 
    dailySpending, 
    daysRemaining, 
    survivalDays, 
    status, 
    updateData 
  } = useFinancialData();

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
        </div>
        
        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Built for Nigerian students 🇳🇬
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Your data is saved locally on this device
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
