"use client";

import { useState, useEffect } from "react";
import { Package, ShoppingCart, Users, AlertCircle } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  paidOrders: number;
  totalProducts: number;
  publishedProducts: number;
  totalStock: number;
  lowStockItems: number;
  totalCustomers: number;
  customersWithOrders: number;
}

const emptyStats: DashboardStats = {
  totalOrders: 0,
  pendingOrders: 0,
  confirmedOrders: 0,
  paidOrders: 0,
  totalProducts: 0,
  publishedProducts: 0,
  totalStock: 0,
  lowStockItems: 0,
  totalCustomers: 0,
  customersWithOrders: 0,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [recentOrders, setRecentOrders] = useState<Array<{ id: string; customerName: string; total: number; confirmed?: boolean; paid?: boolean; status?: string }>>([]);
  const [lowItems, setLowItems] = useState<Array<{ id: string | number; name: string; stock: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const headers: HeadersInit = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const [ordersRes, productsRes, customersRes, stockRes, lowRes] = await Promise.all([
        fetch("/api/orders", { credentials: "include", headers }),
        fetch("/api/products", { credentials: "include", headers }),
        fetch("/api/customers", { credentials: "include", headers }),
        fetch("/api/stock/overview", { credentials: "include", headers }),
        fetch("/api/stock/products?filter=low", { credentials: "include", headers }),
      ]);

      if (!ordersRes.ok && !productsRes.ok) {
        throw new Error("stats");
      }

      const orders = ordersRes.ok ? await ordersRes.json() : [];
      const products = productsRes.ok ? await productsRes.json() : [];
      const customers = customersRes.ok ? await customersRes.json() : [];
      const stockOverview = stockRes.ok ? await stockRes.json() : { totalStock: 0, lowStockCount: 0 };
      const low = lowRes.ok ? await lowRes.json() : [];

      setRecentOrders(Array.isArray(orders) ? orders.slice(0, 5) : []);
      setLowItems(Array.isArray(low) ? low.slice(0, 6) : []);

      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter((order: { confirmed?: boolean; paid?: boolean }) => !order.confirmed && !order.paid).length,
        confirmedOrders: orders.filter((order: { confirmed?: boolean; paid?: boolean }) => order.confirmed && !order.paid).length,
        paidOrders: orders.filter((order: { paid?: boolean }) => order.paid).length,
        totalProducts: products.length,
        publishedProducts: products.filter((product: { isPublished?: boolean; is_published?: boolean }) => product.isPublished || product.is_published).length,
        totalStock: stockOverview.totalStock || products.reduce((sum: number, product: { stock?: number }) => sum + (product.stock || 0), 0),
        lowStockItems: stockOverview.lowStockCount || products.filter((product: { stock?: number }) => (product.stock || 0) < 10).length,
        totalCustomers: customers.length,
        customersWithOrders: customers.filter((customer: { orderCount?: number }) => (customer.orderCount || 0) > 0).length,
      });
    } catch {
      setError("The latest numbers could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  const groups = [
    {
      title: "Orders",
      icon: ShoppingCart,
      items: [
        { label: "All orders", value: stats.totalOrders, href: "/admin/orders" },
        { label: "Waiting", value: stats.pendingOrders, href: "/admin/orders?filter=pending" },
        { label: "Confirmed", value: stats.confirmedOrders, href: "/admin/orders?filter=confirmed" },
        { label: "Paid", value: stats.paidOrders, href: "/admin/orders?filter=paid" },
      ],
    },
    {
      title: "Catalog",
      icon: Package,
      items: [
        { label: "Products", value: stats.totalProducts, href: "/admin/products" },
        { label: "Published", value: stats.publishedProducts, href: "/admin/products?filter=published" },
        { label: "Pieces in stock", value: stats.totalStock, href: "/admin/stock" },
        { label: "Low stock", value: stats.lowStockItems, href: "/admin/stock?filter=low", warn: stats.lowStockItems > 0 },
      ],
    },
    {
      title: "Customers",
      icon: Users,
      items: [
        { label: "People", value: stats.totalCustomers, href: "/admin/customers" },
        { label: "With an order", value: stats.customersWithOrders, href: "/admin/customers?filter=ordered" },
      ],
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-carmine">Today</p>
          <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/products/new" className="bg-carmine px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-ivory hover:bg-ink">
            Add product
          </Link>
          <Link href="/admin/categories" className="border border-ink/15 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-ink hover:border-carmine hover:text-carmine">
            Categories
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-center justify-between gap-4 border border-carmine/30 bg-white px-4 py-3 text-sm text-carmine">
          <span className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </span>
          <button type="button" onClick={loadStats} className="underline">
            Retry
          </button>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {groups.map((group) => {
          const Icon = group.icon;
          return (
            <section key={group.title} className="border border-ink/10 bg-white">
              <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
                <Icon className="h-4 w-4 text-carmine" />
                <h2 className="font-display text-2xl">{group.title}</h2>
              </div>
              <div className={group.items.length > 2 ? "grid grid-cols-2" : "grid grid-cols-2"}>
                {group.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="border-b border-r border-ink/10 px-5 py-4 transition-colors hover:bg-mist"
                  >
                    <p className="text-[11px] uppercase tracking-[0.16em] text-ink/50">{item.label}</p>
                    <p className={`mt-2 font-display text-4xl ${item.warn ? "text-carmine" : "text-ink"}`}>
                      {loading ? "—" : item.value}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="border border-ink/10 bg-white">
          <h2 className="border-b border-ink/10 px-5 py-4 font-display text-2xl">Latest orders</h2>
          <ul className="divide-y divide-ink/10">
            {recentOrders.length === 0 && <li className="px-5 py-4 text-sm text-ink/60">No orders yet.</li>}
            {recentOrders.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-ink/60">
                    {new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" }).format(order.total || 0)} · {order.status || "pending"}
                  </p>
                </div>
                {!order.confirmed ? (
                  <button
                    type="button"
                    onClick={async () => {
                      const token = localStorage.getItem("authToken");
                      const response = await fetch(`/api/orders/${order.id}/confirm`, {
                        method: "PATCH",
                        credentials: "include",
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                      });
                      if (response.ok) loadStats();
                    }}
                    className="bg-carmine px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-ivory"
                  >
                    Confirm
                  </button>
                ) : (
                  <Link href="/admin/orders" className="text-sm text-carmine">Open</Link>
                )}
              </li>
            ))}
          </ul>
        </section>
        <section className="border border-ink/10 bg-white">
          <h2 className="border-b border-ink/10 px-5 py-4 font-display text-2xl">Low stock</h2>
          <ul className="divide-y divide-ink/10">
            {lowItems.length === 0 && <li className="px-5 py-4 text-sm text-ink/60">Every piece is above the threshold.</li>}
            {lowItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between px-5 py-4">
                <p>{item.name}</p>
                <p className="text-carmine">{item.stock} left</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 border border-ink/10 bg-white">
        <h2 className="border-b border-ink/10 px-5 py-4 font-display text-2xl">Open a list</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Orders waiting", "/admin/orders?filter=pending"],
            ["Published products", "/admin/products?filter=published"],
            ["Low stock", "/admin/stock?filter=low"],
            ["Customers with orders", "/admin/customers?filter=ordered"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="border-b border-ink/10 px-5 py-4 text-sm hover:bg-mist sm:border-r">
              {label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
