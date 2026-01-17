import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { properties, PropertyImage, PropertyDocument } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { PropertyImageGallery } from "@/components/properties/PropertyImageGallery";
import { PropertyMap } from "@/components/properties/PropertyMap";
import { PropertyImages } from "@/components/properties/PropertyImages";
import { PropertyDocuments } from "@/components/properties/PropertyDocuments";
import { PropertyNotes } from "@/components/properties/PropertyNotes";
import { PropertyTimeline } from "@/components/properties/PropertyTimeline";
import { PropertyLedger } from "@/components/properties/PropertyLedger";
import { LedgerEntry } from "@/data/properties";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <AppLayout title="Property Not Found">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg font-medium text-muted-foreground">Property not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/properties")}>
            Back to Properties
          </Button>
        </div>
      </AppLayout>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(value);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const handleAddImage = (category: PropertyImage["category"], file: File) => {
    // UI only - create a mock image URL
    const reader = new FileReader();
    reader.onload = (e) => {
      // In a real app, this would upload to a server
      // For now, we'll just show a message
      console.log("Image would be uploaded:", category, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = (imageId: string) => {
    // UI only - in a real app, this would delete from server
    console.log("Image would be deleted:", imageId);
  };

  const handleAddDocument = (document: Omit<PropertyDocument, "id" | "uploadedAt">) => {
    // UI only - in a real app, this would upload to server
    console.log("Document would be uploaded:", document);
  };

  const handleDeleteDocument = (documentId: string) => {
    // UI only - in a real app, this would delete from server
    console.log("Document would be deleted:", documentId);
  };

  const handleSaveNotes = (notes: string) => {
    // UI only - in a real app, this would save to server
    console.log("Notes would be saved:", notes);
  };

  const handleAddLedgerEntry = (entry: Omit<LedgerEntry, "id">) => {
    // UI only - in a real app, this would save to server
    console.log("Ledger entry would be added:", entry);
  };

  const handleDeleteLedgerEntry = (entryId: string) => {
    // UI only - in a real app, this would delete from server
    console.log("Ledger entry would be deleted:", entryId);
  };

  const hasOwnershipInfo = property.ownershipType || (property.partners && property.partners.length > 0);
  const isLandPlusConstruction = property.category === "Land + Construction";
  const isRentType = property.type === "Rent";
  const hasAgentInfo = property.agentInformation && (property.agentInformation.name || property.agentInformation.phoneNumber || property.agentInformation.commissionAmount || property.agentInformation.commissionPercentage);
  const hasTimelineEvents = property.timelineEvents && property.timelineEvents.length > 0;

  return (
    <AppLayout title="Property Details">
      {/* Back Button and Actions */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" className="gap-2 text-sm" onClick={() => navigate("/properties")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Button>
        <Button variant="default" className="gap-2" onClick={() => navigate(`/accounts/${property.id}`)}>
          <BookOpen className="h-4 w-4" />
          Open Accounts
        </Button>
      </div>

      <div className="space-y-6">
        {/* Section 1: Property Image Gallery (Featured at Top) */}
        <PropertyImageGallery images={property.images || []} />

        {/* Section 2: Key Property Information (Immediately Below Images) */}
        <div className="space-y-4 pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">{property.name}</h1>
            <p className="text-base text-muted-foreground mb-4">{property.location}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div>
              <span className="text-xs text-muted-foreground mr-1.5">Category:</span>
              <Badge variant="info" className="text-xs font-normal">{property.category}</Badge>
            </div>
            <div>
              <span className="text-xs text-muted-foreground mr-1.5">Type:</span>
              <Badge variant="secondary" className="text-xs font-normal">{property.type}</Badge>
            </div>
            <div>
              <span className="text-xs text-muted-foreground mr-1.5">Status:</span>
              <Badge variant="success" className="text-xs font-normal">{property.status}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Purchase Date</p>
              <p className="text-sm font-medium">{formatDate(property.purchaseDate)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Purchase Price</p>
              <p className="text-sm font-medium">{formatCurrency(property.purchasePrice)}</p>
            </div>
          </div>
        </div>

        {/* Section 3: Property Location Map */}
        <PropertyMap location={property.location} propertyName={property.name} />

        {/* Section 4: Ownership & Partner Information */}
        {hasOwnershipInfo && (
          <div className="border border-border bg-card p-5">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-border">Ownership & Partner Information</h2>
            
            <div className="space-y-3">
              {property.ownershipType && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Ownership Type</p>
                  <p className="text-sm font-medium">{property.ownershipType}</p>
                </div>
              )}

              {property.ownershipType === "Joint" && property.partners && property.partners.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Partners</p>
                  <div className="space-y-2">
                    {property.partners.map((partner, index) => (
                      <div key={index} className="p-3 border border-border bg-muted/30 rounded-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{partner.name}</p>
                            {partner.sharePercentage !== undefined && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Ownership Share: {partner.sharePercentage}%
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {property.ownershipType === "Single" && (
                <p className="text-xs text-muted-foreground">This property is owned by a single owner.</p>
              )}
            </div>
          </div>
        )}

        {/* Section 5: Construction Details (Conditional - Only for Land + Construction) */}
        {isLandPlusConstruction && (
          <div className="border border-border bg-card p-5">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-border">Construction Details</h2>
            
            {property.constructionDetails ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Construction Start Date</p>
                  <p className="text-sm font-medium">
                    {formatDate(property.constructionDetails.constructionStartDate)}
                  </p>
                </div>

                {property.constructionDetails.expectedCompletionDate && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Expected Completion Date</p>
                    <p className="text-sm font-medium">
                      {formatDate(property.constructionDetails.expectedCompletionDate)}
                    </p>
                  </div>
                )}

                {property.constructionDetails.contractorName && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Contractor Name</p>
                    <p className="text-sm font-medium">
                      {property.constructionDetails.contractorName}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No construction details available.</p>
            )}

            <div className="mt-4 p-3 bg-muted/30 border border-border">
              <p className="text-xs font-medium mb-1.5">Construction Cost Handling</p>
              <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
                <li>Construction expenses appear in the Property Ledger</li>
                <li>Ledger entries may be tagged as: Land Cost, Construction Cost, or Other Expense</li>
                <li>Construction images are stored under: Construction Progress and After Completion</li>
              </ul>
            </div>
          </div>
        )}

        {/* Section 6: Rental Details (Conditional - Only for Rent type) */}
        {isRentType && (
          <div className="border border-border bg-card p-5">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-border">Rental Details</h2>
            
            {property.rentalDetails ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tenant Name</p>
                  <p className="text-sm font-medium">{property.rentalDetails.tenantName}</p>
                </div>

                {property.rentalDetails.tenantCNIC && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tenant CNIC</p>
                    <p className="text-sm font-medium">{property.rentalDetails.tenantCNIC}</p>
                  </div>
                )}

                {property.rentalDetails.tenantPhoneNumber && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tenant Phone Number</p>
                    <p className="text-sm font-medium">{property.rentalDetails.tenantPhoneNumber}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Monthly Rent Amount</p>
                  <p className="text-sm font-medium">
                    {formatCurrency(property.rentalDetails.monthlyRentAmount)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Rent Due Date</p>
                  <p className="text-sm font-medium">
                    Day {property.rentalDetails.rentDueDate} of each month
                  </p>
                </div>

                {property.rentalDetails.securityAdvanceAmount && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Security / Advance Amount</p>
                    <p className="text-sm font-medium">
                      {formatCurrency(property.rentalDetails.securityAdvanceAmount)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No rental details available.</p>
            )}

            <div className="mt-4 p-3 bg-muted/30 border border-border">
              <p className="text-xs font-medium mb-1">Rental Income & Expenses</p>
              <p className="text-xs text-muted-foreground">
                Rental income and rental expenses are shown in the Property Ledger.
              </p>
            </div>
          </div>
        )}

        {/* Section 7: Agent / Dealer Information (Optional) */}
        {hasAgentInfo && (
          <div className="border border-border bg-card p-5">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-border">Agent / Dealer Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Agent / Dealer Name</p>
                <p className="text-sm font-medium">{property.agentInformation.name}</p>
              </div>

              {property.agentInformation.phoneNumber && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                  <p className="text-sm font-medium">{property.agentInformation.phoneNumber}</p>
                </div>
              )}

              {property.agentInformation.commissionAmount && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Commission Amount</p>
                  <p className="text-sm font-medium">
                    {formatCurrency(property.agentInformation.commissionAmount)}
                  </p>
                </div>
              )}

              {property.agentInformation.commissionPercentage && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Commission Percentage</p>
                  <p className="text-sm font-medium">
                    {property.agentInformation.commissionPercentage}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 8: Documents & Bills */}
        <div className="border border-border bg-card p-5">
          <PropertyDocuments
            documents={property.documents || []}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        </div>

        {/* Section 9: Property Images (Detailed Management) */}
        <div className="border border-border bg-card p-5">
          <PropertyImages
            images={property.images || []}
            onAddImage={handleAddImage}
            onDeleteImage={handleDeleteImage}
          />
        </div>

        {/* Section 10: Maintenance & Notes */}
        <div className="border border-border bg-card p-5">
          <PropertyNotes
            notes={property.notes || ""}
            onSaveNotes={handleSaveNotes}
          />
        </div>

        {/* Section 11: Property Ledger */}
        <div className="border border-border bg-card p-5">
          <PropertyLedger
            entries={property.ledgerEntries || []}
            documents={property.documents || []}
            images={property.images || []}
            onAddEntry={handleAddLedgerEntry}
            onDeleteEntry={handleDeleteLedgerEntry}
          />
        </div>

        {/* Section 12: Property Timeline / Activity History */}
        {hasTimelineEvents && (
          <div className="border border-border bg-card p-5">
            <PropertyTimeline events={property.timelineEvents || []} />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default PropertyDetail;
