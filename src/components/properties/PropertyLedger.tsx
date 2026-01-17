import { useState } from "react";
import { Plus, X, FileText, Image as ImageIcon, Eye } from "lucide-react";
import { LedgerEntry, PropertyDocument, PropertyImage } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";

interface PropertyLedgerProps {
  entries: LedgerEntry[];
  documents?: PropertyDocument[];
  images?: PropertyImage[];
  onAddEntry?: (entry: Omit<LedgerEntry, "id">) => void;
  onDeleteEntry?: (entryId: string) => void;
}

export function PropertyLedger({ 
  entries, 
  documents = [], 
  images = [],
  onAddEntry, 
  onDeleteEntry 
}: PropertyLedgerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PropertyDocument | null>(null);
  const [selectedImage, setSelectedImage] = useState<PropertyImage | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    type: "Debit" as "Debit" | "Credit",
    amount: 0,
    category: "",
    linkedDocumentId: "",
    linkedBillImageId: "",
    notes: "",
  });

  const handleAddEntry = () => {
    if (onAddEntry && formData.description && formData.amount > 0) {
      onAddEntry({
        date: formData.date,
        description: formData.description,
        type: formData.type,
        amount: formData.amount,
        category: formData.category || undefined,
        linkedDocumentId: formData.linkedDocumentId || undefined,
        linkedBillImageId: formData.linkedBillImageId || undefined,
        notes: formData.notes || undefined,
      });

      // Reset form
      setFormData({
        date: new Date().toISOString().split("T")[0],
        description: "",
        type: "Debit",
        amount: 0,
        category: "",
        linkedDocumentId: "",
        linkedBillImageId: "",
        notes: "",
      });
      setShowAddDialog(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(value);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate totals
  const totalDebit = entries.filter(e => e.type === "Debit").reduce((sum, e) => sum + e.amount, 0);
  const totalCredit = entries.filter(e => e.type === "Credit").reduce((sum, e) => sum + e.amount, 0);
  const balance = totalCredit - totalDebit;

  const getLinkedDocument = (documentId?: string) => {
    if (!documentId) return null;
    return documents.find(d => d.id === documentId);
  };

  const getLinkedImage = (imageId?: string) => {
    if (!imageId) return null;
    return images.find(img => img.id === imageId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Property Ledger</h3>
        {onAddEntry && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddDialog(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
        )}
      </div>

      {/* Ledger Table */}
      <div className="border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Debit</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Credit</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Links</th>
                {onDeleteEntry && (
                  <th className="px-4 py-3 text-center text-sm font-semibold text-foreground w-12">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedEntries.length === 0 ? (
                <tr>
                  <td colSpan={onDeleteEntry ? 7 : 6} className="px-4 py-8 text-center text-muted-foreground">
                    <p className="text-sm">No ledger entries</p>
                    <p className="text-xs mt-1">Add your first entry to get started</p>
                  </td>
                </tr>
              ) : (
                sortedEntries.map((entry) => {
                  const linkedDoc = getLinkedDocument(entry.linkedDocumentId);
                  const linkedImg = getLinkedImage(entry.linkedBillImageId);

                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-foreground">
                        {formatDate(entry.date)}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{entry.description}</p>
                          {entry.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{entry.notes}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {entry.category || "-"}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium">
                        {entry.type === "Debit" ? (
                          <span className="text-destructive">{formatCurrency(entry.amount)}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium">
                        {entry.type === "Credit" ? (
                          <span className="text-emerald-700 dark:text-emerald-400">{formatCurrency(entry.amount)}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {linkedDoc && (
                            <button
                              onClick={() => setSelectedDocument(linkedDoc)}
                              className="p-1.5 hover:bg-muted rounded"
                              title={`View document: ${linkedDoc.fileName}`}
                            >
                              <FileText className="h-4 w-4 text-blue-600" />
                            </button>
                          )}
                          {linkedImg && (
                            <button
                              onClick={() => setSelectedImage(linkedImg)}
                              className="p-1.5 hover:bg-muted rounded"
                              title={`View bill image: ${linkedImg.category}`}
                            >
                              <ImageIcon className="h-4 w-4 text-purple-600" />
                            </button>
                          )}
                          {!linkedDoc && !linkedImg && (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </div>
                      </td>
                      {onDeleteEntry && (
                        <td className="px-4 py-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteEntry(entry.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            title="Delete entry"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot className="border-t border-border bg-muted/30">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-foreground">
                  Total
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-destructive">
                  {formatCurrency(totalDebit)}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(totalCredit)}
                </td>
                <td colSpan={onDeleteEntry ? 2 : 1} className="px-4 py-3 text-right text-sm font-semibold">
                  <span className={cn(
                    "text-sm",
                    balance >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-destructive"
                  )}>
                    Balance: {formatCurrency(Math.abs(balance))}
                    {balance >= 0 ? " (Credit)" : " (Debit)"}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Add Entry Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Ledger Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entry-date">Date</Label>
                <Input
                  id="entry-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="entry-type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as "Debit" | "Credit" })}
                >
                  <SelectTrigger id="entry-type" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Debit">Debit (Expense)</SelectItem>
                    <SelectItem value="Credit">Credit (Receipt/Rent/Sale)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="entry-description">Description</Label>
              <Input
                id="entry-description"
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entry-amount">Amount</Label>
                <Input
                  id="entry-amount"
                  type="number"
                  placeholder="0"
                  value={formData.amount || ""}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="entry-category">Category (Optional)</Label>
                <Input
                  id="entry-category"
                  placeholder="e.g., Rent, Maintenance, Utility"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entry-document">Link Document (Optional)</Label>
                <Select
                  value={formData.linkedDocumentId}
                  onValueChange={(value) => setFormData({ ...formData, linkedDocumentId: value })}
                >
                  <SelectTrigger id="entry-document" className="mt-1">
                    <SelectValue placeholder="Select document" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {documents.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.fileName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="entry-image">Link Bill Image (Optional)</Label>
                <Select
                  value={formData.linkedBillImageId}
                  onValueChange={(value) => setFormData({ ...formData, linkedBillImageId: value })}
                >
                  <SelectTrigger id="entry-image" className="mt-1">
                    <SelectValue placeholder="Select image" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {images.map((img) => (
                      <SelectItem key={img.id} value={img.id}>
                        {img.category} - {formatDate(img.uploadedAt)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="entry-notes">Notes (Optional)</Label>
              <Textarea
                id="entry-notes"
                placeholder="Additional notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddEntry}
                disabled={!formData.description || formData.amount <= 0}
              >
                Add Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.fileName}</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Type: {selectedDocument.type}</span>
                <span>•</span>
                <span>Uploaded: {formatDate(selectedDocument.uploadedAt)}</span>
              </div>
              <div className="border rounded-lg overflow-hidden bg-muted">
                {selectedDocument.url.toLowerCase().endsWith(".pdf") || selectedDocument.url.includes("pdf") ? (
                  <iframe
                    src={selectedDocument.url}
                    className="w-full h-[600px]"
                    title={selectedDocument.fileName}
                  />
                ) : (
                  <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Preview not available</p>
                      <a
                        href={selectedDocument.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline mt-2 inline-block"
                      >
                        Download to view
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.category}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage.url}
                alt={selectedImage.category}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

