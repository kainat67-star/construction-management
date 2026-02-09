import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AppLayout } from "@/components/layout/AppLayout";
import { Property, properties as initialProperties } from "@/data/properties";
import { 
  DailyLog, 
  DailyExpense, 
  OpeningBalances, 
  createDailyLog,
  consolidateEndOfDay,
  getDailyLogs,
  setDailyLogs as updateDailyLogsData,
} from "@/data/dailyLogs";
import { 
  Bank, 
  getBanks, 
  addBank, 
  updateBank, 
  deleteBank 
} from "@/data/banks";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Lock, Calendar, CalendarDays, Trash2, Building2, Edit2, Wallet, Landmark, TrendingUp, Pencil, CircleDollarSign, Clock, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar as DateCalendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const Accounts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [properties] = useState<Property[]>(initialProperties);
  const [currentLog, setCurrentLog] = useState<DailyLog | null>(null);
  const [dailyLogs, setDailyLogsState] = useState<DailyLog[]>(getDailyLogs());
  const [banks, setBanksState] = useState<Bank[]>(getBanks());
  
  // Helper to update both state and data
  const setDailyLogs = (logs: DailyLog[]) => {
    setDailyLogsState(logs);
    updateDailyLogsData(logs);
  };

  const setBanks = (banksList: Bank[]) => {
    setBanksState(banksList);
  };

  const [showOpeningBalanceDialog, setShowOpeningBalanceDialog] = useState(false);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showBankDialog, setShowBankDialog] = useState(false);
  const [showManageBanksDialog, setShowManageBanksDialog] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [editingBalance, setEditingBalance] = useState<{ type: "cash" | "bank"; bankName?: string } | null>(null);
  const [editingBalanceValue, setEditingBalanceValue] = useState<number>(0);
  
  const [openingBalances, setOpeningBalances] = useState<OpeningBalances>({
    cash: 0,
    banks: {},
  });

  const [newExpense, setNewExpense] = useState<Omit<DailyExpense, "id">>({
    description: "",
    propertyId: null,
    amount: 0,
    paymentMethod: "Cash",
    bankName: undefined,
    cashAmount: undefined,
    bankAmount: undefined,
    isPending: false,
  });
  const [selectedPaymentSource, setSelectedPaymentSource] = useState<string>("Cash");

  const [newBank, setNewBank] = useState<Omit<Bank, "id">>({
    name: "",
    accountNumber: "",
    branchName: "",
    accountType: "",
    balance: 0,
    notes: "",
  });

  // Load log when date changes
  useEffect(() => {
    const dateObj = selectedDate || new Date();
    const isoDate = dateObj.toISOString().split("T")[0];
    const logs = getDailyLogs();
    let logForDay = logs.find((log) => log.date === isoDate);

    if (!logForDay) {
      // If no log exists for this date, create a fresh one with zero balances
      const initialBalances: OpeningBalances = { cash: 0, banks: {} };
      logForDay = createDailyLog(isoDate, initialBalances);
      const updatedLogs = [...logs, logForDay];
      setDailyLogs(updatedLogs);
    }

    setCurrentLog(logForDay);
    setOpeningBalances(logForDay.openingBalances);
  }, [selectedDate]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleSetOpeningBalances = () => {
    if (!currentLog) return;

    const updatedLog: DailyLog = {
      ...currentLog,
      openingBalances,
    };
    
    setCurrentLog(updatedLog);
    setDailyLogs(dailyLogs.map(log => log.id === updatedLog.id ? updatedLog : log));
    setShowOpeningBalanceDialog(false);
    
    toast({
      title: "Opening balances set",
      description: "Opening balances have been saved.",
    });
  };

  const handleEditBalance = (type: "cash" | "bank", bankName?: string) => {
    if (!currentLog || currentLog.isLocked) return;
    
    if (type === "cash") {
      setEditingBalance({ type: "cash" });
      setEditingBalanceValue(currentLog.openingBalances.cash);
    } else if (type === "bank" && bankName) {
      setEditingBalance({ type: "bank", bankName });
      setEditingBalanceValue(currentLog.openingBalances.banks[bankName] || 0);
    }
  };

  const handleSaveBalance = () => {
    if (!currentLog || !editingBalance) return;

    const updatedBalances = { ...currentLog.openingBalances };
    
    if (editingBalance.type === "cash") {
      updatedBalances.cash = editingBalanceValue;
    } else if (editingBalance.type === "bank" && editingBalance.bankName) {
      updatedBalances.banks = {
        ...updatedBalances.banks,
        [editingBalance.bankName]: editingBalanceValue,
      };
    }

    const updatedLog: DailyLog = {
      ...currentLog,
      openingBalances: updatedBalances,
    };
    
    setCurrentLog(updatedLog);
    setDailyLogs(dailyLogs.map(log => log.id === updatedLog.id ? updatedLog : log));
    setEditingBalance(null);
    setEditingBalanceValue(0);
    
    toast({
      title: "Balance updated",
      description: `${editingBalance.type === "cash" ? "Cash" : editingBalance.bankName} balance has been updated.`,
    });
  };

  const handleAddExpense = () => {
    if (!currentLog || currentLog.isLocked) {
        toast({
        title: "Cannot add expense",
        description: "This day's log is locked. Please unlock it first.",
          variant: "destructive",
        });
      return;
    }

    if (!newExpense.description) {
      toast({
        title: "Invalid expense",
        description: "Please enter a description.",
        variant: "destructive",
      });
      return;
    }

    if (newExpense.amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPaymentSource) {
      toast({
        title: "Payment method required",
        description: "Please select Cash or a Bank.",
        variant: "destructive",
      });
      return;
    }

    const isCash = selectedPaymentSource === "Cash";

    const expense: DailyExpense = {
      ...newExpense,
      paymentMethod: isCash ? "Cash" : "Bank",
      amount: newExpense.amount,
      bankName: isCash ? undefined : selectedPaymentSource,
      cashAmount: undefined,
      bankAmount: undefined,
      id: `expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedLog: DailyLog = {
      ...currentLog,
      expenses: [...currentLog.expenses, expense],
    };

    setCurrentLog(updatedLog);
    setDailyLogs(dailyLogs.map(log => log.id === updatedLog.id ? updatedLog : log));
    
    // Reset form
    setNewExpense({
      description: "",
      propertyId: null,
      amount: 0,
      paymentMethod: "Cash",
      bankName: undefined,
      cashAmount: undefined,
      bankAmount: undefined,
      isPending: false,
    });
    setSelectedPaymentSource("Cash");
    setShowExpenseDialog(false);

    toast({
      title: "Expense added",
      description: "Expense has been added successfully.",
    });
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (!currentLog || currentLog.isLocked) return;

    const updatedLog: DailyLog = {
      ...currentLog,
      expenses: currentLog.expenses.filter(exp => exp.id !== expenseId),
    };

    setCurrentLog(updatedLog);
    setDailyLogs(dailyLogs.map(log => log.id === updatedLog.id ? updatedLog : log));

    toast({
      title: "Expense deleted",
      description: "Expense has been removed.",
    });
  };

  const handleMarkAsPaid = (expenseId: string) => {
    if (!currentLog || currentLog.isLocked) return;

    const updatedLog: DailyLog = {
      ...currentLog,
      expenses: currentLog.expenses.map(exp => 
        exp.id === expenseId ? { ...exp, isPending: false } : exp
      ),
    };

    setCurrentLog(updatedLog);
    setDailyLogs(dailyLogs.map(log => log.id === updatedLog.id ? updatedLog : log));

    toast({
      title: "Payment marked as paid",
      description: "The expense has been marked as paid.",
    });
  };

  const handleEndOfDay = () => {
    if (!currentLog) return;

    if (currentLog.isLocked) {
      toast({
        title: "Already locked",
        description: "This day's log is already locked.",
        variant: "destructive",
      });
      return;
    }

    const consolidated = consolidateEndOfDay(currentLog);
    setCurrentLog(consolidated);
    setDailyLogs(dailyLogs.map(log => log.id === consolidated.id ? consolidated : log));

    toast({
      title: "Day completed",
      description: "Daily log has been consolidated and locked.",
    });

    // Navigate to full report page with the consolidated log
    navigate("/accounts/report", { state: { log: consolidated } });
  };

  const handleAddBank = () => {
    if (!newBank.name.trim()) {
      toast({
        title: "Bank name required",
        description: "Please enter a bank name.",
        variant: "destructive",
      });
      return;
    }

    if (banks.some(b => b.name.toLowerCase() === newBank.name.toLowerCase())) {
      toast({
        title: "Bank already exists",
        description: "A bank with this name already exists.",
        variant: "destructive",
      });
      return;
    }

    const bank = addBank(newBank);
    setBanks(getBanks());
    setNewBank({ name: "", accountNumber: "", branchName: "", accountType: "", notes: "" });
    setShowBankDialog(false);

    toast({
      title: "Bank added",
      description: `${bank.name} has been added successfully.`,
    });
  };

  const handleUpdateBank = () => {
    if (!editingBank) return;

    if (!editingBank.name.trim()) {
      toast({
        title: "Bank name required",
        description: "Please enter a bank name.",
        variant: "destructive",
      });
      return;
    }

    updateBank(editingBank.id, editingBank);
    setBanks(getBanks());
    setEditingBank(null);
    setShowBankDialog(false);

    toast({
      title: "Bank updated",
      description: "Bank information has been updated.",
    });
  };

  const handleDeleteBank = (bankId: string) => {
    const bank = banks.find(b => b.id === bankId);
    if (!bank) return;

    // Check if bank is used in any expenses
    const isUsed = dailyLogs.some(log =>
      log.expenses.some(exp => exp.bankName === bank.name)
    );

    if (isUsed) {
      toast({
        title: "Cannot delete bank",
        description: "This bank is being used in expense entries and cannot be deleted.",
        variant: "destructive",
      });
      return;
    }

    deleteBank(bankId);
    setBanks(getBanks());

    toast({
      title: "Bank deleted",
      description: `${bank.name} has been removed.`,
    });
  };

  if (!currentLog) {
    return (
      <AppLayout title="">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  // Separate pending and paid expenses
  const paidExpenses = currentLog.expenses.filter(exp => !exp.isPending);
  const pendingExpenses = currentLog.expenses.filter(exp => exp.isPending);

  const totalExpenses = paidExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const cashExpenses = paidExpenses
    .filter(exp => exp.paymentMethod === "Cash")
    .reduce((sum, exp) => sum + exp.amount, 0) +
    paidExpenses
    .filter(exp => exp.paymentMethod === "Split" && exp.cashAmount)
    .reduce((sum, exp) => sum + (exp.cashAmount || 0), 0);
  
  const bankExpenses: Record<string, number> = {};
  paidExpenses.forEach(exp => {
    if (exp.paymentMethod === "Bank" && exp.bankName) {
      bankExpenses[exp.bankName] = (bankExpenses[exp.bankName] || 0) + exp.amount;
    } else if (exp.paymentMethod === "Split" && exp.bankName && exp.bankAmount) {
      bankExpenses[exp.bankName] = (bankExpenses[exp.bankName] || 0) + exp.bankAmount;
    }
  });

  const closingCash = currentLog.openingBalances.cash - cashExpenses;
  const closingBanks: Record<string, number> = {};
  Object.keys(currentLog.openingBalances.banks).forEach(bankName => {
    closingBanks[bankName] = (currentLog.openingBalances.banks[bankName] || 0) - (bankExpenses[bankName] || 0);
  });

  // Calculate total balances
  const totalOpeningBalance = currentLog.openingBalances.cash + 
    Object.values(currentLog.openingBalances.banks).reduce((sum, balance) => sum + (balance || 0), 0);
  const totalCurrentBalance = closingCash + 
    Object.values(closingBanks).reduce((sum, balance) => sum + (balance || 0), 0);

  const bankNames = banks.map(b => b.name);

  return (
    <AppLayout title="">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-1">Accounts</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Daily financial tracking and expense management</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 h-9 px-3 text-sm border-border/50 hover:bg-muted/50"
                >
                  <CalendarDays className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {selectedDate
                      ? formatDate(selectedDate.toISOString().split("T")[0])
                      : "Select date"}
                  </span>
                  <span className="sm:hidden">Date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-border/50 glass-card" align="start" side="bottom">
                <DateCalendar
                  mode="single"
                  selected={selectedDate || new Date()}
                  onSelect={(date) => setSelectedDate(date ?? new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              onClick={() => setShowHistoryDialog(true)}
              className="gap-2 h-9 px-3 text-sm border-border/50 hover:bg-muted/50"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </Button>
            {!currentLog.isLocked && (
              <Button
                onClick={handleEndOfDay}
                className="gap-2 h-9 px-4 text-sm bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">Close Day</span>
                <span className="sm:hidden">Close</span>
              </Button>
            )}
          </div>
        </div>

        {/* Balance Cards Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Balances</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowManageBanksDialog(true)}
              className="gap-2 h-8 px-3 text-xs border-border/50 hover:bg-muted/50"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Manage Banks</span>
              <span className="sm:hidden">Banks</span>
            </Button>
          </div>
          
          {/* Balance Cards - Modern Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Total Balance Card */}
            <div className="rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5 backdrop-blur-xl p-4 sm:p-6 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 relative group shadow-lg sm:col-span-2 lg:col-span-1">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/30 shadow-lg shadow-primary/20">
                    <CircleDollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Balance</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground/60 mb-0.5">Opening</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {formatCurrency(totalOpeningBalance)}
                  </p>
                </div>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-foreground mb-2 break-words">
                {formatCurrency(totalCurrentBalance)}
              </p>
              <p className="text-xs text-muted-foreground/70">Cash + All Banks</p>
            </div>

            {/* Cash Card */}
            <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl p-4 sm:p-6 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 relative group shadow-lg">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cash</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground/60 mb-0.5">Opening</p>
                    <p className="text-sm font-semibold text-muted-foreground">
                      {formatCurrency(currentLog.openingBalances.cash)}
                    </p>
                  </div>
                  {!currentLog.isLocked && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditBalance("cash")}
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
                      title="Edit cash balance"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mb-2 break-words">
                {formatCurrency(closingCash)}
              </p>
              <p className="text-xs text-muted-foreground/70">Current balance</p>
            </div>

            {/* Bank Cards */}
            {banks.map((bank, index) => {
              const openingBalance = currentLog.openingBalances.banks[bank.name] || 0;
              const currentBalance = closingBanks[bank.name] || 0;
              return (
                <div
                  key={bank.id}
                  className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl p-4 sm:p-6 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 relative group shadow-lg"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl border flex-shrink-0",
                        index % 2 === 0 
                          ? "bg-gradient-to-br from-primary/20 to-primary/10 border-primary/20"
                          : "bg-gradient-to-br from-accent/20 to-accent/10 border-accent/20"
                      )}>
                        <Landmark className={cn(
                          "h-6 w-6",
                          index % 2 === 0 ? "text-primary" : "text-accent"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">{bank.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground/60 mb-0.5">Opening</p>
                        <p className="text-sm font-semibold text-muted-foreground">
                          {formatCurrency(openingBalance)}
                        </p>
                      </div>
                      {!currentLog.isLocked && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditBalance("bank", bank.name)}
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground hover:bg-muted/50 flex-shrink-0 rounded-lg"
                          title={`Edit ${bank.name} balance`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground mb-2 break-words">
                    {formatCurrency(currentBalance)}
                  </p>
                  {bank.accountNumber ? (
                    <p className="text-xs text-muted-foreground/70 truncate">{bank.accountNumber}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground/70">Current balance</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Payments Section */}
        {pendingExpenses.length > 0 && (
          <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 backdrop-blur-xl shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    Pending Payments
                  </h2>
                  <p className="text-xs text-muted-foreground/70">Payments that are not yet completed</p>
                </div>
              </div>
              
              <div className="rounded-xl border border-amber-500/20 overflow-hidden bg-muted/10">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-amber-500/10 border-b border-amber-500/20 hover:bg-amber-500/10">
                        <TableHead className="text-xs font-semibold w-12 text-center text-muted-foreground py-4">#</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground py-4 min-w-[160px]">Description</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground py-4 hidden sm:table-cell min-w-[140px]">Property</TableHead>
                        <TableHead className="text-xs font-semibold text-right text-muted-foreground py-4 min-w-[120px]">Amount</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground py-4 hidden md:table-cell">Method</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground py-4 hidden lg:table-cell">Bank</TableHead>
                        {!currentLog.isLocked && (
                          <TableHead className="text-xs font-semibold text-center w-20 text-muted-foreground py-4">Action</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingExpenses.map((expense, index) => {
                        const property = expense.propertyId
                          ? properties.find(p => p.id === expense.propertyId)
                          : null;
                        return (
                          <TableRow 
                            key={expense.id} 
                            className="border-b border-amber-500/10 hover:bg-amber-500/5 transition-colors"
                          >
                            <TableCell className="text-sm text-center text-muted-foreground py-4">
                              {index + 1}
                            </TableCell>
                            <TableCell className="text-sm font-medium text-foreground py-4">
                              <div className="flex flex-col gap-0.5">
                                <span>{expense.description}</span>
                                <span className="text-xs text-muted-foreground sm:hidden">
                                  {property ? property.name : "-"} • {expense.paymentMethod === "Split" ? "Split" : expense.paymentMethod}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground py-4 hidden sm:table-cell">
                              {property ? property.name : "-"}
                            </TableCell>
                            <TableCell className="text-sm font-semibold text-right text-foreground py-4">
                              {formatCurrency(expense.amount)}
                              {expense.paymentMethod === "Split" && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {expense.cashAmount && expense.bankAmount && (
                                    <>Cash: {formatCurrency(expense.cashAmount)} • Bank: {formatCurrency(expense.bankAmount)}</>
                                  )}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="py-4 hidden md:table-cell">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                {expense.paymentMethod === "Split" ? "Split" : expense.paymentMethod}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground py-4 hidden lg:table-cell">
                              {expense.paymentMethod === "Split" 
                                ? expense.bankName ? `${expense.bankName} (Split)` : "Split"
                                : expense.bankName || "-"}
                            </TableCell>
                            {!currentLog.isLocked && (
                              <TableCell className="text-center py-4">
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkAsPaid(expense.id)}
                                    className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10 rounded-lg"
                                    title="Mark as paid"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteExpense(expense.id)}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expenses Section */}
        <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-1">Paid Expenses</h2>
                <p className="text-xs text-muted-foreground/70">Track all completed daily expenses</p>
              </div>
              {!currentLog.isLocked && (
                <Button
                  onClick={() => {
                    setSelectedPaymentSource("Cash");
                    setShowExpenseDialog(true);
                  }}
                  className="gap-2 h-10 px-3 sm:px-5 text-sm bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Entry</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              )}
            </div>
            
            {paidExpenses.length === 0 ? (
              <div className="border border-dashed border-border/50 rounded-xl p-8 sm:p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <TrendingUp className="h-10 w-10 text-muted-foreground/30" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">No expenses recorded</p>
                    <p className="text-xs text-muted-foreground">Click "Add Entry" to record your first expense</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border/20 overflow-hidden bg-muted/10">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20 border-b border-border/20 hover:bg-muted/20">
                        <TableHead className="text-xs font-semibold w-12 text-center text-muted-foreground py-4">#</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground py-4 min-w-[160px]">Description</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground py-4 hidden sm:table-cell min-w-[140px]">Property</TableHead>
                        <TableHead className="text-xs font-semibold text-right text-muted-foreground py-4 min-w-[120px]">Amount</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground py-4 hidden md:table-cell">Method</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground py-4 hidden lg:table-cell">Bank</TableHead>
                        {!currentLog.isLocked && (
                          <TableHead className="text-xs font-semibold text-center w-20 text-muted-foreground py-4">Action</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paidExpenses.map((expense, index) => {
                        const property = expense.propertyId
                          ? properties.find(p => p.id === expense.propertyId)
                          : null;
                        return (
                          <TableRow 
                            key={expense.id} 
                            className="border-b border-border/10 hover:bg-muted/20 transition-colors"
                          >
                            <TableCell className="text-sm text-center text-muted-foreground py-4">
                              {index + 1}
                            </TableCell>
                            <TableCell className="text-sm font-medium text-foreground py-4">
                              <div className="flex flex-col gap-0.5">
                                <span>{expense.description}</span>
                                <span className="text-xs text-muted-foreground sm:hidden">
                                  {property ? property.name : "-"} • {expense.paymentMethod === "Split" ? "Split" : expense.paymentMethod}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground py-4 hidden sm:table-cell">
                              {property ? property.name : "-"}
                            </TableCell>
                            <TableCell className="text-sm font-semibold text-right text-foreground py-4">
                              {formatCurrency(expense.amount)}
                              {expense.paymentMethod === "Split" && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {expense.cashAmount && expense.bankAmount && (
                                    <>Cash: {formatCurrency(expense.cashAmount)} • Bank: {formatCurrency(expense.bankAmount)}</>
                                  )}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="py-4 hidden md:table-cell">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                {expense.paymentMethod === "Split" ? "Split" : expense.paymentMethod}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground py-4 hidden lg:table-cell">
                              {expense.paymentMethod === "Split" 
                                ? expense.bankName ? `${expense.bankName} (Split)` : "Split"
                                : expense.bankName || "-"}
                            </TableCell>
                            {!currentLog.isLocked && (
                              <TableCell className="text-center py-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteExpense(expense.id)}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          {/* Footer note when the day is locked */}
          {currentLog.isLocked && (
            <div className="p-4 bg-muted/20 border-t border-border/30">
              <p className="text-xs font-medium text-muted-foreground text-center">
                🔒 This day's accounts are closed and locked. View the full report on the report page.
              </p>
            </div>
          )}
        </div>

        {/* Edit Single Balance Dialog */}
        <Dialog open={!!editingBalance} onOpenChange={(open) => !open && setEditingBalance(null)}>
          <DialogContent className="max-w-md border-border/50 glass-card w-[95vw] sm:w-full shadow-modal">
            <DialogHeader className="pb-4 border-b border-border/30">
              <DialogTitle className="text-base sm:text-lg font-semibold">
                Edit {editingBalance?.type === "cash" ? "Cash" : editingBalance?.bankName} Balance
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                Update the opening balance for {editingBalance?.type === "cash" ? "cash" : editingBalance?.bankName}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div>
                <Label htmlFor="edit-balance" className="text-sm font-medium mb-2 block">
                  {editingBalance?.type === "cash" ? "Cash" : editingBalance?.bankName} Balance
                </Label>
                <Input
                  id="edit-balance"
                  type="number"
                  step="500"
                  value={editingBalanceValue === 0 ? "" : editingBalanceValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditingBalanceValue(value === "" ? 0 : parseFloat(value) || 0);
                  }}
                  className="h-11 border-border/50"
                  placeholder="Enter amount"
                  autoFocus
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-border/30">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingBalance(null)} 
                  className="h-9 px-4 text-sm border-border/50 hover:bg-muted/50 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveBalance} 
                  className="h-9 px-4 text-sm bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 w-full sm:w-auto"
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Opening Balance Dialog */}
        <Dialog open={showOpeningBalanceDialog} onOpenChange={setShowOpeningBalanceDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto border-border/50 glass-card w-[95vw] sm:w-full shadow-modal">
            <DialogHeader className="pb-4 border-b border-border/30">
              <DialogTitle className="text-base sm:text-lg font-semibold">Set Opening Balances</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                Enter the opening balances for cash and each bank at the start of the day.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5">
              <div>
                <Label htmlFor="cash-balance" className="text-sm font-medium mb-2 block">Cash</Label>
                <Input
                  id="cash-balance"
                  type="number"
                  step="500"
                  value={openingBalances.cash === 0 ? "" : openingBalances.cash}
                  onChange={(e) => {
                    const value = e.target.value;
                    setOpeningBalances({
                      ...openingBalances,
                      cash: value === "" ? 0 : parseFloat(value) || 0,
                    });
                  }}
                  className="h-11 border-border/50"
                  placeholder="Enter amount"
                />
              </div>
              {banks.map(bank => (
                <div key={bank.id}>
                  <Label htmlFor={`bank-${bank.id}`} className="text-sm font-medium mb-2 block">{bank.name}</Label>
                  <Input
                    id={`bank-${bank.id}`}
                    type="number"
                    step="500"
                    value={openingBalances.banks[bank.name] === 0 || !openingBalances.banks[bank.name] ? "" : openingBalances.banks[bank.name]}
                    onChange={(e) => {
                      const value = e.target.value;
                      setOpeningBalances({
                        ...openingBalances,
                        banks: {
                          ...openingBalances.banks,
                          [bank.name]: value === "" ? 0 : parseFloat(value) || 0,
                        },
                      });
                    }}
                    className="h-11 border-border/50"
                    placeholder="Enter amount"
                  />
                </div>
              ))}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-border/30">
                <Button variant="outline" onClick={() => setShowOpeningBalanceDialog(false)} className="h-9 px-4 text-sm border-border/50 hover:bg-muted/50 w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleSetOpeningBalances} className="h-9 px-4 text-sm bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 w-full sm:w-auto">
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Expense Dialog */}
        <Dialog 
          open={showExpenseDialog} 
          onOpenChange={(open) => {
            setShowExpenseDialog(open);
            if (!open) {
              setSelectedPaymentSource("Cash");
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto border-border/50 glass-card w-[95vw] sm:w-full shadow-modal">
            <DialogHeader className="pb-4 border-b border-border/30">
              <DialogTitle className="text-base sm:text-lg font-semibold">Add Expense Entry</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                Record a new expense entry for today.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5">
              <div>
                <Label htmlFor="expense-description" className="text-sm font-medium mb-2 block">Description *</Label>
                <Input
                  id="expense-description"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, description: e.target.value })
                  }
                  className="h-11 border-border/50"
                  placeholder="Enter expense description"
                />
              </div>
              <div>
                <Label htmlFor="expense-property" className="text-sm font-medium mb-2 block">Property (Optional)</Label>
                <Select
                  value={newExpense.propertyId || "none"}
                  onValueChange={(value) =>
                    setNewExpense({
                      ...newExpense,
                      propertyId: value === "none" ? null : value,
                    })
                  }
                >
                  <SelectTrigger id="expense-property" className="h-11 border-border/50">
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expense-amount" className="text-sm font-medium mb-2 block">Amount *</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  step="500"
                  value={newExpense.amount === 0 ? "" : newExpense.amount || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewExpense({
                      ...newExpense,
                      amount: value === "" ? 0 : parseFloat(value) || 0,
                    });
                  }}
                  className="h-11 border-border/50"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <Label htmlFor="expense-method" className="text-sm font-medium mb-2 block">Payment Method *</Label>
                <Select
                  value={selectedPaymentSource}
                  onValueChange={(value) => setSelectedPaymentSource(value)}
                >
                  <SelectTrigger id="expense-method" className="h-11 border-border/50">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    {bankNames.map((bankName) => (
                      <SelectItem key={bankName} value={bankName}>
                        {bankName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is-pending"
                  checked={newExpense.isPending || false}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, isPending: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="is-pending" className="text-sm font-medium cursor-pointer">
                  Mark as pending payment
                </Label>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-border/30">
                <Button variant="outline" onClick={() => setShowExpenseDialog(false)} className="h-9 px-4 text-sm border-border/50 hover:bg-muted/50 w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleAddExpense} className="h-9 px-4 text-sm bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 w-full sm:w-auto">
                  <span className="hidden sm:inline">Add Entry</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Manage Banks Dialog */}
        <Dialog open={showManageBanksDialog} onOpenChange={setShowManageBanksDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold">Manage Banks</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Add, edit, or remove bank accounts.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-5">
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setEditingBank(null);
                    setNewBank({ name: "", accountNumber: "", branchName: "", accountType: "", notes: "" });
                    setShowBankDialog(true);
                  }}
                  className="gap-2 shadow-sm text-sm sm:text-base h-9 sm:h-10"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add New Bank</span>
                  <span className="sm:hidden">Add Bank</span>
                </Button>
              </div>
              <div className="border border-border/50 rounded-xl overflow-hidden bg-background">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 border-b border-border/50">
                        <TableHead className="text-sm sm:text-base font-bold min-w-[120px]">Bank Name</TableHead>
                        <TableHead className="text-sm sm:text-base font-bold min-w-[140px]">Account Number</TableHead>
                        <TableHead className="text-sm sm:text-base font-bold min-w-[120px]">Branch</TableHead>
                        <TableHead className="text-sm sm:text-base font-bold min-w-[120px]">Account Type</TableHead>
                        <TableHead className="text-sm sm:text-base font-bold text-right min-w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {banks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                            <div className="flex flex-col items-center gap-3">
                              <Building2 className="h-12 w-12 text-muted-foreground/50" />
                              <p className="text-sm sm:text-base font-medium">No banks added yet</p>
                              <p className="text-xs sm:text-sm text-muted-foreground">Click "Add New Bank" to get started</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        banks.map((bank) => (
                          <TableRow key={bank.id} className="border-b border-border/50 hover:bg-muted/20">
                            <TableCell className="text-sm sm:text-base font-semibold">{bank.name}</TableCell>
                            <TableCell className="text-sm sm:text-base text-muted-foreground">
                              {bank.accountNumber || "-"}
                            </TableCell>
                            <TableCell className="text-sm sm:text-base text-muted-foreground">
                              {bank.branchName || "-"}
                            </TableCell>
                            <TableCell className="text-sm sm:text-base text-muted-foreground">
                              {bank.accountType || "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingBank(bank);
                                    setShowBankDialog(true);
                                  }}
                                  className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-lg"
                                >
                                  <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteBank(bank.id)}
                                  className="h-8 w-8 sm:h-9 sm:w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                >
                                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Bank Dialog */}
        <Dialog open={showBankDialog} onOpenChange={(open) => {
          setShowBankDialog(open);
          if (!open) {
            setEditingBank(null);
            setNewBank({ name: "", accountNumber: "", branchName: "", accountType: "", notes: "" });
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold">
                {editingBank ? "Edit Bank" : "Add New Bank"}
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                {editingBank ? "Update bank information." : "Add a new bank account with details."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-5">
              <div>
                <Label htmlFor="bank-name" className="text-sm sm:text-base font-semibold mb-2 block">Bank Name *</Label>
                <Input
                  id="bank-name"
                  value={editingBank ? editingBank.name : newBank.name}
                  onChange={(e) => {
                    if (editingBank) {
                      setEditingBank({ ...editingBank, name: e.target.value });
                    } else {
                      setNewBank({ ...newBank, name: e.target.value });
                    }
                  }}
                  className="text-base sm:text-lg h-11 sm:h-12 border-2"
                  placeholder="Enter bank name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="bank-account" className="text-sm sm:text-base font-semibold mb-2 block">Account Number</Label>
                <Input
                  id="bank-account"
                  value={editingBank ? editingBank.accountNumber || "" : newBank.accountNumber || ""}
                  onChange={(e) => {
                    if (editingBank) {
                      setEditingBank({ ...editingBank, accountNumber: e.target.value });
                    } else {
                      setNewBank({ ...newBank, accountNumber: e.target.value });
                    }
                  }}
                  className="text-base sm:text-lg h-11 sm:h-12 border-2"
                  placeholder="Enter account number"
                />
              </div>
              <div>
                <Label htmlFor="bank-branch" className="text-sm sm:text-base font-semibold mb-2 block">Branch Name</Label>
                <Input
                  id="bank-branch"
                  value={editingBank ? editingBank.branchName || "" : newBank.branchName || ""}
                  onChange={(e) => {
                    if (editingBank) {
                      setEditingBank({ ...editingBank, branchName: e.target.value });
                    } else {
                      setNewBank({ ...newBank, branchName: e.target.value });
                    }
                  }}
                  className="text-base sm:text-lg h-11 sm:h-12 border-2"
                  placeholder="Enter branch name"
                />
              </div>
              <div>
                <Label htmlFor="bank-type" className="text-sm sm:text-base font-semibold mb-2 block">Account Type</Label>
                <Select
                  value={editingBank ? editingBank.accountType || "" : newBank.accountType || ""}
                  onValueChange={(value) => {
                    if (editingBank) {
                      setEditingBank({ ...editingBank, accountType: value });
                    } else {
                      setNewBank({ ...newBank, accountType: value });
                    }
                  }}
                >
                  <SelectTrigger id="bank-type" className="text-base sm:text-lg h-11 sm:h-12 border-2">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Current">Current</SelectItem>
                    <SelectItem value="Savings">Savings</SelectItem>
                    <SelectItem value="Fixed Deposit">Fixed Deposit</SelectItem>
                    <SelectItem value="Recurring Deposit">Recurring Deposit</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bank-balance" className="text-sm sm:text-base font-semibold mb-2 block">Bank Balance</Label>
                <Input
                  id="bank-balance"
                  type="number"
                  value={
                    editingBank
                      ? editingBank.balance ?? ""
                      : newBank.balance === 0 ? "" : newBank.balance
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    const numeric = value === "" ? 0 : parseFloat(value) || 0;
                    if (editingBank) {
                      setEditingBank({ ...editingBank, balance: numeric });
                    } else {
                      setNewBank({ ...newBank, balance: numeric });
                    }
                  }}
                  className="text-base sm:text-lg h-11 sm:h-12 border-2"
                  placeholder="Enter current bank balance"
                />
              </div>
              <div>
                <Label htmlFor="bank-notes" className="text-sm sm:text-base font-semibold mb-2 block">Notes</Label>
                <Input
                  id="bank-notes"
                  value={editingBank ? editingBank.notes || "" : newBank.notes || ""}
                  onChange={(e) => {
                    if (editingBank) {
                      setEditingBank({ ...editingBank, notes: e.target.value });
                    } else {
                      setNewBank({ ...newBank, notes: e.target.value });
                    }
                  }}
                  className="text-base sm:text-lg h-11 sm:h-12 border-2"
                  placeholder="Additional notes (optional)"
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowBankDialog(false);
                    setEditingBank(null);
                    setNewBank({ name: "", accountNumber: "", branchName: "", accountType: "", balance: 0, notes: "" });
                  }}
                  className="shadow-sm w-full sm:w-auto h-9 sm:h-10"
                >
                  Cancel
                </Button>
                <Button onClick={editingBank ? handleUpdateBank : handleAddBank} className="shadow-sm w-full sm:w-auto h-9 sm:h-10">
                  {editingBank ? (
                    <>
                      <span className="hidden sm:inline">Update Bank</span>
                      <span className="sm:hidden">Update</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Add Bank</span>
                      <span className="sm:hidden">Add</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* History Dialog */}
        <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold">Daily Accounts History</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                View past daily accounts.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {dailyLogs
                .filter(log => log.isLocked)
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((log) => (
                  <div key={log.id} className="border border-border/50 rounded-xl p-4 sm:p-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-border/50">
                      <h3 className="text-base sm:text-lg font-bold text-foreground">{formatDate(log.date)}</h3>
                      <span className="text-xs sm:text-sm font-semibold text-muted-foreground">🔒 Closed</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-1">Total Expenses</p>
                        <p className="text-xl font-bold text-foreground">{formatCurrency(log.totalDailyExpenses)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-1">Number of Entries</p>
                        <p className="text-xl font-bold text-foreground">{log.expenses.length}</p>
                      </div>
                    </div>
                    {Object.keys(log.bankUsage).length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-sm font-semibold text-muted-foreground mb-3">Bank Usage</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.entries(log.bankUsage).map(([bank, amount]) => (
                            <div key={bank} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                              <p className="text-xs font-semibold text-muted-foreground mb-1">{bank}</p>
                              <p className="text-base font-bold text-foreground">{formatCurrency(amount)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              {dailyLogs.filter(log => log.isLocked).length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-base font-medium text-muted-foreground">
                    No historical accounts available yet.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Accounts;
