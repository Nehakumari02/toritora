import { subscribeUser } from "./notificationService";


export const setupServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) return;

  try {
    let registration = await navigator.serviceWorker.getRegistration();

    if (!registration) {
      registration = await navigator.serviceWorker.register("/sw.js");
      console.log("✅ Service Worker registered successfully");
    }

    if (!registration) return;

    // Check for existing subscription
    const existingSubscription = await registration.pushManager.getSubscription();
    if (!existingSubscription) {
      // Subscribe the user
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });

      // Send subscription to backend
      await subscribeUser(subscription);
    }
  } catch (error) {
    console.error("❌ Service Worker setup failed:", error);
  }
};

/**
 * Convert VAPID Public Key to Uint8Array
 */
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = base64String.replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
};
