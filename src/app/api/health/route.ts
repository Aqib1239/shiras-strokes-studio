import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Shira's Strokes Full-Stack API",
    version: "1.0.0",
  });
}
