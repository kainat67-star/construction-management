import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, FileX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImportedRow {
  propertyName: string;
  purchasePrice: number;
  maintenanceCost: number;
  utilities: number;
  taxes: number;
  otherExpenses: number;
  [key: string]: string | number;
}

type ValidationStatus = "idle" | "success" | "error" | "warning";

export function ExcelImportPanel({ onImport }: { onImport: (data: ImportedRow[]) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [importedData, setImportedData] = useState<ImportedRow[]>([]);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>("idle");
  const [validationMessage, setValidationMessage] = useState("");

  // Mock file upload handler (UI only)
  const handleFileUpload = useCallback((file: File | null) => {
    if (!file) return;

    // Check file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith(".csv") && !file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setValidationStatus("error");
      setValidationMessage("Invalid file type. Please upload a .xlsx, .xls, or .csv file.");
      return;
    }

    // Mock data parsing - simulate successful import
    // In a real app, this would parse the actual file
    const mockImportedData: ImportedRow[] = [
      {
        propertyName: "Sample Property 1",
        purchasePrice: 1200000,
        maintenanceCost: 5000,
        utilities: 2000,
        taxes: 24000,
        otherExpenses: 1000,
      },
      {
        propertyName: "Sample Property 2",
        purchasePrice: 850000,
        maintenanceCost: 3500,
        utilities: 1500,
        taxes: 18000,
        otherExpenses: 800,
      },
      {
        propertyName: "Sample Property 3",
        purchasePrice: 2100000,
        maintenanceCost: 8000,
        utilities: 3000,
        taxes: 42000,
        otherExpenses: 1500,
      },
    ];

    // Validate mock data
    const hasRequiredFields = mockImportedData.every(
      (row) => row.propertyName && row.purchasePrice && row.maintenanceCost !== undefined
    );

    if (!hasRequiredFields) {
      setValidationStatus("error");
      setValidationMessage("Missing required fields in some rows. Please check your file.");
      setImportedData([]);
      return;
    }

    // Check for formatting issues (mock)
    const hasFormatIssues = mockImportedData.some((row) => typeof row.purchasePrice !== "number");

    if (hasFormatIssues) {
      setValidationStatus("warning");
      setValidationMessage("Some formatting issues detected. Please review the data below.");
    } else {
      setValidationStatus("success");
      setValidationMessage("File uploaded successfully! Review the data below.");
    }

    setImportedData(mockImportedData);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleClear = () => {
    setImportedData([]);
    setValidationStatus("idle");
    setValidationMessage("");
  };

  const handleImport = () => {
    if (importedData.length > 0 && validationStatus !== "error") {
      onImport(importedData);
      handleClear();
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-2xl border-2 border-dashed p-10 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          validationStatus === "success" && "border-success/50 bg-success/5",
          validationStatus === "error" && "border-destructive/50 bg-destructive/5"
        )}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          {validationStatus === "success" ? (
            <CheckCircle2 className="h-12 w-12 text-success" />
          ) : validationStatus === "error" ? (
            <FileX className="h-12 w-12 text-destructive" />
          ) : (
            <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {validationStatus === "success"
                ? "File uploaded successfully"
                : validationStatus === "error"
                  ? "Upload failed"
                  : "Drag and drop your Excel file here"}
            </p>
            <p className="text-xs text-muted-foreground">
              {validationStatus === "idle" && "or click the button below to browse"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              id="file-upload"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileInput}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Excel (.xlsx / .csv)
            </Button>
            {importedData.length > 0 && (
              <Button type="button" variant="ghost" size="sm" onClick={handleClear} className="gap-2">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Validation Status */}
      {validationMessage && (
        <Alert
          variant={validationStatus === "error" ? "destructive" : validationStatus === "warning" ? "default" : "default"}
          className={cn(
            validationStatus === "success" && "border-success/50 bg-success/5 text-success-foreground",
            validationStatus === "warning" && "border-warning/50 bg-warning/5"
          )}
        >
          {validationStatus === "error" ? (
            <AlertCircle className="h-4 w-4" />
          ) : validationStatus === "warning" ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          <AlertDescription>{validationMessage}</AlertDescription>
        </Alert>
      )}

      {/* Sample File Structure Preview */}
      <div className="space-y-4">
        <div>
          <h4 className="text-base font-bold tracking-tight">Expected File Structure</h4>
          <p className="mt-1 text-sm text-muted-foreground">Your Excel/CSV file should contain the following columns:</p>
        </div>
        <div className="rounded-2xl border bg-muted/50 p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Property Name</TableHead>
                <TableHead className="text-xs">Purchase Price</TableHead>
                <TableHead className="text-xs">Maintenance Cost</TableHead>
                <TableHead className="text-xs">Utilities</TableHead>
                <TableHead className="text-xs">Taxes</TableHead>
                <TableHead className="text-xs">Other Expenses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-xs text-muted-foreground">Required</TableCell>
                <TableCell className="text-xs text-muted-foreground">Required</TableCell>
                <TableCell className="text-xs text-muted-foreground">Required</TableCell>
                <TableCell className="text-xs text-muted-foreground">Optional</TableCell>
                <TableCell className="text-xs text-muted-foreground">Optional</TableCell>
                <TableCell className="text-xs text-muted-foreground">Optional</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Imported Data Preview */}
      {importedData.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold tracking-tight">Data Preview</h4>
              <p className="mt-1 text-sm text-muted-foreground">{importedData.length} properties found</p>
            </div>
            {validationStatus !== "error" && (
              <Button onClick={handleImport} size="sm" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Import {importedData.length} Properties
              </Button>
            )}
          </div>
          <div className="rounded-2xl border overflow-hidden shadow-card">
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property Name</TableHead>
                    <TableHead className="text-right">Purchase Price</TableHead>
                    <TableHead className="text-right">Maintenance</TableHead>
                    <TableHead className="text-right">Utilities</TableHead>
                    <TableHead className="text-right">Taxes</TableHead>
                    <TableHead className="text-right">Other Expenses</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importedData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.propertyName}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
                          row.purchasePrice
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
                          row.maintenanceCost
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
                          row.utilities
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
                          row.taxes
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
                          row.otherExpenses
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

