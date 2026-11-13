import type { Metadata } from "next";
import ProductDetail from "@/components/ProductDetail";
import { SITE_URL, buildMetadata } from "@/lib/seo";

type ProductMeta = {
  name: string;
  description: string;
  introImage?: string;
  images?: string[];
  price?: number;
  isOnSale?: boolean;
  salePrice?: number;
  category?: { name?: string };
};

async function getProductMeta(id: string): Promise<ProductMeta | null> {
  try {
    const response = await fetch(`${SITE_URL}/api/public/products/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as ProductMeta & { error?: string };
    if (data?.error) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to load product metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProductMeta(params.id);

  if (!product) {
    return buildMetadata({
      title: `Atlantic Leather Product ${params.id}`,
      description:
        "Explore handcrafted Ethiopian leather footwear, bags, belts, and accessories from Atlantic Leather.",
      path: `/products/${params.id}`,
      keywords: ["Atlantic Leather product", "Ethiopian leather goods"],
      type: "website",
    });
  }

  const images: string[] = [];
  if (Array.isArray(product.images)) {
    images.push(
      ...product.images.filter(
        (image) => typeof image === "string" && image.trim() && !image.startsWith("blob:")
      )
    );
  }
  if (
    product.introImage &&
    typeof product.introImage === "string" &&
    product.introImage.trim() &&
    !product.introImage.startsWith("blob:")
  ) {
    images.unshift(product.introImage.trim());
  }

  const cleanImages = Array.from(new Set(images));
  const description =
    product.description?.trim() ||
    `Discover ${product.name} by Atlantic Leather — handcrafted using premium Ethiopian leather.`;

  const keywords = [
    product.name,
    "Atlantic Leather product",
    product.category?.name,
    "Ethiopian leather",
  ].filter((keyword): keyword is string => Boolean(keyword && keyword.trim()));

  return buildMetadata({
    title: `${product.name} | Atlantic Leather`,
    description,
    path: `/products/${params.id}`,
    keywords,
    images: cleanImages,
    type: "website",
  });
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetail key={params.id} productId={params.id} />;
}
