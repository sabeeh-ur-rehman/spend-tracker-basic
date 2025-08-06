import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, DollarSign } from "lucide-react";
import type { Expense } from "./ExpenseForm";

interface ExpenseSummaryProps {
  expenses: Expense[];
}

export function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  const totalExpenses = expenses
    .filter(expense => expense.type === 'expense')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalIncome = expenses
    .filter(expense => expense.type === 'income')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const summaryCards = [
    {
      title: "Total Income",
      amount: totalIncome,
      icon: TrendingUp,
      color: "text-income",
      bgColor: "bg-income/20"
    },
    {
      title: "Total Expenses", 
      amount: totalExpenses,
      icon: TrendingDown,
      color: "text-expense",
      bgColor: "bg-expense/20"
    },
    {
      title: "Balance",
      amount: balance,
      icon: DollarSign,
      color: balance >= 0 ? "text-income" : "text-expense",
      bgColor: balance >= 0 ? "bg-income/20" : "bg-expense/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {summaryCards.map((card, index) => (
        <Card key={card.title} className={`${
          index === 1 ? 'bg-gradient-primary text-white border-primary/30' : 'bg-gradient-card border border-border/30'
        } backdrop-blur-sm`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${
              index === 1 ? 'text-white/80' : 'text-muted-foreground'
            }`}>
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${
              index === 1 ? 'bg-white/20' : card.bgColor
            }`}>
              <card.icon className={`h-4 w-4 ${
                index === 1 ? 'text-white' : card.color
              }`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              index === 1 ? 'text-white' : card.color
            }`}>
              {card.title === "Balance" && balance < 0 && "-"}
              {formatCurrency(Math.abs(card.amount))}
            </div>
            <p className={`text-xs mt-1 ${
              index === 1 ? 'text-white/70' : 'text-muted-foreground'
            }`}>
              {card.title === "Balance" 
                ? balance >= 0 
                  ? "You're in the green!" 
                  : "Consider reducing expenses"
                : `${expenses.filter(e => e.type === (card.title.includes('Income') ? 'income' : 'expense')).length} transactions`
              }
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}