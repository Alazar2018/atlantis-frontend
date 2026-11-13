import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const PUBLIC_API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const backendResponse = await fetch(`${BACKEND_URL}/api/public/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": PUBLIC_API_KEY,
      },
      body: JSON.stringify(await request.json()),
      cache: "no-store",
    });
    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Public message proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
