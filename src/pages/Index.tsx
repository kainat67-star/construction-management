import { Building2, DollarSign, TrendingUp, Receipt, Calculator, BadgeDollarSign } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { CostRevenueChart } from "@/components/dashboard/CostRevenueChart";
import { ExpenseBreakdownChart } from "@/components/dashboard/ExpenseBreakdownChart";
import { RecentActivityTable } from "@/components/dashboard/RecentActivityTable";

const Dashboard = () => {
  return (
    <AppLayout title="Dashboard">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6">
        <KPICard
          title="Total Properties"
          value="12"
          change={{ value: "2 new", trend: "up" }}
          icon={Building2}
          variant="default"
        />
        <KPICard
          title="Purchase Investment"
          value="Rs. 4.2M"
          change={{ value: "12%", trend: "up" }}
          icon={DollarSign}
          variant="accent"
        />
        <KPICard
          title="Operational Costs (YTD)"
          value="Rs. 695K"
          change={{ value: "8%", trend: "down" }}
          icon={Calculator}
          variant="default"
        />
        <KPICard
          title="Revenue (YTD)"
          value="Rs. 956K"
          change={{ value: "15%", trend: "up" }}
          icon={TrendingUp}
          variant="default"
        />
        <KPICard
          title="Taxes Paid (YTD)"
          value="Rs. 156K"
          change={{ value: "3%", trend: "up" }}
          icon={Receipt}
          variant="warning"
        />
        <KPICard
          title="Net Profit"
          value="Rs. 261K"
          change={{ value: "22%", trend: "up" }}
          icon={BadgeDollarSign}
          variant="success"
        />
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CostRevenueChart />
        </div>
        <ExpenseBreakdownChart />
      </div>

      {/* Recent Activity */}
      <RecentActivityTable />
    </AppLayout>
  );
};

export default Dashboard;
