import { NextResponse } from "next/server";
import {
  diagnoseRedisEnv,
  getStorageSetupMessage,
  getStorageStatus,
  listRedisRelatedEnvKeys,
  resolveRedisCredentials,
} from "@/lib/bookings-storage";

/** GET /api/storage-status — verify Redis/file storage (use after connecting Vercel Storage). */
export async function GET() {
  const status = await getStorageStatus();
  const creds = resolveRedisCredentials();
  const diagnosis = diagnoseRedisEnv();

  const body = {
    ...status,
    message: status.ok ? status.message : getStorageSetupMessage(),
    envKeysFound: listRedisRelatedEnvKeys(),
    hasRestUrl: diagnosis.hasRestUrl,
    hasRestToken: diagnosis.hasRestToken,
    credentialsResolved: creds !== null,
  };
  return NextResponse.json(body, { status: status.ok ? 200 : 503 });
}
