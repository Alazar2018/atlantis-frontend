"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Image as ImageIcon, Copy } from "lucide-react";
import { toast } from "react-toastify";
import { useStaffRole } from "@/components/StaffRole";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  introImage: string;
  images: string[];
  isPublished: boolean;
  isFeatured: boolean;
  description: string;
}

export default function ProductsPage() {
  const role = useStaffRole();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const requested = searchParams.get("filter");
  const [filter, setFilter] = useState<"all" | "published" | "unpublished" | "featured">(
    requested === "published" || requested === "unpublished" || requested === "featured" ? requested : "all"
  );

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch("/api/products", {
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

  const deleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        const headers: HeadersInit = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers,
        });
        if (response.ok) {
          toast.success("Product deleted successfully");
          loadProducts(); // Reload products
        } else {
          const data = await response.json();
          toast.error(data.error || "Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const togglePublished = async (id: string) => {
    const product = products.find((p) => p.id === id || p.id.toString() === id);
    if (!product) return;

    const currentStatus = product.isPublished || product.is_published || false;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`/api/products/${id}/publish`, {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({ is_published: !currentStatus }),
      });
      if (response.ok) {
        toast.success("Product status updated");
        loadProducts(); // Reload products
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update product status");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Failed to update product status");
    }
  };

  const toggleFeatured = async (id: string) => {
    const product = products.find((p) => p.id === id || p.id.toString() === id);
    if (!product) return;

    const currentStatus = product.isFeatured || product.is_featured || false;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`/api/products/${id}/feature`, {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({ is_featured: !currentStatus }),
      });
      if (response.ok) {
        toast.success("Featured status updated");
        loadProducts(); // Reload products
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update featured status");
      }
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  const duplicateProduct = async (id: string) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`/api/products/${id}/duplicate`, {
      method: "POST",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (response.ok) {
      toast.success("Unpublished copy created");
      loadProducts();
    } else {
      toast.error("Could not duplicate the product");
    }
  };

  const filteredProducts = products.filter((product) => {
    const haystack = `${product.name} ${product.category || ""} ${product.description || ""}`.toLowerCase();
    if (query && !haystack.includes(query.toLowerCase())) return false;
    if (filter === "published") return product.isPublished || product.is_published;
    if (filter === "unpublished") return !product.isPublished && !product.is_published;
    if (filter === "featured") return product.isFeatured || product.is_featured;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Products</h1>
          <p className="text-sm md:text-base text-gray-600">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all text-sm md:text-base"
        >
          <Plus className="h-4 w-4 md:h-5 md:w-5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-3 md:p-4 border border-gray-200">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, category, or description"
          className="mb-3 w-full border border-ink/15 px-3 py-2 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "all"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setFilter("published")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "published"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Published ({products.filter((p) => p.isPublished).length})
          </button>
          <button
            onClick={() => setFilter("unpublished")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "unpublished"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Unpublished ({products.filter((p) => !p.isPublished).length})
          </button>
          <button
            onClick={() => setFilter("featured")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "featured"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Featured ({products.filter((p) => p.isFeatured).length})
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Category
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Status
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No products found. <Link href="/admin/products/new" className="text-primary hover:underline">Add your first product</Link>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="relative h-12 w-12 md:h-16 md:w-16 rounded-lg overflow-hidden">
                        {product.introImage ? (
                          <Image
                            src={product.introImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs md:text-sm font-medium text-gray-900">{product.name}</span>
                        {(product.isFeatured || product.is_featured) && (
                          <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="lg:hidden text-xs text-gray-500 mt-1">{product.category || product.category_name}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden lg:table-cell">
                      {product.category || product.category_name}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                      ETB {product.price.toLocaleString()}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs md:text-sm font-medium ${
                        product.stock < 10 ? "text-red-600" : product.stock < 50 ? "text-orange-600" : "text-green-600"
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <button
                        onClick={() => togglePublished(product.id.toString())}
                        className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                          product.isPublished || product.is_published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.isPublished || product.is_published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFeatured(product.id.toString())}
                          className="text-yellow-600 hover:text-yellow-800"
                          title={product.isFeatured || product.is_featured ? "Remove from featured" : "Add to featured"}
                        >
                          <Star className={`h-5 w-5 ${product.isFeatured || product.is_featured ? "fill-yellow-500" : ""}`} />
                        </button>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit product"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => duplicateProduct(product.id.toString())}
                          className="text-ink/70 hover:text-ink"
                          title="Duplicate as a draft"
                        >
                          <Copy className="h-5 w-5" />
                        </button>
                        {role === "admin" && (
                        <button
                          onClick={() => deleteProduct(product.id.toString())}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        )}
                      </div>
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

