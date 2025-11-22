"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Home,
  ChevronRight,
  ChevronLeft,
  Maximize,
  Minimize,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";

const TOTAL_PAGES = 604;

export default function QuranPage() {
  const params = useParams();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(
    null
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);

  const pageNumber = params.pageNumber as string;
  const currentPage = parseInt(pageNumber);

  // Check screen width for 2-page spread
  useEffect(() => {
    const checkWidth = () => {
      setIsWideScreen(window.innerWidth >= 1024);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  useEffect(() => {
    setMounted(true);

    // Request fullscreen on mount for mobile app feel
    const requestFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (err) {
        console.log("Fullscreen request failed:", err);
      }
    };

    requestFullscreen();

    // Hide controls after 3 seconds
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  const navigateToPage = useCallback(
    (newPage: number, direction: "next" | "prev") => {
      if (newPage < 1 || newPage > TOTAL_PAGES || isAnimating) return;

      setIsAnimating(true);
      setFlipDirection(direction);

      setTimeout(() => {
        const pageNum = String(newPage).padStart(3, "0");
        router.push(`/page/${pageNum}`);
        setFlipDirection(null);
        setIsAnimating(false);
      }, 800);
    },
    [router, isAnimating]
  );

  const nextPage = useCallback(() => {
    navigateToPage(currentPage + 1, "next");
  }, [currentPage, navigateToPage]);

  const previousPage = useCallback(() => {
    navigateToPage(currentPage - 1, "prev");
  }, [currentPage, navigateToPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        // In RTL: ArrowLeft goes to next page, ArrowRight goes to previous page
        if (e.key === "ArrowLeft") {
          nextPage();
        } else {
          previousPage();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextPage, previousPage]);

  // Touch handling for swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - next page (in RTL)
      nextPage();
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right - previous page (in RTL)
      previousPage();
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const goHome = () => {
    router.push("/");
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  if (!mounted) {
    return null;
  }

  // Calculate adjacent page for 2-page spread
  const leftPageNumber = currentPage % 2 === 0 ? currentPage - 1 : currentPage;
  const rightPageNumber = leftPageNumber + 1;
  const showTwoPages = isWideScreen && rightPageNumber <= TOTAL_PAGES;

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Main Content */}
      <div
        className="flex items-center justify-center min-h-screen p-4 cursor-pointer book-container"
        onClick={toggleControls}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {showTwoPages ? (
          <div className="page-spread w-full px-8">
            {/* Left Page */}
            <div
              className={`relative ${
                flipDirection === "prev" ? "page-flip-prev" : "page-fade-in"
              }`}
            >
              <Image
                src={`/quran/${String(leftPageNumber).padStart(3, "0")}.png`}
                alt={`Quran Page ${leftPageNumber}`}
                width={800}
                height={1200}
                priority
                className="w-full h-auto quran-page invert-on-dark"
                draggable={false}
              />
            </div>

            {/* Right Page */}
            <div
              className={`relative ${
                flipDirection === "next" ? "page-flip-next" : "page-fade-in"
              }`}
            >
              <Image
                src={`/quran/${String(rightPageNumber).padStart(3, "0")}.png`}
                alt={`Quran Page ${rightPageNumber}`}
                width={800}
                height={1200}
                priority
                className="w-full h-auto quran-page invert-on-dark"
                draggable={false}
              />
            </div>
          </div>
        ) : (
          <div
            className={`relative w-full max-w-2xl ${
              flipDirection === "next" ? "page-flip-next" : ""
            } ${flipDirection === "prev" ? "page-flip-prev" : ""}`}
          >
            <Image
              src={`/quran/${pageNumber}.png`}
              alt={`Quran Page ${currentPage}`}
              width={800}
              height={1200}
              priority
              className="w-full h-auto quran-page invert-on-dark"
              draggable={false}
            />
          </div>
        )}
      </div>

      {/* Navigation Arrows - Fixed positions */}
      <button
        onClick={nextPage}
        disabled={currentPage >= TOTAL_PAGES || isAnimating}
        className="fixed left-4 top-1/2 -translate-y-1/2 p-3 bg-background/80 backdrop-blur-sm rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent transition-all z-20"
        aria-label="Next page"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={previousPage}
        disabled={currentPage <= 1 || isAnimating}
        className="fixed right-4 top-1/2 -translate-y-1/2 p-3 bg-background/80 backdrop-blur-sm rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent transition-all z-20"
        aria-label="Previous page"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Top Controls */}
      <div
        className={`fixed top-0 left-0 right-0 bg-gradient-to-b from-background/95 to-transparent backdrop-blur-sm p-4 transition-all duration-300 z-10 ${
          showControls ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={goHome}
              className="p-2 hover:bg-accent rounded-full transition-colors"
              aria-label="Home"
            >
              <Home className="w-5 h-5" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-accent rounded-full transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-accent rounded-full transition-colors"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="text-sm font-medium bg-accent px-3 py-1.5 rounded-full">
            {showTwoPages
              ? `صفحة ${leftPageNumber}-${rightPageNumber} من ${TOTAL_PAGES}`
              : `صفحة ${currentPage} من ${TOTAL_PAGES}`}
          </div>
        </div>
      </div>

      {/* Bottom Page Indicator */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent backdrop-blur-sm p-4 transition-all duration-300 z-10 ${
          showControls ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute top-0 right-0 h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(currentPage / TOTAL_PAGES) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
