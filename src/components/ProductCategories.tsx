"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";

interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
}

export default function ProductCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/public/categories");
        const data = await response.json();
        
        console.log("Categories API response:", data); // Debug log
        
        if (data && !data.error && Array.isArray(data)) {
          setCategories(data);
        } else {
          console.warn("No categories found or invalid response");
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null; // Don't show section if no categories
  }

  return (
    <section className="bg-ivory px-6 py-16 sm:px-10 lg:py-24">
      <div className="mx-auto max-w-[90rem]">
        <p className="text-[11px] uppercase tracking-[0.35em] text-carmine">From the rail</p>
        <h2 className="mt-3 font-display text-5xl text-ink">Forms the house still cuts</h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group block overflow-hidden bg-mist"
            >
              <div className="relative h-48 bg-mist">
                {category.image_url && !category.image_url.startsWith('blob:') ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized={category.image_url.startsWith('data:')}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-carmine/10">
                    <Package className="h-16 w-16 text-carmine/70" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl text-ink">{category.name}</h3>
                {category.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-ink/65">{category.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

