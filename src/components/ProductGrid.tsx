"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { studioImages } from "@/lib/studioImages";
import LeatherArtwork, { pieceKind } from "@/components/LeatherArtwork";
import { useRouter, useSearchParams } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  rating: number;
  category: string;
  isOnSale?: boolean;
}

// Extended mock data - matching Atlantic Leather product categories
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Leather Bag",
    price: 4500,
    image: studioImages.bag,
    description: "High-quality, stylish, and durable bag designed for everyday use",
    rating: 4.8,
    category: "Leather Bags",
  },
  {
    id: "2",
    name: "Leather Gloves",
    price: 1200,
    image: studioImages.wallet,
    description: "Perfectly crafted gloves that combine functionality with elegance",
    rating: 4.9,
    category: "Leather Gloves",
  },
  {
    id: "3",
    name: "Leather Belt",
    price: 850,
    image: studioImages.boots,
    description: "High-quality leather belt designed to last",
    rating: 4.7,
    category: "Leather Belts",
  },
  {
    id: "4",
    name: "Leather Apron",
    price: 2800,
    image: studioImages.atelier,
    description: "Robust and stylish leather apron, ideal for professionals and artisans",
    rating: 4.8,
    category: "Leather Aprons",
  },
  {
    id: "5",
    name: "Men's Leather Shoes",
    price: 8500,
    image: studioImages.shoes,
    description: "Combining style and comfort for the modern man",
    rating: 4.9,
    category: "Men's Shoes",
  },
  {
    id: "6",
    name: "Women's Leather Shoes",
    price: 7200,
    image: studioImages.satchel,
    description: "Elegant and durable shoes for every occasion",
    rating: 4.8,
    category: "Women's Shoes",
  },
  {
    id: "7",
    name: "Kids Leather Shoes",
    price: 4200,
    image: studioImages.pack,
    description: "Comfortable, stylish, and durable shoes designed specifically for children",
    rating: 4.7,
    category: "Kids Shoes",
  },
  {
    id: "8",
    name: "Quality TR Soles",
    price: 1500,
    image: studioImages.hero,
    description: "Durable soles that provide comfort and longevity for footwear",
    rating: 4.9,
    category: "TR Soles",
  },
];

export default function ProductGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Read category from URL query parameter on mount and when it changes
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam));
    } else {
      setSelectedCategory("All");
    }
  }, [searchParams]);

  useEffect(() => {
    // Fetch products from public API
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/public/products");
        const data = await response.json();
        
        console.log("Products API response:", data); // Debug log
        
        if (data && !data.error && Array.isArray(data)) {
          // Transform API data to Product format - same logic as FeaturedProducts
          const transformedProducts: Product[] = data.map((p: any) => {
            // Handle images array (same logic as FeaturedProducts and ProductDetail)
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
              rating: 4.8, // Default rating
              category: p.category?.name || "Uncategorized",
              isOnSale: p.isOnSale || false,
            };
          });
          
          setProducts(transformedProducts);
          
          // Fetch categories from API to update filter options
          try {
            const categoriesResponse = await fetch("/api/public/categories");
            const categoriesData = await categoriesResponse.json();
            if (categoriesData && Array.isArray(categoriesData)) {
              const categoryNames = categoriesData.map((c: any) => c.name);
              setCategories(["All", ...categoryNames]);
            }
          } catch (catError) {
            console.error("Error fetching categories:", catError);
          }
        } else {
          console.warn("No products found, using mock data");
          setProducts(mockProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const [categories, setCategories] = useState<string[]>(["All"]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch =
      searchLower === "" ||
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(price);
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 md:mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search products by name, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-b border-ink/15 bg-transparent py-3 pl-10 pr-10 text-sm text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                // Update URL without page reload
                const url = new URL(window.location.href);
                if (category === "All") {
                  url.searchParams.delete('category');
                } else {
                  url.searchParams.set('category', category);
                }
                router.push(url.pathname + url.search, { scroll: false });
              }}
              className={`px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors duration-200 ${
                selectedCategory === category
                  ? "bg-ink text-champagne"
                  : "bg-transparent text-ink/70 hover:text-ink"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Results Count */}
        {searchTerm || selectedCategory !== "All" ? (
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
            {searchTerm && (
              <span className="ml-2">
                for "<span className="font-semibold">{searchTerm}</span>"
              </span>
            )}
          </div>
        ) : null}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <article key={product.id} className="group">
              <Link href={`/products/${product.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-mist">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized={product.image.startsWith("blob:") || product.image.startsWith("data:")}
                    />
                  ) : (
                    <LeatherArtwork
                      kind={pieceKind(product.name, product.category)}
                      view="profile"
                      color="#941A20"
                      title={product.name}
                      uid={`grid-${product.id}`}
                    />
                  )}
                  {product.isOnSale && (
                    <div className="absolute left-3 top-3 bg-champagne px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-ink">
                      Sale
                    </div>
                  )}
                </div>
                <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-carmine">
                  {product.category}
                </p>
                <h3 className="mt-1 font-display text-3xl text-ink">{product.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm font-light text-ink/65">
                  {product.description}
                </p>
                <p className="mt-2 text-sm text-ink">
                  {product.isOnSale && product.originalPrice ? (
                    <>
                      <span>{formatPrice(product.price)}</span>
                      <span className="ml-2 text-ink/40 line-through">
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
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-600 text-lg font-medium mb-2">No products found</p>
          <p className="text-gray-500 text-sm">
            {searchTerm
              ? `No products match "${searchTerm}"${selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}`
              : selectedCategory !== "All"
              ? `No products found in ${selectedCategory}`
              : "Try adjusting your search or filters"}
          </p>
          {(searchTerm || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-4 text-primary hover:text-primary/80 font-medium text-sm underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
