import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const PUBLIC_API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

export async function POST(request: NextRequest) {
  try {
    // If no API key is configured, return error with instructions
    if (!PUBLIC_API_KEY) {
      console.warn("NEXT_PUBLIC_API_KEY is not set. Please configure it in .env.local");
      return NextResponse.json(
        { error: "API key not configured. Please set NEXT_PUBLIC_API_KEY in your environment variables." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-API-Key": PUBLIC_API_KEY,
    };

    const backendResponse = await fetch(`${BACKEND_URL}/api/public/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();
    
    // Log for debugging
    if (backendResponse.status !== 200 && backendResponse.status !== 201) {
      console.error("Backend API error:", data, "Status:", backendResponse.status);
    }
    
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Public orders proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

