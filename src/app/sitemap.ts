import type { MetadataRoute } from "next";
import { SITE_URL, marketingRoutes } from "@/lib/seo";

type ProductSummary = {
  id: string | number;
  updated_at?: string;
  updatedAt?: string;
};

const getProductRoutes = async (): Promise<MetadataRoute.Sitemap> => {
  try {
    const response = await fetch(`${SITE_URL}/api/public/products`, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as ProductSummary[];
    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .filter((product) => product?.id)
      .map((product) => {
        const lastModified =
          product.updated_at || product.updatedAt || new Date().toISOString();
        const url = `${SITE_URL}/products/${product.id}`;
        return {
          url,
          lastModified,
        };
      });
  } catch (error) {
    console.error("Failed to build product sitemap entries:", error);
    return [];
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = marketingRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date().toISOString(),
  }));

  const productEntries = await getProductRoutes();

  return [...staticEntries, ...productEntries];
}


