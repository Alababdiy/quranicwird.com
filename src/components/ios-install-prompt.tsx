"use client";

import { useEffect, useState } from "react";
import { Share, X, Plus } from "lucide-react";

export function IOSInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;

    // Check if user previously dismissed the prompt
    const dismissed = localStorage.getItem("ios-install-dismissed");

    // Show prompt only on iOS, not in standalone mode, and not previously dismissed
    if (isIOS && !isInStandaloneMode && dismissed !== "true") {
      // Show after 3 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("ios-install-dismissed", "true");
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-md mx-auto bg-gradient-to-br from-primary/90 to-primary backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-primary-foreground/10">
        <div className="flex items-start gap-3">
          <button
            onClick={handleDismiss}
            className="absolute top-2 left-2 p-1.5 bg-background/20 text-primary-foreground rounded-lg hover:bg-background/30 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex-1 pt-2">
            <h3 className="text-sm font-bold text-primary-foreground mb-2 text-center">
              تثبيت التطبيق على الآيفون
            </h3>

            <div className="space-y-3 text-xs text-primary-foreground/90">
              <div className="flex items-center gap-2 bg-background/10 rounded-lg p-2">
                <div className="flex-shrink-0 w-8 h-8 bg-background/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">١</span>
                </div>
                <div className="flex-1">
                  <p>
                    اضغط على زر المشاركة{" "}
                    <Share className="w-4 h-4 inline-block" /> في الأسفل
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-background/10 rounded-lg p-2">
                <div className="flex-shrink-0 w-8 h-8 bg-background/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">٢</span>
                </div>
                <div className="flex-1">
                  <p>
                    اختر &ldquo;إضافة إلى الشاشة الرئيسية&rdquo;{" "}
                    <Plus className="w-4 h-4 inline-block" />
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-background/10 rounded-lg p-2">
                <div className="flex-shrink-0 w-8 h-8 bg-background/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">٣</span>
                </div>
                <div className="flex-1">
                  <p>اضغط &ldquo;إضافة&rdquo; لتثبيت التطبيق</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="w-full mt-3 px-4 py-2 bg-background text-primary rounded-lg font-medium text-sm hover:bg-background/90 transition-colors"
            >
              فهمت
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
