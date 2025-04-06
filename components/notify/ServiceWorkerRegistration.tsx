"use client"; 

import { useEffect } from "react";
import { requestPermission } from "@/hooks/firebaseClient";

const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered with scope:", registration.scope);
          requestPermission(); 
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error);
        });
    }
  }, []);

  return null;
};

export default ServiceWorkerRegistration;
