import { useState } from "react";
import { ExpenseForm, type Expense } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseSummary } from "@/components/ExpenseSummary";
import { Wallet } from "lucide-react";

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString()
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">ExpenseTracker</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take control of your finances. Track expenses, monitor income, and achieve your financial goals.
          </p>
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
    </div>
  );
};

export default Index;
