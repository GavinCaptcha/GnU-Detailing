/**
 * Run after copying Upstash env vars to .env.local:
 *   npm run verify-storage
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvLocal() {
  const path = resolve(root, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const url =
  process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

if (!url || !token) {
  console.error(
    "Missing Redis credentials. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env.local"
  );
  console.error(
    "  Vercel: Project → Settings → Environment Variables, or run: npx vercel env pull .env.local"
  );
  process.exit(1);
}

const res = await fetch(`${url}/ping`, {
  headers: { Authorization: `Bearer ${token}` },
});
const body = await res.text();

if (!res.ok) {
  console.error("Redis ping failed:", res.status, body);
  process.exit(1);
}

console.log("Redis OK:", body);
console.log("Bookings will persist on Vercel once env vars are set and you redeploy.");
