import { useState } from "react";
import { Property, LedgerEntry } from "@/data/properties";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface TaxEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTaxEntry: (entry: Omit<LedgerEntry, "id">) => void;
  property: Property;
}

export function TaxEntryDialog({
  open,
  onOpenChange,
  onAddTaxEntry,
  property,
}: TaxEntryDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    taxType: "" as "Property Sale Tax" | "Rental Income Tax" | "Advance / Withholding Tax" | "",
    amount: "",
    taxRate: "",
    description: "",
    paymentMethod: "" as "" | "Cash" | "Bank" | "Cheque",
    paidTo: "",
    challanNumber: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.taxType || !formData.amount || parseFloat(formData.amount) <= 0) {
      return;
    }

    let description = formData.description || formData.taxType;
    if (formData.taxRate) {
      description += ` (${formData.taxRate}%)`;
    }
    if (formData.challanNumber) {
      description += ` - Challan: ${formData.challanNumber}`;
    }

    const entry: Omit<LedgerEntry, "id"> = {
      date: formData.date,
      description,
      type: "Debit",
      amount: parseFloat(formData.amount),
      category: "Tax",
      paymentMethod: formData.paymentMethod || undefined,
      paidToReceivedFrom: formData.paidTo || undefined,
      notes: formData.notes || undefined,
    };

    onAddTaxEntry(entry);
    resetForm();
    onOpenChange(false);
    toast({
      title: "Tax entry added",
      description: "Tax payment has been added to the ledger.",
    });
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      taxType: "",
      amount: "",
      taxRate: "",
      description: "",
      paymentMethod: "",
      paidTo: "",
      challanNumber: "",
      notes: "",
    });
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  // Get applicable tax types based on property type
  const getTaxTypes = () => {
    const types: Array<"Property Sale Tax" | "Rental Income Tax" | "Advance / Withholding Tax"> =
      [];
    if (property.type === "Sale") {
      types.push("Property Sale Tax");
    }
    if (property.type === "Rent") {
      types.push("Rental Income Tax");
    }
    types.push("Advance / Withholding Tax");
    return types;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Tax Entry</DialogTitle>
          <DialogDescription>
            Record tax payment for {property.name}. Tax entries appear as expenses in the ledger.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tax-date">Date *</Label>
              <Input
                id="tax-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="tax-type">Tax Type *</Label>
              <Select
                value={formData.taxType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    taxType: value as
                      | "Property Sale Tax"
                      | "Rental Income Tax"
                      | "Advance / Withholding Tax",
                  })
                }
                required
              >
                <SelectTrigger id="tax-type" className="mt-1">
                  <SelectValue placeholder="Select tax type" />
                </SelectTrigger>
                <SelectContent>
                  {getTaxTypes().map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tax-amount">Tax Amount *</Label>
              <Input
                id="tax-amount"
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
            <div>
              <Label htmlFor="tax-rate">Tax Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g., 5.5"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tax-description">Description</Label>
            <Input
              id="tax-description"
              placeholder="Tax payment description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tax-paymentMethod">Payment Method</Label>
              <Select
                value={formData.paymentMethod || undefined}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    paymentMethod: value as "Cash" | "Bank" | "Cheque",
                  })
                }
              >
                <SelectTrigger id="tax-paymentMethod" className="mt-1">
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
              <Label htmlFor="tax-paidTo">Paid To</Label>
              <Input
                id="tax-paidTo"
                placeholder="e.g., FBR, Local Authority"
                value={formData.paidTo}
                onChange={(e) => setFormData({ ...formData, paidTo: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tax-challanNumber">Tax Challan Number</Label>
            <Input
              id="tax-challanNumber"
              placeholder="Enter challan number if available"
              value={formData.challanNumber}
              onChange={(e) => setFormData({ ...formData, challanNumber: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="tax-notes">Notes</Label>
            <Textarea
              id="tax-notes"
              placeholder="Additional notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.taxType || !formData.amount || parseFloat(formData.amount) <= 0}
            >
              Add Tax Entry
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

