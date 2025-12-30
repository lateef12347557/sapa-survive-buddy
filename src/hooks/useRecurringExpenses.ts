import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { TransactionCategory, CATEGORY_LABELS } from '@/hooks/useTransactions';

export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface RecurringExpense {
  id: string;
  user_id: string;
  amount: number;
  category: TransactionCategory;
  description: string;
  frequency: Frequency;
  next_due_date: string;
  is_active: boolean;
  created_at: string;
}

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

export const useRecurringExpenses = () => {
  const { user } = useAuth();
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecurringExpenses = useCallback(async () => {
    if (!user) {
      setRecurringExpenses([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('recurring_expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('next_due_date', { ascending: true });

      if (error) throw error;
      setRecurringExpenses((data as RecurringExpense[]) || []);
    } catch (error) {
      console.error('Error fetching recurring expenses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load recurring expenses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRecurringExpenses();
  }, [fetchRecurringExpenses]);

  const addRecurringExpense = async (
    amount: number,
    category: TransactionCategory,
    description: string,
    frequency: Frequency
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('recurring_expenses').insert({
        user_id: user.id,
        amount,
        category,
        description,
        frequency,
        next_due_date: new Date().toISOString().split('T')[0],
      });

      if (error) throw error;

      toast({
        title: 'Recurring expense added',
        description: `${description} - ₦${amount.toLocaleString()} ${FREQUENCY_LABELS[frequency].toLowerCase()}`,
      });

      await fetchRecurringExpenses();
    } catch (error) {
      console.error('Error adding recurring expense:', error);
      toast({
        title: 'Error',
        description: 'Failed to add recurring expense',
        variant: 'destructive',
      });
    }
  };

  const toggleRecurringExpense = async (id: string, isActive: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('recurring_expenses')
        .update({ is_active: isActive })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: isActive ? 'Expense activated' : 'Expense paused',
      });

      await fetchRecurringExpenses();
    } catch (error) {
      console.error('Error toggling recurring expense:', error);
      toast({
        title: 'Error',
        description: 'Failed to update expense',
        variant: 'destructive',
      });
    }
  };

  const deleteRecurringExpense = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('recurring_expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Recurring expense deleted',
      });

      await fetchRecurringExpenses();
    } catch (error) {
      console.error('Error deleting recurring expense:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete expense',
        variant: 'destructive',
      });
    }
  };

  // Get expenses that are due today or overdue
  const getDueExpenses = useCallback((): RecurringExpense[] => {
    const today = new Date().toISOString().split('T')[0];
    return recurringExpenses.filter(
      (exp) => exp.is_active && exp.next_due_date <= today
    );
  }, [recurringExpenses]);

  // Calculate total monthly recurring cost
  const getMonthlyTotal = useCallback((): number => {
    return recurringExpenses
      .filter((exp) => exp.is_active)
      .reduce((total, exp) => {
        const amount = Number(exp.amount);
        switch (exp.frequency) {
          case 'daily':
            return total + amount * 30;
          case 'weekly':
            return total + amount * 4;
          case 'monthly':
            return total + amount;
          default:
            return total;
        }
      }, 0);
  }, [recurringExpenses]);

  return {
    recurringExpenses,
    loading,
    addRecurringExpense,
    toggleRecurringExpense,
    deleteRecurringExpense,
    getDueExpenses,
    getMonthlyTotal,
    refetch: fetchRecurringExpenses,
  };
};
