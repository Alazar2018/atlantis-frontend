import { NextRequest, NextResponse } from "next/server";

// Simple placeholder image API route for development
export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  const [width = "400", height = "400"] = params.params;

  // Return a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#8B4513"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#D2B48C" font-family="Arial, sans-serif" font-size="20">
        ${width}x${height}
      </text>
    </svg>
  `.trim();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
}
