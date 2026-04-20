"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Users,
  ArrowLeft,
  Store,
  Settings,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "";

const navItems = [
  { label: "Dashboard", labelHi: "डैशबोर्ड", href: "/admin", icon: LayoutDashboard },
  { label: "Products", labelHi: "प्रोडक्ट", href: "/admin/products", icon: Package },
  { label: "Orders", labelHi: "ऑर्डर", href: "/admin/orders", icon: ShoppingCart },
  { label: "Categories", labelHi: "कैटेगरी", href: "/admin/categories", icon: Tags },
  { label: "Customers", labelHi: "ग्राहक", href: "/admin/users", icon: Users },
  { label: "Settings", labelHi: "सेटिंग्स", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, language } = useAuthStore();
  const isHi = language === "HI";
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const unlocked = sessionStorage.getItem("admin_pin_ok");
    if (unlocked === "1") setPinUnlocked(true);
  }, []);

  if (!isAuthenticated || user?.role !== "ADMIN") return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem("admin_pin_ok", "1");
      setPinUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin("");
    }
  };

  if (!pinUnlocked) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md text-center border border-cream-200">
          <div className="w-20 h-20 bg-maroon-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-maroon-500 mb-2">
            {isHi ? "एडमिन पैनल" : "Admin Panel"}
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            {isHi ? "कृपया पासवर्ड दर्ज करें" : "Enter password to continue"}
          </p>
          <form onSubmit={handlePinSubmit} className="space-y-5">
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => { setPin(e.target.value); setPinError(false); }}
                placeholder={isHi ? "पासवर्ड" : "Password"}
                className={`w-full text-center text-3xl tracking-[0.5em] py-5 px-6 rounded-2xl border-2 ${
                  pinError ? "border-red-400 bg-red-50" : "border-cream-300 bg-cream-50"
                } focus:outline-none focus:border-gold-500 transition-colors font-mono`}
                autoFocus
                maxLength={6}
                inputMode="numeric"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPin ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
            {pinError && (
              <p className="text-red-500 text-lg font-medium">
                {isHi ? "गलत पासवर्ड!" : "Wrong password!"}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-maroon-500 hover:bg-maroon-600 text-white text-xl font-bold py-5 rounded-2xl transition-colors shadow-lg"
            >
              {isHi ? "अनलॉक करें" : "Unlock"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Sidebar — extra wide, large text for easy reading */}
      <aside className="w-72 bg-white border-r border-cream-200 flex-shrink-0 hidden lg:flex flex-col shadow-sm">
        <div className="p-6 border-b border-cream-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-maroon-500 rounded-2xl flex items-center justify-center shadow-md">
              <Store size={28} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl text-maroon-500">AAINA</h1>
              <p className="text-sm text-gray-500 font-medium">
                {isHi ? "एडमिन पैनल" : "Admin Panel"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const isExactActive = pathname === item.href;
            const active = item.href === "/admin" ? isExactActive : isActive;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 ${
                  active
                    ? "bg-gold-50 text-gold-700 border-2 border-gold-300 shadow-sm"
                    : "text-gray-600 hover:bg-cream-100 hover:text-gray-800 border-2 border-transparent"
                }`}
              >
                <item.icon size={26} strokeWidth={active ? 2.5 : 2} />
                {isHi ? item.labelHi : item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-cream-200">
          <Link
            href="/"
            className="flex items-center gap-3 px-5 py-4 text-base font-medium text-gray-500 hover:text-maroon-500 rounded-2xl hover:bg-cream-100 transition-colors"
          >
            <ArrowLeft size={22} />
            {isHi ? "दुकान पर जाएं" : "Back to Store"}
          </Link>
        </div>
      </aside>

      {/* Mobile bottom nav — large touch targets */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-cream-200 z-50 safe-area-bottom">
        <div className="flex">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const isExactActive = pathname === item.href;
            const active = item.href === "/admin" ? isExactActive : isActive;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center py-3 text-sm font-semibold ${
                  active ? "text-gold-700 bg-gold-50" : "text-gray-500"
                }`}
              >
                <item.icon size={26} />
                <span className="mt-1">{isHi ? item.labelHi : item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">
        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
