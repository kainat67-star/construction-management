import { useState, useEffect } from "react";
import { Bell, Building2, BookOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
}

const navItems = [
  { icon: BookOpen, label: "Accounts", href: "/accounts" },
  { icon: Building2, label: "Properties", href: "/properties" },
];

export function Header({ title }: HeaderProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "";
    setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  // Get user initial from email
  const getUserInitial = () => {
    if (userEmail) {
      return userEmail.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Get display name from email (part before @)
  const getDisplayName = () => {
    if (userEmail) {
      const namePart = userEmail.split("@")[0];
      // Capitalize first letter and format
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return "User";
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center border-b border-border/30 bg-card/60 backdrop-blur-xl px-2 sm:px-4 md:px-6 relative">
      {/* Logo - Left */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs md:text-sm lg:text-base font-bold text-foreground tracking-tight leading-tight">Construction</span>
            <span className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground font-medium leading-tight">Hub</span>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Center */}
      <nav className="flex items-center gap-0.5 sm:gap-1 absolute left-1/2 transform -translate-x-1/2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href === "/properties" && location.pathname.startsWith("/properties")) ||
            (item.href === "/accounts" && location.pathname.startsWith("/accounts"));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Notification & Profile - Right */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0 ml-auto">
        {/* Notification Button */}
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-muted/50">
          <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>

        {/* Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center">
            <span className="text-xs sm:text-sm font-semibold text-foreground">{getUserInitial()}</span>
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold text-foreground">{getDisplayName()}</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
        </div>

        {/* Sign Out Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="h-8 sm:h-9 gap-1 sm:gap-2 text-muted-foreground hover:text-foreground px-2 sm:px-3"
        >
          <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden lg:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}
