import type { Service, VehicleSize } from "./types";

export const INTERIOR_SERVICE: Service = {
  id: "interior-detail",
  name: "Interior Cleaning",
  description:
    "Deep vacuum, wipe-down, interior glass, and light stain treatment for a fresh, tidy cabin.",
  durationMinutes: 90,
  highlights: [
    "Full interior vacuum",
    "Dash, console & door panels",
    "Interior glass & mirrors",
    "Light stain treatment",
  ],
};

export const SERVICES: Service[] = [INTERIOR_SERVICE];

export const VEHICLE_SIZES: {
  id: VehicleSize;
  label: string;
  price: number;
}[] = [
  { id: "compact", label: "Compact / Coupe", price: 90 },
  { id: "sedan", label: "Sedan", price: 110 },
  { id: "suv", label: "SUV / Crossover", price: 140 },
  { id: "truck", label: "Truck / Large SUV", price: 165 },
];

export function getService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function estimatePrice(
  _serviceId: string,
  vehicleSize: VehicleSize
): number {
  const size = VEHICLE_SIZES.find((v) => v.id === vehicleSize);
  return size?.price ?? 0;
}
