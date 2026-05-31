import Link from "next/link";
import { BeforeAfterGallery } from "@/components/BeforeAfterGallery";
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
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-3xl font-bold text-white">About us</h2>
              <div className="mt-6 space-y-4 leading-relaxed text-slate-400">
                <p>
                  We are two brothers, Uncas and Gavin, born and raised in the
                  Catskills and new members of the Ithaca community. We are
                  looking to bring a professional and effective detailing and
                  cleaning service to others in our community.
                </p>
                <p>
                  What started as a chore — keeping our mother&apos;s car clean
                  and tidy on the weekends for some spare cash — turned into a
                  passion for effective and detailed cleaning. We promise to
                  bring our utmost best to each job and won&apos;t quit until we
                  are sure that our customer is satisfied.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-surface-border bg-surface-raised p-8">
              <h3 className="text-lg font-semibold text-white">
                How booking works
              </h3>
              <ol className="mt-6 space-y-4">
                {[
                  "Select your vehicle type for your price",
                  "Pick an open date and time slot",
                  "Enter your contact and vehicle details",
                  "Get instant confirmation with your booking ID",
                ].map((text, i) => (
                  <li key={text} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600/20 text-sm font-bold text-brand-300">
                      {i + 1}
                    </span>
                    <span className="pt-1 text-slate-300">{text}</span>
                  </li>
                ))}
              </ol>
              <Link
                href="/book"
                className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-brand-600 py-3 font-medium text-white transition hover:bg-brand-500"
              >
                Start your reservation
              </Link>
            </div>
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
