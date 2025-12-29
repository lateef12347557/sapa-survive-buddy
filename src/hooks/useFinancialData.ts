import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface FinancialData {
  currentBalance: number;
  dailySpending: number;
  daysRemaining: number;
}

interface FinancialState extends FinancialData {
  survivalDays: number;
  status: 'safe' | 'warning' | 'critical';
  loading: boolean;
}

const defaultData: FinancialData = {
  currentBalance: 50000,
  dailySpending: 1500,
  daysRemaining: 60,
};

export const useFinancialData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<FinancialData>(defaultData);
  const [loading, setLoading] = useState(true);

  // Fetch data from database when user is logged in
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: financialData, error } = await supabase
          .from('financial_data')
          .select('current_balance, daily_spending, days_remaining')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching financial data:', error);
          return;
        }

        if (financialData) {
          setData({
            currentBalance: Number(financialData.current_balance),
            dailySpending: Number(financialData.daily_spending),
            daysRemaining: Number(financialData.days_remaining),
          });
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Calculate derived values
  const survivalDays = data.dailySpending > 0 
    ? Math.floor(data.currentBalance / data.dailySpending)
    : data.currentBalance > 0 ? Infinity : 0;

  const getStatus = (days: number): 'safe' | 'warning' | 'critical' => {
    if (days >= 30) return 'safe';
    if (days >= 7) return 'warning';
    return 'critical';
  };

  const status = getStatus(survivalDays === Infinity ? 999 : survivalDays);

  const updateData = useCallback(async (balance: number, spending: number, days: number) => {
    const newData = {
      currentBalance: Math.max(0, balance),
      dailySpending: Math.max(0, spending),
      daysRemaining: Math.max(1, days),
    };
    
    setData(newData);

    // Save to database if user is logged in
    if (user) {
      try {
        const { error } = await supabase
          .from('financial_data')
          .update({
            current_balance: newData.currentBalance,
            daily_spending: newData.dailySpending,
            days_remaining: newData.daysRemaining,
          })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating financial data:', error);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    }
  }, [user]);

  const state: FinancialState = {
    ...data,
    survivalDays: survivalDays === Infinity ? 999 : survivalDays,
    status,
    loading,
  };

  return { ...state, updateData };
};
