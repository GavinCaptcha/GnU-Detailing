export const BUSINESS_HOURS = {
  /** Mon–Fri: after 6 PM */
  weekdays: { open: 18, close: 22 },
  /** Sat–Sun: flexible daytime & evening */
  weekend: { open: 8, close: 20 },
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
  if (day === 0 || day === 6) return BUSINESS_HOURS.weekend;
  return BUSINESS_HOURS.weekdays;
}

/** YYYY-MM-DD in the local timezone (avoids UTC day-shift from toISOString). */
export function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getTodayLocal(): string {
  return toLocalDateString(new Date());
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

  for (let i = 0; i <= daysAhead; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const iso = toLocalDateString(d);
    if (isDateBookable(iso) && getTimeSlots(iso).length > 0) dates.push(iso);
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

  const isToday = dateStr === getTodayLocal();

  if (isToday) {
    const currentHour = new Date().getHours();
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

export function getScheduleSummary(): string {
  return "Weekdays after 6 PM · Weekends anytime (8 AM – 8 PM)";
}
