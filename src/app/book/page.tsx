import { Suspense } from "react";
import { BookingWizard } from "@/components/BookingWizard";

export const metadata = {
  title: "Book an Appointment | GnU Detailing",
};

export default function BookPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white">Book interior cleaning</h1>
        <p className="mt-2 text-slate-400">
          Pick your vehicle type, schedule, and details — most bookings take
          under two minutes.
        </p>
      </div>
      <Suspense
        fallback={
          <p className="text-center text-slate-400">Loading booking form…</p>
        }
      >
        <BookingWizard />
      </Suspense>
    </div>
  );
}
