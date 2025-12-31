import { RecurringExpense, Frequency } from '@/hooks/useRecurringExpenses';

/**
 * Calculate the "True Balance" - balance after deducting all recurring expenses
 * This is the money students actually have to spend freely
 */
export const calculateTrueBalance = (
  currentBalance: number,
  recurringExpenses: RecurringExpense[],
  daysRemaining: number
): number => {
  // Calculate total recurring costs for the remaining period
  const activeExpenses = recurringExpenses.filter((e) => e.is_active);
  
  let totalRecurringCost = 0;
  
  activeExpenses.forEach((expense) => {
    const amount = Number(expense.amount);
    
    switch (expense.frequency) {
      case 'daily':
        totalRecurringCost += amount * daysRemaining;
        break;
      case 'weekly':
        totalRecurringCost += amount * Math.ceil(daysRemaining / 7);
        break;
      case 'monthly':
        totalRecurringCost += amount * Math.ceil(daysRemaining / 30);
        break;
    }
  });
  
  return Math.max(0, currentBalance - totalRecurringCost);
};

/**
 * Calculate the recurring reserve (amount locked for bills)
 */
export const calculateRecurringReserve = (
  currentBalance: number,
  recurringExpenses: RecurringExpense[],
  daysRemaining: number
): number => {
  const trueBalance = calculateTrueBalance(currentBalance, recurringExpenses, daysRemaining);
  return currentBalance - trueBalance;
};

/**
 * Calculate the monthly total of recurring expenses
 */
export const getMonthlyRecurringTotal = (recurringExpenses: RecurringExpense[]): number => {
  const activeExpenses = recurringExpenses.filter((e) => e.is_active);
  
  return activeExpenses.reduce((total, expense) => {
    const amount = Number(expense.amount);
    switch (expense.frequency) {
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
};

/**
 * Calculate the "Pain Level" of an expense
 * If expense is > 20% of remaining daily balance, it's painful
 */
export const getExpensePainLevel = (
  expenseAmount: number,
  dailyBalance: number
): { isPainful: boolean; percentage: number } => {
  if (dailyBalance <= 0) {
    return { isPainful: true, percentage: 100 };
  }
  
  const percentage = (expenseAmount / dailyBalance) * 100;
  return {
    isPainful: percentage > 20,
    percentage: Math.round(percentage),
  };
};

/**
 * Define "Fun" categories that get Hard Stops
 */
export const FUN_CATEGORIES = ['entertainment', 'other'] as const;

/**
 * Check if a category is a "Fun" category
 */
export const isFunCategory = (category: string): boolean => {
  return FUN_CATEGORIES.includes(category as typeof FUN_CATEGORIES[number]);
};

/**
 * Get hard stop message for fun categories
 */
export const getHardStopMessage = (category: string): string => {
  const messages: Record<string, string> = {
    entertainment: "No more outings! Your future self is begging you to eat at home. 🏠",
    other: "Hold up! That's enough random spending. Your bank account needs a break. 💭",
  };
  
  return messages[category] || "Budget limit reached! Time to chill on the spending. 🛑";
};
