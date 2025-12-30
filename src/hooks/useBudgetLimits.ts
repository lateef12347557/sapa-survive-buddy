import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { TransactionCategory, CategorySpending, CATEGORY_LABELS } from '@/hooks/useTransactions';

export interface BudgetLimit {
  id: string;
  user_id: string;
  category: TransactionCategory;
  monthly_limit: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetAlert {
  category: TransactionCategory;
  limit: number;
  spent: number;
  percentage: number;
  status: 'safe' | 'warning' | 'exceeded';
}

export const useBudgetLimits = (categorySpending: CategorySpending[]) => {
  const { user } = useAuth();
  const [budgetLimits, setBudgetLimits] = useState<BudgetLimit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgetLimits = useCallback(async () => {
    if (!user) {
      setBudgetLimits([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('budget_limits')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setBudgetLimits((data as BudgetLimit[]) || []);
    } catch (error) {
      console.error('Error fetching budget limits:', error);
      toast({
        title: 'Error',
        description: 'Failed to load budget limits',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBudgetLimits();
  }, [fetchBudgetLimits]);

  const setBudgetLimit = async (category: TransactionCategory, limit: number) => {
    if (!user) return;

    try {
      // Use upsert to handle both insert and update
      const { error } = await supabase
        .from('budget_limits')
        .upsert(
          {
            user_id: user.id,
            category,
            monthly_limit: limit,
          },
          {
            onConflict: 'user_id,category',
          }
        );

      if (error) throw error;

      toast({
        title: 'Budget limit set',
        description: `${CATEGORY_LABELS[category]}: ₦${limit.toLocaleString()}/month`,
      });

      await fetchBudgetLimits();
    } catch (error) {
      console.error('Error setting budget limit:', error);
      toast({
        title: 'Error',
        description: 'Failed to set budget limit',
        variant: 'destructive',
      });
    }
  };

  const removeBudgetLimit = async (category: TransactionCategory) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('budget_limits')
        .delete()
        .eq('user_id', user.id)
        .eq('category', category);

      if (error) throw error;

      toast({
        title: 'Budget limit removed',
      });

      await fetchBudgetLimits();
    } catch (error) {
      console.error('Error removing budget limit:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove budget limit',
        variant: 'destructive',
      });
    }
  };

  // Calculate budget alerts based on spending vs limits
  const getBudgetAlerts = useCallback((): BudgetAlert[] => {
    return budgetLimits.map((limit) => {
      const spending = categorySpending.find((s) => s.category === limit.category);
      const spent = spending?.total || 0;
      const limitAmount = Number(limit.monthly_limit);
      const percentage = limitAmount > 0 ? (spent / limitAmount) * 100 : 0;

      let status: 'safe' | 'warning' | 'exceeded' = 'safe';
      if (percentage >= 100) {
        status = 'exceeded';
      } else if (percentage >= 80) {
        status = 'warning';
      }

      return {
        category: limit.category,
        limit: limitAmount,
        spent,
        percentage,
        status,
      };
    });
  }, [budgetLimits, categorySpending]);

  // Get limit for a specific category
  const getLimitForCategory = useCallback(
    (category: TransactionCategory): number | null => {
      const limit = budgetLimits.find((l) => l.category === category);
      return limit ? Number(limit.monthly_limit) : null;
    },
    [budgetLimits]
  );

  return {
    budgetLimits,
    loading,
    setBudgetLimit,
    removeBudgetLimit,
    getBudgetAlerts,
    getLimitForCategory,
    refetch: fetchBudgetLimits,
  };
};
