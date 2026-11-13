import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(request: NextRequest) {
  try {
    // Forward request to backend
    const cookieHeader = request.headers.get("cookie") || "";

    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        cookie: cookieHeader,
      },
    });

    const data = await backendResponse.json();

    // Create response and clear cookie
    const response = NextResponse.json(data, { status: backendResponse.status });
    
    // Clear the auth token cookie
    response.cookies.delete("authToken");
    response.cookies.delete("refreshToken");

    return response;
  } catch (error) {
    console.error("Logout proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

