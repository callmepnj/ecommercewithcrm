"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function WishlistPage() {
  const language = useAuthStore((s) => s.language);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { wishlist, isLoading, fetchWishlist, removeItem } = useWishlistStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) fetchWishlist();
  }, [isAuthenticated, fetchWishlist]);

  if (!isAuthenticated) {
    return (
      <div className="container-app py-20 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cream-100 flex items-center justify-center animate-float">
          <Heart size={48} className="text-maroon-400" />
        </div>
        <h2 className="text-2xl font-heading font-semibold text-gray-700 mb-3">
          {language === "EN" ? "Please login to view wishlist" : "पसंदीदा देखने के लिए लॉगिन करें"}
        </h2>
        <p className="text-gray-400 mb-6">
          {language === "EN" ? "Save your favorite items for later" : "अपनी पसंदीदा आइटम बाद के लिए सहेजें"}
        </p>
        <Link href="/login">
          <Button variant="primary" size="lg">
            {language === "EN" ? "Login" : "लॉगिन"}
          </Button>
        </Link>
      </div>
    );
  }

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cream-100 flex items-center justify-center animate-float">
          <Heart size={48} className="text-maroon-400" />
        </div>
        <h2 className="text-2xl font-heading font-semibold text-gray-700 mb-3">
          {language === "EN" ? "Your wishlist is empty" : "आपकी पसंदीदा सूची खाली है"}
        </h2>
        <p className="text-gray-400 mb-6">
          {language === "EN" ? "Start adding items you love" : "अपनी पसंद की चीज़ें जोड़ना शुरू करें"}
        </p>
        <Link href="/">
          <Button variant="primary" size="lg">
            {language === "EN" ? "Browse Products" : "उत्पाद देखें"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <h1 className="section-title mb-8">
        {language === "EN" ? "My Wishlist" : "मेरी पसंदीदा सूची"}
        <span className="text-lg font-normal text-gray-500 ml-3">
          ({wishlist.items.length} {language === "EN" ? "items" : "आइटम"})
        </span>
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.items.map((item) => {
          const img = item.product.images?.[0]?.url || "/placeholder-product.jpg";
          const price = item.product.salePrice || item.product.price;

          return (
            <div key={item.id} className="card-product group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <Link href={`/product/${item.product.slug}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-cream-100">
                  <Image
                    src={img}
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-500/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/product/${item.product.slug}`}>
                  <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-1">
                    {language === "EN" ? item.product.name : item.product.nameHi || item.product.name}
                  </h3>
                </Link>
                <p className="text-lg font-bold text-maroon-500 mb-3">
                  {formatPrice(price)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1 text-sm"
                    onClick={async () => {
                      await addToCart(item.productId, 1, item.product.sizes?.[0]);
                    }}
                    disabled={item.product.stock === 0}
                  >
                    <ShoppingCart size={16} className="mr-1" />
                    {language === "EN" ? "Add" : "जोड़ें"}
                  </Button>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
