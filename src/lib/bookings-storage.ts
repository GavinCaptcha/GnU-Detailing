import "server-only";

import { Redis } from "@upstash/redis";
import { promises as fs } from "fs";
import path from "path";
import type { Booking } from "./types";

const BOOKINGS_KEY = "gnu:bookings";
const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

export const VERCEL_STORAGE_SETUP_MESSAGE =
  "Bookings storage is not connected. In Vercel: open your Redis database → Connect to Project → select this site → enable Production & Preview → Redeploy.";

export class BookingsStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookingsStorageError";
  }
}

/** Credentials from Vercel Storage / Upstash (several naming conventions). */
export function resolveRedisCredentials(): {
  url: string;
  token: string;
} | null {
  const fixedPairs: [string, string][] = [
    ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
    ["KV_REST_API_URL", "KV_REST_API_TOKEN"],
  ];

  for (const [urlKey, tokenKey] of fixedPairs) {
    const url = process.env[urlKey];
    const token = process.env[tokenKey];
    if (url && token) return { url, token };
  }

  for (const key of Object.keys(process.env)) {
    if (key.endsWith("_KV_REST_API_URL")) {
      const prefix = key.slice(0, -"_KV_REST_API_URL".length);
      const tokenKey = `${prefix}_KV_REST_API_TOKEN`;
      const url = process.env[key];
      const token = process.env[tokenKey];
      if (url && token) return { url, token };
    }
    if (key.endsWith("_REDIS_REST_URL") && key !== "UPSTASH_REDIS_REST_URL") {
      const prefix = key.slice(0, -"_REDIS_REST_URL".length);
      const tokenKey = `${prefix}_REDIS_REST_TOKEN`;
      const url = process.env[key];
      const token = process.env[tokenKey];
      if (url && token) return { url, token };
    }
  }

  return null;
}

export function hasRedisEnv(): boolean {
  return resolveRedisCredentials() !== null;
}

export function usesRedisStorage(): boolean {
  return hasRedisEnv();
}

export function isVercelDeployment(): boolean {
  return process.env.VERCEL === "1";
}

function getRedisClient(): Redis {
  const creds = resolveRedisCredentials();
  if (!creds) {
    throw new BookingsStorageError(VERCEL_STORAGE_SETUP_MESSAGE);
  }
  return new Redis({ url: creds.url, token: creds.token });
}

export async function pingRedis(): Promise<boolean> {
  const result = await getRedisClient().ping();
  return result === "PONG";
}

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, "[]", "utf-8");
  }
}

async function loadBookingsFromFile(): Promise<Booking[]> {
  await ensureDataFile();
  const raw = await fs.readFile(BOOKINGS_FILE, "utf-8");
  return JSON.parse(raw) as Booking[];
}

async function saveBookingsToFile(bookings: Booking[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
}

async function loadBookingsFromRedis(): Promise<Booking[]> {
  const data = await getRedisClient().get<Booking[]>(BOOKINGS_KEY);
  return data ?? [];
}

async function saveBookingsToRedis(bookings: Booking[]): Promise<void> {
  await getRedisClient().set(BOOKINGS_KEY, bookings);
}

export async function loadBookings(): Promise<Booking[]> {
  if (hasRedisEnv()) {
    return loadBookingsFromRedis();
  }
  if (isVercelDeployment()) {
    throw new BookingsStorageError(VERCEL_STORAGE_SETUP_MESSAGE);
  }
  return loadBookingsFromFile();
}

export async function saveBookings(bookings: Booking[]): Promise<void> {
  if (hasRedisEnv()) {
    await saveBookingsToRedis(bookings);
    return;
  }
  if (isVercelDeployment()) {
    throw new BookingsStorageError(VERCEL_STORAGE_SETUP_MESSAGE);
  }
  await saveBookingsToFile(bookings);
}

export type StorageStatus = {
  ok: boolean;
  storage: "redis" | "file" | "none";
  bookingCount?: number;
  message?: string;
};

export async function getStorageStatus(): Promise<StorageStatus> {
  if (hasRedisEnv()) {
    try {
      await pingRedis();
      const bookings = await loadBookingsFromRedis();
      return { ok: true, storage: "redis", bookingCount: bookings.length };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Redis connection failed.";
      return { ok: false, storage: "redis", message };
    }
  }

  if (isVercelDeployment()) {
    return {
      ok: false,
      storage: "none",
      message: VERCEL_STORAGE_SETUP_MESSAGE,
    };
  }

  const bookings = await loadBookingsFromFile();
  return { ok: true, storage: "file", bookingCount: bookings.length };
}
