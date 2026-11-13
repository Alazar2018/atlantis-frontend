"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const links = [
  { href: "/products", label: "Collection" },
  { href: "/about", label: "House" },
  { href: "/services", label: "Atelier" },
  { href: "/contact", label: "Visit" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const onAdmin = pathname.startsWith("/admin") || pathname.startsWith("/login");

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const mark = "text-carmine";
  const bar = "border-white/10 bg-ink text-ivory";

  const isActive = (path: string) => pathname.startsWith(path);

  if (onAdmin) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-ink/10 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center" aria-label="Atlantic Leather home">
            <img
              src="/images/logo/English Horizontal.png"
              alt="Atlantic Leather"
              className="h-10 w-auto"
            />
          </Link>
          <Link href="/" className="hidden text-[11px] uppercase tracking-[0.22em] text-ink/70 hover:text-carmine md:inline">
            Shop
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] border-b backdrop-blur-md ${bar}`}>
      <div className="mx-auto flex h-[4.25rem] max-w-[90rem] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center" aria-label="Atlantic Leather home">
          <img
            src="/images/logo/English Horizontal.png"
            alt="Atlantic Leather"
            className="h-11 w-auto sm:h-12"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[11px] uppercase tracking-[0.28em] transition-colors duration-200 ${
                isActive(link.href) ? mark : "text-ivory/75 hover:text-ivory"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative p-2 text-ivory transition-colors duration-200 hover:text-carmine"
            aria-label={`Bag, ${cartCount} items`}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center bg-carmine px-1 text-[10px] text-ivory">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="p-2 text-ivory md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-white/10 bg-ink px-5 py-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-3 text-[12px] uppercase tracking-[0.28em] ${
                isActive(link.href) ? mark : "text-ivory/80"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
