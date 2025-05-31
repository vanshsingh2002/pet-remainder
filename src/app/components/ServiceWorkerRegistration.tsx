"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    workbox: {
      addEventListener: (type: string, callback: (event: any) => void) => void;
      register: () => Promise<void>;
      messageSkipWaiting: () => void;
    };
  }
}

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const registerServiceWorker = async () => {
      try {
        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.register("/sw.js");
          console.log("Service Worker registered:", registration);

          // Handle updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New content is available, show update prompt
                  console.log("New content is available; please refresh.");
                }
              });
            }
          });
        }
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    };

    registerServiceWorker();
  }, []);

  return null;
} 