import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'sapaflow_data';

interface FinancialData {
  currentBalance: number;
  dailySpending: number;
  daysRemaining: number;
}

interface FinancialState extends FinancialData {
  survivalDays: number;
  status: 'safe' | 'warning' | 'critical';
}

const defaultData: FinancialData = {
  currentBalance: 50000,
  dailySpending: 1500,
  daysRemaining: 60,
};

export const useFinancialData = () => {
  const [data, setData] = useState<FinancialData>(() => {
    // Load from localStorage on initial render
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate parsed data
        if (
          typeof parsed.currentBalance === 'number' &&
          typeof parsed.dailySpending === 'number' &&
          typeof parsed.daysRemaining === 'number'
        ) {
          return {
            currentBalance: Math.max(0, parsed.currentBalance),
            dailySpending: Math.max(0, parsed.dailySpending),
            daysRemaining: Math.max(1, parsed.daysRemaining),
          };
        }
      }
    } catch (error) {
      console.warn('Failed to load saved data:', error);
    }
    return defaultData;
  });

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

  // Persist to localStorage when data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save data:', error);
    }
  }, [data]);

  const updateData = useCallback((balance: number, spending: number, days: number) => {
    setData({
      currentBalance: Math.max(0, balance),
      dailySpending: Math.max(0, spending),
      daysRemaining: Math.max(1, days),
    });
  }, []);

  const state: FinancialState = {
    ...data,
    survivalDays: survivalDays === Infinity ? 999 : survivalDays,
    status,
  };

  return { ...state, updateData };
};
