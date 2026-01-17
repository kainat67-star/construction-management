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
} from "@/components/ui/dialog";

interface AddLedgerEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEntry: (entry: Omit<LedgerEntry, "id">) => void;
  property: Property;
}

export function AddLedgerEntryDialog({
  open,
  onOpenChange,
  onAddEntry,
  property,
}: AddLedgerEntryDialogProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    type: "Debit" as "Debit" | "Credit",
    amount: "",
    paymentMethod: "" as "" | "Cash" | "Bank" | "Cheque",
    paidToReceivedFrom: "",
    category: "",
    notes: "",
    attachmentFile: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.amount || parseFloat(formData.amount) <= 0) {
      return;
    }

    const entry: Omit<LedgerEntry, "id"> = {
      date: formData.date,
      description: formData.description,
      type: formData.type,
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod || undefined,
      paidToReceivedFrom: formData.paidToReceivedFrom || undefined,
      category: formData.category || undefined,
      notes: formData.notes || undefined,
    };

    // Handle file upload (in a real app, this would upload to server)
    if (formData.attachmentFile) {
      // For now, create a mock URL
      const reader = new FileReader();
      reader.onload = () => {
        entry.attachmentUrl = reader.result as string;
        entry.attachmentFileName = formData.attachmentFile?.name;
        onAddEntry(entry);
        resetForm();
      };
      reader.readAsDataURL(formData.attachmentFile);
    } else {
      onAddEntry(entry);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      description: "",
      type: "Debit",
      amount: "",
      paymentMethod: "",
      paidToReceivedFrom: "",
      category: "",
      notes: "",
      attachmentFile: null,
    });
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  // Get category options based on property type
  const getCategoryOptions = () => {
    const baseCategories = ["Other"];
    
    if (property.type === "Rent") {
      return ["Rent", "Maintenance", "Utility", "Tax", ...baseCategories];
    }
    
    if (property.type === "Sale") {
      return ["Sale", "Advance", "Partial Payment", "Final Settlement", "Tax", ...baseCategories];
    }
    
    if (property.category === "Land + Construction") {
      return ["Land Cost", "Construction Cost", "Material", "Labor", "Tax", ...baseCategories];
    }
    
    return ["Purchase", "Tax", ...baseCategories];
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Ledger Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="type">Entry Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as "Debit" | "Credit" })
                }
              >
                <SelectTrigger id="type" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Debit">Expense (Kharcha)</SelectItem>
                  <SelectItem value="Credit">Received (Paise Aaye)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
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
              <Label htmlFor="category">Category (Optional)</Label>
              <Select
                value={formData.category || undefined}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category" className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {getCategoryOptions().map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentMethod">Payment Method (Optional)</Label>
              <Select
                value={formData.paymentMethod || undefined}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentMethod: value as "Cash" | "Bank" | "Cheque" })
                }
              >
                <SelectTrigger id="paymentMethod" className="mt-1">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Bank">Bank</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paidToReceivedFrom">Paid To / Received From (Optional)</Label>
              <Input
                id="paidToReceivedFrom"
                placeholder="Enter name"
                value={formData.paidToReceivedFrom}
                onChange={(e) =>
                  setFormData({ ...formData, paidToReceivedFrom: e.target.value })
                }
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="attachment">Attach Bill / Receipt (Optional)</Label>
            <Input
              id="attachment"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  attachmentFile: e.target.files?.[0] || null,
                })
              }
              className="mt-1"
            />
            {formData.attachmentFile && (
              <p className="text-xs text-muted-foreground mt-1">
                Selected: {formData.attachmentFile.name}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
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
              disabled={!formData.description || !formData.amount || parseFloat(formData.amount) <= 0}
            >
              Add Entry
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

