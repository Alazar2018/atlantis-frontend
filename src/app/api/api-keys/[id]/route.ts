import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

    const backendResponse = await fetch(`${BACKEND_URL}/api/api-keys/${params.id}`, {
      method: "DELETE",
      headers,
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("API key DELETE proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

