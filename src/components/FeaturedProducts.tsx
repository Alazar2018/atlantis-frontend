"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { studioImages } from "@/lib/studioImages";
import LeatherArtwork, { pieceKind } from "@/components/LeatherArtwork";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  rating: number;
  isOnSale?: boolean;
}

// Mock data - will be replaced with API call later
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Handcrafted Leather Bag",
    price: 4500,
    image: studioImages.bag,
    description: "Premium leather bag crafted with Atlantic Leather's 18+ years of experience",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Leather Wallet",
    price: 850,
    image: studioImages.satchel,
    description: "Classic leather wallet with modern design",
    rating: 4.9,
  },
  {
    id: "3",
    name: "Leather Belt",
    price: 1200,
    image: studioImages.wallet,
    description: "Sturdy leather belt with traditional buckle",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Leather Sandals",
    price: 2800,
    image: studioImages.shoes,
    description: "Comfortable handmade leather sandals",
    rating: 4.8,
  },
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured products from public API
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/public/products/featured");
        const data = await response.json();
        
        console.log("Featured products API response:", data); // Debug log
        
        if (data && !data.error && Array.isArray(data)) {
          // Transform API data to component format - matching ProductGrid logic
          const transformedProducts = data.map((p: any) => {
            // Handle images array (similar to ProductGrid)
            let imageArray: string[] = [];
            if (p.images) {
              if (Array.isArray(p.images)) {
                imageArray = p.images
                  .filter((img: any) => img && typeof img === 'string' && img.trim() && !img.startsWith('blob:'))
                  .map((img: string) => img.trim());
              } else if (typeof p.images === 'string') {
                try {
                  const parsed = JSON.parse(p.images);
                  if (Array.isArray(parsed)) {
                    imageArray = parsed
                      .filter((img: any) => img && typeof img === 'string' && img.trim() && !img.startsWith('blob:'))
                      .map((img: string) => img.trim());
                  }
                } catch (e) {
                  if (p.images.trim() && !p.images.trim().startsWith('blob:')) {
                    imageArray = [p.images.trim()];
                  }
                }
              }
            }
            
            // Get the first valid image - prioritize images array, then introImage (skip blob URLs)
            let imageUrl = "";
            if (imageArray.length > 0) {
              imageUrl = imageArray[0];
            } else if (p.introImage && typeof p.introImage === 'string' && p.introImage.trim() && !p.introImage.startsWith('blob:')) {
              imageUrl = p.introImage.trim();
            }

            return {
              id: p.id,
              name: p.name,
              price: p.isOnSale && p.salePrice ? p.salePrice : p.price,
              originalPrice: p.isOnSale && p.salePrice ? p.price : undefined,
              image: imageUrl,
              description: p.description || "",
              rating: 4.5, // Default rating since API doesn't provide it
              isOnSale: p.isOnSale || false,
            };
          });
          setProducts(transformedProducts);
        } else {
          console.warn("No featured products found, using mock data");
          setProducts(mockProducts);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(price);
  };

  return (
    <section className="bg-ivory px-6 py-16 text-ink sm:px-10">
      <div className="mx-auto max-w-[90rem]">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl md:text-4xl">Featured products</h2>
          <Link href="/products" className="text-sm text-carmine hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-ink/60">Loading products…</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product.id} className="group">
                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-mist">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, 25vw"
                        unoptimized={product.image.startsWith("blob:") || product.image.startsWith("data:")}
                      />
                    ) : (
                      <LeatherArtwork
                        kind={pieceKind(product.name, "")}
                        view="profile"
                        color="#941A20"
                        title={product.name}
                        uid={`featured-${product.id}`}
                      />
                    )}
                    {product.isOnSale && (
                      <div className="absolute left-3 top-3 bg-carmine px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-ivory">
                        Sale
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 text-lg text-ink">{product.name}</h3>
                  <p className="mt-1 text-sm text-ink/70">
                    {product.isOnSale && product.originalPrice ? (
                      <>
                        <span>{formatPrice(product.price)}</span>
                        <span className="ml-2 line-through opacity-50">
                          {formatPrice(product.originalPrice)}
                        </span>
                      </>
                    ) : (
                      formatPrice(product.price)
                    )}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-ink/60">No featured products yet.</p>
        )}
      </div>
    </section>
  );
}
