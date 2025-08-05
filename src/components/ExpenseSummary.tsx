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
      {summaryCards.map((card) => (
        <Card key={card.title} className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {card.title === "Balance" && balance < 0 && "-"}
              {formatCurrency(Math.abs(card.amount))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
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