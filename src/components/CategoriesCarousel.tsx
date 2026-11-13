"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";

interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
}

export default function CategoriesCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/public/categories");
        const data = await response.json();
        
        if (data && !data.error && Array.isArray(data)) {
          setCategories(data);
        } else {
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

  // Calculate how many categories to show per slide (responsive)
  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth >= 1280) return 4; // xl: 4 categories
    if (window.innerWidth >= 1024) return 3; // lg: 3 categories
    if (window.innerWidth >= 768) return 2; // md: 2 categories
    return 1; // sm: 1 category
  };

  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const updateVisibleCount = () => {
      const newCount = getVisibleCount();
      setVisibleCount(newCount);
      // Reset index if needed when window resizes
      const maxIndex = Math.max(0, categories.length - newCount);
      setCurrentIndex((prev) => Math.min(prev, maxIndex));
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [categories.length]);

  const maxIndex = Math.max(0, categories.length - visibleCount);
  const adjustedCurrentIndex = Math.min(currentIndex, maxIndex);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      return next > maxIndex ? 0 : next;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const prevIndex = prev - 1;
      return prevIndex < 0 ? maxIndex : prevIndex;
    });
  };

  // Auto-play carousel
  useEffect(() => {
    if (categories.length <= visibleCount) return; // Don't auto-play if all categories are visible
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        return next > maxIndex ? 0 : next;
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [categories.length, visibleCount, maxIndex]);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-ink px-6 py-16 text-ivory sm:px-10">
      <div className="mx-auto max-w-[90rem]">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-carmine">The index</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">Shop by form</h2>
          </div>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          {categories.length > visibleCount && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all hover:bg-primary hover:text-white border border-gray-200"
                aria-label="Previous categories"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all hover:bg-primary hover:text-white border border-gray-200"
                aria-label="Next categories"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Carousel Container */}
          <div className="overflow-hidden relative px-8 md:px-0">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-3 md:gap-4"
              style={{
                transform: `translateX(-${adjustedCurrentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex-shrink-0"
                  style={{ 
                    width: `${100 / visibleCount}%`,
                  }}
                >
                  <Link
                    href={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group block h-full overflow-hidden bg-mist"
                >
                  <div className="relative h-40 bg-mist md:h-52">
                    {category.image_url && !category.image_url.startsWith('blob:') ? (
                      <Image
                        src={category.image_url}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized={category.image_url.startsWith('data:')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                        <Package className="h-16 w-16 text-primary/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/50 transition-opacity"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-display text-2xl text-white">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          {categories.length > visibleCount && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    adjustedCurrentIndex === index
                      ? "bg-primary w-8"
                      : "bg-gray-300 w-2 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

