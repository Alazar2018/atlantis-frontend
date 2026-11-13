import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const authHeader = request.headers.get("authorization") || "";

    const headers: HeadersInit = {
      cookie: cookieHeader,
    };
    if (authHeader) {
      headers.authorization = authHeader;
    }

    const backendResponse = await fetch(`${BACKEND_URL}/api/products/${params.id}`, {
      method: "GET",
      headers,
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Product GET proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Configure route to accept larger payloads
export const runtime = 'nodejs';
export const maxDuration = 30;

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const backendResponse = await fetch(`${BACKEND_URL}/api/products/${params.id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Product PUT proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const authHeader = request.headers.get("authorization") || "";

    const headers: HeadersInit = {
      cookie: cookieHeader,
    };
    if (authHeader) {
      headers.authorization = authHeader;
    }

    const backendResponse = await fetch(`${BACKEND_URL}/api/products/${params.id}`, {
      method: "DELETE",
      headers,
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Product DELETE proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

