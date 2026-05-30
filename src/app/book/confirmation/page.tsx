import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDateLabel, formatTimeLabel } from "@/lib/availability";
import { readBookings } from "@/lib/bookings";
import { getService, VEHICLE_SIZES } from "@/lib/services";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const { id } = await searchParams;
  if (!id) notFound();

  const bookings = await readBookings();
  const booking = bookings.find((b) => b.id === id);
  if (!booking) notFound();

  const service = getService(booking.serviceId);
  const sizeLabel =
    VEHICLE_SIZES.find((v) => v.id === booking.vehicleSize)?.label ?? "";

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-24">
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-2xl text-emerald-400">
          ✓
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white">
          You&apos;re booked!
        </h1>
        <p className="mt-2 text-slate-400">
          Save your confirmation number — you&apos;ll need it if you contact
          us.
        </p>
        <p className="mt-6 font-mono text-3xl font-bold tracking-wider text-brand-300">
          {booking.id}
        </p>
      </div>

      <dl className="mt-8 space-y-4 rounded-2xl border border-surface-border bg-surface-raised p-6 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Service</dt>
          <dd className="text-right text-white">{service?.name}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">When</dt>
          <dd className="text-right text-white">
            {formatDateLabel(booking.date)} at {formatTimeLabel(booking.time)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Vehicle</dt>
          <dd className="text-right text-white">
            {booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}{" "}
            ({sizeLabel})
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Location</dt>
          <dd className="max-w-[60%] text-right text-white">{booking.address}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-surface-border pt-4">
          <dt className="font-medium text-slate-400">Estimated total</dt>
          <dd className="text-lg font-semibold text-brand-300">
            ${booking.estimatedPrice}
          </dd>
        </div>
      </dl>

      <p className="mt-6 text-center text-sm text-slate-500">
        We&apos;ll reach out at{" "}
        <span className="text-slate-300">{booking.email}</span> if anything
        changes before your appointment.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="flex-1 rounded-lg border border-surface-border py-3 text-center text-sm font-medium text-slate-300 transition hover:text-white"
        >
          Back to home
        </Link>
        <Link
          href="/book"
          className="flex-1 rounded-lg bg-brand-600 py-3 text-center text-sm font-medium text-white transition hover:bg-brand-500"
        >
          Book another
        </Link>
      </div>
    </div>
  );
}
