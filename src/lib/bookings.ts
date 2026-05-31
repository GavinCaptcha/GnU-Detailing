import type { Booking, BookingRequest } from "./types";
import { estimatePrice } from "./services";
import { loadBookings, saveBookings } from "./bookings-storage";

export { BookingsStorageError } from "./bookings-storage";

export async function readBookings(): Promise<Booking[]> {
  return loadBookings();
}

export async function writeBookings(bookings: Booking[]): Promise<void> {
  await saveBookings(bookings);
}

function generateId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "GNU-";
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export async function createBooking(
  request: BookingRequest
): Promise<{ booking: Booking } | { error: string }> {
  const bookings = await readBookings();

  const conflict = bookings.find(
    (b) =>
      b.status === "confirmed" &&
      b.date === request.date &&
      b.time === request.time
  );
  if (conflict) {
    return { error: "That time slot was just booked. Please choose another." };
  }

  const booking: Booking = {
    ...request,
    id: generateId(),
    createdAt: new Date().toISOString(),
    estimatedPrice: estimatePrice(request.serviceId, request.vehicleSize),
    status: "confirmed",
  };

  bookings.push(booking);
  await writeBookings(bookings);
  return { booking };
}
