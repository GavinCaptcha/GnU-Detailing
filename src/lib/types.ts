export type VehicleSize = "compact" | "sedan" | "suv" | "truck";

export type ServiceId = "interior-detail";

export interface Service {
  id: ServiceId;
  name: string;
  description: string;
  durationMinutes: number;
  highlights: string[];
}

export interface BookingRequest {
  serviceId: ServiceId;
  vehicleSize: VehicleSize;
  date: string;
  time: string;
  customerName: string;
  email: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  address: string;
  notes?: string;
}

export interface Booking extends BookingRequest {
  id: string;
  createdAt: string;
  estimatedPrice: number;
  status: "confirmed" | "cancelled";
}
