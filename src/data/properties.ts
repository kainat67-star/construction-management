export interface Partner {
  name: string;
  sharePercentage?: number;
}

export interface PropertyImage {
  id: string;
  url: string;
  category: "Front View" | "Inside" | "Construction Progress" | "After Completion";
  uploadedAt: string;
}

export interface PropertyDocument {
  id: string;
  type: "Registry" | "Agreement" | "Bills" | "Utility" | "Other";
  url: string;
  fileName: string;
  uploadedAt: string;
  description?: string;
}

export interface ConstructionDetails {
  constructionStartDate: string;
  expectedCompletionDate?: string;
  contractorName?: string;
}

export interface RentalDetails {
  tenantName: string;
  tenantCNIC?: string;
  tenantPhoneNumber?: string;
  monthlyRentAmount: number;
  rentDueDate: number; // Day of month (1-31)
  securityAdvanceAmount?: number;
}

export interface AgentInformation {
  name: string;
  phoneNumber?: string;
  commissionAmount?: number;
  commissionPercentage?: number;
}

export interface TimelineEvent {
  id: string;
  type: "Property Created" | "Construction Started" | "Property Rented" | "Property Sold" | "Document Uploaded" | "Note Added" | "Status Changed";
  date: string;
  description: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  type: "Debit" | "Credit";
  amount: number;
  category?: string;
  paymentMethod?: "Cash" | "Bank" | "Cheque";
  paidToReceivedFrom?: string;
  linkedDocumentId?: string;
  linkedBillImageId?: string;
  attachmentUrl?: string;
  attachmentFileName?: string;
  notes?: string;
  isOpeningBalance?: boolean;
  isLocked?: boolean;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  category: "Land Only" | "Built House (Purchased)" | "Land + Construction";
  type: "Sale" | "Rent";
  status: "Ongoing" | "Sold" | "Rented";
  purchaseDate: string;
  purchasePrice: number;
  ownershipType?: "Single" | "Joint";
  partners?: Partner[];
  images?: PropertyImage[];
  documents?: PropertyDocument[];
  constructionDetails?: ConstructionDetails;
  rentalDetails?: RentalDetails;
  notes?: string;
  agentInformation?: AgentInformation;
  timelineEvents?: TimelineEvent[];
  ledgerEntries?: LedgerEntry[];
}

export const properties: Property[] = [
  {
    id: "1",
    name: "Property-001",
    location: "Karachi, Sindh",
    category: "Built House (Purchased)",
    type: "Rent",
    status: "Ongoing",
    purchaseDate: "2023-03-15",
    purchasePrice: 2450000,
    ownershipType: "Single",
    images: [
      {
        id: "img1",
        url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
        category: "Front View",
        uploadedAt: "2023-03-20",
      },
      {
        id: "img2",
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
        category: "Inside",
        uploadedAt: "2023-03-20",
      },
    ],
  },
  {
    id: "2",
    name: "Property-002",
    location: "Lahore, Punjab",
    category: "Land + Construction",
    type: "Sale",
    status: "Ongoing",
    purchaseDate: "2022-08-20",
    purchasePrice: 890000,
    ownershipType: "Joint",
    partners: [
      { name: "Ahmed Khan", sharePercentage: 60 },
      { name: "Fatima Ali", sharePercentage: 40 },
    ],
    images: [
      {
        id: "img3",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        category: "Construction Progress",
        uploadedAt: "2022-09-15",
      },
    ],
    constructionDetails: {
      constructionStartDate: "2022-09-01",
      expectedCompletionDate: "2024-12-31",
      contractorName: "ABC Construction Company",
    },
    documents: [
      {
        id: "doc1",
        type: "Agreement",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileName: "Construction_Agreement.pdf",
        uploadedAt: "2022-08-25",
        description: "Main construction agreement",
      },
    ],
    notes: "Foundation work completed. Waiting for first floor slab. Need to follow up with contractor about material delivery.",
    agentInformation: {
      name: "Real Estate Solutions",
      phoneNumber: "+92-300-9876543",
      commissionPercentage: 2.5,
    },
    timelineEvents: [
      {
        id: "timeline1",
        type: "Property Created",
        date: "2022-08-20",
        description: "Property was added to the system",
      },
      {
        id: "timeline2",
        type: "Construction Started",
        date: "2022-09-01",
        description: "Construction work began",
      },
      {
        id: "timeline3",
        type: "Document Uploaded",
        date: "2022-08-25",
        description: "Construction agreement uploaded",
      },
    ],
    ledgerEntries: [
      {
        id: "ledger1",
        date: "2022-08-20",
        description: "Land purchase payment",
        type: "Debit",
        amount: 890000,
        category: "Land Cost",
        linkedDocumentId: "doc1",
      },
      {
        id: "ledger2",
        date: "2022-09-15",
        description: "Construction material - Cement and Steel",
        type: "Debit",
        amount: 150000,
        category: "Construction Cost",
      },
      {
        id: "ledger3",
        date: "2022-10-05",
        description: "Labor charges - Foundation work",
        type: "Debit",
        amount: 75000,
        category: "Construction Cost",
      },
    ],
  },
  {
    id: "3",
    name: "Property-003",
    location: "Islamabad, Capital",
    category: "Land Only",
    type: "Sale",
    status: "Sold",
    purchaseDate: "2024-01-10",
    purchasePrice: 1200000,
    ownershipType: "Single",
  },
  {
    id: "4",
    name: "Property-004",
    location: "Karachi, Sindh",
    category: "Built House (Purchased)",
    type: "Rent",
    status: "Rented",
    purchaseDate: "2021-11-05",
    purchasePrice: 3200000,
    ownershipType: "Joint",
    partners: [
      { name: "Hassan Malik", sharePercentage: 50 },
      { name: "Sara Malik", sharePercentage: 50 },
    ],
    images: [
      {
        id: "img4",
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        category: "Front View",
        uploadedAt: "2021-11-10",
      },
      {
        id: "img5",
        url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800",
        category: "After Completion",
        uploadedAt: "2021-11-10",
      },
    ],
    rentalDetails: {
      tenantName: "Muhammad Ali",
      tenantCNIC: "42101-1234567-1",
      tenantPhoneNumber: "+92-300-1234567",
      monthlyRentAmount: 50000,
      rentDueDate: 5,
      securityAdvanceAmount: 100000,
    },
    documents: [
      {
        id: "doc2",
        type: "Agreement",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileName: "Rental_Agreement.pdf",
        uploadedAt: "2021-11-10",
        description: "Tenant rental agreement",
      },
      {
        id: "doc3",
        type: "Bills",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileName: "Electricity_Bill_Nov_2021.pdf",
        uploadedAt: "2021-11-15",
        description: "Monthly electricity bill",
      },
    ],
    notes: "Tenant is regular with payments. AC unit in master bedroom needs servicing. Follow up with maintenance team.",
    agentInformation: {
      name: "Property Deals Ltd",
      phoneNumber: "+92-321-5551234",
      commissionAmount: 50000,
    },
    timelineEvents: [
      {
        id: "timeline4",
        type: "Property Created",
        date: "2021-11-05",
        description: "Property was added to the system",
      },
      {
        id: "timeline5",
        type: "Property Rented",
        date: "2021-11-10",
        description: "Property rented to Muhammad Ali",
      },
      {
        id: "timeline6",
        type: "Document Uploaded",
        date: "2021-11-10",
        description: "Rental agreement uploaded",
      },
      {
        id: "timeline7",
        type: "Document Uploaded",
        date: "2021-11-15",
        description: "Electricity bill uploaded",
      },
    ],
    ledgerEntries: [
      {
        id: "ledger4",
        date: "2021-11-05",
        description: "Property purchase payment",
        type: "Debit",
        amount: 3200000,
        category: "Purchase",
        linkedDocumentId: "doc2",
      },
      {
        id: "ledger5",
        date: "2021-12-05",
        description: "Monthly rent received",
        type: "Credit",
        amount: 50000,
        category: "Rent",
      },
      {
        id: "ledger6",
        date: "2021-12-10",
        description: "Electricity bill payment",
        type: "Debit",
        amount: 8500,
        category: "Utility",
        linkedDocumentId: "doc3",
        linkedBillImageId: "img5",
      },
      {
        id: "ledger7",
        date: "2022-01-05",
        description: "Monthly rent received",
        type: "Credit",
        amount: 50000,
        category: "Rent",
      },
      {
        id: "ledger8",
        date: "2022-01-12",
        description: "Maintenance - AC servicing",
        type: "Debit",
        amount: 5000,
        category: "Maintenance",
      },
    ],
  },
  {
    id: "5",
    name: "Property-005",
    location: "Lahore, Punjab",
    category: "Land Only",
    type: "Sale",
    status: "Ongoing",
    purchaseDate: "2024-06-22",
    purchasePrice: 580000,
    ownershipType: "Single",
  },
];
