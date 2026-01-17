import { useState, useEffect } from "react";
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

interface EditLedgerEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: LedgerEntry;
  onUpdateEntry: (entryId: string, entry: Partial<LedgerEntry>) => void;
  property: Property;
}

export function EditLedgerEntryDialog({
  open,
  onOpenChange,
  entry,
  onUpdateEntry,
  property,
}: EditLedgerEntryDialogProps) {
  const [formData, setFormData] = useState({
    date: entry.date,
    description: entry.description,
    type: entry.type,
    amount: entry.amount.toString(),
    paymentMethod: (entry.paymentMethod || "") as "" | "Cash" | "Bank" | "Cheque",
    paidToReceivedFrom: entry.paidToReceivedFrom || "",
    category: entry.category || "",
    notes: entry.notes || "",
    attachmentFile: null as File | null,
  });

  useEffect(() => {
    if (entry) {
      setFormData({
        date: entry.date,
        description: entry.description,
        type: entry.type,
        amount: entry.amount.toString(),
        paymentMethod: (entry.paymentMethod || "") as "" | "Cash" | "Bank" | "Cheque",
        paidToReceivedFrom: entry.paidToReceivedFrom || "",
        category: entry.category || "",
        notes: entry.notes || "",
        attachmentFile: null,
      });
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.amount || parseFloat(formData.amount) <= 0) {
      return;
    }

    const updatedEntry: Partial<LedgerEntry> = {
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
      const reader = new FileReader();
      reader.onload = () => {
        updatedEntry.attachmentUrl = reader.result as string;
        updatedEntry.attachmentFileName = formData.attachmentFile?.name;
        onUpdateEntry(entry.id, updatedEntry);
        onOpenChange(false);
      };
      reader.readAsDataURL(formData.attachmentFile);
    } else {
      onUpdateEntry(entry.id, updatedEntry);
      onOpenChange(false);
    }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Ledger Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-date">Date *</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-type">Entry Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as "Debit" | "Credit" })
                }
              >
                <SelectTrigger id="edit-type" className="mt-1">
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
            <Label htmlFor="edit-description">Description *</Label>
            <Input
              id="edit-description"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-amount">Amount *</Label>
              <Input
                id="edit-amount"
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
              <Label htmlFor="edit-category">Category (Optional)</Label>
              <Select
                value={formData.category || undefined}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="edit-category" className="mt-1">
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
              <Label htmlFor="edit-paymentMethod">Payment Method (Optional)</Label>
              <Select
                value={formData.paymentMethod || undefined}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentMethod: value as "Cash" | "Bank" | "Cheque" })
                }
              >
                <SelectTrigger id="edit-paymentMethod" className="mt-1">
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
              <Label htmlFor="edit-paidToReceivedFrom">Paid To / Received From (Optional)</Label>
              <Input
                id="edit-paidToReceivedFrom"
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
            <Label htmlFor="edit-attachment">Attach Bill / Receipt (Optional)</Label>
            <Input
              id="edit-attachment"
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
            {entry.attachmentUrl && !formData.attachmentFile && (
              <p className="text-xs text-muted-foreground mt-1">
                Current: {entry.attachmentFileName || "Attachment"}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="edit-notes">Notes (Optional)</Label>
            <Textarea
              id="edit-notes"
              placeholder="Additional notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.description || !formData.amount || parseFloat(formData.amount) <= 0}
            >
              Update Entry
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

