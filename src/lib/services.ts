import type { Service, VehicleSize } from "./types";

export const INTERIOR_SERVICE: Service = {
  id: "interior-cleaning",
  name: "Interior Cleaning",
  description:
    "Deep vacuum, wipe-down of all surfaces, interior glass, vents, and light stain treatment — a fresh, tidy cabin you'll notice the moment you sit down.",
  durationMinutes: 90,
  highlights: [
    "Full vacuum (seats, floors, trunk)",
    "Dash, console & door panels",
    "Interior windows & mirrors",
    "Vents & cup holders",
  ],
};

export const VEHICLE_SIZES: {
  id: VehicleSize;
  label: string;
  price: number;
}[] = [
  { id: "compact", label: "Compact / Coupe", price: 85 },
  { id: "sedan", label: "Sedan", price: 95 },
  { id: "suv", label: "SUV / Crossover", price: 115 },
  { id: "truck", label: "Truck / Large SUV", price: 130 },
];

/** @deprecated Use INTERIOR_SERVICE — kept for booking wizard compatibility */
export const SERVICES = [INTERIOR_SERVICE];

export function getService(id: string): Service | undefined {
  if (id === INTERIOR_SERVICE.id) return INTERIOR_SERVICE;
  return undefined;
}

export function getPriceForVehicle(vehicleSize: VehicleSize): number {
  return VEHICLE_SIZES.find((v) => v.id === vehicleSize)?.price ?? 0;
}

export function estimatePrice(
  _serviceId: string,
  vehicleSize: VehicleSize
): number {
  return getPriceForVehicle(vehicleSize);
}
