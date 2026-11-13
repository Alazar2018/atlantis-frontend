import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const authHeader = request.headers.get("authorization") || "";
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get("filter");

    let url = `${BACKEND_URL}/api/stock/products`;
    if (filter) url += `?filter=${filter}`;

    const headers: HeadersInit = {
      cookie: cookieHeader,
    };
    if (authHeader) {
      headers.authorization = authHeader;
    }

    const backendResponse = await fetch(url, {
      method: "GET",
      headers,
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Stock products GET proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

