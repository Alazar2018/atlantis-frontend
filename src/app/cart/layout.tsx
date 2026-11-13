import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Your Shopping Cart | Atlantic Leather",
  description:
    "Review the handcrafted leather goods you've added to your Atlantic Leather cart before completing your purchase.",
  path: "/cart",
  keywords: ["leather shopping cart", "Atlantic Leather checkout"],
});

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}


