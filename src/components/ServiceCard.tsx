import Link from "next/link";
import type { Service } from "@/lib/types";
import { VEHICLE_SIZES } from "@/lib/services";

interface ServiceCardProps {
  service: Service;
  showBookLink?: boolean;
}

export function ServiceCard({ service, showBookLink = true }: ServiceCardProps) {
  const minPrice = Math.min(...VEHICLE_SIZES.map((v) => v.price));
  const maxPrice = Math.max(...VEHICLE_SIZES.map((v) => v.price));

  return (
    <article className="flex flex-col rounded-2xl border border-surface-border bg-surface-raised p-6 transition hover:border-brand-600/40">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-white">{service.name}</h3>
        <span className="shrink-0 rounded-full bg-brand-600/20 px-3 py-1 text-sm font-medium text-brand-300">
          ${minPrice}–${maxPrice}
        </span>
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
        {service.description}
      </p>
      <ul className="mt-4 space-y-1.5">
        {service.highlights.map((h) => (
          <li key={h} className="flex items-center gap-2 text-sm text-slate-300">
            <span className="text-brand-400">✓</span>
            {h}
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border border-surface-border bg-surface/50 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Pricing by vehicle type
        </p>
        <ul className="mt-3 space-y-2">
          {VEHICLE_SIZES.map((v) => (
            <li
              key={v.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-slate-300">{v.label}</span>
              <span className="font-medium text-brand-300">${v.price}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        ~{Math.floor(service.durationMinutes / 60)}h
        {service.durationMinutes % 60 > 0
          ? ` ${service.durationMinutes % 60}m`
          : ""}{" "}
        · Price depends on vehicle size
      </p>
      {showBookLink && (
        <Link
          href="/book"
          className="mt-5 inline-flex items-center justify-center rounded-lg border border-brand-600/50 px-4 py-2.5 text-sm font-medium text-brand-300 transition hover:bg-brand-600/10 hover:text-white"
        >
          Book interior cleaning
        </Link>
      )}
    </article>
  );
}
