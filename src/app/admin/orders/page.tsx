"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Eye, DollarSign, Truck, Download } from "lucide-react";
import { toast } from "react-toastify";
import Dialog from "@/components/Dialog";
import Link from "next/link";
import { downloadCsv } from "@/lib/csv";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  total: number;
  status: "pending" | "confirmed" | "paid" | "shipped";
  confirmed: boolean;
  paid: boolean;
  shipped?: boolean;
  createdAt: string;
  notes?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const searchParams = useSearchParams();
  const requested = searchParams.get("filter");
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "paid" | "shipped">(
    requested === "pending" || requested === "confirmed" || requested === "paid" || requested === "shipped" ? requested : "all"
  );
  const [query, setQuery] = useState("");
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch("/api/orders", {
        credentials: "include",
        headers,
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    }
  };

  const handleConfirm = async (orderId: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`/api/orders/${orderId}/confirm`, {
        method: "PATCH",
        credentials: "include",
        headers,
      });
      if (response.ok) {
        toast.success("Order confirmed. Stock reserved.");
        loadOrders(); // Reload orders
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to confirm order");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      toast.error("Failed to confirm order");
    }
  };

  const handleMarkPaid = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    if (!order.confirmed) {
      toast.error("Please confirm the order first before marking as paid");
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`/api/orders/${orderId}/paid`, {
        method: "PATCH",
        credentials: "include",
        headers,
      });
      if (response.ok) {
        toast.success("Order marked as paid. Stock decreased.");
        loadOrders(); // Reload orders
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to mark order as paid");
      }
    } catch (error) {
      console.error("Error marking order as paid:", error);
      toast.error("Failed to mark order as paid");
    }
  };

  const handleShip = async (orderId: string) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`/api/orders/${orderId}/ship`, {
      method: "PATCH",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (response.ok) {
      toast.success("Marked as handed over");
      loadOrders();
    } else {
      const data = await response.json();
      toast.error(data.error || "Could not mark the order as handed over");
    }
  };

  const saveNote = async (orderId: string) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`/api/orders/${orderId}/notes`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ notes: noteDraft }),
    });
    if (response.ok) {
      toast.success("Note saved");
      setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, notes: noteDraft } : order)));
    } else {
      toast.error("Could not save the note");
    }
  };

  const matchesQuery = (order: Order) => {
    const haystack = `${order.customerName} ${order.customerEmail} ${order.id}`.toLowerCase();
    return !query || haystack.includes(query.toLowerCase());
  };

  const matchesFilter = (order: Order, filterType: typeof filter) => {
    if (filterType === "pending") return !order.confirmed && !order.paid && !order.shipped;
    if (filterType === "confirmed") return Boolean(order.confirmed) && !order.paid && !order.shipped;
    if (filterType === "paid") return Boolean(order.paid) && !order.shipped;
    if (filterType === "shipped") return Boolean(order.shipped);
    return true;
  };

  const filteredOrders = orders.filter((order) => matchesQuery(order) && matchesFilter(order, filter));

  const getFilterCount = (filterType: typeof filter) => orders.filter((order) => matchesFilter(order, filterType)).length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Orders</h1>
          <p className="text-sm md:text-base text-gray-600">Manage customer orders</p>
        </div>
        <button
          type="button"
          onClick={() =>
            downloadCsv("orders.csv", [
              ["Order", "Customer", "Email", "Total", "Status", "Notes"],
              ...filteredOrders.map((order) => [order.id, order.customerName, order.customerEmail, order.total, order.status, order.notes || ""]),
            ])
          }
          className="inline-flex items-center gap-2 border border-ink/15 px-3 py-2 text-sm"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-3 md:p-4 border border-gray-200">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, email, or order"
          className="mb-3 w-full border border-ink/15 px-3 py-2 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "confirmed", "paid", "shipped"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-all capitalize ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f} ({getFilterCount(f)})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Items</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Date</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                      #{order.id.slice(-8)}
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <div className="text-xs md:text-sm">
                        <div className="font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-gray-500 text-xs">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 text-xs md:text-sm text-gray-500 hidden sm:table-cell">
                      {order.items.length} item(s)
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                        order.paid
                          ? "bg-green-100 text-green-800"
                          : order.confirmed
                          ? "bg-orange-100 text-orange-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden lg:table-cell">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setNoteDraft(order.notes || "");
                            setShowDialog(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {!order.confirmed && (
                          <button
                            onClick={() => handleConfirm(order.id)}
                            className="text-orange-600 hover:text-orange-800"
                            title="Confirm Order"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        )}
                        {order.confirmed && !order.paid && (
                          <button
                            onClick={() => handleMarkPaid(order.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Mark as Paid"
                          >
                            <DollarSign className="h-5 w-5" />
                          </button>
                        )}
                        {order.confirmed && !order.shipped && (
                          <button
                            onClick={() => handleShip(order.id)}
                            className="text-ink hover:text-carmine"
                            title="Mark as handed over"
                          >
                            <Truck className="h-5 w-5" />
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

      {/* Order Detail Dialog */}
      <Dialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        title={`Order #${selectedOrder?.id.slice(-8)}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                <p><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</p>
                <p><span className="font-medium">Phone:</span> {selectedOrder.customerPhone}</p>
                <p><span className="font-medium">Address:</span> {selectedOrder.customerAddress}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                      {item.color && <p className="text-sm text-gray-600">Color: {item.color}</p>}
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-primary">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <textarea
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
                rows={4}
                className="w-full border border-ink/15 p-3 text-sm"
              />
              <button
                type="button"
                onClick={() => saveNote(selectedOrder.id)}
                className="mt-2 border border-ink px-3 py-2 text-sm"
              >
                Save note
              </button>
            </div>

            <div className="flex gap-4">
              {!selectedOrder.confirmed && (
                <button
                  onClick={() => {
                    handleConfirm(selectedOrder.id);
                    setShowDialog(false);
                  }}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all"
                >
                  Confirm Order
                </button>
              )}
              {selectedOrder.confirmed && !selectedOrder.paid && (
                <button
                  onClick={() => {
                    handleMarkPaid(selectedOrder.id);
                    setShowDialog(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all"
                >
                  Mark as Paid
                </button>
              )}
              {selectedOrder.confirmed && !selectedOrder.shipped && (
                <button
                  onClick={() => {
                    handleShip(selectedOrder.id);
                    setShowDialog(false);
                  }}
                  className="flex-1 px-4 py-2 bg-ink text-ivory font-semibold rounded-lg"
                >
                  Handed over
                </button>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

