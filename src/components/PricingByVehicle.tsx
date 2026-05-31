import { INTERIOR_SERVICE, VEHICLE_SIZES } from "@/lib/services";

export function PricingByVehicle() {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-surface-border bg-surface-raised">
      <div className="border-b border-surface-border bg-surface px-6 py-4">
        <h3 className="font-semibold text-white">Pricing by vehicle type</h3>
        <p className="mt-1 text-sm text-slate-400">
          {INTERIOR_SERVICE.name} — one service, fair price for your size
        </p>
      </div>
      <ul className="divide-y divide-surface-border">
        {VEHICLE_SIZES.map((v) => (
          <li
            key={v.id}
            className="flex items-center justify-between gap-4 px-6 py-4"
          >
            <span className="text-slate-300">{v.label}</span>
            <span className="text-lg font-semibold text-brand-300">
              ${v.price}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
