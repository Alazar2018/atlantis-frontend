import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(request: NextRequest) {
  try {
    // Forward request to backend with cookies
    const cookieHeader = request.headers.get("cookie") || "";

    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        cookie: cookieHeader,
      },
    });

    const data = await backendResponse.json();

    if (backendResponse.ok && data.token) {
      // Forward the new token in response
      return NextResponse.json(data, { status: 200 });
    }

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Refresh token proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

