"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { productApi } from "@/services/productService";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await productApi.getAll({ search: query, limit: 6 });
        setResults(data.products);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = (slug: string) => {
    onClose();
    router.push(`/product/${slug}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-fade-in-up" onClick={onClose}>
      <div
        className="w-full max-w-2xl mx-auto mt-20 bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-cream-200 bg-cream-50">
          <Search size={24} className="text-gold-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for Kurtis, Sarees..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-lg outline-none bg-transparent placeholder:text-gray-400"
          />
          <button onClick={onClose} className="p-1.5 hover:bg-cream-200 rounded-full transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="p-8 text-center text-gray-500 text-lg">Searching...</div>
          )}

          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="p-8 text-center text-gray-500 text-lg">
              No products found for &ldquo;{query}&rdquo;
            </div>
          )}

          {results.map((product) => {
            const img = product.images?.[0]?.url || "/placeholder-product.jpg";
            return (
              <button
                key={product.id}
                onClick={() => handleSelect(product.slug)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-cream-50 transition-all text-left border-b border-cream-100 last:border-0 group"
              >
                <div className="w-16 h-20 relative rounded-xl overflow-hidden bg-cream-100 flex-shrink-0 ring-1 ring-cream-200 group-hover:ring-gold-300 transition-all">
                  <Image src={img} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="64px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-800 truncate">{product.name}</p>
                  <p className="text-sm text-gold-600">{product.category?.name}</p>
                  <p className="text-lg font-bold text-maroon-500 mt-1">
                    {formatPrice(product.salePrice || product.price)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
