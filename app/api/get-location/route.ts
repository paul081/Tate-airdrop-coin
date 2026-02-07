import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get client IP from headers
    const forwarded = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const clientIp = forwarded?.split(",")[0] || realIp || "unknown"

    // For development, return mock data
    if (process.env.NODE_ENV === "development" || clientIp === "unknown") {
      return NextResponse.json({
        ip: clientIp,
        country: "Development",
        city: "Local",
      })
    }

    // Use a free IP geolocation service
    const geoResponse = await fetch(`http://ip-api.com/json/${clientIp}`)
    const geoData = await geoResponse.json()

    return NextResponse.json({
      ip: clientIp,
      country: geoData.country || "Unknown",
      city: geoData.city || "Unknown",
    })
  } catch (error) {
    console.error("Location API error:", error)
    return NextResponse.json({
      ip: "unknown",
      country: "Unknown",
      city: "Unknown",
    })
  }
}
