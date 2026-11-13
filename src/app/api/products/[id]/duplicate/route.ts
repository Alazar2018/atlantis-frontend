import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const headers: HeadersInit = { cookie: request.headers.get("cookie") || "" };
    const auth = request.headers.get("authorization");
    if (auth) headers.authorization = auth;
    const backendResponse = await fetch(`${BACKEND_URL}/api/products/${params.id}/duplicate`, {
      method: "POST",
      headers,
    });
    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
