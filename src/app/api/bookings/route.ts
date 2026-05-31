import { NextResponse } from "next/server";
import { createBooking, readBookings } from "@/lib/bookings";
import { handleBookingsApiError } from "@/lib/api-errors";
import { getService } from "@/lib/services";
import type { BookingRequest, ServiceId, VehicleSize } from "@/lib/types";
import { isDateBookable, getTimeSlots, loadBookedSlots } from "@/lib/availability";

function validateBody(body: unknown): body is BookingRequest {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  const serviceIds = ["interior-cleaning"];
  const sizes = ["compact", "sedan", "suv", "truck"];
  return (
    typeof b.serviceId === "string" &&
    serviceIds.includes(b.serviceId) &&
    typeof b.vehicleSize === "string" &&
    sizes.includes(b.vehicleSize) &&
    typeof b.date === "string" &&
    typeof b.time === "string" &&
    typeof b.customerName === "string" &&
    b.customerName.trim().length >= 2 &&
    typeof b.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
    typeof b.phone === "string" &&
    typeof b.vehicleMake === "string" &&
    typeof b.vehicleModel === "string" &&
    typeof b.vehicleYear === "string" &&
    typeof b.address === "string" &&
    b.address.trim().length >= 5
  );
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (!validateBody(body)) {
      return NextResponse.json(
        { error: "Please fill in all required fields correctly." },
        { status: 400 }
      );
    }

    if (!getService(body.serviceId)) {
      return NextResponse.json({ error: "Invalid service." }, { status: 400 });
    }

    if (!isDateBookable(body.date)) {
      return NextResponse.json(
        { error: "Selected date is not available." },
        { status: 400 }
      );
    }

    const bookings = await readBookings();
    loadBookedSlots(bookings);
    const slots = getTimeSlots(body.date);
    if (!slots.includes(body.time)) {
      return NextResponse.json(
        { error: "Selected time is not available." },
        { status: 400 }
      );
    }

    const result = await createBooking({
      ...body,
      serviceId: body.serviceId as ServiceId,
      vehicleSize: body.vehicleSize as VehicleSize,
      customerName: body.customerName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      vehicleMake: body.vehicleMake.trim(),
      vehicleModel: body.vehicleModel.trim(),
      vehicleYear: body.vehicleYear.trim(),
      address: body.address.trim(),
      notes: typeof body.notes === "string" ? body.notes.trim() : undefined,
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({ booking: result.booking }, { status: 201 });
  } catch (error) {
    const storageResponse = handleBookingsApiError(error);
    if (storageResponse) return storageResponse;
    console.error("POST /api/bookings failed:", error);
    return NextResponse.json(
      { error: "Could not save booking. Please try again." },
      { status: 500 }
    );
  }
}
