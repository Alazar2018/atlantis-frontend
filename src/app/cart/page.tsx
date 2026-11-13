"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Dialog from "@/components/Dialog";
import LeatherArtwork, { leatherColors, pieceKind } from "@/components/LeatherArtwork";
import { toast } from "react-toastify";

function hideName(value?: string) {
  return leatherColors.find((color) => color.value === value)?.name || value || "";
}

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
  } = useCart();
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(price);
  };

  const handlePlaceOrder = async () => {
    if (!orderForm.name || !orderForm.email || !orderForm.phone || !orderForm.address) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      // Transform cart items to API format
      const orderItems = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        size: item.size || undefined,
        color: item.color || undefined,
      }));

      const orderData = {
        customer: {
          name: orderForm.name,
          email: orderForm.email,
          phone: orderForm.phone,
          address: orderForm.address,
        },
        items: orderItems,
        notes: orderForm.notes,
      };

      const response = await fetch("/api/public/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Order placed successfully! We'll contact you soon.", {
          position: "top-right",
          autoClose: 5000,
        });
        
        setShowOrderDialog(false);
        clearCart();
        setOrderForm({ name: "", email: "", phone: "", address: "", notes: "" });
      } else {
        toast.error(data.error || "Failed to place order. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("An error occurred while placing your order. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-ivory pb-16 pt-28 text-ink md:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-display text-5xl md:text-6xl">Cart</h1>

        {cartItems.length === 0 ? (
          <div className="border border-ink/10 bg-white px-6 py-16 text-center">
            <h2 className="font-display text-3xl">The cart is empty</h2>
            <p className="mt-3 text-ink/65">Add a piece from the shop, then come back here to order it.</p>
            <Link
              href="/products"
              className="mt-8 inline-block bg-carmine px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-ivory transition-colors duration-200 hover:bg-ink"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {cartItems.map((item) => {
                const image = item.image && !item.image.startsWith("blob:") ? item.image : "";
                return (
                <div
                  key={`${item.id}-${item.size || ""}-${item.color || ""}`}
                  className="flex flex-col gap-4 border border-ink/10 bg-white p-4 sm:flex-row sm:p-6"
                >
                  <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden bg-mist">
                    {image ? (
                      <Image
                        src={image}
                        alt={item.name}
                        fill
                        className="object-contain"
                        sizes="128px"
                        unoptimized={image.startsWith("data:")}
                      />
                    ) : (
                      <LeatherArtwork
                        kind={pieceKind(item.name, "")}
                        view="profile"
                        color="#941A20"
                        title={item.name}
                        uid={`cart-${item.id}-${item.size || "size"}-${item.color || "hide"}`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-3xl">{item.name}</h2>
                    {item.size && (
                      <p className="mt-1 text-sm text-ink/65">Size {item.size}</p>
                    )}
                    {item.color && (
                      <p className="text-sm text-ink/65">Hide {hideName(item.color)}</p>
                    )}
                    <p className="mt-3 text-lg">{formatPrice(item.price)}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                          className="h-10 w-10 border border-ink/20 hover:border-carmine"
                          aria-label={`Decrease ${item.name}`}
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                          className="h-10 w-10 border border-ink/20 hover:border-carmine"
                          aria-label={`Increase ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        className="p-2 text-carmine"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>

            <div>
              <div className="border border-ink/10 bg-white p-6 lg:sticky lg:top-28">
                <h2 className="font-display text-3xl">Order</h2>
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between text-ink/70">
                    <span>Pieces</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between border-t border-ink/10 pt-3 text-lg text-ink">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOrderDialog(true)}
                  className="mt-6 w-full bg-carmine px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-ivory transition-colors duration-200 hover:bg-ink"
                >
                  Place order
                </button>
                <Link href="/products" className="mt-4 block text-center text-sm text-ink/70 hover:text-carmine">
                  <ArrowLeft className="mr-2 inline h-4 w-4" />
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Order Dialog */}
        <Dialog
          isOpen={showOrderDialog}
          onClose={() => setShowOrderDialog(false)}
          title="Place your order"
          size="xl"
        >
          <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
            <div>
              <label htmlFor="order-name" className="mb-1 block text-sm font-medium text-ink">
                Full name <span className="text-carmine">*</span>
              </label>
              <input
                id="order-name"
                type="text"
                value={orderForm.name}
                onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                className="w-full border border-ink/15 px-3 py-2 outline-none focus:border-carmine"
                required
              />
            </div>

            <div>
              <label htmlFor="order-email" className="mb-1 block text-sm font-medium text-ink">
                Email <span className="text-carmine">*</span>
              </label>
              <input
                id="order-email"
                type="email"
                value={orderForm.email}
                onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                className="w-full border border-ink/15 px-3 py-2 outline-none focus:border-carmine"
                required
              />
            </div>

            <div>
              <label htmlFor="order-phone" className="mb-1 block text-sm font-medium text-ink">
                Phone <span className="text-carmine">*</span>
              </label>
              <input
                id="order-phone"
                type="tel"
                value={orderForm.phone}
                onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                className="w-full border border-ink/15 px-3 py-2 outline-none focus:border-carmine"
                placeholder="+251 912 345 678"
                required
              />
            </div>

            <div>
              <label htmlFor="order-address" className="mb-1 block text-sm font-medium text-ink">
                Delivery address <span className="text-carmine">*</span>
              </label>
              <textarea
                id="order-address"
                value={orderForm.address}
                onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                rows={2}
                className="w-full resize-none border border-ink/15 px-3 py-2 outline-none focus:border-carmine"
                placeholder="City, area, and street"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="order-notes" className="mb-1 block text-sm font-medium text-ink">
                Notes
              </label>
              <textarea
                id="order-notes"
                value={orderForm.notes}
                onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                rows={2}
                className="w-full resize-none border border-ink/15 px-3 py-2 outline-none focus:border-carmine"
                placeholder="Size changes, delivery time, or anything else"
              />
            </div>

            <div className="flex items-center justify-between border border-ink/10 bg-mist px-4 py-3 md:col-span-2">
              <p className="text-sm text-ink/70">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} pieces
              </p>
              <p className="font-medium">{formatPrice(total)}</p>
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="button"
                onClick={() => setShowOrderDialog(false)}
                className="flex-1 border border-ink/20 px-4 py-3 text-sm hover:border-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="flex-1 bg-carmine px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-ivory transition-colors duration-200 hover:bg-ink"
              >
                Confirm order
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
