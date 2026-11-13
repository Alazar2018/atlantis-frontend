import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin Login | Atlantic Leather Portal",
  description:
    "Securely access the Atlantic Leather admin portal to manage products, orders, categories, and inventory.",
  path: "/login",
  keywords: ["Atlantic Leather login", "leather admin portal"],
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}


