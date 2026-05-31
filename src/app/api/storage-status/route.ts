import { NextResponse } from "next/server";
import { getStorageStatus } from "@/lib/bookings-storage";

/** GET /api/storage-status — verify Redis/file storage (use after connecting Vercel Storage). */
export async function GET() {
  const status = await getStorageStatus();
  return NextResponse.json(status, { status: status.ok ? 200 : 503 });
}
