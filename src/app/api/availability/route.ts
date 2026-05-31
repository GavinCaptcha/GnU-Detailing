import { NextResponse } from "next/server";
import { readBookings } from "@/lib/bookings";
import { handleBookingsApiError } from "@/lib/api-errors";

export async function GET() {
  try {
    const bookings = await readBookings();
    const slots = bookings
      .filter((b) => b.status === "confirmed")
      .map((b) => ({ date: b.date, time: b.time }));
    return NextResponse.json({ slots });
  } catch (error) {
    const storageResponse = handleBookingsApiError(error);
    if (storageResponse) return storageResponse;
    console.error("GET /api/availability failed:", error);
    return NextResponse.json(
      { error: "Could not load availability." },
      { status: 500 }
    );
  }
}
