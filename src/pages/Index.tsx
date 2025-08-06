import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExpenseForm, type Expense } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseSummary } from "@/components/ExpenseSummary";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchExpenses();
  }, [user, navigate]);
  const fetchExpenses = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('expenses').select('*').order('created_at', {
        ascending: false
      });
      if (error) {
        console.error('Error fetching expenses:', error);
        toast({
          title: "Error",
          description: "Failed to load expenses",
          variant: "destructive"
        });
      } else {
        // Transform database data to match our Expense interface
        const transformedExpenses: Expense[] = data.map(expense => ({
          id: expense.id,
          amount: Number(expense.amount),
          description: expense.description,
          category: expense.category,
          date: expense.created_at,
          type: expense.type as 'expense' | 'income'
        }));
        setExpenses(transformedExpenses);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!user) return;
    try {
      const {
        data,
        error
      } = await supabase.from('expenses').insert({
        user_id: user.id,
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
        type: expense.type
      }).select().single();
      if (error) {
        console.error('Error adding expense:', error);
        toast({
          title: "Error",
          description: "Failed to add expense",
          variant: "destructive"
        });
      } else {
        const newExpense: Expense = {
          id: data.id,
          amount: Number(data.amount),
          description: data.description,
          category: data.category,
          date: data.created_at,
          type: data.type as 'expense' | 'income'
        };
        setExpenses(prev => [newExpense, ...prev]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const deleteExpense = async (id: string) => {
    try {
      const {
        error
      } = await supabase.from('expenses').delete().eq('id', id);
      if (error) {
        console.error('Error deleting expense:', error);
        toast({
          title: "Error",
          description: "Failed to delete expense",
          variant: "destructive"
        });
      } else {
        setExpenses(prev => prev.filter(expense => expense.id !== id));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };
  if (!user) {
    return null; // Will redirect to auth
  }
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your expenses...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      {/* Hero background with gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-20 pointer-events-none" />
      
      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-4 rounded-full bg-gradient-primary">
                <Wallet className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Paisy App
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Your Financial AI Assistant
                </p>
              </div>
            </div>
            <p className="text-xl text-foreground/80 max-w-2xl mx-[5px] px-0 my-[23px]">
              Get AI-Generated Financial Solutions in Seconds
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border/30">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">{user.email}</span>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2 border-border/30 hover:bg-card/50">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8">
          <ExpenseSummary expenses={expenses} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Expense Form */}
          <div>
            <ExpenseForm onAddExpense={addExpense} />
          </div>

          {/* Expense List */}
          <div>
            <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
          </div>
        </div>
      </div>
    </div>;
};
export default Index;