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
          type: 'expense' // For now, all entries are expenses. You can add type column later
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
        category: expense.category
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
          type: 'expense'
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary/20">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Paisy App</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Welcome back! Track your expenses and manage your finances.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm">{user.email}</span>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
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