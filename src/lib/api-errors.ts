import { NextResponse } from "next/server";
import { BookingsStorageError } from "./bookings-storage";

export function handleBookingsApiError(error: unknown): NextResponse | null {
  if (error instanceof BookingsStorageError) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }
  return null;
}
