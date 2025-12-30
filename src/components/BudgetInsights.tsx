import { useMemo } from 'react';
import { format } from 'date-fns';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  CategorySpending,
  DailySpending,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  TransactionCategory,
} from '@/hooks/useTransactions';

interface BudgetInsightsProps {
  categorySpending: CategorySpending[];
  dailySpending: DailySpending[];
  totalSpending: number;
}

const BudgetInsights = ({ categorySpending, dailySpending, totalSpending }: BudgetInsightsProps) => {
  const pieData = useMemo(() => 
    categorySpending
      .sort((a, b) => b.total - a.total)
      .map((item) => ({
        name: CATEGORY_LABELS[item.category],
        value: item.total,
        color: CATEGORY_COLORS[item.category],
        category: item.category,
      })),
    [categorySpending]
  );

  const barData = useMemo(() =>
    dailySpending.map((item) => ({
      day: format(new Date(item.date), 'EEE'),
      amount: item.total,
      fullDate: item.date,
    })),
    [dailySpending]
  );

  const topCategory = pieData[0];

  if (totalSpending === 0) {
    return (
      <div className="glass-card p-5 animate-fade-in">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Budget Insights</h3>
        <p className="text-center text-muted-foreground py-8 text-sm">
          Start adding expenses to see your spending patterns
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Budget Insights</h3>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total Spent</p>
          <p className="font-bold text-foreground">₦{totalSpending.toLocaleString()}</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-3">Spending by Category</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 10%)',
                    border: '1px solid hsl(222, 30%, 16%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 40%, 98%)',
                  }}
                  formatter={(value: number) => [`₦${value.toLocaleString()}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground mb-3">Top Categories</p>
          {pieData.slice(0, 4).map((item) => (
            <div key={item.category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-foreground">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                ₦{item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Trend */}
      <div>
        <p className="text-xs text-muted-foreground mb-3">Last 7 Days</p>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 47%, 10%)',
                  border: '1px solid hsl(222, 30%, 16%)',
                  borderRadius: '8px',
                  color: 'hsl(210, 40%, 98%)',
                }}
                formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Spent']}
                labelFormatter={(label) => label}
              />
              <Bar
                dataKey="amount"
                fill="hsl(166, 76%, 47%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insight */}
      {topCategory && (
        <div className="p-3 rounded-xl bg-secondary/50">
          <p className="text-xs text-muted-foreground">
            💡 Your biggest expense category is{' '}
            <span className="font-medium text-foreground">{topCategory.name}</span>
            {' '}at{' '}
            <span className="font-medium text-foreground">
              ₦{topCategory.value.toLocaleString()}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetInsights;
