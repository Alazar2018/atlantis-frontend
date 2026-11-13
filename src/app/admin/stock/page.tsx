"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Package, TrendingDown, TrendingUp, AlertCircle, Edit, Image as ImageIcon, Download } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import { downloadCsv } from "@/lib/csv";

interface Product {
  id: string;
  name: string;
  category?: string;
  category_name?: string;
  stock: number;
  introImage?: string;
  intro_image?: string;
}

export default function StockManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const searchParams = useSearchParams();
  const requested = searchParams.get("filter");
  const [filter, setFilter] = useState<"all" | "low" | "out">(
    requested === "low" || requested === "out" ? requested : "all"
  );
  const [editingStock, setEditingStock] = useState<{ id: string; value: number } | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadProducts();
    loadStockOverview();
  }, [filter]);

  const loadProducts = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      let url = "/api/stock/products";
      if (filter !== "all") {
        url += `?filter=${filter}`;
      }
      const response = await fetch(url, {
        credentials: "include",
        headers,
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        toast.error("Failed to load products");
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    }
  };

  const loadStockOverview = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch("/api/stock/overview", {
        credentials: "include",
        headers,
      });
      if (response.ok) {
        const data = await response.json();
        setTotalStock(data.totalStock || 0);
        setLowStockCount(data.lowStockCount || 0);
        setOutOfStockCount(data.outOfStockCount || 0);
      }
    } catch (error) {
      console.error("Error loading stock overview:", error);
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    if (newStock < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`/api/stock/products/${id}`, {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({ stock: newStock }),
      });
      if (response.ok) {
        toast.success("Stock updated successfully");
        setEditingStock(null);
        loadProducts(); // Reload products
        loadStockOverview(); // Reload stats
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock");
    }
  };

  const [totalStock, setTotalStock] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);

  const filteredProducts = products.filter((product) => {
    const haystack = `${product.name} ${product.category || product.category_name || ""}`.toLowerCase();
    if (query && !haystack.includes(query.toLowerCase())) return false;
    if (filter === "low") return product.stock < 10 && product.stock > 0;
    if (filter === "out") return product.stock === 0;
    return true;
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Stock Management</h1>
          <p className="text-sm md:text-base text-gray-600">Monitor and manage product inventory</p>
        </div>
        <button
          type="button"
          onClick={() =>
            downloadCsv(
              filter === "low" ? "low-stock.csv" : "stock.csv",
              [["Product", "Category", "Stock"], ...filteredProducts.map((product) => [product.name, product.category || product.category_name || "", product.stock])]
            )
          }
          className="inline-flex items-center gap-2 border border-ink/15 px-3 py-2 text-sm"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Stock</p>
              <p className="text-3xl font-bold text-secondary">{totalStock}</p>
            </div>
            <Package className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
              <p className="text-3xl font-bold text-orange-600">{lowStockCount}</p>
            </div>
            <AlertCircle className="h-12 w-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
            </div>
            <TrendingDown className="h-12 w-12 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-3 md:p-4 border border-gray-200">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search product or category"
          className="mb-3 w-full border border-ink/15 px-3 py-2 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          {(["all", "low", "out"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-all capitalize ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f === "all" ? "All Products" : f === "low" ? "Low Stock" : "Out of Stock"} (
              {f === "all"
                ? products.length
                : f === "low"
                ? lowStockCount
                : outOfStockCount}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          {(product.introImage || product.intro_image) ? (
                            <Image
                              src={product.introImage || product.intro_image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category || product.category_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingStock?.id === product.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={editingStock.value}
                            onChange={(e) =>
                              setEditingStock({ ...editingStock, value: parseInt(e.target.value) || 0 })
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                updateStock(editingStock.id, editingStock.value);
                              } else if (e.key === 'Escape') {
                                setEditingStock(null);
                              }
                            }}
                            className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            autoFocus
                            min="0"
                          />
                        </div>
                      ) : (
                        <span
                          className={`text-sm font-medium ${
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock < 10
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.stock}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.stock === 0
                            ? "bg-red-100 text-red-800"
                            : product.stock < 10
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.stock === 0
                          ? "Out of Stock"
                          : product.stock < 10
                          ? "Low Stock"
                          : "In Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingStock?.id === product.id ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateStock(editingStock.id, editingStock.value)
                            }
                            className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-all flex items-center space-x-1"
                            title="Save stock"
                          >
                            <TrendingUp className="h-4 w-4" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => setEditingStock(null)}
                            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setEditingStock({ id: product.id, value: product.stock })
                          }
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                          title="Edit stock"
                        >
                          <Edit className="h-5 w-5" />
                          <span className="text-sm">Edit</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

