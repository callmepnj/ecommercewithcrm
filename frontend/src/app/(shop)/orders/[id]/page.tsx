"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { orderApi } from "@/services/orderService";
import { formatPrice, getStatusColor, getStatusLabel } from "@/lib/utils";
import type { Order } from "@/types";
import { CheckCircle2, Package, MapPin, CreditCard, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

const statusSteps = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const language = useAuthStore((s) => s.language);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const showSuccess = searchParams.get("success") === "true";

  useEffect(() => {
    const load = async () => {
      try {
        const data = await orderApi.getById(params.id as string);
        setOrder(data);
      } catch {
        // silent
      }
      setLoading(false);
    };
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container-app py-8 max-w-3xl mx-auto animate-pulse">
        <div className="h-8 bg-cream-200 rounded w-1/3 mb-6" />
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <div className="h-6 bg-cream-200 rounded w-1/2" />
          <div className="h-20 bg-cream-200 rounded" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-app py-20 text-center">
        <h2 className="text-2xl text-gray-500">
          {language === "EN" ? "Order not found" : "ऑर्डर नहीं मिला"}
        </h2>
      </div>
    );
  }

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="container-app py-8 max-w-3xl mx-auto">
      <Link href="/orders" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-base">
        <ArrowLeft size={18} />
        {language === "EN" ? "Back to Orders" : "ऑर्डर पर वापस जाएं"}
      </Link>

      {/* Success message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 flex items-center gap-4">
          <CheckCircle2 size={32} className="text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-green-800">
              {language === "EN" ? "Order Placed Successfully!" : "ऑर्डर सफलतापूर्वक दिया गया!"}
            </h3>
            <p className="text-green-600">
              {language === "EN"
                ? "Thank you for shopping with AAINA BOUTIQUE"
                : "AAINA BOUTIQUE से खरीदारी के लिए धन्यवाद"}
            </p>
          </div>
        </div>
      )}

      {/* Order Header */}
      <div className="bg-white rounded-xl border border-cream-200 p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{order.orderNumber}</h1>
            <p className="text-gray-500 text-base">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-base font-semibold ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status, language)}
          </span>
        </div>

        {/* Status tracker */}
        {order.status !== "CANCELLED" && order.status !== "RETURNED" && (
          <div className="mt-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-1 bg-cream-200 rounded" />
              <div
                className="absolute top-4 left-0 h-1 bg-gold-500 rounded transition-all duration-500"
                style={{ width: `${Math.max(0, currentStep / (statusSteps.length - 1)) * 100}%` }}
              />
              {statusSteps.map((step, i) => (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i <= currentStep
                        ? "bg-gold-500 text-white"
                        : "bg-cream-200 text-gray-400"
                    }`}
                  >
                    {i <= currentStep ? "✓" : i + 1}
                  </div>
                  <span className="text-xs text-gray-500 mt-2 text-center hidden md:block max-w-[80px]">
                    {getStatusLabel(step, language)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-cream-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package size={20} className="text-gold-600" />
          {language === "EN" ? "Items" : "आइटम"}
        </h2>
        <div className="space-y-4">
          {order.items.map((item) => {
            const img = item.product?.images?.[0]?.url || "/placeholder-product.jpg";
            return (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-20 relative rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
                  <Image src={img} alt={item.product?.name || ""} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-800 truncate">
                    {item.product?.name}
                  </p>
                  {item.size && (
                    <p className="text-sm text-gray-500">
                      {language === "EN" ? "Size:" : "साइज़:"} {item.size}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    {language === "EN" ? "Qty:" : "मात्रा:"} {item.quantity}
                  </p>
                </div>
                <p className="text-base font-bold text-maroon-500">
                  {formatPrice(item.total)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment & Address */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Address */}
        {order.address && (
          <div className="bg-white rounded-xl border border-cream-200 p-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MapPin size={20} className="text-gold-600" />
              {language === "EN" ? "Delivery Address" : "डिलीवरी पता"}
            </h2>
            <p className="font-medium text-base">{order.address.fullName}</p>
            <p className="text-gray-600 text-base">
              {order.address.addressLine}, {order.address.city}, {order.address.state} -{" "}
              {order.address.pincode}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {language === "EN" ? "Phone:" : "फ़ोन:"} {order.address.phone}
            </p>
          </div>
        )}

        {/* Payment */}
        <div className="bg-white rounded-xl border border-cream-200 p-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <CreditCard size={20} className="text-gold-600" />
            {language === "EN" ? "Payment" : "भुगतान"}
          </h2>
          <div className="space-y-2 text-base">
            <div className="flex justify-between">
              <span className="text-gray-600">{language === "EN" ? "Method" : "विधि"}</span>
              <span className="font-medium">
                {order.paymentMethod === "COD"
                  ? language === "EN" ? "Cash on Delivery" : "कैश ऑन डिलीवरी"
                  : language === "EN" ? "Online" : "ऑनलाइन"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{language === "EN" ? "Status" : "स्थिति"}</span>
              <span className={`px-2 py-0.5 rounded text-sm font-medium ${getStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
            </div>
            <div className="border-t border-cream-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-600">{language === "EN" ? "Subtotal" : "उप-कुल"}</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{language === "EN" ? "Shipping" : "शिपिंग"}</span>
                <span>{order.shippingCharge === 0 ? (language === "EN" ? "FREE" : "मुफ्त") : formatPrice(order.shippingCharge)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>{language === "EN" ? "Total" : "कुल"}</span>
                <span className="text-maroon-500">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
