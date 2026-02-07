import { type NextRequest, NextResponse } from "next/server"
import { sendTelegramNotification, type UserActivity } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  try {
    const activity: UserActivity = await request.json()

    const forwarded = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const clientIp = forwarded?.split(",")[0] || realIp || "unknown"

    // Get location data server-side
    let location = {
      ip: clientIp,
      country: "Unknown",
      city: "Unknown",
    }

    try {
      if (process.env.NODE_ENV !== "development" && clientIp !== "unknown") {
        const geoResponse = await fetch(`https://ipapi.co/${clientIp}/json/`, {
          timeout: 5000, // 5 second timeout
        })
        if (geoResponse.ok) {
          const geoData = await geoResponse.json()
          location = {
            ip: clientIp,
            country: geoData.country_name || "Unknown",
            city: geoData.city || "Unknown",
          }
        }
      } else {
        // Development mode
        location = {
          ip: clientIp,
          country: "Development",
          city: "Local",
        }
      }
    } catch (geoError) {
      console.warn("[redwhalesdev] Failed to get location data:", geoError)
      // Continue with default location data
    }

    const activityWithLocation = {
      ...activity,
      location,
    }

    await sendTelegramNotification(activityWithLocation)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[redwhalesdev] Telegram notification error:", error)
    return NextResponse.json({ success: false, error: "Failed to send notification" }, { status: 500 })
  }
}
