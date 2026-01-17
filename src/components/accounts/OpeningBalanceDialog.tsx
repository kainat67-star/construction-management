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

interface OpeningBalanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEntry: (entry: Omit<LedgerEntry, "id">) => void;
  property: Property;
}

export function OpeningBalanceDialog({
  open,
  onOpenChange,
  onAddEntry,
  property,
}: OpeningBalanceDialogProps) {
  const [formData, setFormData] = useState({
    date: property.purchaseDate || new Date().toISOString().split("T")[0],
    amount: "",
    type: "Credit" as "Debit" | "Credit",
    notes: "Purana hisaab (Opening Balance)",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      return;
    }

    const entry: Omit<LedgerEntry, "id"> = {
      date: formData.date,
      description: "Opening Balance",
      type: formData.type,
      amount: parseFloat(formData.amount),
      notes: formData.notes,
      isOpeningBalance: true,
    };

    onAddEntry(entry);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      date: property.purchaseDate || new Date().toISOString().split("T")[0],
      amount: "",
      type: "Credit",
      notes: "Purana hisaab (Opening Balance)",
    });
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Opening Balance</DialogTitle>
          <DialogDescription>
            Enter the opening balance for {property.name}. This will be the first entry in the ledger.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="opening-date">Date *</Label>
              <Input
                id="opening-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="opening-type">Balance Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as "Debit" | "Credit" })
                }
              >
                <SelectTrigger id="opening-type" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit">Credit (Positive Balance)</SelectItem>
                  <SelectItem value="Debit">Debit (Negative Balance)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="opening-amount">Opening Amount *</Label>
            <Input
              id="opening-amount"
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
            <Label htmlFor="opening-notes">Notes (Optional)</Label>
            <Textarea
              id="opening-notes"
              placeholder="e.g., Purana hisaab"
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
              disabled={!formData.amount || parseFloat(formData.amount) <= 0}
            >
              Add Opening Balance
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

