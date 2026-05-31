"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  formatDateLabel,
  formatTimeLabel,
  getAvailableDates,
  getTimeSlots,
} from "@/lib/availability";
import {
  estimatePrice,
  INTERIOR_SERVICE,
  VEHICLE_SIZES,
} from "@/lib/services";
import type { Booking, BookingRequest, VehicleSize } from "@/lib/types";

const STEPS = ["Vehicle", "Schedule", "Details", "Confirm"] as const;

type Step = (typeof STEPS)[number];

const emptyForm: BookingRequest = {
  serviceId: "interior-detail",
  vehicleSize: "sedan",
  date: "",
  time: "",
  customerName: "",
  email: "",
  phone: "",
  vehicleMake: "",
  vehicleModel: "",
  vehicleYear: "",
  address: "",
  notes: "",
};

export function BookingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("Vehicle");
  const [form, setForm] = useState<BookingRequest>(emptyForm);
  const [bookedSlots, setBookedSlots] = useState<
    { date: string; time: string }[]
  >([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((data: { slots: { date: string; time: string }[] }) =>
        setBookedSlots(data.slots)
      )
      .catch(() => {});
  }, []);

  const availableDates = useMemo(() => getAvailableDates(), []);
  const timeSlots = useMemo(() => {
    if (!form.date) return [];
    const booked = new Set(
      bookedSlots
        .filter((s) => s.date === form.date)
        .map((s) => s.time)
    );
    return getTimeSlots(form.date).filter((t) => !booked.has(t));
  }, [form.date, bookedSlots]);

  const price = estimatePrice(form.serviceId, form.vehicleSize);
  const stepIndex = STEPS.indexOf(step);

  const update = useCallback(
    <K extends keyof BookingRequest>(key: K, value: BookingRequest[K]) => {
      setForm((f) => ({ ...f, [key]: value }));
      setError(null);
    },
    []
  );

  function canProceed(): boolean {
    switch (step) {
      case "Vehicle":
        return !!form.vehicleSize;
      case "Schedule":
        return !!form.date && !!form.time;
      case "Details":
        return (
          form.customerName.trim().length >= 2 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
          form.phone.replace(/\D/g, "").length >= 10 &&
          form.vehicleMake.trim().length > 0 &&
          form.vehicleModel.trim().length > 0 &&
          form.vehicleYear.trim().length === 4 &&
          form.address.trim().length >= 5
        );
      default:
        return true;
    }
  }

  async function submitBooking() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not complete booking.");
        return;
      }
      const booking = data.booking as Booking;
      router.push(`/book/confirmation?id=${booking.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <ol className="mb-8 flex gap-2">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 flex-col items-center gap-1">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                i <= stepIndex
                  ? "bg-brand-600 text-white"
                  : "bg-surface-border text-slate-500"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`text-xs ${i <= stepIndex ? "text-slate-300" : "text-slate-600"}`}
            >
              {s}
            </span>
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-surface-border bg-surface-raised p-6 sm:p-8">
        {step === "Vehicle" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Interior cleaning
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Select your vehicle type for your price.
              </p>
            </div>
            <div className="rounded-xl border border-surface-border bg-surface/50 p-4">
              <p className="font-medium text-white">{INTERIOR_SERVICE.name}</p>
              <p className="mt-1 text-sm text-slate-400">
                {INTERIOR_SERVICE.description}
              </p>
              <ul className="mt-3 space-y-1">
                {INTERIOR_SERVICE.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <span className="text-brand-400">✓</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Vehicle type
              </label>
              <div className="space-y-2">
                {VEHICLE_SIZES.map((v) => (
                  <label
                    key={v.id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                      form.vehicleSize === v.id
                        ? "border-brand-500 bg-brand-600/10"
                        : "border-surface-border hover:border-slate-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="vehicleSize"
                      className="sr-only"
                      checked={form.vehicleSize === v.id}
                      onChange={() => update("vehicleSize", v.id)}
                    />
                    <span className="font-medium text-white">{v.label}</span>
                    <span className="text-brand-300">${v.price}</span>
                  </label>
                ))}
              </div>
            </div>
            <p className="rounded-lg bg-brand-600/10 px-4 py-3 text-center text-lg font-semibold text-brand-300">
              Your price: ${price}
            </p>
          </div>
        )}

        {step === "Schedule" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Pick date & time
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                We&apos;re closed Sundays. Times shown in your local timezone.
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Date
              </label>
              <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
                {availableDates.slice(0, 21).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      update("date", d);
                      update("time", "");
                    }}
                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                      form.date === d
                        ? "border-brand-500 bg-brand-600/20 text-white"
                        : "border-surface-border text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {formatDateLabel(d)}
                  </button>
                ))}
              </div>
            </div>
            {form.date && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Time
                </label>
                {timeSlots.length === 0 ? (
                  <p className="text-sm text-amber-400">
                    No slots left this day. Please pick another date.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => update("time", t)}
                        className={`rounded-lg border px-3 py-2 text-sm transition ${
                          form.time === t
                            ? "border-brand-500 bg-brand-600/20 text-white"
                            : "border-surface-border text-slate-300 hover:border-slate-500"
                        }`}
                      >
                        {formatTimeLabel(t)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === "Details" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Your information
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                We&apos;ll use this to confirm your appointment.
              </p>
            </div>
            <Field
              label="Full name"
              value={form.customerName}
              onChange={(v) => update("customerName", v)}
              required
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => update("email", v)}
                required
              />
              <Field
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(v) => update("phone", v)}
                required
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field
                label="Year"
                value={form.vehicleYear}
                onChange={(v) => update("vehicleYear", v)}
                placeholder="2020"
                maxLength={4}
                required
              />
              <Field
                label="Make"
                value={form.vehicleMake}
                onChange={(v) => update("vehicleMake", v)}
                placeholder="Toyota"
                required
              />
              <Field
                label="Model"
                value={form.vehicleModel}
                onChange={(v) => update("vehicleModel", v)}
                placeholder="Camry"
                required
              />
            </div>
            <Field
              label="Service address"
              value={form.address}
              onChange={(v) => update("address", v)}
              placeholder="Street, city, ZIP"
              required
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Notes (optional)
              </label>
              <textarea
                value={form.notes ?? ""}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                placeholder="Pet hair, stains, preferred entrance, etc."
                className="w-full rounded-lg border border-surface-border bg-surface px-4 py-3 text-white outline-none focus:border-brand-500"
              />
            </div>
          </div>
        )}

        {step === "Confirm" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Review your booking
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Double-check everything before confirming.
              </p>
            </div>
            <dl className="divide-y divide-surface-border text-sm">
              <Row label="Service" value={INTERIOR_SERVICE.name} />
              <Row
                label="Vehicle"
                value={`${form.vehicleYear} ${form.vehicleMake} ${form.vehicleModel}`}
              />
              <Row
                label="Vehicle type"
                value={
                  VEHICLE_SIZES.find((v) => v.id === form.vehicleSize)?.label ??
                  ""
                }
              />
              <Row
                label="When"
                value={`${formatDateLabel(form.date)} at ${formatTimeLabel(form.time)}`}
              />
              <Row label="Where" value={form.address} />
              <Row label="Contact" value={`${form.customerName} · ${form.phone}`} />
              <Row label="Email" value={form.email} />
              {form.notes && <Row label="Notes" value={form.notes} />}
              <div className="flex justify-between pt-4 text-base font-semibold text-white">
                <dt>Total</dt>
                <dd className="text-brand-300">${price}</dd>
              </div>
            </dl>
            <p className="text-xs text-slate-500">
              Final price may adjust on-site for heavily soiled interiors.
              Payment is collected after service.
            </p>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-8 flex gap-3">
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={() => setStep(STEPS[stepIndex - 1])}
              className="flex-1 rounded-lg border border-surface-border px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-surface"
            >
              Back
            </button>
          )}
          {step !== "Confirm" ? (
            <button
              type="button"
              disabled={!canProceed()}
              onClick={() => setStep(STEPS[stepIndex + 1])}
              className="flex-1 rounded-lg bg-brand-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={submitBooking}
              className="flex-1 rounded-lg bg-brand-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-500 disabled:opacity-60"
            >
              {submitting ? "Booking…" : "Confirm reservation"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        className="w-full rounded-lg border border-surface-border bg-surface px-4 py-3 text-white outline-none focus:border-brand-500"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 py-3 sm:flex-row sm:justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-200 sm:text-right">{value}</dd>
    </div>
  );
}
