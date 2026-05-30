import type { Service, VehicleSize } from "./types";

export const SERVICES: Service[] = [
  {
    id: "exterior-wash",
    name: "Exterior Wash & Shine",
    description:
      "Hand wash, wheel clean, tire dressing, and paint-safe dry finish.",
    durationMinutes: 60,
    basePrice: 75,
    highlights: ["Foam wash", "Wheels & tires", "Streak-free dry"],
  },
  {
    id: "interior-detail",
    name: "Interior Detail",
    description:
      "Vacuum, wipe-down, glass, and light stain treatment for a fresh cabin.",
    durationMinutes: 90,
    basePrice: 120,
    highlights: ["Full vacuum", "Dash & console", "Interior glass"],
  },
  {
    id: "full-detail",
    name: "Full Detail",
    description:
      "Our most popular package — complete interior and exterior refresh.",
    durationMinutes: 180,
    basePrice: 225,
    highlights: ["Interior + exterior", "Door jambs", "Trunk vacuum"],
  },
  {
    id: "paint-correction",
    name: "Paint Correction",
    description:
      "Multi-stage polish to reduce swirls and restore depth and clarity.",
    durationMinutes: 300,
    basePrice: 450,
    highlights: ["Paint inspection", "Machine polish", "Protection prep"],
  },
];

export const VEHICLE_SIZES: {
  id: VehicleSize;
  label: string;
  priceMultiplier: number;
}[] = [
  { id: "compact", label: "Compact / Coupe", priceMultiplier: 1 },
  { id: "sedan", label: "Sedan", priceMultiplier: 1.1 },
  { id: "suv", label: "SUV / Crossover", priceMultiplier: 1.25 },
  { id: "truck", label: "Truck / Large SUV", priceMultiplier: 1.4 },
];

export function getService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function estimatePrice(
  serviceId: string,
  vehicleSize: VehicleSize
): number {
  const service = getService(serviceId);
  const size = VEHICLE_SIZES.find((v) => v.id === vehicleSize);
  if (!service || !size) return 0;
  return Math.round(service.basePrice * size.priceMultiplier);
}
