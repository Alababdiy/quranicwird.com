"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    console.log("InstallPrompt: Initializing...");

    // Check if already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    console.log("InstallPrompt: Is standalone?", isStandalone);

    if (isStandalone) {
      setIsInstalled(true);
      console.log("InstallPrompt: App already installed");
      return;
    }

    // Check if user previously dismissed the prompt
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    console.log("InstallPrompt: Was dismissed?", dismissed);

    if (dismissed === "true") {
      console.log("InstallPrompt: User previously dismissed, not showing");
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("InstallPrompt: beforeinstallprompt event fired!");
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      // Show prompt after 3 seconds
      setTimeout(() => {
        console.log("InstallPrompt: Showing prompt now");
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener("appinstalled", () => {
      console.log("InstallPrompt: App installed!");
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    // Clear the prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-md mx-auto bg-gradient-to-br from-primary/90 to-primary backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-primary-foreground/10">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-background/20 rounded-xl flex items-center justify-center">
            <Download className="w-6 h-6 text-primary-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-primary-foreground mb-1">
              تثبيت التطبيق
            </h3>
            <p className="text-xs text-primary-foreground/80 mb-3">
              ثبت التطبيق للوصول السريع وتجربة أفضل للقراءة
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 px-4 py-2 bg-background text-primary rounded-lg font-medium text-sm hover:bg-background/90 transition-colors"
              >
                تثبيت الآن
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 bg-background/20 text-primary-foreground rounded-lg hover:bg-background/30 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
