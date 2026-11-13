"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { studioImages } from "@/lib/studioImages";

interface Look {
  id: string;
  name: string;
  price: number;
  image: string;
}

const fallbackLooks: Look[] = [
  { id: "look-carry", name: "Structured carry", price: 4500, image: studioImages.satchel },
  { id: "look-sandals", name: "Atelier sandals", price: 2800, image: studioImages.shoes },
  { id: "look-belt", name: "Day belt", price: 1200, image: studioImages.boots },
];

function firstImage(product: Record<string, unknown>): string {
  const images = product.images;
  if (Array.isArray(images)) {
    const found = images.find(
      (img) => typeof img === "string" && img.trim() && !img.startsWith("blob:")
    );
    if (typeof found === "string") return found.trim();
  }
  if (typeof images === "string" && images.trim() && !images.startsWith("blob:")) {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        const found = parsed.find(
          (img) => typeof img === "string" && img.trim() && !img.startsWith("blob:")
        );
        if (typeof found === "string") return found.trim();
      }
    } catch {
      return images.trim();
    }
  }
  const intro = product.introImage;
  if (typeof intro === "string" && intro.trim() && !intro.startsWith("blob:")) {
    return intro.trim();
  }
  return "";
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(price);
}

function Waves() {
  return (
    <svg viewBox="0 0 120 64" className="h-12 w-24 text-carmine" aria-hidden="true">
      <path fill="currentColor" d="M0 8c10-8 20-8 30 0s20 8 30 0 20-8 30 0 20 8 30 0v6c-10 8-20 8-30 0S70 6 60 14 40 22 30 14 10 6 0 14V8Z" />
      <path fill="currentColor" d="M0 28c10-8 20-8 30 0s20 8 30 0 20-8 30 0 20 8 30 0v6c-10 8-20 8-30 0S70 26 60 34 40 42 30 34 10 26 0 34v-6Z" />
      <path fill="currentColor" d="M0 48c10-8 20-8 30 0s20 8 30 0 20-8 30 0 20 8 30 0v6c-10 8-20 8-30 0S70 46 60 54 40 62 30 54 10 46 0 54v-6Z" />
    </svg>
  );
}

export default function Hero() {
  const [looks, setLooks] = useState<Look[]>(fallbackLooks);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/public/products/featured");
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) return;
        const mapped = data
          .map((product: Record<string, unknown>) => {
            const sale = Boolean(product.isOnSale && product.salePrice);
            const price = sale ? Number(product.salePrice) : Number(product.price);
            return {
              id: String(product.id),
              name: String(product.name || "Leather piece"),
              price: Number.isFinite(price) ? price : 0,
              image: firstImage(product),
            };
          })
          .filter((look) => look.image);
        if (mapped.length > 0) setLooks(mapped.slice(0, 3));
      } catch {
        setLooks(fallbackLooks);
      }
    };
    load();
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-ivory">
      <Image
        src={studioImages.hero}
        alt="Leather boots, the opening look of Atlantic Leather"
        fill
        priority
        className="object-cover object-[center_60%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink from-0% via-ink/80 via-[42%] to-transparent to-[78%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[90rem] flex-col justify-end px-6 pb-8 pt-28 sm:px-10 lg:pb-10">
        <div className="max-w-3xl">
          <Waves />
          <p className="mt-6 text-[11px] uppercase tracking-[0.42em] text-carmine">
            Sheger City · Since 2006
          </p>
          <h1 className="mt-4 font-display text-[4.6rem] font-medium leading-[0.82] tracking-tight sm:text-8xl lg:text-[8.5rem]">
            Cut for
            <span className="block italic text-carmine">the walk.</span>
          </h1>
          <p className="mt-6 max-w-md text-base font-light leading-relaxed text-ivory/80 sm:text-lg">
            Ethiopian hide, finished by hand in Tatek. Bags, shoes, and belts made to leave the bench and stay in the day.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center bg-carmine px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.28em] text-ivory transition-colors duration-200 hover:bg-ivory hover:text-ink"
            >
              Enter the collection
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center border border-ivory/40 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.28em] text-ivory transition-colors duration-200 hover:border-ivory hover:bg-ivory/10"
            >
              The house
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:mt-14 lg:max-w-3xl">
          {looks.map((look, index) => (
            <Link
              key={`${look.id}-${index}`}
              href={look.id.match(/^\d+$/) ? `/products/${look.id}` : "/products"}
              className="group flex items-center gap-3 border border-ivory/15 bg-ink/55 p-2 pr-4 backdrop-blur-md transition-colors duration-200 hover:border-carmine hover:bg-ink/75"
            >
              <span className="relative h-16 w-14 shrink-0 overflow-hidden">
                <Image src={look.image} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="56px" />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] uppercase tracking-[0.22em] text-carmine">0{index + 1}</span>
                <span className="block truncate font-display text-xl leading-tight">{look.name}</span>
                <span className="block text-xs text-ivory/70">{formatPrice(look.price)}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
