"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useAuthStore } from "@/stores/authStore";
import { productApi } from "@/services/productService";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";
import { SlidersHorizontal, X, Grid3X3, LayoutGrid } from "lucide-react";
import type { Product } from "@/types";

export default function AllProductsPage() {
  const language = useAuthStore((s) => s.language);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const prodData = await productApi.getAll({
        page,
        limit: 12,
        sortBy,
        minPrice: priceRange[0] || undefined,
        maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined,
      });
      setProducts(prodData.products);
      setTotalPages(prodData.pagination.totalPages);
      setTotalProducts(prodData.pagination.total);
    } catch {
      // silent
    }
    setLoading(false);
  }, [page, sortBy, priceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        <Image
          src="/images/sarees/saree-10.jpg"
          alt="All Products"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-500/80 via-maroon-500/50 to-transparent" />
        <div className="relative h-full flex items-center">
          <div className="container-app">
            <div className="max-w-xl">
              <p className="text-gold-400 font-medium tracking-widest uppercase text-sm mb-3 animate-fade-in-up">
                {language === "EN" ? "Browse" : "ब्राउज़ करें"}
              </p>
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4 animate-fade-in-up delay-100" style={{ animationFillMode: "backwards" }}>
                {language === "EN" ? "All Products" : "सभी उत्पाद"}
              </h1>
              <p className="text-cream-200 text-lg md:text-xl animate-fade-in-up delay-200" style={{ animationFillMode: "backwards" }}>
                {language === "EN"
                  ? "Explore our complete collection of sarees & kurtis"
                  : "साड़ी और कुर्ती का पूरा संग्रह देखें"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-app py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-cream-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 font-medium text-base px-4 py-2 rounded-lg transition-colors ${
                showFilters
                  ? "bg-gold-50 text-gold-600 border border-gold-200"
                  : "text-gray-700 hover:text-gold-600 hover:bg-cream-100"
              }`}
            >
              <SlidersHorizontal size={20} />
              {language === "EN" ? "Filters" : "फ़िल्टर"}
            </button>

            <span className="text-gray-400 text-sm">
              {totalProducts} {language === "EN" ? "products" : "उत्पाद"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 bg-cream-100 rounded-lg p-1">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-md transition-colors ${gridCols === 3 ? "bg-white shadow-sm text-gold-600" : "text-gray-400"}`}
                aria-label="3 columns"
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-md transition-colors ${gridCols === 4 ? "bg-white shadow-sm text-gold-600" : "text-gray-400"}`}
                aria-label="4 columns"
              >
                <LayoutGrid size={18} />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="border border-cream-200 rounded-lg px-4 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              <option value="newest">{language === "EN" ? "Newest" : "नवीनतम"}</option>
              <option value="price_asc">{language === "EN" ? "Price: Low to High" : "कीमत: कम से ज्यादा"}</option>
              <option value="price_desc">{language === "EN" ? "Price: High to Low" : "कीमत: ज्यादा से कम"}</option>
            </select>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white border border-cream-200 rounded-xl p-6 mb-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {language === "EN" ? "Price Range" : "मूल्य सीमा"}
              </h3>
              <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-cream-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="₹ Min"
                value={priceRange[0] || ""}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="border border-cream-200 rounded-lg px-4 py-2 w-32 text-base focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
              <span className="text-gray-400">—</span>
              <input
                type="number"
                placeholder="₹ Max"
                value={priceRange[1] < 10000 ? priceRange[1] : ""}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                className="border border-cream-200 rounded-lg px-4 py-2 w-32 text-base focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setPage(1);
                  fetchProducts();
                }}
              >
                {language === "EN" ? "Apply" : "लागू करें"}
              </Button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className={`grid grid-cols-2 ${gridCols === 3 ? "md:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-4"} gap-6`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-cream-200 aspect-[3/4] rounded-xl mb-4" />
                <div className="h-4 bg-cream-200 rounded w-3/4 mb-2" />
                <div className="h-5 bg-cream-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cream-100 flex items-center justify-center">
              <span className="text-4xl">🔍</span>
            </div>
            <p className="text-xl text-gray-500 mb-2">
              {language === "EN" ? "No products found" : "कोई उत्पाद नहीं मिला"}
            </p>
            <p className="text-gray-400">
              {language === "EN" ? "Try adjusting your filters" : "फ़िल्टर बदलकर देखें"}
            </p>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-2 ${gridCols === 3 ? "md:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-4"} gap-6`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  {language === "EN" ? "Previous" : "पिछला"}
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => (
                    <span key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                          p === page
                            ? "bg-gold-500 text-white"
                            : "text-gray-600 hover:bg-cream-100"
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  {language === "EN" ? "Next" : "अगला"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
