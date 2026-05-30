import { NextResponse } from "next/server";
import { readBookings } from "@/lib/bookings";

export async function GET() {
  const bookings = await readBookings();
  const slots = bookings
    .filter((b) => b.status === "confirmed")
    .map((b) => ({ date: b.date, time: b.time }));
  return NextResponse.json({ slots });
}
