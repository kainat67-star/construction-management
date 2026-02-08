import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { getProperties, Property } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDailyLogs } from "@/data/dailyLogs";
import { PropertyImageGallery } from "@/components/properties/PropertyImageGallery";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const properties = getProperties();
  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <AppLayout title="Property Not Found">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg font-medium text-muted-foreground">Property not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/properties")}>
            Back to Properties
          </Button>
        </div>
      </AppLayout>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Get expenses linked to this property from daily logs
  const dailyLogs = getDailyLogs();
  const propertyExpenses = dailyLogs
    .flatMap(log => 
      log.expenses
        .filter(exp => exp.propertyId === property.id)
        .map(exp => ({
          ...exp,
          date: log.date,
        }))
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  // Calculate total project cost
  const totalProjectCost = property.purchasePrice + propertyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate partner investments
  const totalPartnerInvestments = (property.partners || []).reduce(
    (sum, partner) => sum + (partner.investmentAmount || 0),
    0
  );

  // Calculate financial status
  const totalExpenses = propertyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netPosition = totalPartnerInvestments - totalProjectCost;

  return (
    <AppLayout title="Property Details">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/50">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="gap-2 -ml-2"
              onClick={() => navigate("/properties")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Properties
            </Button>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">{property.name}</h1>
              <p className="text-lg text-muted-foreground font-medium">{property.location}</p>
            </div>
          </div>
        </div>

        {/* Property Images Gallery */}
        {property.images && property.images.length > 0 && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold">Property Images</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyImageGallery images={property.images} />
            </CardContent>
          </Card>
        )}

        {/* Detailed Property Information */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">Property Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Category</p>
                  <Badge variant="secondary" className="text-base">
                    {property.category}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Type</p>
                  <Badge variant="secondary" className="text-base">
                    {property.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Status</p>
                  <Badge variant="outline" className="text-base">
                    {property.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Purchase Date</p>
                  <p className="text-base font-medium">{formatDate(property.purchaseDate)}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Purchase Price</p>
                    <p className="text-2xl font-bold">{formatCurrency(property.purchasePrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Ownership Type</p>
                    <p className="text-base font-medium">
                      {property.ownershipType || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Construction Details */}
              {property.constructionDetails && (
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-4">Construction Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Construction Start Date</p>
                      <p className="text-base font-medium">
                        {formatDate(property.constructionDetails.constructionStartDate)}
                      </p>
                    </div>
                    {property.constructionDetails.expectedCompletionDate && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Expected Completion Date</p>
                        <p className="text-base font-medium">
                          {formatDate(property.constructionDetails.expectedCompletionDate)}
                        </p>
                      </div>
                    )}
                    {property.constructionDetails.contractorName && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Contractor Name</p>
                        <p className="text-base font-medium">
                          {property.constructionDetails.contractorName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rental Details */}
              {property.rentalDetails && (
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-4">Rental Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tenant Name</p>
                      <p className="text-base font-medium">{property.rentalDetails.tenantName}</p>
                    </div>
                    {property.rentalDetails.tenantPhoneNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tenant Phone</p>
                        <p className="text-base font-medium">
                          {property.rentalDetails.tenantPhoneNumber}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Monthly Rent</p>
                      <p className="text-base font-semibold">
                        {formatCurrency(property.rentalDetails.monthlyRentAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Rent Due Date</p>
                      <p className="text-base font-medium">
                        Day {property.rentalDetails.rentDueDate} of each month
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {property.notes && (
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-2">Notes</h3>
                  <p className="text-base text-foreground whitespace-pre-wrap">{property.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Partner/Investor Information */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">
              {property.partners && property.partners.length > 0
                ? "Partners & Investors"
                : "Ownership Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {property.partners && property.partners.length > 0 ? (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-base">Partner Name</TableHead>
                        <TableHead className="text-base">Investment Amount</TableHead>
                        <TableHead className="text-base">Share Percentage</TableHead>
                        <TableHead className="text-base">Investment Share</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {property.partners.map((partner, index) => {
                        const investmentShare =
                          totalPartnerInvestments > 0
                            ? ((partner.investmentAmount || 0) / totalPartnerInvestments) * 100
                            : 0;
                        return (
                          <TableRow key={index}>
                            <TableCell className="text-base font-medium">
                              {partner.name}
                            </TableCell>
                            <TableCell className="text-base font-semibold">
                              {formatCurrency(partner.investmentAmount || 0)}
                            </TableCell>
                            <TableCell className="text-base">
                              {partner.sharePercentage
                                ? `${partner.sharePercentage}%`
                                : "-"}
                            </TableCell>
                            <TableCell className="text-base">
                              {investmentShare > 0
                                ? `${investmentShare.toFixed(1)}%`
                                : "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">Total Partner Investments</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(totalPartnerInvestments)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-base text-muted-foreground">Number of Partners</p>
                    <p className="text-lg font-semibold">
                      {property.partners.length} {property.partners.length === 1 ? "Partner" : "Partners"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <p className="text-base text-muted-foreground">
                  This property is owned by a single owner. No partner information available.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expense Report */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">Expense Report</CardTitle>
          </CardHeader>
          <CardContent>
            {propertyExpenses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-base">
                No expenses linked to this property yet.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-base">Date</TableHead>
                        <TableHead className="text-base">Description</TableHead>
                        <TableHead className="text-base">Amount</TableHead>
                        <TableHead className="text-base">Payment Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {propertyExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell className="text-base">
                            {formatDate(expense.date)}
                          </TableCell>
                          <TableCell className="text-base">{expense.description}</TableCell>
                          <TableCell className="text-base font-semibold">
                            {formatCurrency(expense.amount)}
                          </TableCell>
                          <TableCell className="text-base">
                            {expense.paymentMethod}
                            {expense.bankName && ` (${expense.bankName})`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">Total Expenses</p>
                    <p className="text-2xl font-bold text-destructive">
                      {formatCurrency(totalExpenses)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Status */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">Overall Financial Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Purchase Price</p>
                  <p className="text-2xl font-bold">{formatCurrency(property.purchasePrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-destructive">
                    {formatCurrency(totalExpenses)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Project Cost</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalProjectCost)}</p>
                </div>
                {property.partners && property.partners.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Partner Investments</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(totalPartnerInvestments)}
                    </p>
                  </div>
                )}
              </div>
              {property.partners && property.partners.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">Net Position</p>
                    <p
                      className={`text-3xl font-bold ${
                        netPosition >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-destructive"
                      }`}
                    >
                      {formatCurrency(Math.abs(netPosition))}
                      {netPosition >= 0 ? " (Surplus)" : " (Deficit)"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PropertyDetail;
