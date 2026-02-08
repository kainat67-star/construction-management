import { Building2, BookOpen, ChevronLeft, ChevronRight, X, LogOut, LayoutDashboard, Activity, List, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import * as React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Activity, label: "Activity", href: "/activity" },
  { icon: Building2, label: "Property", href: "/properties" },
  { icon: List, label: "Listing", href: "/listing" },
  { icon: FileText, label: "Report", href: "/accounts/report" },
  { icon: BookOpen, label: "Accounts", href: "/accounts" },
];

interface SidebarContentProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

function SidebarContent({ collapsed = false, onNavigate }: SidebarContentProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "";
    setUserEmail(email);
  }, []);

  const isActive = (href: string) => {
    return location.pathname.startsWith(href);
  };

  const handleLinkClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    navigate("/login");
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <>
      {/* Logo & Brand */}
      <div className="flex h-16 items-center border-b border-sidebar-border/30 px-5">
        <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "justify-center w-full")}>
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold text-sidebar-foreground tracking-tight">Construction</span>
              <span className="text-xs text-sidebar-foreground/60 font-medium">Hub</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              to={item.href}
              onClick={handleLinkClick}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-primary/20 to-primary/10 text-sidebar-foreground border border-primary/20 shadow-sm shadow-primary/10"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon
                className={cn(
                  "h-4.5 w-4.5 flex-shrink-0 transition-colors",
                  active ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-primary"
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border/30 p-4 space-y-2.5">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-sm font-semibold text-sidebar-foreground border border-primary/20">
            {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden flex-1 min-w-0">
              <span className="truncate text-sm font-semibold text-sidebar-foreground">
                {userEmail || "User"}
              </span>
              <span className="truncate text-xs text-sidebar-foreground/60">Admin</span>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg h-8 text-xs px-3"
          >
            <LogOut className="h-3.5 w-3.5 mr-2" />
            Sign Out
          </Button>
        )}
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="w-full h-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg"
            title="Sign Out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </>
  );
}

interface SidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [isTablet, setIsTablet] = useState(false);

  React.useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  // Mobile and Tablet sidebar using Sheet
  if (isMobile || isTablet) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-72 bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden border-r border-sidebar-border">
          <div className="relative flex h-full flex-col">
            <SidebarContent onNavigate={() => onOpenChange?.(false)} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar (lg and above)
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar/98 backdrop-blur-xl transition-all duration-300 ease-in-out hidden lg:block border-r border-sidebar-border/30",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="relative flex h-full flex-col">
        <SidebarContent collapsed={collapsed} />
        
        {/* Collapse Toggle - Desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 flex h-7 w-7 items-center justify-center rounded-full border border-sidebar-border/50 bg-card/90 backdrop-blur-sm text-foreground/70 shadow-lg hover:bg-sidebar-accent hover:text-foreground hover:border-primary/30 transition-all duration-200 z-10"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>
    </aside>
  );
}
