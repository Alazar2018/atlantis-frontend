import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function headersFrom(request: NextRequest, json = false): HeadersInit {
  const headers: HeadersInit = { cookie: request.headers.get("cookie") || "" };
  const auth = request.headers.get("authorization");
  if (auth) headers.authorization = auth;
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}

export async function GET(request: NextRequest) {
  try {
    const backendResponse = await fetch(`${BACKEND_URL}/api/staff`, { headers: headersFrom(request) });
    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const backendResponse = await fetch(`${BACKEND_URL}/api/staff`, {
      method: "POST",
      headers: headersFrom(request, true),
      body: JSON.stringify(await request.json()),
    });
    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
