import { Property, LedgerEntry } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Lock, Unlock, FileText, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountsLedgerTableProps {
  entries: LedgerEntry[];
  property: Property;
  onEdit: (entry: LedgerEntry) => void;
  onDelete: (entryId: string) => void;
  onLock: (entryId: string) => void;
  onUnlock: (entryId: string) => void;
  onViewAttachment: (url: string, fileName?: string) => void;
}

export function AccountsLedgerTable({
  entries,
  property,
  onEdit,
  onDelete,
  onLock,
  onUnlock,
  onViewAttachment,
}: AccountsLedgerTableProps) {
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

  // Sort entries by date (oldest first for register-style view)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (sortedEntries.length === 0) {
    return (
      <div className="border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground mb-2">No ledger entries yet</p>
        <p className="text-sm text-muted-foreground">
          Add your first entry or opening balance to get started
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px] min-w-[80px]">Date</TableHead>
              <TableHead className="min-w-[150px]">Description</TableHead>
              <TableHead className="text-right w-[120px] min-w-[100px]">Debit (Kharcha)</TableHead>
              <TableHead className="text-right w-[120px] min-w-[100px]">Credit (Paise Aaye)</TableHead>
              <TableHead className="w-[100px] min-w-[90px] hidden md:table-cell">Payment Method</TableHead>
              <TableHead className="w-[150px] min-w-[120px] hidden lg:table-cell">Paid To / Received From</TableHead>
              <TableHead className="w-[80px] text-center min-w-[60px]">Attachment</TableHead>
              <TableHead className="w-[120px] text-center min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntries.map((entry) => {
              const isLocked = entry.isLocked || false;
              const hasAttachment =
                entry.attachmentUrl ||
                entry.linkedDocumentId ||
                entry.linkedBillImageId;

              return (
                <TableRow
                  key={entry.id}
                  className={cn(
                    "hover:bg-muted/30",
                    isLocked && "opacity-60",
                    entry.isOpeningBalance && "bg-muted/20"
                  )}
                >
                  <TableCell className="font-medium">{formatDate(entry.date)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{entry.description}</span>
                        {entry.isOpeningBalance && (
                          <Badge variant="outline" className="text-xs">
                            Opening Balance
                          </Badge>
                        )}
                        {isLocked && (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      {entry.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{entry.notes}</p>
                      )}
                      {entry.category && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Category: {entry.category}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.type === "Debit" ? (
                      <span className="font-medium text-destructive">
                        {formatCurrency(entry.amount)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.type === "Credit" ? (
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(entry.amount)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {entry.paymentMethod ? (
                      <Badge variant="secondary" className="text-xs">
                        {entry.paymentMethod}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {entry.paidToReceivedFrom ? (
                      <span className="text-sm">{entry.paidToReceivedFrom}</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {hasAttachment ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          if (entry.attachmentUrl) {
                            onViewAttachment(entry.attachmentUrl, entry.attachmentFileName);
                          } else if (entry.linkedDocumentId) {
                            const doc = property.documents?.find((d) => d.id === entry.linkedDocumentId);
                            if (doc) {
                              onViewAttachment(doc.url, doc.fileName);
                            }
                          } else if (entry.linkedBillImageId) {
                            const img = property.images?.find((i) => i.id === entry.linkedBillImageId);
                            if (img) {
                              onViewAttachment(img.url);
                            }
                          }
                        }}
                        title="View attachment"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      {!isLocked && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onEdit(entry)}
                            title="Edit entry"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => onDelete(entry.id)}
                            title="Delete entry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {isLocked ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUnlock(entry.id)}
                          title="Unlock entry"
                        >
                          <Unlock className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onLock(entry.id)}
                          title="Lock entry"
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

