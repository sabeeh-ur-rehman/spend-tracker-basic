-- Add type column to expenses table
ALTER TABLE public.expenses 
ADD COLUMN type TEXT NOT NULL DEFAULT 'expense' 
CHECK (type IN ('expense', 'income'));