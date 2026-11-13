"use client";

import { useState, useEffect } from "react";
import LeatherArtwork, { leatherColors, pieceKind } from "@/components/LeatherArtwork";
import { ShoppingCart, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { toast } from "react-toastify";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  longDescription: string;
  rating: number;
  category: string;
  inStock: boolean;
  isOnSale?: boolean;
  sizes?: string[];
  hides?: string[];
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isOnSale?: boolean;
}

function productImage(data: { images?: unknown; introImage?: unknown }): string {
  const candidates: string[] = [];
  const push = (value: unknown) => {
    if (typeof value === "string" && value.trim() && !value.startsWith("blob:")) {
      candidates.push(value.trim());
    }
  };
  if (Array.isArray(data.images)) {
    data.images.forEach(push);
  } else if (typeof data.images === "string") {
    try {
      const parsed = JSON.parse(data.images);
      if (Array.isArray(parsed)) parsed.forEach(push);
      else push(parsed);
    } catch {
      push(data.images);
    }
  }
  push(data.introImage);
  return candidates[0] || "";
}

function toRelated(data: {
  id: string | number;
  name: string;
  price: number;
  salePrice?: number | null;
  isOnSale?: boolean;
  images?: unknown;
  introImage?: unknown;
  category?: { name?: string };
}): RelatedProduct {
  const onSale = Boolean(data.isOnSale && data.salePrice);
  return {
    id: String(data.id),
    name: data.name,
    price: onSale ? Number(data.salePrice) : Number(data.price),
    originalPrice: onSale ? Number(data.price) : undefined,
    image: productImage(data),
    category: data.category?.name || "Uncategorized",
    isOnSale: Boolean(data.isOnSale),
  };
}

const mockProduct: Product = {
  id: "1",
  name: "Handcrafted Leather Bag",
  price: 4500,
  images: [
    "/images/home/IMG_20251105_222233_648.jpg",
    "/images/home/IMG_20251105_222629_819.jpg"
  ],
    description: "Premium leather bag crafted with over 18 years of experience",
    longDescription:
      "This exquisite leather bag is crafted by skilled artisans using traditional techniques combined with modern technology. Made from premium leather, it features elegant stitching and a timeless design that combines classic aesthetics with modern functionality. Perfect for everyday use or special occasions.",
  rating: 4.8,
  category: "Bags",
  inStock: true,
};

export default function ProductDetail({ productId }: { productId: string }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(leatherColors[0].value);

  useEffect(() => {
    // Fetch product by ID from public API
    const fetchProduct = async () => {
      try {
        setRelated([]);
        const response = await fetch(`/api/public/products/${productId}`);
        const data = await response.json();
        
        if (data && !data.error) {
          // Transform API data to Product format - matching ProductGrid logic
          // Handle images - backend might return array or string
          let imageArray: string[] = [];
          if (data.images) {
            if (Array.isArray(data.images)) {
              imageArray = data.images
                .filter((img: any) => img && typeof img === 'string' && img.trim() && !img.startsWith('blob:'))
                .map((img: string) => img.trim());
            } else if (typeof data.images === 'string') {
              try {
                const parsed = JSON.parse(data.images);
                if (Array.isArray(parsed)) {
                  imageArray = parsed
                    .filter((img: any) => img && typeof img === 'string' && img.trim() && !img.startsWith('blob:'))
                    .map((img: string) => img.trim());
                } else if (parsed && typeof parsed === 'string' && !parsed.startsWith('blob:')) {
                  imageArray = [parsed.trim()];
                }
              } catch (e) {
                // If not JSON, treat as single image string (only if not blob)
                if (data.images.trim() && !data.images.trim().startsWith('blob:')) {
                  imageArray = [data.images.trim()];
                }
              }
            }
          }
          
          // Get the first valid image - prioritize images array, then introImage (skip blob URLs)
          let imageUrl = "";
          if (imageArray.length > 0) {
            // Use first image from array (these are data URLs)
            imageUrl = imageArray[0];
          } else if (data.introImage && typeof data.introImage === 'string' && data.introImage.trim() && !data.introImage.startsWith('blob:')) {
            // Fallback to introImage if it's a valid data URL
            imageUrl = data.introImage.trim();
          }
          
          // Build images array for display (introImage first if valid, then images array)
          const validImages: string[] = [];
          if (data.introImage && typeof data.introImage === 'string' && data.introImage.trim() && !data.introImage.startsWith('blob:')) {
            validImages.push(data.introImage.trim());
          }
          // Add images from array (skip if already added as introImage)
          imageArray.forEach(img => {
            if (img && !validImages.includes(img)) {
              validImages.push(img);
            }
          });
          
          // Reset selectedImage if it's out of bounds
          if (validImages.length > 0) {
            setSelectedImage(0);
          }

          const transformedProduct: Product = {
            id: data.id,
            name: data.name,
            price: data.isOnSale && data.salePrice ? data.salePrice : data.price,
            originalPrice: data.isOnSale && data.salePrice ? data.price : undefined,
            images: validImages.length > 0 ? validImages : [],
            description: data.description || "",
            longDescription: data.description || "",
            rating: 4.8, // Default rating
            category: data.category?.name || "Uncategorized",
            inStock: data.stock > 0,
            isOnSale: data.isOnSale || false,
            sizes: Array.isArray(data.sizes) ? data.sizes.map(String) : [],
            hides: Array.isArray(data.hides) ? data.hides.map(String) : [],
          };
          
          setProduct(transformedProduct);
          if (transformedProduct.hides && transformedProduct.hides.length > 0) {
            setSelectedColor(transformedProduct.hides[0]);
          } else {
            setSelectedColor(leatherColors[0].value);
          }

          const listResponse = await fetch("/api/public/products");
          const list = await listResponse.json();
          if (Array.isArray(list)) {
            const others = list
              .map((item) => toRelated(item))
              .filter((item) => item.id !== String(transformedProduct.id));
            const kind = pieceKind(transformedProduct.name, transformedProduct.category);
            const sameCategory = others.filter((item) => item.category === transformedProduct.category);
            const sameKind = others.filter(
              (item) =>
                item.category !== transformedProduct.category &&
                pieceKind(item.name, item.category) === kind
            );
            const rest = others.filter(
              (item) =>
                item.category !== transformedProduct.category &&
                pieceKind(item.name, item.category) !== kind
            );
            const matched = sameCategory.length > 0 ? sameCategory : sameKind.length > 0 ? sameKind : rest;
            setRelated(matched.slice(0, 4));
          }
        } else {
          // Fallback to mock data if product not found
          setProduct(mockProduct);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        // Fallback to mock data on error
        setProduct(mockProduct);
      }
    };
    
    fetchProduct();
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(price);
  };

  const handleAddToCart = () => {
    const size = availableSizes.length === 0 ? "One size" : selectedSize;
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Add item with selected quantity
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size,
        color: selectedColor,
      },
      quantity
    );
    
    // Reset form after adding
    setQuantity(1);
    setSelectedSize("");
    setSelectedColor(leatherColors[0].value);
  };

  // Mock sizes and colors - in production, these would come from the product data
  const kind = pieceKind(product.name, product.category);
  const offeredColors =
    product.hides && product.hides.length > 0
      ? leatherColors.filter((color) => product.hides?.includes(color.value))
      : leatherColors;
  const activeColor = offeredColors.find((color) => color.value === selectedColor) ?? offeredColors[0] ?? leatherColors[0];
  const defaultSizes =
    kind === "bag"
      ? []
      : kind === "belt"
        ? ["85", "90", "95", "100", "105", "110"]
        : kind === "glove" || kind === "jacket" || kind === "apron"
          ? ["S", "M", "L"]
          : ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : defaultSizes;
  const leatherFacts =
    kind === "bag"
      ? [
          ["Hide", "Full-grain Ethiopian leather"],
          ["Origin", "Tatek Industrial Zone, Sheger City"],
          ["Construction", "One panel, saddle-stitched, leather lined"],
          ["Hardware", "Solid brass"],
          ["Care", "Wipe dry and keep the bag stuffed"],
        ]
      : kind === "belt"
        ? [
            ["Hide", "Full-grain strap, 35 mm"],
            ["Origin", "Tatek Industrial Zone, Sheger City"],
            ["Construction", "Edges burnished, keeper stitched"],
            ["Hardware", "Solid brass buckle"],
            ["Care", "Hang straight, condition once a year"],
          ]
        : kind === "glove"
          ? [
              ["Hide", "Soft full-grain, unlined"],
              ["Origin", "Tatek Industrial Zone, Sheger City"],
              ["Construction", "Thumb seam set off the grip"],
              ["Stitching", "Linen"],
              ["Care", "Rest flat. Do not wash"],
            ]
          : kind === "jacket"
            ? [
                ["Hide", "Heavy full-grain, leather lined"],
                ["Origin", "Tatek Industrial Zone, Sheger City"],
                ["Construction", "Saddle-stitched seams, set collar"],
                ["Hardware", "Metal zip"],
                ["Care", "Hang wide, condition once a year. Do not wash"],
              ]
            : kind === "apron"
              ? [
                  ["Hide", "Firm full-grain bib and skirt"],
                  ["Origin", "Tatek Industrial Zone, Sheger City"],
                  ["Construction", "Neck strap, waist ties, stitched pockets"],
                  ["Tannage", "Vegetable, uncoated"],
                  ["Care", "Wipe down and hang by the strap. Do not wash"],
                ]
              : [
              ["Hide", "Full-grain Ethiopian leather"],
              ["Origin", "Tatek Industrial Zone, Sheger City"],
              ["Construction", "Hand-lasted, stitched welt, leather sole"],
              ["Tannage", "Vegetable, uncoated aniline"],
              ["Care", "Brush, condition twice a year, use shoe trees"],
            ];

  return (
    <div className="min-h-screen bg-champagne px-4 py-28 md:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="mb-6 inline-flex items-center text-sm text-ink/70 transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-2" />
          Back to Products
        </Link>

        <div className="overflow-hidden bg-champagne">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-4 md:p-8">
            {/* Images */}
            <div>
              <div className="relative aspect-square overflow-hidden bg-mist">
                {product.images[selectedImage] ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-contain p-6"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={
                      product.images[selectedImage].startsWith("data:") ||
                      product.images[selectedImage].startsWith("blob:")
                    }
                  />
                ) : (
                  <LeatherArtwork
                    kind={kind}
                    view="profile"
                    color={activeColor.hex}
                    title={product.name}
                    uid={`piece-${product.id}`}
                  />
                )}
                {product.isOnSale && (
                  <div className="absolute left-4 top-4 bg-carmine px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-ivory">
                    Sale
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={`${product.id}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      aria-pressed={selectedImage === index}
                      className={`relative aspect-square overflow-hidden border bg-mist ${
                        selectedImage === index ? "border-carmine" : "border-ink/10"
                      }`}
                    >
                      <Image
                        src={image}
                        alt=""
                        fill
                        className="object-contain p-1"
                        sizes="80px"
                        unoptimized={image.startsWith("data:") || image.startsWith("blob:")}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="mb-4 font-display text-5xl text-ink md:text-6xl">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                    <Star className="h-5 w-5 fill-carmine text-carmine" />
                  <span className="ml-2 text-gray-700">{product.rating}</span>
                </div>
                <span className="ml-4 text-gray-500">({product.category})</span>
              </div>

              <div className="mb-6">
                {product.isOnSale && product.originalPrice ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <span className="text-4xl font-bold text-ink">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    </div>
                    <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">
                      ON SALE
                    </span>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-ink">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.longDescription}
              </p>

              {availableSizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {kind === "belt" ? "Waist, cm" : kind === "glove" ? "Size" : "Size"} <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedSize === size
                          ? "border-ink bg-mist text-ink font-semibold"
                          : "border-gray-300 hover:border-ink/40"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              )}

              {/* Color Selection */}
              <div className="mb-8">
                <div className="mb-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-carmine">Hide</p>
                    <p className="font-display text-2xl text-ink">{activeColor.name}</p>
                  </div>
                  <div className="h-16 w-24 overflow-hidden bg-mist">
                    <LeatherArtwork
                      kind={kind}
                      view="profile"
                      color={activeColor.hex}
                      title={`${product.name} in ${activeColor.name}`}
                      uid={`hide-${product.id}`}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {offeredColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      aria-label={color.name}
                      aria-pressed={selectedColor === color.value}
                      className={`h-11 w-11 rounded-full border transition-transform duration-200 ${
                        selectedColor === color.value
                          ? "scale-105 border-ink ring-2 ring-sage ring-offset-2 ring-offset-champagne"
                          : "border-ink/15 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex flex-1 items-center justify-center space-x-2 bg-ink px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-champagne transition-colors duration-200 hover:bg-sage disabled:cursor-not-allowed disabled:bg-ink/30"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
              </div>

              <div className="border-t border-ink/10 pt-6">
                <h3 className="font-display text-3xl text-ink">Leather</h3>
                <dl className="mt-4 divide-y divide-ink/10">
                  {leatherFacts.map(([label, value]) => (
                    <div key={label} className="grid grid-cols-3 gap-3 py-3 text-sm">
                      <dt className="text-ink/50">{label}</dt>
                      <dd className="col-span-2 text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-16 border-t border-ink/10 pt-12">
              <h2 className="font-display text-3xl text-ink md:text-4xl">
                {related.every((item) => item.category === product.category)
                  ? `More in ${product.category}`
                  : related.every(
                        (item) => pieceKind(item.name, item.category) === pieceKind(product.name, product.category)
                      )
                    ? "More like this"
                    : "Related leather"}
              </h2>
              <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
                {related.map((item) => (
                  <article key={item.id}>
                    <Link href={`/products/${item.id}`} className="block">
                      <div className="relative aspect-square overflow-hidden bg-mist">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-4"
                            sizes="(max-width: 1024px) 50vw, 25vw"
                            unoptimized={item.image.startsWith("data:") || item.image.startsWith("blob:")}
                          />
                        ) : (
                          <LeatherArtwork
                            kind={pieceKind(item.name, item.category)}
                            view="profile"
                            color="#941A20"
                            title={item.name}
                            uid={`related-${product.id}-${item.id}`}
                          />
                        )}
                        {item.isOnSale && (
                          <div className="absolute left-3 top-3 bg-carmine px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-ivory">
                            Sale
                          </div>
                        )}
                      </div>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-carmine">{item.category}</p>
                      <h3 className="mt-1 font-display text-2xl text-ink">{item.name}</h3>
                      <p className="mt-1 text-sm text-ink/70">
                        {item.originalPrice ? (
                          <>
                            <span>{formatPrice(item.price)}</span>
                            <span className="ml-2 line-through opacity-50">{formatPrice(item.originalPrice)}</span>
                          </>
                        ) : (
                          formatPrice(item.price)
                        )}
                      </p>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
