import { useState } from "react";
import { Plus, X, FileText, File, Eye, Download } from "lucide-react";
import { PropertyDocument } from "@/data/properties";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PropertyDocumentsProps {
  documents: PropertyDocument[];
  onAddDocument?: (document: Omit<PropertyDocument, "id" | "uploadedAt">) => void;
  onDeleteDocument?: (documentId: string) => void;
}

const documentTypes: PropertyDocument["type"][] = [
  "Registry",
  "Agreement",
  "Bills",
  "Utility",
  "Other",
];

const getDocumentIcon = (type: PropertyDocument["type"]) => {
  return <FileText className="h-5 w-5" />;
};

const getDocumentTypeColor = (type: PropertyDocument["type"]) => {
  const colors = {
    Registry: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    Agreement: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    Bills: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    Utility: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    Other: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };
  return colors[type];
};

export function PropertyDocuments({ documents, onAddDocument, onDeleteDocument }: PropertyDocumentsProps) {
  const [selectedDocument, setSelectedDocument] = useState<PropertyDocument | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadType, setUploadType] = useState<PropertyDocument["type"]>("Other");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUpload = () => {
    if (uploadFile && onAddDocument) {
      // Create a mock URL for the file (in real app, this would be uploaded to server)
      const mockUrl = URL.createObjectURL(uploadFile);
      
      onAddDocument({
        type: uploadType,
        url: mockUrl,
        fileName: uploadFile.name,
        description: uploadDescription || undefined,
      });

      // Reset form
      setUploadFile(null);
      setUploadDescription("");
      setUploadType("Other");
      setShowUploadDialog(false);
    }
  };

  const documentsByType = documentTypes.map((type) => ({
    type,
    documents: documents.filter((doc) => doc.type === type),
  }));

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const isPdf = (url: string) => url.toLowerCase().endsWith(".pdf") || url.includes("pdf");
  const isImage = (url: string) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Documents & Bills</h3>
        {onAddDocument && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowUploadDialog(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Upload Document
          </Button>
        )}
      </div>

      {documentsByType.map(({ type, documents: typeDocuments }) => (
        <div key={type} className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">{type}</h4>
            <span className="text-xs text-muted-foreground">
              {typeDocuments.length} document{typeDocuments.length !== 1 ? "s" : ""}
            </span>
          </div>

          {typeDocuments.length > 0 ? (
            <div className="space-y-2">
              {typeDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-3 border border-border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-1.5 rounded ${getDocumentTypeColor(document.type)}`}>
                      {getDocumentIcon(document.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{document.fileName}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span>Uploaded: {formatDate(document.uploadedAt)}</span>
                        {document.description && (
                          <span className="truncate">• {document.description}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedDocument(document)}
                      title="View Document"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-muted rounded"
                      title="Download Document"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                    {onDeleteDocument && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteDocument(document.id)}
                        className="text-destructive hover:text-destructive"
                        title="Delete Document"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 border border-dashed border-border bg-muted/30">
              <div className="text-center">
                <File className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No {type.toLowerCase()} documents</p>
              </div>
            </div>
          )}
        </div>
      ))}

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
                {selectedDocument.description && (
                  <>
                    <span>•</span>
                    <span>{selectedDocument.description}</span>
                  </>
                )}
              </div>
              <div className="border rounded-lg overflow-hidden bg-muted">
                {isPdf(selectedDocument.url) ? (
                  <iframe
                    src={selectedDocument.url}
                    className="w-full h-[600px]"
                    title={selectedDocument.fileName}
                  />
                ) : isImage(selectedDocument.url) ? (
                  <img
                    src={selectedDocument.url}
                    alt={selectedDocument.fileName}
                    className="w-full h-auto"
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

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="doc-type">Document Type</Label>
              <Select value={uploadType} onValueChange={(value) => setUploadType(value as PropertyDocument["type"])}>
                <SelectTrigger id="doc-type" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="doc-file">File</Label>
              <Input
                id="doc-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileSelect}
                className="mt-1"
              />
              {uploadFile && (
                <p className="text-sm text-muted-foreground mt-1">{uploadFile.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="doc-description">Description / Note (Optional)</Label>
              <Textarea
                id="doc-description"
                placeholder="Enter a short description or note about this document"
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowUploadDialog(false);
                  setUploadFile(null);
                  setUploadDescription("");
                  setUploadType("Other");
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpload}
                disabled={!uploadFile}
              >
                Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

