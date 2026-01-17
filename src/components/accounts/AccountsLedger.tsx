import { useState } from "react";
import { Plus, Edit, Trash2, Lock, Unlock, FileText, Download, Printer, Eye, Receipt } from "lucide-react";
import { Property, LedgerEntry } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountsLedgerTable } from "./AccountsLedgerTable";
import { AddLedgerEntryDialog } from "./AddLedgerEntryDialog";
import { EditLedgerEntryDialog } from "./EditLedgerEntryDialog";
import { OpeningBalanceDialog } from "./OpeningBalanceDialog";
import { MonthlyRentRegister } from "./MonthlyRentRegister";
import { SaleAccounting } from "./SaleAccounting";
import { TaxEntryDialog } from "./TaxEntryDialog";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AccountsLedgerProps {
  property: Property;
  onAddEntry: (entry: Omit<LedgerEntry, "id">) => void;
  onUpdateEntry: (entryId: string, entry: Partial<LedgerEntry>) => void;
  onDeleteEntry: (entryId: string) => void;
}

export function AccountsLedger({
  property,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
}: AccountsLedgerProps) {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showOpeningBalanceDialog, setShowOpeningBalanceDialog] = useState(false);
  const [showTaxDialog, setShowTaxDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LedgerEntry | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<{ url: string; fileName?: string } | null>(null);

  const entries = property.ledgerEntries || [];
  const hasEntries = entries.length > 0;
  const hasOpeningBalance = entries.some((e) => e.isOpeningBalance);
  const isLocked = entries.some((e) => e.isLocked);

  // Calculate totals
  const totalExpenses = entries
    .filter((e) => e.type === "Debit")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalReceived = entries
    .filter((e) => e.type === "Credit")
    .reduce((sum, e) => sum + e.amount, 0);
  const currentBalance = totalReceived - totalExpenses;

  const handleAddEntry = (entry: Omit<LedgerEntry, "id">) => {
    onAddEntry(entry);
    setShowAddDialog(false);
  };

  const handleAddTaxEntry = (entry: Omit<LedgerEntry, "id">) => {
    onAddEntry(entry);
  };

  const handleEditEntry = (entry: LedgerEntry) => {
    if (entry.isLocked) {
      toast({
        title: "Entry is locked",
        description: "This entry is locked and cannot be edited.",
        variant: "destructive",
      });
      return;
    }
    setEditingEntry(entry);
  };

  const handleUpdateEntry = (entryId: string, entry: Partial<LedgerEntry>) => {
    onUpdateEntry(entryId, entry);
    setEditingEntry(null);
  };

  const handleDeleteEntry = (entryId: string) => {
    const entry = entries.find((e) => e.id === entryId);
    if (entry?.isLocked) {
      toast({
        title: "Entry is locked",
        description: "This entry is locked and cannot be deleted.",
        variant: "destructive",
      });
      return;
    }
    onDeleteEntry(entryId);
  };

  const handleLockEntry = (entryId: string) => {
    onUpdateEntry(entryId, { isLocked: true });
    toast({
      title: "Entry locked",
      description: "This entry has been locked.",
    });
  };

  const handleUnlockEntry = (entryId: string) => {
    onUpdateEntry(entryId, { isLocked: false });
    toast({
      title: "Entry unlocked",
      description: "This entry has been unlocked.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    toast({
      title: "Export to PDF",
      description: "PDF export functionality will be implemented soon.",
    });
  };

  const handleExportExcel = () => {
    toast({
      title: "Export to Excel",
      description: "Excel export functionality will be implemented soon.",
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="space-y-6">
      {/* Totals Cards - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses (Kharcha)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Received (Paise Aaye)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalReceived)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                currentBalance >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-destructive"
              }`}
            >
              {formatCurrency(Math.abs(currentBalance))}
              {currentBalance >= 0 ? " (Credit)" : " (Debit)"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conditional Features: Monthly Rent Register */}
      {property.type === "Rent" && property.rentalDetails && (
        <MonthlyRentRegister
          property={property}
          onAddRentEntry={handleAddEntry}
          onAddRentalExpense={handleAddEntry}
        />
      )}

      {/* Conditional Features: Sale Accounting */}
      {property.type === "Sale" && (
        <SaleAccounting property={property} onAddSaleEntry={handleAddEntry} />
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
        <div className="flex flex-wrap items-center gap-2">
          {!hasOpeningBalance && !hasEntries && (
            <Button
              variant="outline"
              onClick={() => setShowOpeningBalanceDialog(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Opening Balance
            </Button>
          )}
          <Button
            variant="default"
            onClick={() => setShowAddDialog(true)}
            disabled={isLocked}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowTaxDialog(true)}
            disabled={isLocked}
            className="gap-2"
          >
            <Receipt className="h-4 w-4" />
            Add Tax
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export Excel</span>
          </Button>
        </div>
      </div>

      {/* Ledger Table */}
      <AccountsLedgerTable
        entries={entries}
        property={property}
        onEdit={handleEditEntry}
        onDelete={handleDeleteEntry}
        onLock={handleLockEntry}
        onUnlock={handleUnlockEntry}
        onViewAttachment={(url, fileName) => setSelectedAttachment({ url, fileName })}
      />

      {/* Add Entry Dialog */}
      <AddLedgerEntryDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddEntry={handleAddEntry}
        property={property}
      />

      {/* Opening Balance Dialog */}
      <OpeningBalanceDialog
        open={showOpeningBalanceDialog}
        onOpenChange={setShowOpeningBalanceDialog}
        onAddEntry={handleAddEntry}
        property={property}
      />

      {/* Tax Entry Dialog */}
      <TaxEntryDialog
        open={showTaxDialog}
        onOpenChange={setShowTaxDialog}
        onAddTaxEntry={handleAddTaxEntry}
        property={property}
      />

      {/* Edit Entry Dialog */}
      {editingEntry && (
        <EditLedgerEntryDialog
          open={!!editingEntry}
          onOpenChange={() => setEditingEntry(null)}
          entry={editingEntry}
          onUpdateEntry={handleUpdateEntry}
          property={property}
        />
      )}

      {/* Attachment Preview Dialog */}
      <Dialog open={!!selectedAttachment} onOpenChange={() => setSelectedAttachment(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAttachment?.fileName || "Attachment"}</DialogTitle>
          </DialogHeader>
          {selectedAttachment && (
            <div className="space-y-4">
              {selectedAttachment.url.toLowerCase().endsWith(".pdf") ||
              selectedAttachment.url.includes("pdf") ? (
                <iframe
                  src={selectedAttachment.url}
                  className="w-full h-[600px]"
                  title={selectedAttachment.fileName || "Attachment"}
                />
              ) : (
                <div className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Preview not available</p>
                    <a
                      href={selectedAttachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-block"
                    >
                      <Button variant="outline" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Open in new tab
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

