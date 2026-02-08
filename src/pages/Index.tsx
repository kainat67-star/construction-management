import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardKPICard } from "@/components/dashboard/DashboardKPICard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ActivePropertyList } from "@/components/dashboard/ActivePropertyList";
import { MessagesList } from "@/components/dashboard/MessagesList";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Top Row: KPI Cards (2x2) + Revenue Chart */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-3">
          {/* KPI Cards - 2x2 Grid on Left */}
          <div className="xl:col-span-2 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <DashboardKPICard
              title="Total Sale"
              value="$9,8360"
              description="Properties Growth from previous month"
              trendData={[20, 25, 30, 28, 35, 40, 38, 42, 45, 48, 50, 52]}
              color="#a855f7"
            />
            <DashboardKPICard
              title="Property View"
              value="98360"
              description="Properties Growth from previous month"
              trendData={[15, 18, 22, 20, 25, 28, 26, 30, 32, 35, 38, 40]}
              color="#fb923c"
            />
            <DashboardKPICard
              title="Asset Value"
              value="98360"
              description="Properties Growth from previous month"
              trendData={[10, 12, 15, 14, 18, 20, 19, 22, 24, 26, 28, 30]}
              color="#22c55e"
            />
            <DashboardKPICard
              title="Property Sold"
              value="98360"
              description="Properties Growth from previous month"
              trendData={[5, 8, 10, 9, 12, 15, 14, 16, 18, 20, 22, 25]}
              color="#ef4444"
            />
          </div>
          
          {/* Revenue Chart on Right */}
          <div className="xl:col-span-1">
            <RevenueChart />
          </div>
        </div>

        {/* Bottom Row: Active Property + Messages */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <ActivePropertyList />
          <MessagesList />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
