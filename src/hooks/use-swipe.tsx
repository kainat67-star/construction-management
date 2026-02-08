import { useRef } from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeOptions extends SwipeHandlers {
  threshold?: number; // Minimum distance in pixels to trigger a swipe
  velocity?: number; // Minimum velocity to trigger a swipe
  preventScroll?: boolean; // Prevent default scroll behavior during swipe
}

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  velocity = 0.2,
  preventScroll = false,
}: SwipeOptions) {
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number; time: number } | null>(null);
  const isScrolling = useRef(false);

  const minSwipeDistance = threshold;
  const minSwipeVelocity = velocity;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    isScrolling.current = false;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: Date.now(),
    };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const deltaX = Math.abs(currentX - touchStart.current.x);
    const deltaY = Math.abs(currentY - touchStart.current.y);

    // If vertical movement is significant, user is scrolling
    if (deltaY > 10 && deltaY > deltaX) {
      isScrolling.current = true;
    }

    touchEnd.current = {
      x: currentX,
      y: currentY,
      time: Date.now(),
    };

    // Prevent default scroll if horizontal swipe is detected and preventScroll is true
    if (preventScroll && deltaX > deltaY && deltaX > 10) {
      e.preventDefault();
    }
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current || isScrolling.current) {
      touchStart.current = null;
      touchEnd.current = null;
      isScrolling.current = false;
      return;
    }

    const distanceX = touchEnd.current.x - touchStart.current.x;
    const distanceY = touchEnd.current.y - touchStart.current.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    const timeDelta = touchEnd.current.time - touchStart.current.time;
    
    // Avoid division by zero
    if (timeDelta === 0) {
      touchStart.current = null;
      touchEnd.current = null;
      return;
    }

    const swipeVelocity = distance / timeDelta;

    const isLeftSwipe = distanceX < -minSwipeDistance;
    const isRightSwipe = distanceX > minSwipeDistance;
    const isUpSwipe = distanceY < -minSwipeDistance;
    const isDownSwipe = distanceY > minSwipeDistance;

    // Check if horizontal swipe is more dominant than vertical (at least 2x)
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY) * 1.5;

    if (swipeVelocity > minSwipeVelocity && isHorizontalSwipe) {
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft();
      } else if (isRightSwipe && onSwipeRight) {
        onSwipeRight();
      }
    } else if (swipeVelocity > minSwipeVelocity && !isHorizontalSwipe) {
      if (isUpSwipe && onSwipeUp) {
        onSwipeUp();
      } else if (isDownSwipe && onSwipeDown) {
        onSwipeDown();
      }
    }

    touchStart.current = null;
    touchEnd.current = null;
    isScrolling.current = false;
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
