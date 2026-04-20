"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SearchModal from "@/components/ui/SearchModal";

const navLinks = [
  { href: "/", label: "ALL", labelHi: "सभी" },
  { href: "/category/kurti", label: "Kurti", labelHi: "कुर्ती" },
  { href: "/category/saree", label: "Saree", labelHi: "साड़ी" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, language, setLanguage } = useAuthStore();
  const cart = useCartStore((s) => s.cart);

  const cartCount = cart?.itemCount || 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 bg-cream-50/95 backdrop-blur-sm border-b border-cream-200 transition-shadow duration-300",
        scrolled ? "shadow-md" : "shadow-sm"
      )}>
        {/* Top bar */}
        <div className="bg-maroon-500 text-white text-center py-1.5 text-sm font-medium">
          {language === "EN"
            ? "✨ Free Shipping on Orders Above ₹999 ✨"
            : "✨ ₹999 से ऊपर के ऑर्डर पर मुफ्त डिलीवरी ✨"}
        </div>

        <div className="container-app">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 -ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-maroon-500 tracking-wide">
                AAINA
                <span className="text-gold-500 ml-1">BOUTIQUE</span>
              </h1>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-gold-600",
                    pathname === link.href
                      ? "text-gold-600 border-b-2 border-gold-500 pb-1"
                      : "text-gray-700"
                  )}
                >
                  {language === "EN" ? link.label : link.labelHi}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Language toggle */}
              <button
                onClick={() => setLanguage(language === "EN" ? "HI" : "EN")}
                className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gold-600 px-2 py-1 rounded-md"
                aria-label="Toggle language"
              >
                <Globe size={18} />
                <span>{language === "EN" ? "हिं" : "EN"}</span>
              </button>

              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-700 hover:text-gold-600 transition-colors"
                aria-label="Search"
              >
                <Search size={24} />
              </button>

              {/* Wishlist */}
              {isAuthenticated && (
                <Link
                  href="/wishlist"
                  className="hidden md:block p-2 text-gray-700 hover:text-gold-600 transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart size={24} />
                </Link>
              )}

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2 text-gray-700 hover:text-gold-600 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-maroon-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <Link
                href={isAuthenticated ? "/profile" : "/login"}
                className="p-2 text-gray-700 hover:text-gold-600 transition-colors"
                aria-label="Profile"
              >
                <User size={24} />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={cn(
          "md:hidden border-t border-cream-200 bg-cream-50 overflow-hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <nav className="container-app py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block py-3 px-4 text-lg font-medium rounded-lg transition-colors",
                    pathname === link.href
                      ? "bg-gold-50 text-gold-600"
                      : "text-gray-700 hover:bg-cream-100"
                  )}
                >
                  {language === "EN" ? link.label : link.labelHi}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 text-lg font-medium text-gray-700 hover:bg-cream-100 rounded-lg"
                >
                  <Heart size={20} className="inline mr-2" />
                  {language === "EN" ? "Wishlist" : "इच्छा सूची"}
                </Link>
              )}
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-lg font-medium text-gray-700 hover:bg-cream-100 rounded-lg"
              >
                {language === "EN" ? "My Orders" : "मेरे ऑर्डर"}
              </Link>
              <button
                onClick={() => {
                  setLanguage(language === "EN" ? "HI" : "EN");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-4 text-lg font-medium text-gray-700 hover:bg-cream-100 rounded-lg"
              >
                <Globe size={20} className="inline mr-2" />
                {language === "EN" ? "हिंदी में देखें" : "View in English"}
              </button>
            </nav>
          </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
