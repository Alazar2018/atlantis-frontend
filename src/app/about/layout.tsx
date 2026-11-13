import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Atlantic Leather | Ethiopian Leather Heritage Since 2006",
  description:
    "Discover Atlantic Leather's story, mission, and craftsmanship legacy. Learn how we combine Ethiopian heritage with modern design across shoes, bags, and accessories.",
  path: "/about",
  keywords: ["Atlantic Leather story", "Ethiopian craftsmanship", "leather manufacturer history"],
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

