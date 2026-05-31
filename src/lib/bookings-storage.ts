import "server-only";

import { Redis } from "@upstash/redis";
import { promises as fs } from "fs";
import path from "path";
import type { Booking } from "./types";

const BOOKINGS_KEY = "gnu:bookings";
const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

export class BookingsStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookingsStorageError";
  }
}

const TOKEN_KEY_RE =
  /(?:REST_API_TOKEN|REST_TOKEN|READ_WRITE_TOKEN|_TOKEN)$/i;
const URL_KEY_RE =
  /(?:REST_API_URL|REST_URL|^STORAGE_URL$|^KV_REST_API_URL$|UPSTASH_REDIS_REST_URL$)/i;

/** Env var names related to Redis/KV (values never exposed). */
export function listRedisRelatedEnvKeys(): string[] {
  return Object.keys(process.env)
    .filter(
      (key) =>
        /redis|kv|upstash|storage/i.test(key) &&
        !/^VERCEL_/i.test(key) &&
        process.env[key]
    )
    .sort();
}

export function diagnoseRedisEnv(): {
  foundKeys: string[];
  hasRestUrl: boolean;
  hasRestToken: boolean;
} {
  const foundKeys = listRedisRelatedEnvKeys();
  const hasRestUrl = collectRestUrls().length > 0;
  const hasRestToken = collectRestTokens().length > 0;
  return { foundKeys, hasRestUrl, hasRestToken };
}

export function getStorageSetupMessage(): string {
  const { foundKeys, hasRestUrl, hasRestToken } = diagnoseRedisEnv();

  if (hasRestUrl && !hasRestToken) {
    return (
      "Redis URL is set on Vercel but the REST token is missing. " +
      "Storage → your database → .env / Credentials → copy the REST token. " +
      "Project → Settings → Environment Variables → add KV_REST_API_TOKEN (or STORAGE_TOKEN) " +
      "for Production & Preview → Redeploy."
    );
  }

  if (!hasRestUrl && hasRestToken) {
    return (
      "Redis token is set but the REST URL is missing. " +
      "Add KV_REST_API_URL or UPSTASH_REDIS_REST_URL from Storage credentials, then redeploy."
    );
  }

  if (foundKeys.length > 0) {
    return (
      `Redis env vars found (${foundKeys.join(", ")}) but not a usable REST URL + token pair. ` +
      "Add KV_REST_API_URL and KV_REST_API_TOKEN from Storage → Credentials, then redeploy."
    );
  }

  return (
    "No Redis credentials on this deployment. " +
    "Vercel → Storage → your Redis → Connect to Project (this site). " +
    "Then add KV_REST_API_URL + KV_REST_API_TOKEN from the database .env tab " +
    "(Project → Settings → Environment Variables → Production & Preview) and redeploy."
  );
}

function isRestUrl(value: string): boolean {
  return (
    value.startsWith("https://") &&
    (value.includes("upstash.io") ||
      value.includes("redis.vercel-storage.com") ||
      value.includes("upstash"))
  );
}

function collectRestUrls(): string[] {
  const urls = new Set<string>();
  for (const [key, value] of Object.entries(process.env)) {
    if (!value || !URL_KEY_RE.test(key)) continue;
    if (isRestUrl(value) || key === "STORAGE_URL" || key.endsWith("_REST_API_URL")) {
      urls.add(value);
    }
  }
  return [...urls];
}

function collectRestTokens(): string[] {
  const tokens = new Set<string>();
  for (const [key, value] of Object.entries(process.env)) {
    if (!value || value.length < 8) continue;
    if (key.includes("READ_ONLY")) continue;
    if (TOKEN_KEY_RE.test(key)) tokens.add(value);
  }
  return [...tokens];
}

function tokenForStorageUrl(): string | undefined {
  return (
    process.env.STORAGE_TOKEN ??
    process.env.STORAGE_REST_TOKEN ??
    process.env.STORAGE_REST_API_TOKEN ??
    process.env.STORAGE_READ_WRITE_TOKEN ??
    process.env.STORAGE_KV_REST_API_TOKEN ??
    process.env.KV_REST_API_TOKEN ??
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

/** Credentials from Vercel Storage / Upstash (several naming conventions). */
export function resolveRedisCredentials(): {
  url: string;
  token: string;
} | null {
  const fixedPairs: [string, string][] = [
    ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
    ["KV_REST_API_URL", "KV_REST_API_TOKEN"],
    ["STORAGE_URL", "STORAGE_TOKEN"],
    ["STORAGE_URL", "STORAGE_REST_TOKEN"],
    ["STORAGE_URL", "STORAGE_REST_API_TOKEN"],
    ["STORAGE_URL", "STORAGE_KV_REST_API_TOKEN"],
    ["STORAGE_URL", "KV_REST_API_TOKEN"],
    ["KV_REST_API_URL", "STORAGE_TOKEN"],
    ["KV_REST_API_URL", "STORAGE_REST_API_TOKEN"],
  ];

  for (const [urlKey, tokenKey] of fixedPairs) {
    const url = process.env[urlKey];
    const token = process.env[tokenKey];
    if (url && token) return { url, token };
  }

  const storageUrl = process.env.STORAGE_URL;
  const storageToken = tokenForStorageUrl();
  if (storageUrl && storageToken) {
    return { url: storageUrl, token: storageToken };
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

  const urls = collectRestUrls();
  const tokens = collectRestTokens();
  if (urls.length === 1 && tokens.length === 1) {
    return { url: urls[0], token: tokens[0] };
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
    throw new BookingsStorageError(getStorageSetupMessage());
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
    throw new BookingsStorageError(getStorageSetupMessage());
  }
  return loadBookingsFromFile();
}

export async function saveBookings(bookings: Booking[]): Promise<void> {
  if (hasRedisEnv()) {
    await saveBookingsToRedis(bookings);
    return;
  }
  if (isVercelDeployment()) {
    throw new BookingsStorageError(getStorageSetupMessage());
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
      message: getStorageSetupMessage(),
    };
  }

  const bookings = await loadBookingsFromFile();
  return { ok: true, storage: "file", bookingCount: bookings.length };
}
