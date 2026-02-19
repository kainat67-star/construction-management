import { ReactNode, useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { useSwipe } from "@/hooks/use-swipe";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

const navItems = [
  { href: "/accounts" },
  { href: "/properties" },
];

export function AppLayout({ children, title }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [transitionDirection, setTransitionDirection] = useState<"left" | "right" | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousPathname = useRef(location.pathname);

  // Find current tab index
  const currentIndex = useMemo(() => {
    return navItems.findIndex(
      (item) =>
        location.pathname === item.href ||
        (item.href === "/properties" && location.pathname.startsWith("/properties")) ||
        (item.href === "/accounts" && location.pathname.startsWith("/accounts"))
    );
  }, [location.pathname]);

  // Detect direction of navigation
  useEffect(() => {
    const prevIndex = navItems.findIndex(
      (item) =>
        previousPathname.current === item.href ||
        (item.href === "/properties" && previousPathname.current.startsWith("/properties")) ||
        (item.href === "/accounts" && previousPathname.current.startsWith("/accounts"))
    );

    // Only trigger transition if we're switching between main tabs (not sub-routes)
    const isMainTabChange = 
      (previousPathname.current === "/accounts" || previousPathname.current.startsWith("/accounts")) &&
      (location.pathname === "/properties" || location.pathname.startsWith("/properties")) ||
      (previousPathname.current === "/properties" || previousPathname.current.startsWith("/properties")) &&
      (location.pathname === "/accounts" || location.pathname.startsWith("/accounts"));

    if (isMainTabChange && prevIndex !== -1 && currentIndex !== -1 && prevIndex !== currentIndex) {
      // Determine direction based on index change
      if (currentIndex > prevIndex) {
        setTransitionDirection("right"); // Swiped left, content slides in from right
      } else {
        setTransitionDirection("left"); // Swiped right, content slides in from left
      }
      setIsTransitioning(true);
      
      // Reset transition state after animation
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setTransitionDirection(null);
      }, 300);

      previousPathname.current = location.pathname;
      return () => clearTimeout(timer);
    }

    previousPathname.current = location.pathname;
  }, [location.pathname, currentIndex]);

  // Swipe handlers - only enable on mobile
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      // Swipe left = go to next tab (right)
      if (currentIndex < navItems.length - 1) {
        navigate(navItems[currentIndex + 1].href);
      }
    },
    onSwipeRight: () => {
      // Swipe right = go to previous tab (left)
      if (currentIndex > 0) {
        navigate(navItems[currentIndex - 1].href);
      }
    },
    threshold: 50, // Minimum swipe distance in pixels
    velocity: 0.2, // Minimum velocity
    preventScroll: false, // Don't prevent scroll, just detect swipes
  });

  // Only apply swipe handlers on mobile
  const touchHandlers = isMobile ? swipeHandlers : {};

  // Determine transition class based on direction
  const transitionClass = useMemo(() => {
    if (isTransitioning && transitionDirection) {
      return transitionDirection === "right"
        ? "page-transition-enter"
        : "page-transition-enter-left";
    }
    // Default fade for other navigations (only on initial load or non-tab switches)
    if (previousPathname.current === location.pathname) {
      return ""; // No animation on same route
    }
    return "page-fade-enter";
  }, [isTransitioning, transitionDirection, location.pathname]);

  return (
    <div className="min-h-screen bg-white">
      <Header title={title} />
      <main
        {...touchHandlers}
        className={cn(
          "p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-4.5rem)] relative w-full overflow-x-hidden"
        )}
      >
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
