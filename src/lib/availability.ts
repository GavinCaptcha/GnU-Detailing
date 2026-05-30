export const BUSINESS_HOURS = {
  weekdays: { open: 8, close: 18 },
  saturday: { open: 9, close: 16 },
  sunday: null as { open: number; close: number } | null,
};

export const SLOT_INTERVAL_MINUTES = 60;

const BOOKED_TIMES = new Map<string, Set<string>>();

export function registerBookedSlot(date: string, time: string): void {
  if (!BOOKED_TIMES.has(date)) {
    BOOKED_TIMES.set(date, new Set());
  }
  BOOKED_TIMES.get(date)!.add(time);
}

export function loadBookedSlots(
  bookings: { date: string; time: string; status: string }[]
): void {
  BOOKED_TIMES.clear();
  for (const b of bookings) {
    if (b.status !== "cancelled") {
      registerBookedSlot(b.date, b.time);
    }
  }
}

function getHoursForDate(dateStr: string): { open: number; close: number } | null {
  const date = new Date(dateStr + "T12:00:00");
  const day = date.getDay();
  if (day === 0) return BUSINESS_HOURS.sunday;
  if (day === 6) return BUSINESS_HOURS.saturday;
  return BUSINESS_HOURS.weekdays;
}

export function isDateBookable(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr + "T12:00:00");
  if (date < today) return false;
  return getHoursForDate(dateStr) !== null;
}

export function getAvailableDates(daysAhead = 30): string[] {
  const dates: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i <= daysAhead; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    if (isDateBookable(iso)) dates.push(iso);
  }
  return dates;
}

export function getTimeSlots(dateStr: string): string[] {
  const hours = getHoursForDate(dateStr);
  if (!hours) return [];

  const booked = BOOKED_TIMES.get(dateStr) ?? new Set();
  const slots: string[] = [];

  for (let h = hours.open; h < hours.close; h++) {
    const time = `${String(h).padStart(2, "0")}:00`;
    if (!booked.has(time)) slots.push(time);
  }

  const now = new Date();
  const isToday =
    dateStr ===
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  if (isToday) {
    const currentHour = now.getHours();
    return slots.filter((t) => parseInt(t, 10) > currentHour);
  }

  return slots;
}

export function formatDateLabel(iso: string): string {
  const date = new Date(iso + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatTimeLabel(time: string): string {
  const [h] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:00 ${period}`;
}
