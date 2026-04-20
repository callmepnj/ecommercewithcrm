"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  ShoppingCart,
  Heart,
  Truck,
  RotateCcw,
  Star,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { productApi } from "@/services/productService";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import Button from "@/components/ui/Button";
import type { Product } from "@/types";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const language = useAuthStore((s) => s.language);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { addToCart, isLoading: cartLoading } = useCartStore();
  const { isInWishlist, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productApi.getBySlug(slug);
        setProduct(data);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
      } catch {
        // silent
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product || !isAuthenticated) return;
    try {
      await addToCart(product.id, quantity, selectedSize || undefined);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch {
      // silent
    }
  };

  const wishlisted = product ? isInWishlist(product.id) : false;
  const handleWishlistToggle = async () => {
    if (!product || !isAuthenticated) return;
    wishlisted ? await removeWishlist(product.id) : await addWishlist(product.id);
  };

  if (loading) {
    return (
      <div className="container-app py-8">
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-cream-200 rounded-2xl" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-24 bg-cream-200 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-4 pt-4">
            <div className="h-5 bg-cream-200 rounded w-1/4" />
            <div className="h-10 bg-cream-200 rounded w-3/4" />
            <div className="h-8 bg-cream-200 rounded w-1/3" />
            <div className="h-24 bg-cream-200 rounded" />
            <div className="h-14 bg-cream-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-app py-20 text-center">
        <h2 className="text-2xl text-gray-500">
          {language === "EN" ? "Product not found" : "उत्पाद नहीं मिला"}
        </h2>
      </div>
    );
  }

  const discount = product.salePrice
    ? getDiscountPercent(product.price, product.salePrice)
    : 0;
  const images = product.images?.length ? product.images : [{ url: "/placeholder-product.jpg", altText: product.name, id: "0", isPrimary: true, sortOrder: 0 }];
  const avgRating =
    product.reviews?.length
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <div className="container-app py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-gold-600 transition-colors">
          {language === "EN" ? "Home" : "होम"}
        </a>
        <span>/</span>
        {product.category && (
          <>
            <a href={`/category/${product.category.slug}`} className="hover:text-gold-600 transition-colors">
              {language === "EN" ? product.category.name : product.category.nameHi || product.category.name}
            </a>
            <span>/</span>
          </>
        )}
        <span className="text-gray-800 font-medium truncate">
          {language === "EN" ? product.name : product.nameHi || product.name}
        </span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="sticky top-28 self-start">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-cream-100 mb-4 group">
            <Image
              src={images[selectedImage]?.url}
              alt={product.name}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-maroon-500 text-white font-bold px-3 py-1.5 rounded-lg text-base shadow-lg">
                -{discount}% {language === "EN" ? "OFF" : "छूट"}
              </span>
            )}
            {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
              <span className="absolute top-4 right-4 bg-orange-500 text-white font-semibold px-3 py-1.5 rounded-lg text-sm">
                {language === "EN" ? `Only ${product.stock} left!` : `केवल ${product.stock} बचे!`}
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                    selectedImage === i
                      ? "border-gold-500 ring-2 ring-gold-200 scale-105"
                      : "border-cream-200 hover:border-gold-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-gold-600 font-medium text-sm tracking-wider uppercase mb-2">
            {product.category?.name}
          </p>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3 leading-tight">
            {language === "EN" ? product.name : product.nameHi || product.name}
          </h1>

          {/* Rating */}
          {product._count?.reviews ? (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={
                      star <= Math.round(avgRating)
                        ? "fill-gold-400 text-gold-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-base text-gray-500">
                ({product._count.reviews}{" "}
                {language === "EN" ? "reviews" : "समीक्षा"})
              </span>
            </div>
          ) : null}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6 p-4 bg-cream-50 rounded-xl border border-cream-200">
            <span className="text-3xl font-bold text-maroon-500">
              {formatPrice(product.salePrice || product.price)}
            </span>
            {product.salePrice && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-green-600 font-semibold text-sm bg-green-50 px-2 py-1 rounded-md">
                  {language === "EN" ? `${discount}% off` : `${discount}% की छूट`}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            {language === "EN"
              ? product.description
              : product.descHi || product.description}
          </p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 mb-6 text-base">
            {product.fabric && (
              <div>
                <span className="text-gray-500">
                  {language === "EN" ? "Fabric:" : "कपड़ा:"}
                </span>{" "}
                <span className="font-medium">{product.fabric}</span>
              </div>
            )}
            {product.color && (
              <div>
                <span className="text-gray-500">
                  {language === "EN" ? "Color:" : "रंग:"}
                </span>{" "}
                <span className="font-medium">{product.color}</span>
              </div>
            )}
          </div>

          {/* Size Selection */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-700">
                  {language === "EN" ? "Select Size" : "साइज़ चुनें"}
                </h3>
                {selectedSize && (
                  <span className="text-sm text-gold-600 font-medium">
                    {language === "EN" ? "Selected:" : "चुना:"} {selectedSize}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3.5rem] h-14 px-4 rounded-xl text-base font-semibold transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-gold-500 text-white border-2 border-gold-500 shadow-md scale-105"
                        : "bg-white border-2 border-cream-200 text-gray-700 hover:border-gold-400 hover:text-gold-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-700 mb-3">
              {language === "EN" ? "Quantity" : "मात्रा"}
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 bg-cream-100 rounded-xl flex items-center justify-center hover:bg-cream-200 transition-colors"
              >
                <Minus size={20} />
              </button>
              <span className="text-xl font-semibold w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-12 h-12 bg-cream-100 rounded-xl flex items-center justify-center hover:bg-cream-200 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              loading={cartLoading}
              disabled={product.stock === 0 || !isAuthenticated}
            >
              {addedToCart ? (
                <>
                  <Check size={22} className="mr-2" />
                  {language === "EN" ? "Added!" : "जोड़ा गया!"}
                </>
              ) : (
                <>
                  <ShoppingCart size={22} className="mr-2" />
                  {product.stock === 0
                    ? language === "EN"
                      ? "Out of Stock"
                      : "स्टॉक में नहीं"
                    : language === "EN"
                      ? "Add to Cart"
                      : "कार्ट में जोड़ें"}
                </>
              )}
            </Button>
            {isAuthenticated && (
              <Button variant="outline" size="lg" onClick={handleWishlistToggle}>
                <Heart
                  size={22}
                  className={wishlisted ? "fill-maroon-500 text-maroon-500 mr-2" : "mr-2"}
                />
                {wishlisted
                  ? language === "EN"
                    ? "Wishlisted"
                    : "पसंदीदा"
                  : language === "EN"
                    ? "Wishlist"
                    : "पसंदीदा में जोड़ें"}
              </Button>
            )}
          </div>

          {!isAuthenticated && (
            <p className="text-sm text-gray-500 mb-6">
              {language === "EN"
                ? "Please login to add items to cart"
                : "कार्ट में आइटम जोड़ने के लिए लॉगिन करें"}
            </p>
          )}

          {/* USP strip */}
          <div className="border-t border-cream-200 pt-6 space-y-3">
            <div className="flex items-center gap-3 text-base text-gray-600">
              <Truck size={20} className="text-gold-600" />
              {language === "EN"
                ? "Free delivery on orders above ₹999"
                : "₹999 से ऊपर के ऑर्डर पर मुफ्त डिलीवरी"}
            </div>
            <div className="flex items-center gap-3 text-base text-gray-600">
              <RotateCcw size={20} className="text-gold-600" />
              {language === "EN"
                ? "7 days easy return"
                : "7 दिन आसान वापसी"}
            </div>
          </div>

          {/* Care instructions */}
          {product.careInstr && (
            <div className="border-t border-cream-200 pt-6 mt-6">
              <h3 className="text-base font-semibold text-gray-700 mb-2">
                {language === "EN" ? "Care Instructions" : "देखभाल निर्देश"}
              </h3>
              <p className="text-gray-600 text-base">{product.careInstr}</p>
            </div>
          )}

          {/* Reviews */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="border-t border-cream-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {language === "EN" ? "Customer Reviews" : "ग्राहक समीक्षा"}
              </h3>
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-cream-50 rounded-xl p-4 border border-cream-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={
                              star <= review.rating
                                ? "fill-gold-400 text-gold-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {review.user?.name}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
