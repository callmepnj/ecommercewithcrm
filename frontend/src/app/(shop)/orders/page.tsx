"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/stores/authStore";
import { orderApi } from "@/services/orderService";
import { formatPrice, getStatusColor, getStatusLabel } from "@/lib/utils";
import Button from "@/components/ui/Button";
import type { Order } from "@/types";
import { Package, ChevronRight } from "lucide-react";

export default function OrdersPage() {
  const language = useAuthStore((s) => s.language);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await orderApi.getUserOrders(page);
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages);
      } catch {
        // silent
      }
      setLoading(false);
    };
    load();
  }, [isAuthenticated, page]);

  if (!isAuthenticated) {
    return (
      <div className="container-app py-20 text-center">
        <Package size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {language === "EN" ? "Login to view orders" : "ऑर्डर देखने के लिए लॉगिन करें"}
        </h2>
        <Link href="/login">
          <Button variant="primary" size="lg">
            {language === "EN" ? "Login" : "लॉगिन"}
          </Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-app py-8">
        <h1 className="section-title mb-8">
          {language === "EN" ? "My Orders" : "मेरे ऑर्डर"}
        </h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-cream-200 p-6 animate-pulse">
              <div className="h-6 bg-cream-200 rounded w-1/3 mb-4" />
              <div className="h-4 bg-cream-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <Package size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {language === "EN" ? "No orders yet" : "अभी तक कोई ऑर्डर नहीं"}
        </h2>
        <Link href="/">
          <Button variant="primary" size="lg">
            {language === "EN" ? "Start Shopping" : "खरीदारी शुरू करें"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-8 max-w-3xl mx-auto">
      <h1 className="section-title mb-8">
        {language === "EN" ? "My Orders" : "मेरे ऑर्डर"}
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block bg-white rounded-xl border border-cream-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500">{order.orderNumber}</p>
                <p className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                >
                  {getStatusLabel(order.status, language)}
                </span>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {order.items.slice(0, 3).map((item) => {
                  const img = item.product?.images?.[0]?.url || "/placeholder-product.jpg";
                  return (
                    <div
                      key={item.id}
                      className="w-12 h-14 rounded-lg overflow-hidden border-2 border-white relative bg-cream-100"
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="48px" />
                    </div>
                  );
                })}
                {order.items.length > 3 && (
                  <div className="w-12 h-14 rounded-lg bg-cream-200 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-500">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-base text-gray-600">
                  {order.items.length} {language === "EN" ? "items" : "आइटम"}
                </p>
              </div>
              <p className="text-lg font-bold text-maroon-500">
                {formatPrice(order.total)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
            {language === "EN" ? "Previous" : "पिछला"}
          </Button>
          <span className="text-base font-medium text-gray-600 flex items-center">
            {page} / {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            {language === "EN" ? "Next" : "अगला"}
          </Button>
        </div>
      )}
    </div>
  );
}
