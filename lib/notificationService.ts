const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Subscribe User to Push Notifications
 * @param subscription PushSubscription object
 */
export async function subscribeUser(subscription: PushSubscription) {
  try {
    const response = await fetch(`${BACKEND_URL}/notification/subscribeUser`, {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: { "Content-Type": "application/json" },
    });

    return await response.json();
  } catch (error) {
    console.error("❌ Error subscribing user:", error);
    return { success: false, error: "Failed to subscribe" };
  }
}

/**
 * Unsubscribe User from Push Notifications
 * Removes the subscription from both frontend and backend
 */
export async function unsubscribeUser() {
  try {
    if (!("serviceWorker" in navigator)) return;

    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return;

    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();

      // Notify backend to remove subscription
      await fetch(`${BACKEND_URL}/notification/unsubscribeUser`, {
        method: "POST",
        body: JSON.stringify({ endpoint: subscription.endpoint }),
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ User unsubscribed successfully.");
      return { success: true };
    } else {
      console.warn("⚠️ No existing subscription found.");
      return { success: false, error: "No active subscription" };
    }
  } catch (error) {
    console.error("❌ Error unsubscribing user:", error);
    return { success: false, error: "Failed to unsubscribe" };
  }
}

/**
 * Send Push Notification
 * @param message The message to send in the notification
 */
export async function sendNotification(message: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/notification/sendNotification`, {
      method: "POST",
      body: JSON.stringify({
        title: "Notification",
        body: message,
        icon: "/icon.png",
        data: { url: "/" },
      }),
      headers: { "Content-Type": "application/json" },
    });

    return await response.json();
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}