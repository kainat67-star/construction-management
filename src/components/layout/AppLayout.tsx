import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div className={cn(
        "transition-all duration-300",
        "lg:pl-64"
      )}>
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className={cn(
          "p-3 sm:p-4 md:p-5"
        )}>{children}</main>
      </div>
    </div>
  );
}
