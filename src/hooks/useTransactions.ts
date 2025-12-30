import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export type TransactionCategory = 'food' | 'transport' | 'airtime' | 'utilities' | 'entertainment' | 'other';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  category: TransactionCategory;
  description: string | null;
  created_at: string;
}

export interface CategorySpending {
  category: TransactionCategory;
  total: number;
  count: number;
}

export interface DailySpending {
  date: string;
  total: number;
}

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  food: 'Food 🍛',
  transport: 'Transport 🚌',
  airtime: 'Airtime 📱',
  utilities: 'Utilities 💡',
  entertainment: 'Entertainment 🎬',
  other: 'Other 📦',
};

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  food: 'hsl(160, 84%, 39%)',
  transport: 'hsl(200, 80%, 50%)',
  airtime: 'hsl(280, 70%, 55%)',
  utilities: 'hsl(45, 93%, 47%)',
  entertainment: 'hsl(320, 70%, 55%)',
  other: 'hsl(215, 20%, 55%)',
};

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setTransactions((data as Transaction[]) || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load transactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Add transaction
  const addTransaction = async (
    amount: number,
    category: TransactionCategory,
    description?: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        amount,
        category,
        description: description || null,
      });

      if (error) throw error;

      toast({
        title: 'Expense added',
        description: `₦${amount.toLocaleString()} for ${CATEGORY_LABELS[category]}`,
      });

      await fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to add expense',
        variant: 'destructive',
      });
    }
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Expense deleted',
      });

      await fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete expense',
        variant: 'destructive',
      });
    }
  };

  // Calculate spending by category
  const getSpendingByCategory = useCallback((): CategorySpending[] => {
    const categoryMap = new Map<TransactionCategory, { total: number; count: number }>();

    transactions.forEach((tx) => {
      const existing = categoryMap.get(tx.category) || { total: 0, count: 0 };
      categoryMap.set(tx.category, {
        total: existing.total + Number(tx.amount),
        count: existing.count + 1,
      });
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      ...data,
    }));
  }, [transactions]);

  // Calculate daily spending for the last 7 days
  const getDailySpending = useCallback((): DailySpending[] => {
    const today = new Date();
    const last7Days: DailySpending[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayTotal = transactions
        .filter((tx) => tx.created_at.startsWith(dateStr))
        .reduce((sum, tx) => sum + Number(tx.amount), 0);

      last7Days.push({
        date: dateStr,
        total: dayTotal,
      });
    }

    return last7Days;
  }, [transactions]);

  // Get total spending
  const getTotalSpending = useCallback((): number => {
    return transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  }, [transactions]);

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    getSpendingByCategory,
    getDailySpending,
    getTotalSpending,
    refetch: fetchTransactions,
  };
};
