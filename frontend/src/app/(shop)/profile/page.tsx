"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/ui/Button";
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ChevronRight,
  Globe,
  Shield,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, language, setLanguage, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!user) return null;

  const menuItems = [
    {
      icon: Package,
      label: language === "EN" ? "My Orders" : "मेरे ऑर्डर",
      href: "/orders",
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: Heart,
      label: language === "EN" ? "Wishlist" : "पसंदीदा",
      href: "/wishlist",
      color: "text-pink-600 bg-pink-50",
    },
    {
      icon: MapPin,
      label: language === "EN" ? "Addresses" : "पते",
      href: "/addresses",
      color: "text-green-600 bg-green-50",
    },
  ];

  return (
    <div className="container-app py-8 max-w-2xl mx-auto">
      {/* User Info */}
      <div className="bg-white rounded-2xl border border-cream-200 p-8 mb-6 text-center">
        <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={36} className="text-gold-600" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-gray-800">
          {user.name}
        </h1>
        <p className="text-gray-500 text-lg mt-1">{user.phone}</p>
        {user.email && (
          <p className="text-gray-500 text-base">{user.email}</p>
        )}
        {user.role === "ADMIN" && (
          <span className="inline-flex items-center gap-1 mt-2 bg-maroon-50 text-maroon-500 px-3 py-1 rounded-full text-sm font-medium">
            <Shield size={14} /> Admin
          </span>
        )}
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden mb-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 px-6 py-5 hover:bg-cream-50 transition-colors border-b border-cream-100 last:border-0"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
              <item.icon size={22} />
            </div>
            <span className="text-lg font-medium text-gray-700 flex-1">
              {item.label}
            </span>
            <ChevronRight size={20} className="text-gray-400" />
          </Link>
        ))}

        {user.role === "ADMIN" && (
          <Link
            href="/admin"
            className="flex items-center gap-4 px-6 py-5 hover:bg-cream-50 transition-colors border-b border-cream-100"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-maroon-600 bg-maroon-50">
              <Shield size={22} />
            </div>
            <span className="text-lg font-medium text-gray-700 flex-1">
              {language === "EN" ? "Admin Panel" : "एडमिन पैनल"}
            </span>
            <ChevronRight size={20} className="text-gray-400" />
          </Link>
        )}
      </div>

      {/* Language Toggle */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe size={22} className="text-gold-600" />
            <span className="text-lg font-medium text-gray-700">
              {language === "EN" ? "Language" : "भाषा"}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage("EN")}
              className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                language === "EN"
                  ? "bg-gold-500 text-white"
                  : "bg-cream-100 text-gray-600 hover:bg-cream-200"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("HI")}
              className={`px-4 py-2 rounded-lg text-base font-medium font-hindi transition-colors ${
                language === "HI"
                  ? "bg-gold-500 text-white"
                  : "bg-cream-100 text-gray-600 hover:bg-cream-200"
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* Logout */}
      <Button
        variant="outline"
        size="lg"
        className="w-full border-red-200 text-red-500 hover:bg-red-50"
        onClick={handleLogout}
      >
        <LogOut size={20} className="mr-2" />
        {language === "EN" ? "Logout" : "लॉगआउट"}
      </Button>
    </div>
  );
}
