import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const PUBLIC_API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // If no API key is configured, return error with instructions
    if (!PUBLIC_API_KEY) {
      console.warn("NEXT_PUBLIC_API_KEY is not set. Please configure it in .env.local");
      return NextResponse.json(
        { error: "API key not configured. Please set NEXT_PUBLIC_API_KEY in your environment variables." },
        { status: 500 }
      );
    }

    const headers: HeadersInit = {
      "X-API-Key": PUBLIC_API_KEY,
    };

    const backendResponse = await fetch(`${BACKEND_URL}/api/public/products/${params.id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await backendResponse.json();
    
    // Log for debugging
    if (backendResponse.status !== 200) {
      console.error("Backend API error:", data, "Status:", backendResponse.status);
    }
    
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Public product proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

