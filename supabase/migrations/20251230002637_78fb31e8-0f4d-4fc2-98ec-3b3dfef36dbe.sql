-- Create recurring_expenses table
CREATE TABLE public.recurring_expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('food', 'transport', 'airtime', 'utilities', 'entertainment', 'other')),
  description TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  next_due_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create budget_limits table
CREATE TABLE public.budget_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('food', 'transport', 'airtime', 'utilities', 'entertainment', 'other')),
  monthly_limit NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, category)
);

-- Enable RLS on recurring_expenses
ALTER TABLE public.recurring_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recurring expenses" 
ON public.recurring_expenses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own recurring expenses" 
ON public.recurring_expenses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recurring expenses" 
ON public.recurring_expenses FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recurring expenses" 
ON public.recurring_expenses FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS on budget_limits
ALTER TABLE public.budget_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own budget limits" 
ON public.budget_limits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own budget limits" 
ON public.budget_limits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budget limits" 
ON public.budget_limits FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budget limits" 
ON public.budget_limits FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_recurring_expenses_user_id ON public.recurring_expenses(user_id);
CREATE INDEX idx_recurring_expenses_next_due ON public.recurring_expenses(next_due_date);
CREATE INDEX idx_budget_limits_user_id ON public.budget_limits(user_id);

-- Trigger for budget_limits updated_at
CREATE TRIGGER update_budget_limits_updated_at
BEFORE UPDATE ON public.budget_limits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();