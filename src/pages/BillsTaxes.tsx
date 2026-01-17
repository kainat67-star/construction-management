import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillsFilters } from "@/components/bills-taxes/BillsFilters";
import { BillsManagementTable } from "@/components/bills-taxes/BillsManagementTable";
import { TaxSummaryCards } from "@/components/bills-taxes/TaxSummaryCards";
import { TaxManagementTable } from "@/components/bills-taxes/TaxManagementTable";
import { MonthlyExpenseChart } from "@/components/bills-taxes/MonthlyExpenseChart";
import { YearlyTaxComparisonChart } from "@/components/bills-taxes/YearlyTaxComparisonChart";
import { 
  bills, 
  taxes, 
  taxSummary, 
  monthlyExpenseTrend, 
  yearlyTaxComparison 
} from "@/data/billsTaxesData";
import { FileText, Receipt } from "lucide-react";

const BillsTaxes = () => {
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("bills");

  // Filter bills based on selections
  const filteredBills = bills.filter((bill) => {
    if (selectedProperty !== "all" && bill.propertyId !== selectedProperty) return false;
    if (selectedCategory !== "all" && bill.category !== selectedCategory) return false;
    if (selectedStatus !== "all" && bill.status !== selectedStatus) return false;
    return true;
  });

  // Filter taxes based on property selection
  const filteredTaxes = selectedProperty === "all" 
    ? taxes 
    : taxes.filter(tax => tax.propertyId === selectedProperty);

  return (
    <AppLayout title="Bills & Tax Management">
      {/* Summary Cards */}
      <div className="mb-6">
        <TaxSummaryCards data={taxSummary} />
      </div>

      {/* Tabs for Bills and Taxes */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4 bg-muted/50">
          <TabsTrigger value="bills" className="gap-2 data-[state=active]:bg-card">
            <FileText className="h-4 w-4" />
            Bills Management
          </TabsTrigger>
          <TabsTrigger value="taxes" className="gap-2 data-[state=active]:bg-card">
            <Receipt className="h-4 w-4" />
            Tax Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bills" className="space-y-4">
          {/* Filters */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <BillsFilters
              selectedProperty={selectedProperty}
              onPropertyChange={setSelectedProperty}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
          </div>

          {/* Bills Table */}
          <BillsManagementTable data={filteredBills} />
        </TabsContent>

        <TabsContent value="taxes" className="space-y-4">
          {/* Property Filter for Taxes */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <BillsFilters
              selectedProperty={selectedProperty}
              onPropertyChange={setSelectedProperty}
              selectedCategory="all"
              onCategoryChange={() => {}}
              selectedStatus="all"
              onStatusChange={() => {}}
            />
          </div>

          {/* Tax Table */}
          <TaxManagementTable data={filteredTaxes} />
        </TabsContent>
      </Tabs>

      {/* Charts Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Cost Summary & Trends</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <MonthlyExpenseChart data={monthlyExpenseTrend} />
          <YearlyTaxComparisonChart data={yearlyTaxComparison} />
        </div>
      </div>
    </AppLayout>
  );
};

export default BillsTaxes;
