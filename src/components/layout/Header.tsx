import { useState, useEffect } from "react";
import { BookOpen, Building2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <header className="sticky top-0 z-30 border-b border-gray-300 bg-white">
      {/* Single Row: Logo + Navigation + Avatar (Mobile) */}
      <div className="flex h-14 sm:h-16 md:h-18 items-center gap-1 sm:gap-2 md:gap-4 px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Logo - Left (Compact on Mobile) */}
        <div className="flex items-center flex-shrink-0">
          <img 
            src="/Ibrahim%20Real%20Estate%20logo%20design.png" 
            alt="Ibrahim Real Estate and Construction Services" 
            className="h-14 sm:h-18 md:h-22 lg:h-28 w-auto object-contain max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-none"
            style={{ imageRendering: 'auto' }}
          />
        </div>

        {/* Navigation Tabs - Center (Mobile & Desktop) */}
        <nav className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-1 justify-center min-w-0 mx-1 sm:mx-2">
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
                  "flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-6 lg:px-8 h-10 sm:h-11 md:h-12 min-h-[44px] rounded-lg text-[11px] sm:text-xs md:text-sm lg:text-lg font-semibold transition-colors whitespace-nowrap flex-shrink-0",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
                <span className="text-[11px] sm:text-xs md:text-sm lg:text-lg font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Avatar with Dropdown - Right */}
        <div className="flex items-center flex-shrink-0 ml-1 sm:ml-2">
          {/* Desktop: Profile with Name */}
          <div className="hidden lg:flex items-center gap-2 mr-3">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">{getDisplayName()}</span>
              <span className="text-xs text-gray-600">Admin</span>
            </div>
          </div>

          {/* Avatar with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-700">{getUserInitial()}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 border-gray-300 bg-white">
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-gray-700 focus:bg-gray-100 focus:text-gray-900"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
