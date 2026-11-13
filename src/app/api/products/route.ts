import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Configure route to accept larger payloads
export const runtime = 'nodejs';
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const authHeader = request.headers.get("authorization") || "";
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get("filter");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let url = `${BACKEND_URL}/api/products?`;
    if (filter) url += `filter=${filter}&`;
    if (category) url += `category=${category}&`;
    if (search) url += `search=${search}&`;

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
    console.error("Products GET proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const authHeader = request.headers.get("authorization") || "";
    
    // Get body as text first for larger payloads, then parse
    let body;
    try {
      const bodyText = await request.text();
      body = JSON.parse(bodyText);
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: "Invalid request body or payload too large" },
        { status: 413 }
      );
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      cookie: cookieHeader,
    };
    if (authHeader) {
      headers.authorization = authHeader;
    }

    const backendResponse = await fetch(`${BACKEND_URL}/api/products`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Products POST proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

