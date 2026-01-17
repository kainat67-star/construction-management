import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { FinancialFilters } from "@/components/financials/FinancialFilters";
import { CostManagementTable } from "@/components/financials/CostManagementTable";
import { ProfitBarChart } from "@/components/financials/ProfitBarChart";
import { CostRevenueStackedChart } from "@/components/financials/CostRevenueStackedChart";
import { FinancialSummaryCards } from "@/components/financials/FinancialSummaryCards";
import { 
  propertyFinancialData, 
  profitPerProperty, 
  costVsRevenueData,
  financialSummary 
} from "@/data/financialData";

const Financials = () => {
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [dateRange, setDateRange] = useState("ytd");

  // Filter data based on selected property
  const filteredFinancialData = selectedProperty === "all" 
    ? propertyFinancialData 
    : propertyFinancialData.filter(p => p.id === selectedProperty);

  const filteredProfitData = selectedProperty === "all"
    ? profitPerProperty
    : profitPerProperty.filter(p => {
        const property = propertyFinancialData.find(pf => pf.name === p.fullName);
        return property?.id === selectedProperty;
      });

  const filteredCostRevenueData = selectedProperty === "all"
    ? costVsRevenueData
    : costVsRevenueData.filter(p => {
        const property = propertyFinancialData.find(pf => pf.name.startsWith(p.name.replace("...", "")));
        return property?.id === selectedProperty;
      });

  return (
    <AppLayout title="Financial Dashboard">
      {/* Top Filters */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <FinancialFilters
          selectedProperty={selectedProperty}
          onPropertyChange={setSelectedProperty}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <div className="text-sm text-muted-foreground">
          Showing data for: <span className="font-medium text-foreground">{dateRange === "ytd" ? "Year to Date" : dateRange}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6">
        <FinancialSummaryCards data={financialSummary} />
      </div>

      {/* Cost Management Table */}
      <div className="mb-6">
        <CostManagementTable data={filteredFinancialData} />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ProfitBarChart data={filteredProfitData} />
        <CostRevenueStackedChart data={filteredCostRevenueData} />
      </div>
    </AppLayout>
  );
};

export default Financials;
