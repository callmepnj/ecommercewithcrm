"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const language = useAuthStore((s) => s.language);
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const wishlisted = isInWishlist(product.id);

  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const imageUrl = primaryImage?.url || "/placeholder-product.jpg";
  const discount = product.salePrice
    ? getDiscountPercent(product.price, product.salePrice)
    : 0;

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    if (wishlisted) {
      await removeItem(product.id);
    } else {
      await addItem(product.id);
    }
  };

  return (
    <Link href={`/product/${product.slug}`} className="card-product group block hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-100">
        <Image
          src={imageUrl}
          alt={language === "EN" ? product.name : product.nameHi || product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-500/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick view text on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white/90 backdrop-blur-sm text-maroon-500 font-semibold px-5 py-2 rounded-full text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {language === "EN" ? "Quick View" : "जल्दी देखें"}
          </span>
        </div>

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-maroon-500 text-white text-sm font-bold px-2.5 py-1 rounded-md">
            -{discount}%
          </span>
        )}

        {/* Wishlist button */}
        {isAuthenticated && (
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={20}
              className={wishlisted ? "fill-maroon-500 text-maroon-500" : "text-gray-500"}
            />
          </button>
        )}

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-semibold px-4 py-2 rounded-lg text-lg">
              {language === "EN" ? "Out of Stock" : "स्टॉक में नहीं"}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-sm text-gold-600 font-medium mb-1">
          {product.category?.name}
        </p>
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 leading-snug mb-2">
          {language === "EN"
            ? product.name
            : product.nameHi || product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-maroon-500">
            {formatPrice(product.salePrice || product.price)}
          </span>
          {product.salePrice && (
            <span className="text-base text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
