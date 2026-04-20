"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/services/adminService";
import { formatPrice, getStatusColor, getStatusLabel } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/ui/Button";
import type { Order } from "@/types";
import {
  Package,
  ChevronLeft,
  ChevronRight,
  Phone,
  Calendar,
  IndianRupee,
  Truck,
  Eye,
  X,
} from "lucide-react";

const statusOptions = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const statusHi: Record<string, string> = {
  PENDING: "लंबित",
  CONFIRMED: "पुष्टि",
  PROCESSING: "तैयार हो रहा",
  SHIPPED: "भेज दिया",
  OUT_FOR_DELIVERY: "रास्ते में",
  DELIVERED: "पहुँच गया ✅",
  CANCELLED: "रद्द ❌",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const language = useAuthStore((s) => s.language);
  const isHi = language === "HI";

  useEffect(() => {
    loadOrders();
  }, [page, filterStatus]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllOrders(page, filterStatus || undefined);
      setOrders(data.orders);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      // silent
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      showToast(
        isHi
          ? `स्टेटस बदल गया: ${statusHi[newStatus] || newStatus}`
          : `Status updated to ${newStatus.replace(/_/g, " ")}`
      );
      loadOrders();
    } catch {
      showToast(isHi ? "स्टेटस बदलने में गलती" : "Failed to update status", "error");
    }
  };

  const getStatusBorder = (status: string) => {
    const borders: Record<string, string> = {
      PENDING: "border-l-yellow-400",
      CONFIRMED: "border-l-blue-400",
      PROCESSING: "border-l-indigo-400",
      SHIPPED: "border-l-purple-400",
      OUT_FOR_DELIVERY: "border-l-orange-400",
      DELIVERED: "border-l-green-400",
      CANCELLED: "border-l-red-400",
    };
    return borders[status] || "border-l-gray-400";
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-lg text-lg font-semibold ${
            toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-800">
          📦 {isHi ? "ऑर्डर" : "Orders"}
        </h1>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="border-2 border-cream-200 rounded-xl px-5 py-4 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold-400 min-w-[200px]"
        >
          <option value="">{isHi ? "सभी ऑर्डर" : "All Orders"}</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {isHi ? statusHi[s] || s : s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* ───── ORDER CARDS ───── */}
      <div className="space-y-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border-2 border-cream-200 p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-6 bg-cream-200 rounded w-1/3" />
                  <div className="h-5 bg-cream-200 rounded w-1/2" />
                  <div className="h-8 bg-cream-200 rounded w-1/4" />
                </div>
              </div>
            ))
          : orders.map((order) => (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border-2 border-cream-200 border-l-4 ${getStatusBorder(
                  order.status
                )} p-5 sm:p-6 hover:shadow-md transition-all`}
              >
                {/* Top row */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Package size={22} className="text-gray-400" />
                    <span className="text-xl font-bold text-gray-800">#{order.orderNumber}</span>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-xl text-base font-bold ${getStatusColor(order.status)}`}
                  >
                    {isHi ? statusHi[order.status] || order.status : getStatusLabel(order.status)}
                  </span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Phone size={18} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-800">{order.user?.name || "-"}</p>
                      <p className="text-sm text-gray-500">{order.user?.phone || ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                      <IndianRupee size={18} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-maroon-500">{formatPrice(order.total)}</p>
                      <p className="text-sm text-gray-500">
                        {order.items?.length || 0} {isHi ? "आइटम" : "items"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                      <Truck size={18} className="text-purple-500" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-700">{order.paymentMethod}</p>
                      <p className={`text-sm font-medium ${order.paymentStatus === "PAID" ? "text-green-600" : "text-orange-500"}`}>
                        {order.paymentStatus}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                      <Calendar size={18} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status change + view details */}
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-cream-200">
                  <label className="text-base font-semibold text-gray-600">
                    {isHi ? "स्टेटस बदलें:" : "Change Status:"}
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className="border-2 border-cream-200 rounded-xl px-4 py-3 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold-400 font-semibold min-w-[180px]"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {isHi ? statusHi[s] || s : s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="ml-auto flex items-center gap-2 px-5 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-base font-semibold border border-blue-200"
                  >
                    <Eye size={20} />
                    {isHi ? "विवरण देखें" : "View Details"}
                  </button>
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="w-14 h-14 flex items-center justify-center rounded-xl bg-white border-2 border-cream-200 hover:border-gold-400 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <span className="text-xl font-bold text-gray-600 px-4">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="w-14 h-14 flex items-center justify-center rounded-xl bg-white border-2 border-cream-200 hover:border-gold-400 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      {/* ───── ORDER DETAIL MODAL ───── */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-8 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-gray-800">
                {isHi ? "ऑर्डर विवरण" : "Order Details"} — #{selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-cream-100 hover:bg-cream-200 transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5 mb-5 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                👤 {isHi ? "ग्राहक" : "Customer"}
              </h3>
              <p className="text-lg font-semibold">{selectedOrder.user?.name || "-"}</p>
              <p className="text-base text-gray-600">{selectedOrder.user?.phone || ""}</p>
              <p className="text-base text-gray-600">{selectedOrder.user?.email || ""}</p>
            </div>

            {selectedOrder.address && (
              <div className="bg-green-50 rounded-2xl p-5 mb-5 border border-green-200">
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  📍 {isHi ? "पता" : "Shipping Address"}
                </h3>
                <p className="text-base text-gray-700">
                  {selectedOrder.address.addressLine}, {selectedOrder.address.city}
                </p>
                <p className="text-base text-gray-700">
                  {selectedOrder.address.state} — {selectedOrder.address.pincode}
                </p>
              </div>
            )}

            <div className="mb-5">
              <h3 className="text-lg font-bold text-gray-700 mb-3">
                📋 {isHi ? "आइटम" : "Items"}
              </h3>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-cream-50 rounded-xl px-5 py-4 border border-cream-200"
                  >
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {item.product?.name || "Product"}
                      </p>
                      <p className="text-base text-gray-500">
                        {isHi ? "मात्रा" : "Qty"}: {item.quantity}
                        {item.size ? ` · ${isHi ? "साइज़" : "Size"}: ${item.size}` : ""}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-maroon-500">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between bg-maroon-50 rounded-2xl px-6 py-5 border border-maroon-200">
              <span className="text-xl font-bold text-gray-700">
                {isHi ? "कुल रक़म" : "Total"}
              </span>
              <span className="text-3xl font-bold text-maroon-500">
                {formatPrice(selectedOrder.total)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
