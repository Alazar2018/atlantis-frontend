"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Phone, MapPin, ShoppingCart, DollarSign } from "lucide-react";
import { toast } from "react-toastify";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate?: string;
  hasPaid: boolean;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const searchParams = useSearchParams();
  const requested = searchParams.get("filter");
  const [filter, setFilter] = useState<"all" | "ordered" | "paid">(
    requested === "ordered" || requested === "paid" ? requested : "all"
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadCustomers();
  }, [filter]);

  const loadCustomers = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      let url = "/api/customers";
      if (filter !== "all") {
        url += `?filter=${filter}`;
      }
      const response = await fetch(url, {
        credentials: "include",
        headers,
      });
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      } else {
        toast.error("Failed to load customers");
      }
    } catch (error) {
      console.error("Error loading customers:", error);
      toast.error("Failed to load customers");
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const haystack = `${customer.name} ${customer.email} ${customer.phone || ""}`.toLowerCase();
    if (query && !haystack.includes(query.toLowerCase())) return false;
    if (filter === "ordered") return customer.orderCount > 0;
    if (filter === "paid") return customer.hasPaid;
    return true;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Customers</h1>
        <p className="text-sm md:text-base text-gray-600">Manage your customer database</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-3 md:p-4 border border-gray-200">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, email, or phone"
          className="mb-3 w-full border border-ink/15 px-3 py-2 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          {(["all", "ordered", "paid"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-all capitalize ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f} ({f === "all" ? customers.length : filteredCustomers.length})
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Contact</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Total Spent</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden xl:table-cell">Last Order</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-4">
                      <div className="text-xs md:text-sm">
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-gray-500 text-xs">{customer.email}</div>
                        <div className="lg:hidden mt-1 text-xs text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 hidden lg:table-cell">
                      <div className="text-xs md:text-sm space-y-1">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-start space-x-2 text-gray-600">
                          <MapPin className="h-4 w-4 mt-0.5" />
                          <span className="text-xs">{customer.address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="h-4 w-4 text-gray-400" />
                        <span className="text-xs md:text-sm font-medium text-gray-900">{customer.orderCount}</span>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900 hidden md:table-cell">
                      {formatPrice(customer.totalSpent)}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden xl:table-cell">
                      {formatDate(customer.lastOrderDate)}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      {customer.hasPaid ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid Customer
                        </span>
                      ) : customer.orderCount > 0 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Has Orders
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Lead
                        </span>
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

