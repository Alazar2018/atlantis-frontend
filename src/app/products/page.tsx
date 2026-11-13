import type { Metadata } from "next";
import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Premium Leather Products | Atlantic Leather Collection",
  description:
    "Browse Atlantic Leather's full range of handcrafted Ethiopian leather shoes, bags, aprons, gloves, belts, and accessories for men, women, and kids.",
  path: "/products",
  keywords: ["leather products Ethiopia", "handmade leather shoes", "premium leather bags"],
});

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <section className="pb-8 pt-28 md:pb-12 md:pt-32 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="text-center py-12"><p className="text-gray-600">Loading products...</p></div>}>
            <ProductGrid />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
