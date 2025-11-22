"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    console.log("InstallButton: Initializing...");

    // Check if already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    console.log("InstallButton: Is standalone?", isStandalone);

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("InstallButton: beforeinstallprompt event fired!");
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener("appinstalled", () => {
      console.log("InstallButton: App installed!");
      setIsInstalled(true);
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
    console.log("InstallButton: Install button clicked");

    if (!deferredPrompt) {
      console.log("InstallButton: No deferred prompt available");
      return;
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;

      console.log("InstallButton: User choice:", outcome);

      if (outcome === "accepted") {
        console.log("InstallButton: User accepted the install prompt");
      } else {
        console.log("InstallButton: User dismissed the install prompt");
      }

      // Clear the prompt
      setDeferredPrompt(null);
    } catch (error) {
      console.error("InstallButton: Error during installation:", error);
    }
  };

  // Don't show button if already installed or prompt not available
  if (isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 px-6 py-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-medium animate-in fade-in slide-in-from-bottom-4"
      aria-label="تثبيت التطبيق"
    >
      <Download className="w-5 h-5" />
      <span>تثبيت التطبيق</span>
    </button>
  );
}
