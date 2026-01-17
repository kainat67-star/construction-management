import { useState } from "react";
import { Property, LedgerEntry } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Receipt } from "lucide-react";
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

interface SaleAccountingProps {
  property: Property;
  onAddSaleEntry: (entry: Omit<LedgerEntry, "id">) => void;
}

export function SaleAccounting({ property, onAddSaleEntry }: SaleAccountingProps) {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [entryType, setEntryType] = useState<"Advance" | "Partial Payment" | "Final Settlement">(
    "Advance"
  );
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    paymentMethod: "" as "" | "Cash" | "Bank" | "Cheque",
    receivedFrom: "",
    notes: "",
  });

  if (property.type !== "Sale") {
    return null;
  }

  const entries = property.ledgerEntries || [];
  const saleEntries = entries.filter(
    (e) =>
      e.type === "Credit" &&
      (e.category === "Sale" ||
        e.category === "Advance" ||
        e.category === "Partial Payment" ||
        e.category === "Final Settlement")
  );

  const totalSaleAmount = saleEntries.reduce((sum, e) => sum + e.amount, 0);
  const advanceAmount = saleEntries
    .filter((e) => e.category === "Advance")
    .reduce((sum, e) => sum + e.amount, 0);
  const partialPayments = saleEntries
    .filter((e) => e.category === "Partial Payment")
    .reduce((sum, e) => sum + e.amount, 0);
  const finalSettlement = saleEntries
    .filter((e) => e.category === "Final Settlement")
    .reduce((sum, e) => sum + e.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      return;
    }

    let description = "";
    switch (entryType) {
      case "Advance":
        description = "Buyer Advance Payment";
        break;
      case "Partial Payment":
        description = "Partial Payment from Buyer";
        break;
      case "Final Settlement":
        description = "Final Settlement - Property Sale";
        break;
    }

    const entry: Omit<LedgerEntry, "id"> = {
      date: formData.date,
      description,
      type: "Credit",
      amount: parseFloat(formData.amount),
      category: entryType,
      paymentMethod: formData.paymentMethod || undefined,
      paidToReceivedFrom: formData.receivedFrom || undefined,
      notes: formData.notes || undefined,
    };

    onAddSaleEntry(entry);
    setShowDialog(false);
    resetForm();
    toast({
      title: "Sale entry added",
      description: `${entryType} has been added to the ledger.`,
    });
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      amount: "",
      paymentMethod: "",
      receivedFrom: "",
      notes: "",
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Sale Accounting</CardTitle>
            <CardDescription>Track buyer payments and sale proceeds</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Sale Entry
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Total Sale Amount</p>
              <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalSaleAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Advance Payments</p>
              <p className="text-lg font-semibold">{formatCurrency(advanceAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Partial Payments</p>
              <p className="text-lg font-semibold">{formatCurrency(partialPayments)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Final Settlement</p>
              <p className="text-lg font-semibold">{formatCurrency(finalSettlement)}</p>
            </div>
          </div>

          {/* Recent Sale Entries */}
          {saleEntries.length > 0 ? (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Received From</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {saleEntries
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 5)
                      .map((entry) => (
                        <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 text-sm">
                            {new Date(entry.date).toLocaleDateString("en-PK", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="secondary">{entry.category}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{entry.description}</td>
                          <td className="px-4 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(entry.amount)}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {entry.paidToReceivedFrom || "-"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="border border-border rounded-lg p-8 text-center">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No sale entries yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add buyer advances, partial payments, or final settlement
              </p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Add Sale Entry Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Sale Entry</DialogTitle>
            <DialogDescription>
              Record buyer advance, partial payment, or final settlement
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="sale-entryType">Entry Type *</Label>
              <Select
                value={entryType}
                onValueChange={(value) =>
                  setEntryType(value as "Advance" | "Partial Payment" | "Final Settlement")
                }
              >
                <SelectTrigger id="sale-entryType" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Advance">Buyer Advance</SelectItem>
                  <SelectItem value="Partial Payment">Partial Payment</SelectItem>
                  <SelectItem value="Final Settlement">Final Settlement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sale-date">Date *</Label>
                <Input
                  id="sale-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="sale-amount">Amount *</Label>
                <Input
                  id="sale-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sale-paymentMethod">Payment Method</Label>
                <Select
                  value={formData.paymentMethod || undefined}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      paymentMethod: value as "Cash" | "Bank" | "Cheque",
                    })
                  }
                >
                  <SelectTrigger id="sale-paymentMethod" className="mt-1">
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
                <Label htmlFor="sale-receivedFrom">Received From</Label>
                <Input
                  id="sale-receivedFrom"
                  placeholder="Buyer name"
                  value={formData.receivedFrom}
                  onChange={(e) => setFormData({ ...formData, receivedFrom: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="sale-notes">Notes</Label>
              <Textarea
                id="sale-notes"
                placeholder="Additional notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.amount || parseFloat(formData.amount) <= 0}
              >
                Add Entry
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

