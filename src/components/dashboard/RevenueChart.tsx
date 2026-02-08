import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const revenueData = [
  { month: "Jan", deals: 20, dealValue: 30 },
  { month: "Feb", deals: 25, dealValue: 35 },
  { month: "Mar", deals: 30, dealValue: 40 },
  { month: "Apr", deals: 35, dealValue: 45 },
  { month: "May", deals: 40, dealValue: 50 },
  { month: "Jun", deals: 40, dealValue: 60 },
  { month: "Jul", deals: 35, dealValue: 55 },
  { month: "Aug", deals: 38, dealValue: 58 },
  { month: "Sep", deals: 32, dealValue: 52 },
  { month: "Oct", deals: 42, dealValue: 62 },
  { month: "Nov", deals: 38, dealValue: 58 },
  { month: "Dec", deals: 45, dealValue: 65 },
];

export function RevenueChart() {
  return (
    <Card className="border-border shadow-card">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4">
        <CardTitle className="text-base sm:text-lg font-bold">Revenue Generation</CardTitle>
        <Select defaultValue="last-month">
          <SelectTrigger className="w-full sm:w-[120px] h-8 text-xs">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            <SelectItem value="last-6-months">Last 6 Months</SelectItem>
            <SelectItem value="last-year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.3} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  padding: "8px",
                }}
                formatter={(value: number, name: string) => {
                  if (name === "deals") {
                    return [`${value} Deals`, "Deals"];
                  }
                  return [`$${value.toLocaleString()} Deal value`, "Deal value"];
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 16 }}
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 12 }}>
                    {value === "deals" ? "Deals" : "Deal value"}
                  </span>
                )}
              />
              <Bar dataKey="deals" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="dealValue" stackId="a" fill="#fb923c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
