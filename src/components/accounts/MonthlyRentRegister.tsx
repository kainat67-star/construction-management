import { useState } from "react";
import { Property, LedgerEntry } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Calendar, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface MonthlyRentRegisterProps {
  property: Property;
  onAddRentEntry: (entry: Omit<LedgerEntry, "id">) => void;
  onAddRentalExpense: (entry: Omit<LedgerEntry, "id">) => void;
}

interface RentRecord {
  year: number;
  month: number;
  monthName: string;
  dueDate: string;
  amount: number;
  isReceived: boolean;
  receivedDate?: string;
  entryId?: string;
}

export function MonthlyRentRegister({
  property,
  onAddRentEntry,
  onAddRentalExpense,
}: MonthlyRentRegisterProps) {
  const { toast } = useToast();
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<{ year: number; month: number } | null>(null);
  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    paymentMethod: "" as "" | "Cash" | "Bank" | "Cheque",
    paidTo: "",
    notes: "",
  });

  if (!property.rentalDetails) {
    return null;
  }

  const rentalDetails = property.rentalDetails;
  const monthlyRent = rentalDetails.monthlyRentAmount;
  const rentDueDate = rentalDetails.rentDueDate;
  const entries = property.ledgerEntries || [];

  // Get all rent entries
  const rentEntries = entries.filter(
    (e) => e.category === "Rent" && e.type === "Credit"
  );

  // Generate monthly rent records
  const generateRentRecords = (): RentRecord[] => {
    const records: RentRecord[] = [];
    const currentDate = new Date();
    const startDate = new Date(property.purchaseDate);
    
    // Generate records from purchase date to current date + 3 months ahead
    const endDate = new Date(currentDate);
    endDate.setMonth(endDate.getMonth() + 3);

    let current = new Date(startDate);
    current.setDate(rentDueDate);

    while (current <= endDate) {
      const year = current.getFullYear();
      const month = current.getMonth();
      const monthName = current.toLocaleDateString("en-PK", { month: "long", year: "numeric" });
      const dueDate = new Date(year, month, rentDueDate).toISOString().split("T")[0];

      // Check if rent was received for this month
      const rentEntry = rentEntries.find((e) => {
        const entryDate = new Date(e.date);
        return entryDate.getFullYear() === year && entryDate.getMonth() === month;
      });

      records.push({
        year,
        month,
        monthName,
        dueDate,
        amount: monthlyRent,
        isReceived: !!rentEntry,
        receivedDate: rentEntry?.date,
        entryId: rentEntry?.id,
      });

      current.setMonth(current.getMonth() + 1);
    }

    return records;
  };

  const rentRecords = generateRentRecords();

  const handleMarkRentReceived = (record: RentRecord) => {
    if (record.isReceived) {
      toast({
        title: "Rent already received",
        description: `Rent for ${record.monthName} has already been recorded.`,
      });
      return;
    }

    const entry: Omit<LedgerEntry, "id"> = {
      date: new Date().toISOString().split("T")[0],
      description: `Monthly Rent - ${record.monthName}`,
      type: "Credit",
      amount: record.amount,
      category: "Rent",
      paidToReceivedFrom: rentalDetails.tenantName,
      notes: `Rent for ${record.monthName}`,
    };

    onAddRentEntry(entry);
    toast({
      title: "Rent marked as received",
      description: `Rent for ${record.monthName} has been added to the ledger.`,
    });
  };

  const handleAddRentalExpense = (e: React.FormEvent) => {
    e.preventDefault();

    if (!expenseForm.description || !expenseForm.amount || parseFloat(expenseForm.amount) <= 0) {
      return;
    }

    const entry: Omit<LedgerEntry, "id"> = {
      date: expenseForm.date,
      description: expenseForm.description,
      type: "Debit",
      amount: parseFloat(expenseForm.amount),
      category: "Maintenance",
      paymentMethod: expenseForm.paymentMethod || undefined,
      paidToReceivedFrom: expenseForm.paidTo || undefined,
      notes: expenseForm.notes || undefined,
    };

    onAddRentalExpense(entry);
    setShowExpenseDialog(false);
    setExpenseForm({
      date: new Date().toISOString().split("T")[0],
      description: "",
      amount: "",
      paymentMethod: "",
      paidTo: "",
      notes: "",
    });
    toast({
      title: "Rental expense added",
      description: "The expense has been added to the ledger.",
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const pendingRent = rentRecords.filter((r) => !r.isReceived);
  const totalPending = pendingRent.reduce((sum, r) => sum + r.amount, 0);
  const totalReceived = rentRecords.filter((r) => r.isReceived).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Monthly Rent Register</CardTitle>
            <CardDescription>
              Track monthly rent payments for {rentalDetails.tenantName}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExpenseDialog(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Rental Expense
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Rent</p>
              <p className="text-lg font-semibold">{formatCurrency(monthlyRent)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rent Due Date</p>
              <p className="text-lg font-semibold">Day {rentDueDate} of each month</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Rent</p>
              <p className="text-lg font-semibold text-destructive">
                {formatCurrency(totalPending)} ({pendingRent.length} months)
              </p>
            </div>
          </div>

          {/* Rent Records Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-semibold">Month</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Due Date</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Amount</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rentRecords.map((record, index) => (
                    <tr
                      key={`${record.year}-${record.month}`}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{record.monthName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {formatDate(record.dueDate)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(record.amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {record.isReceived ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Received
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <Circle className="h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {!record.isReceived && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkRentReceived(record)}
                            className="gap-2"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Mark as Received
                          </Button>
                        )}
                        {record.isReceived && record.receivedDate && (
                          <span className="text-xs text-muted-foreground">
                            Received: {formatDate(record.receivedDate)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Add Rental Expense Dialog */}
      <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Rental Expense</DialogTitle>
            <DialogDescription>
              Add an expense related to this rental property (e.g., maintenance, repairs, utilities).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRentalExpense} className="space-y-4">
            <div>
              <Label htmlFor="expense-date">Date *</Label>
              <Input
                id="expense-date"
                type="date"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="expense-description">Description *</Label>
              <Input
                id="expense-description"
                placeholder="e.g., AC repair, Plumbing work"
                value={expenseForm.description}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, description: e.target.value })
                }
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="expense-amount">Amount *</Label>
              <Input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expense-paymentMethod">Payment Method</Label>
                <Select
                  value={expenseForm.paymentMethod || undefined}
                  onValueChange={(value) =>
                    setExpenseForm({
                      ...expenseForm,
                      paymentMethod: value as "Cash" | "Bank" | "Cheque",
                    })
                  }
                >
                  <SelectTrigger id="expense-paymentMethod" className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank">Bank</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expense-paidTo">Paid To</Label>
                <Input
                  id="expense-paidTo"
                  placeholder="Name"
                  value={expenseForm.paidTo}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paidTo: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="expense-notes">Notes</Label>
              <Textarea
                id="expense-notes"
                placeholder="Additional notes"
                value={expenseForm.notes}
                onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowExpenseDialog(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !expenseForm.description || !expenseForm.amount || parseFloat(expenseForm.amount) <= 0
                }
              >
                Add Expense
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

