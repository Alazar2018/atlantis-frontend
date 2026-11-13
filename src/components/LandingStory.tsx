"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
}

export default function LandingStory() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/public/categories");
        const data = await response.json();
        if (Array.isArray(data)) setCategories(data);
      } catch {
        setCategories([]);
      }
    };
    load();
  }, []);

  return (
    <section className="bg-ivory px-6 py-16 text-ink sm:px-10">
      <div className="mx-auto max-w-[90rem]">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl md:text-4xl">Shop by category</h2>
          <Link href="/products" className="text-sm text-carmine hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {categories.map((category) => {
            const image = category.image_url && !category.image_url.startsWith("blob:") ? category.image_url : "";
            return (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-mist">
                  {image ? (
                    <Image
                      src={image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      unoptimized={image.startsWith("data:")}
                    />
                  ) : (
                    <div className="flex h-full items-end bg-oxblood p-4">
                      <span className="font-display text-3xl text-ivory">{category.name}</span>
                    </div>
                  )}
                </div>
                <h3 className="mt-3 font-display text-2xl">{category.name}</h3>
                {category.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-ink/65">{category.description}</p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
