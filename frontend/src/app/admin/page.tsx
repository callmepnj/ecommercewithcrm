"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/services/adminService";
import { formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import type { DashboardStats } from "@/types";
import Link from "next/link";
import {
  IndianRupee,
  ShoppingCart,
  Package,
  Users,
  Clock,
  ArrowRight,
  Tags,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const language = useAuthStore((s) => s.language);
  const isHi = language === "HI";

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.getDashboardStats();
        setStats(data);
      } catch {
        // silent
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading || !stats) {
    return (
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-800 mb-8">
          {isHi ? "डैशबोर्ड" : "Dashboard"}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-cream-200 p-8 animate-pulse">
              <div className="h-12 bg-cream-200 rounded-xl w-1/2 mb-4" />
              <div className="h-10 bg-cream-200 rounded-xl w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: isHi ? "कुल कमाई" : "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: IndianRupee,
      color: "text-green-600",
      bg: "bg-green-50 border-green-200",
    },
    {
      label: isHi ? "कुल ऑर्डर" : "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
    },
    {
      label: isHi ? "कुल प्रोडक्ट" : "Total Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50 border-purple-200",
    },
    {
      label: isHi ? "कुल ग्राहक" : "Total Customers",
      value: stats.totalUsers.toString(),
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50 border-orange-200",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-800">
          {isHi ? "डैशबोर्ड" : "Dashboard"}
        </h1>
        <span className="text-lg text-gray-500 font-medium">
          {isHi ? "नमस्ते" : "Welcome"} 👋
        </span>
      </div>

      {/* Stats cards — large, clear */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-2xl border-2 p-6 ${card.bg}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-600">{card.label}</span>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm ${card.color}`}>
                <card.icon size={28} />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link
          href="/admin/products"
          className="flex items-center justify-between bg-white rounded-2xl border-2 border-cream-200 p-6 hover:border-gold-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <Package size={28} className="text-maroon-500" />
            <span className="text-xl font-semibold text-gray-700">
              {isHi ? "प्रोडक्ट देखें" : "Manage Products"}
            </span>
          </div>
          <ArrowRight size={24} className="text-gray-400 group-hover:text-gold-500 transition-colors" />
        </Link>
        <Link
          href="/admin/orders"
          className="flex items-center justify-between bg-white rounded-2xl border-2 border-cream-200 p-6 hover:border-gold-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <ShoppingCart size={28} className="text-blue-500" />
            <span className="text-xl font-semibold text-gray-700">
              {isHi ? "ऑर्डर देखें" : "Manage Orders"}
            </span>
          </div>
          <ArrowRight size={24} className="text-gray-400 group-hover:text-gold-500 transition-colors" />
        </Link>
        <Link
          href="/admin/categories"
          className="flex items-center justify-between bg-white rounded-2xl border-2 border-cream-200 p-6 hover:border-gold-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <Tags size={28} className="text-purple-500" />
            <span className="text-xl font-semibold text-gray-700">
              {isHi ? "कैटेगरी देखें" : "Manage Categories"}
            </span>
          </div>
          <ArrowRight size={24} className="text-gray-400 group-hover:text-gold-500 transition-colors" />
        </Link>
      </div>

      {/* Recent Orders */}
      {stats.recentOrders && stats.recentOrders.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-cream-200 p-6">
          <h2 className="text-2xl font-heading font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <Clock size={26} className="text-gold-600" />
            {isHi ? "हाल के ऑर्डर" : "Recent Orders"}
          </h2>
          <div className="space-y-4">
            {stats.recentOrders.map((order: any) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-cream-50 border border-cream-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-maroon-50 flex items-center justify-center">
                    <ShoppingCart size={22} className="text-maroon-500" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{order.orderNumber}</p>
                    <p className="text-base text-gray-500">{order.user?.name || "-"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-maroon-500">{formatPrice(order.total)}</p>
                  <span className="inline-block mt-1 px-4 py-1.5 rounded-full text-sm font-bold bg-gold-50 text-gold-700 border border-gold-200">
                    {order.status?.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
