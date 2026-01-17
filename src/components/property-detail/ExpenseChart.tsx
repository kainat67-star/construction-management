import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Expense } from "@/data/propertyDetails";

interface ExpenseChartProps {
  expenses: Expense[];
}

const categoryColors: Record<string, string> = {
  Maintenance: "hsl(var(--chart-1))",
  Utilities: "hsl(var(--chart-2))",
  Insurance: "hsl(var(--chart-3))",
  Repairs: "hsl(var(--chart-4))",
  Management: "hsl(var(--chart-5))",
  Security: "hsl(var(--primary))",
  Cleaning: "hsl(var(--chart-6))",
  Landscaping: "hsl(var(--success))",
};

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  // Aggregate expenses by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    color: categoryColors[name] || "hsl(var(--muted))",
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(value);

  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <h3 className="font-semibold text-card-foreground mb-1">Cost Distribution</h3>
      <p className="text-sm text-muted-foreground mb-4">Expense breakdown by category</p>

      {chartData.length > 0 ? (
        <>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: number) => [formatCurrency(value), "Amount"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-card-foreground">{formatCurrency(item.value)}</span>
                  <span className="text-xs text-muted-foreground">({Math.round((item.value / total) * 100)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          No expense data available
        </div>
      )}
    </div>
  );
}
