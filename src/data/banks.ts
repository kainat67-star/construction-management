export interface Bank {
  id: string;
  name: string;
  accountNumber?: string;
  branchName?: string;
  accountType?: string;
  balance?: number;
  notes?: string;
}

// Default banks (can be replaced by user-added banks)
let banksData: Bank[] = [
  { id: "bank-1", name: "Bank A", balance: 0 },
  { id: "bank-2", name: "Bank B", balance: 0 },
  { id: "bank-3", name: "Bank C", balance: 0 },
];

export function getBanks(): Bank[] {
  // Load from localStorage if available
  const stored = localStorage.getItem("banks");
  if (stored) {
    try {
      banksData = JSON.parse(stored);
    } catch (e) {
      console.error("Error loading banks from localStorage", e);
    }
  }
  return banksData;
}

export function setBanks(banks: Bank[]): void {
  banksData = banks;
  localStorage.setItem("banks", JSON.stringify(banks));
}

export function addBank(bank: Omit<Bank, "id">): Bank {
  const newBank: Bank = {
    ...bank,
    id: `bank-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  const updatedBanks = [...banksData, newBank];
  setBanks(updatedBanks);
  return newBank;
}

export function updateBank(bankId: string, updates: Partial<Bank>): void {
  const updatedBanks = banksData.map(bank =>
    bank.id === bankId ? { ...bank, ...updates } : bank
  );
  setBanks(updatedBanks);
}

export function deleteBank(bankId: string): void {
  const updatedBanks = banksData.filter(bank => bank.id !== bankId);
  setBanks(updatedBanks);
}

export function getBankNames(): string[] {
  return getBanks().map(bank => bank.name);
}
