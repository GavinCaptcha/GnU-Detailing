import Link from "next/link";
import { BeforeAfterGallery } from "@/components/BeforeAfterGallery";
import { FoundersGallery } from "@/components/FoundersGallery";
import { PricingByVehicle } from "@/components/PricingByVehicle";
import { ServiceCard } from "@/components/ServiceCard";
import { INTERIOR_SERVICE } from "@/lib/services";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-surface-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-brand-900)_0%,_transparent_60%)] opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-sm font-medium uppercase tracking-widest text-brand-400">
            Brothers · Ithaca · Interior specialists
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            A cleaner cabin that{" "}
            <span className="text-brand-400">feels brand new</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            GnU Detailing focuses on professional interior cleaning for the
            Ithaca area. Book online in minutes — we come to you with
            everything we need.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/book"
              className="rounded-lg bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-900/30 transition hover:bg-brand-500"
            >
              Reserve a spot
            </Link>
            <a
              href="#services"
              className="rounded-lg border border-surface-border px-6 py-3.5 text-base font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              View pricing
            </a>
          </div>
          <ul className="mt-12 flex flex-wrap gap-8 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <span className="text-brand-400">★</span> Interior cleaning only
            </li>
            <li className="flex items-center gap-2">
              <span className="text-brand-400">★</span> Price by vehicle type
            </li>
            <li className="flex items-center gap-2">
              <span className="text-brand-400">★</span> Easy online booking
            </li>
          </ul>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Our service</h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-400">
            We specialize in one thing and do it well — thorough interior
            cleaning tailored to your vehicle.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-xl">
          <ServiceCard service={INTERIOR_SERVICE} />
          <PricingByVehicle />
        </div>
      </section>

      <BeforeAfterGallery />

      <section
        id="about"
        className="border-y border-surface-border bg-surface-raised/30"
      >
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(240px,340px)_1fr] lg:gap-14">
            <FoundersGallery className="mx-auto w-full max-w-sm lg:mx-0" />
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-brand-400">
                Our story
              </p>
              <h2 className="mt-2 text-3xl font-bold text-white">
                About GnU Detailing
              </h2>
              <p className="mt-3 text-lg text-slate-300">
                Two brothers bringing professional interior cleaning to Ithaca.
              </p>
              <div className="mt-6 space-y-5 leading-relaxed text-slate-400">
                <p>
                  We&apos;re Uncas and Gavin — brothers born and raised in the
                  Catskills, and proud to now call Ithaca our home. We started GnU
                  Detailing to give our neighbors and fellow Ithacans a detailing service that&apos; delivers
                  professional work, affordable prices, and is done with genuine care.
                </p>
                <p>
                  What started as a chore on weekends, scrubbing and vacuuming our
                  mother&apos;s car for a little extra cash. quickly became something we looked forward to: seeing a
                  cabin go from messy to spotless, and knowing we did it right.
                  That same focus on detail is what we bring to every job today.
                </p>
                <p>
                  We show up ready to work, treat your car like our own, and
                  don&apos;t consider a job done until you&apos;re satisfied
                  with the result. That&apos;s our standard — on every vehicle,
                  every time.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 rounded-2xl border border-surface-border bg-surface-raised p-8 lg:p-10">
            <h3 className="text-lg font-semibold text-white">
              How booking works
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Reserve your appointment online in a few minutes.
            </p>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Choose your vehicle type and see your price upfront",
                "Pick a date and time that works for you",
                "Share your contact info and service address",
                "Receive instant confirmation with your booking ID",
              ].map((text, i) => (
                <li key={text} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600/20 text-sm font-bold text-brand-300">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-sm text-slate-300">{text}</span>
                </li>
              ))}
            </ol>
            <Link
              href="/book"
              className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-brand-600 py-3 font-medium text-white transition hover:bg-brand-500 sm:w-auto sm:px-10"
            >
              Start your reservation
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-white">Ready for a fresh interior?</h2>
        <p className="mt-2 text-slate-400">
          Slots fill up on weekends — book early to secure your time.
        </p>
        <Link
          href="/book"
          className="mt-6 inline-flex rounded-lg bg-brand-600 px-8 py-3 font-semibold text-white transition hover:bg-brand-500"
        >
          Book now
        </Link>
      </section>
    </>
  );
}
