import { promises as fs } from "fs";
import path from "path";
import type { Booking, BookingRequest } from "./types";
import { estimatePrice } from "./services";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, "[]", "utf-8");
  }
}

export async function readBookings(): Promise<Booking[]> {
  await ensureDataFile();
  const raw = await fs.readFile(BOOKINGS_FILE, "utf-8");
  return JSON.parse(raw) as Booking[];
}

export async function writeBookings(bookings: Booking[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
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
