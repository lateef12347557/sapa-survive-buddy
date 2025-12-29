-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Create financial_data table to store user's budget settings
CREATE TABLE public.financial_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_balance NUMERIC NOT NULL DEFAULT 0,
  daily_spending NUMERIC NOT NULL DEFAULT 0,
  days_remaining INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on financial_data
ALTER TABLE public.financial_data ENABLE ROW LEVEL SECURITY;

-- Financial data policies
CREATE POLICY "Users can view own financial data" 
ON public.financial_data FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial data" 
ON public.financial_data FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial data" 
ON public.financial_data FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial data" 
ON public.financial_data FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  
  INSERT INTO public.financial_data (user_id, current_balance, daily_spending, days_remaining)
  VALUES (new.id, 50000, 1500, 60);
  
  RETURN new;
END;
$$;

-- Trigger to create profile and financial data on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_data_updated_at
  BEFORE UPDATE ON public.financial_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();