"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const language = useAuthStore((s) => s.language);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { cart, isLoading, fetchCart, updateQuantity, removeItem } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  if (!isAuthenticated) {
    return (
      <div className="container-app py-20 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cream-100 flex items-center justify-center animate-float">
          <ShoppingBag size={48} className="text-gold-400" />
        </div>
        <h2 className="text-2xl font-heading font-semibold text-gray-700 mb-3">
          {language === "EN" ? "Please login to view your cart" : "कार्ट देखने के लिए लॉगिन करें"}
        </h2>
        <p className="text-gray-400 mb-6">
          {language === "EN" ? "Sign in to add items and checkout" : "आइटम जोड़ने और चेकआउट करने के लिए साइन इन करें"}
        </p>
        <Link href="/login">
          <Button variant="primary" size="lg">
            {language === "EN" ? "Login" : "लॉगिन"}
          </Button>
        </Link>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cream-100 flex items-center justify-center animate-float">
          <ShoppingBag size={48} className="text-gold-400" />
        </div>
        <h2 className="text-2xl font-heading font-semibold text-gray-700 mb-3">
          {language === "EN" ? "Your cart is empty" : "आपका कार्ट खाली है"}
        </h2>
        <p className="text-gray-400 mb-6">
          {language === "EN" ? "Looks like you haven't added anything yet" : "लगता है आपने अभी तक कुछ नहीं जोड़ा"}
        </p>
        <Link href="/">
          <Button variant="primary" size="lg">
            {language === "EN" ? "Start Shopping" : "खरीदारी शुरू करें"}
            <ArrowRight size={20} className="ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <h1 className="section-title mb-8">
        {language === "EN" ? "Shopping Cart" : "शॉपिंग कार्ट"}
        <span className="text-lg font-normal text-gray-500 ml-3">
          ({cart.itemCount} {language === "EN" ? "items" : "आइटम"})
        </span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const img = item.product.images?.[0]?.url || "/placeholder-product.jpg";
            const price = item.product.salePrice || item.product.price;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-cream-200 p-4 flex gap-4 hover:shadow-md transition-shadow"
              >
                <Link
                  href={`/product/${item.product.slug}`}
                  className="relative w-24 h-32 md:w-28 md:h-36 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0"
                >
                  <Image
                    src={img}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product.slug}`}>
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 line-clamp-2">
                      {language === "EN"
                        ? item.product.name
                        : item.product.nameHi || item.product.name}
                    </h3>
                  </Link>
                  {item.size && (
                    <p className="text-sm text-gray-500 mt-1">
                      {language === "EN" ? "Size:" : "साइज़:"} {item.size}
                    </p>
                  )}
                  <p className="text-lg font-bold text-maroon-500 mt-2">
                    {formatPrice(price)}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-10 h-10 bg-cream-100 rounded-lg flex items-center justify-center hover:bg-cream-200 transition-colors disabled:opacity-40"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="text-lg font-semibold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= 10}
                        className="w-10 h-10 bg-cream-100 rounded-lg flex items-center justify-center hover:bg-cream-200 transition-colors disabled:opacity-40"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600 p-2 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-cream-200 p-6 sticky top-28 shadow-sm">
            <h3 className="text-xl font-heading font-semibold mb-6 text-maroon-500">
              {language === "EN" ? "Order Summary" : "ऑर्डर सारांश"}
            </h3>

            <div className="space-y-3 text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {language === "EN" ? "Subtotal" : "उप-कुल"}
                </span>
                <span className="font-medium">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {language === "EN" ? "Shipping" : "शिपिंग"}
                </span>
                <span className={cart.shippingCharge === 0 ? "text-green-600 font-medium" : "font-medium"}>
                  {cart.shippingCharge === 0
                    ? language === "EN"
                      ? "FREE"
                      : "मुफ्त"
                    : formatPrice(cart.shippingCharge)}
                </span>
              </div>
              {cart.shippingCharge > 0 && (
                <p className="text-sm text-gold-600">
                  {language === "EN"
                    ? `Add ₹${999 - cart.subtotal} more for free shipping`
                    : `मुफ्त शिपिंग के लिए ₹${999 - cart.subtotal} और जोड़ें`}
                </p>
              )}
              <div className="border-t border-cream-200 pt-3 flex justify-between">
                <span className="text-lg font-semibold">
                  {language === "EN" ? "Total" : "कुल"}
                </span>
                <span className="text-xl font-bold text-maroon-500">
                  {formatPrice(cart.total)}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="block mt-6">
              <Button variant="primary" size="lg" className="w-full">
                {language === "EN" ? "Proceed to Checkout" : "चेकआउट करें"}
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>

            <Link href="/" className="block mt-3">
              <Button variant="ghost" size="md" className="w-full">
                {language === "EN" ? "Continue Shopping" : "खरीदारी जारी रखें"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
