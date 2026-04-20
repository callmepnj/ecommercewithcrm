"use client";

import { useEffect, useState, useRef } from "react";
import { adminApi } from "@/services/adminService";
import { formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/ui/Button";
import Image from "next/image";
import type { Product, ProductImage as ProductImageType } from "@/types";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  ImagePlus,
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const language = useAuthStore((s) => s.language);
  const isHi = language === "HI";

  const [form, setForm] = useState({
    name: "",
    nameHi: "",
    description: "",
    descriptionHi: "",
    price: "",
    salePrice: "",
    stock: "",
    categoryId: "",
    fabric: "",
    color: "",
    sizes: "",
    isFeatured: false,
  });

  const [categories, setCategories] = useState<any[]>([]);

  // Image management state
  const [productImages, setProductImages] = useState<ProductImageType[]>([]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [page]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getProducts(page);
      setProducts(data.products || data);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      // silent
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    try {
      const data = await adminApi.getCategories();
      setCategories(data);
    } catch {
      // silent
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      nameHi: "",
      description: "",
      descriptionHi: "",
      price: "",
      salePrice: "",
      stock: "",
      categoryId: "",
      fabric: "",
      color: "",
      sizes: "",
      isFeatured: false,
    });
    setEditingProduct(null);
    setProductImages([]);
    setShowForm(false);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setProductImages(product.images || []);
    setForm({
      name: product.name,
      nameHi: product.nameHi || "",
      description: product.description || "",
      descriptionHi: product.descriptionHi || "",
      price: product.price.toString(),
      salePrice: product.salePrice?.toString() || "",
      stock: product.stock.toString(),
      categoryId: product.categoryId || "",
      fabric: product.fabric || "",
      color: product.color || "",
      sizes: product.sizes?.join(", ") || "",
      isFeatured: product.isFeatured,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock) {
      showToast(isHi ? "कृपया सभी ज़रूरी फ़ील्ड भरें" : "Please fill all required fields", "error");
      return;
    }

    const payload: any = {
      name: form.name,
      nameHi: form.nameHi || undefined,
      description: form.description || undefined,
      descriptionHi: form.descriptionHi || undefined,
      price: parseFloat(form.price),
      salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined,
      stock: parseInt(form.stock),
      categoryId: form.categoryId || undefined,
      fabric: form.fabric || undefined,
      color: form.color || undefined,
      sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()) : undefined,
      isFeatured: form.isFeatured,
    };

    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, payload);
        showToast(isHi ? "प्रोडक्ट अपडेट हो गया ✅" : "Product updated ✅");
      } else {
        await adminApi.createProduct(payload);
        showToast(isHi ? "प्रोडक्ट बन गया ✅" : "Product created ✅");
      }
      resetForm();
      loadProducts();
    } catch {
      showToast(isHi ? "कुछ गलत हो गया ❌" : "Something went wrong ❌", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isHi ? "क्या आप इसे हटाना चाहते हैं?" : "Are you sure you want to delete this product?")) return;
    try {
      await adminApi.deleteProduct(id);
      showToast(isHi ? "प्रोडक्ट हटा दिया गया" : "Product deleted");
      loadProducts();
    } catch {
      showToast(isHi ? "हटाने में गलती हुई" : "Failed to delete", "error");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct || !e.target.files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(e.target.files)) {
        const result = await adminApi.uploadProductImage(editingProduct.id, file);
        setProductImages((prev) => [...prev, result]);
      }
      showToast(isHi ? "फ़ोटो अपलोड हो गई ✅" : "Image uploaded ✅");
      loadProducts();
    } catch {
      showToast(isHi ? "अपलोड में गलती" : "Upload failed", "error");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageDelete = async (imageId: string) => {
    if (!confirm(isHi ? "यह फ़ोटो हटाएं?" : "Delete this image?")) return;
    try {
      await adminApi.deleteProductImage(imageId);
      setProductImages((prev) => prev.filter((img) => img.id !== imageId));
      showToast(isHi ? "फ़ोटो हटा दी" : "Image deleted");
      loadProducts();
    } catch {
      showToast(isHi ? "फ़ोटो हटाने में गलती" : "Failed to delete image", "error");
    }
  };

  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.nameHi?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <div>
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-lg text-lg font-semibold ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          } animate-fade-in-up`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-800">
          {isHi ? "प्रोडक्ट" : "Products"}
        </h1>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowForm(true)}
          className="text-lg px-8 py-4"
        >
          <Plus size={24} className="mr-2" />
          {isHi ? "नया प्रोडक्ट जोड़ें" : "Add New Product"}
        </Button>
      </div>

      {/* Search bar — large, easy to tap */}
      <div className="relative mb-8">
        <Search size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={isHi ? "🔍 प्रोडक्ट खोजें..." : "🔍 Search products..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-5 text-xl border-2 border-cream-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 bg-white"
        />
      </div>

      {/* ───── PRODUCT FORM MODAL ───── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl my-8 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-heading font-bold text-gray-800">
                {editingProduct
                  ? isHi ? "✏️ प्रोडक्ट बदलें" : "✏️ Edit Product"
                  : isHi ? "➕ नया प्रोडक्ट" : "➕ New Product"}
              </h2>
              <button
                onClick={resetForm}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-cream-100 hover:bg-cream-200 transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    {isHi ? "नाम *" : "Product Name *"}
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Banarasi Silk Saree"
                    className="w-full border-2 border-cream-200 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    {isHi ? "हिंदी नाम" : "Hindi Name"}
                  </label>
                  <input
                    value={form.nameHi}
                    onChange={(e) => setForm({ ...form, nameHi: e.target.value })}
                    placeholder="बनारसी सिल्क साड़ी"
                    className="w-full border-2 border-cream-200 rounded-xl px-5 py-4 text-lg font-hindi focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {isHi ? "विवरण" : "Description"}
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full border-2 border-cream-200 rounded-xl px-5 py-4 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              {/* Price, Sale, Stock — BIG inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    {isHi ? "कीमत (₹) *" : "Price (₹) *"}
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="1999"
                    className="w-full border-2 border-cream-200 rounded-xl px-5 py-4 text-2xl font-bold text-maroon-500 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    {isHi ? "सेल कीमत (₹)" : "Sale Price (₹)"}
                  </label>
                  <input
                    type="number"
                    value={form.salePrice}
                    onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                    placeholder="1499"
                    className="w-full border-2 border-cream-200 rounded-xl px-5 py-4 text-2xl font-bold text-green-600 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    {isHi ? "स्टॉक *" : "Stock *"}
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="50"
                    className="w-full border-2 border-cream-200 rounded-xl px-5 py-4 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              </div>

              {/* Category + Fabric */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    {isHi ? "कैटेगरी" : "Category"}
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full border-2 border-cream-200 rounded-xl px-5 py-4 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold-400"
                  >
                    <option value="">{isHi ? "कैटेगरी चुनें" : "Select Category"}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    {isHi ? "कपड़ा" : "Fabric"}
                  </label>
                  <input
                    value={form.fabric}
                    onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                    placeholder="Silk, Cotton..."
                    className="w-full border-2 border-cream-200 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              </div>

              {/* Color + Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    {isHi ? "रंग" : "Color"}
                  </label>
                  <input
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full border-2 border-cream-200 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    {isHi ? "साइज़ (कॉमा से अलग)" : "Sizes (comma-separated)"}
                  </label>
                  <input
                    value={form.sizes}
                    onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                    placeholder="S, M, L, XL, XXL"
                    className="w-full border-2 border-cream-200 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              </div>

              {/* Featured toggle */}
              <label className="flex items-center gap-3 cursor-pointer bg-gold-50 px-5 py-4 rounded-xl border-2 border-gold-200">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="accent-gold-500 w-6 h-6"
                />
                <Star size={22} className="text-gold-500" />
                <span className="text-lg font-semibold text-gray-700">
                  {isHi ? "फीचर्ड प्रोडक्ट" : "Featured Product"}
                </span>
              </label>

              {/* ───── IMAGE MANAGEMENT ───── */}
              {editingProduct && (
                <div className="border-2 border-dashed border-cream-300 rounded-2xl p-6 bg-cream-50">
                  <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <ImagePlus size={24} className="text-gold-500" />
                    {isHi ? "फ़ोटो प्रबंधन" : "Manage Photos"}
                  </h3>

                  {/* Current images */}
                  {productImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                      {productImages.map((img) => (
                        <div key={img.id} className="relative group rounded-xl overflow-hidden border-2 border-cream-200 bg-white">
                          <div className="aspect-[3/4] relative">
                            <Image
                              src={img.url}
                              alt={img.altText || "Product"}
                              fill
                              className="object-cover"
                              sizes="200px"
                            />
                          </div>
                          <button
                            onClick={() => handleImageDelete(img.id)}
                            className="absolute top-2 right-2 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors opacity-80 group-hover:opacity-100"
                            title={isHi ? "हटाएं" : "Delete"}
                          >
                            <Trash2 size={18} />
                          </button>
                          {img.isPrimary && (
                            <span className="absolute bottom-2 left-2 bg-gold-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                              {isHi ? "मुख्य" : "Main"}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full flex items-center justify-center gap-3 py-5 rounded-xl border-2 border-dashed border-gold-300 bg-white hover:bg-gold-50 transition-colors text-lg font-semibold text-gold-600 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-gold-400 border-t-transparent rounded-full animate-spin" />
                        {isHi ? "अपलोड हो रहा है..." : "Uploading..."}
                      </>
                    ) : (
                      <>
                        <Upload size={24} />
                        {isHi ? "📷 फ़ोटो अपलोड करें" : "📷 Upload Photos"}
                      </>
                    )}
                  </button>
                </div>
              )}

              {!editingProduct && (
                <p className="text-base text-gray-500 bg-blue-50 border border-blue-200 rounded-xl px-5 py-3">
                  💡 {isHi ? "पहले प्रोडक्ट बनाएं, फिर फ़ोटो जोड़ें" : "Create the product first, then you can add photos"}
                </p>
              )}

              {/* Action buttons — very large */}
              <div className="flex gap-4 pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  className="text-xl px-10 py-5 flex-1"
                >
                  {editingProduct
                    ? isHi ? "✅ अपडेट करें" : "✅ Update Product"
                    : isHi ? "✅ प्रोडक्ट बनाएं" : "✅ Create Product"}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={resetForm}
                  className="text-xl px-8 py-5"
                >
                  {isHi ? "रद्द करें" : "Cancel"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───── PRODUCT CARDS (card layout, not table) ───── */}
      <div className="space-y-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border-2 border-cream-200 p-6 animate-pulse">
                <div className="flex gap-6">
                  <div className="w-28 h-36 bg-cream-200 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-cream-200 rounded w-1/2" />
                    <div className="h-5 bg-cream-200 rounded w-1/3" />
                    <div className="h-8 bg-cream-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))
          : filteredProducts.map((product) => {
              const img = product.images?.[0]?.url || "/placeholder-product.jpg";
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border-2 border-cream-200 p-5 hover:border-gold-300 hover:shadow-md transition-all"
                >
                  <div className="flex gap-5 items-start">
                    {/* Product image */}
                    <div className="w-28 h-36 relative rounded-xl overflow-hidden bg-cream-100 flex-shrink-0 border border-cream-200">
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                      {product.images?.length > 1 && (
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                          +{product.images.length - 1}
                        </span>
                      )}
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 truncate">
                            {product.name}
                          </h3>
                          {product.nameHi && (
                            <p className="text-base text-gray-500 font-hindi">{product.nameHi}</p>
                          )}
                        </div>
                        {product.isFeatured && (
                          <span className="flex items-center gap-1 bg-gold-50 text-gold-700 px-3 py-1 rounded-full text-sm font-bold border border-gold-200 flex-shrink-0">
                            <Star size={14} fill="currentColor" /> {isHi ? "फीचर्ड" : "Featured"}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <p className="text-2xl font-bold text-maroon-500">
                          {formatPrice(product.salePrice || product.price)}
                        </p>
                        {product.salePrice && (
                          <p className="text-lg text-gray-400 line-through">
                            {formatPrice(product.price)}
                          </p>
                        )}
                        <span className="text-base text-gray-500">|</span>
                        <span className={`text-lg font-semibold ${product.stock <= 5 ? "text-red-600" : "text-green-600"}`}>
                          {isHi ? "स्टॉक" : "Stock"}: {product.stock}
                        </span>
                      </div>

                      <p className="text-base text-gray-500 mt-1">
                        {product.category?.name || "-"} {product.fabric ? `· ${product.fabric}` : ""}
                      </p>
                    </div>

                    {/* Actions — big touch targets */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEdit(product)}
                        className="flex items-center gap-2 px-5 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-base font-semibold border border-blue-200"
                      >
                        <Pencil size={20} />
                        {isHi ? "बदलें" : "Edit"}
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors text-base font-semibold border border-red-200"
                      >
                        <Trash2 size={20} />
                        {isHi ? "हटाएं" : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Pagination — large buttons */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="w-14 h-14 flex items-center justify-center rounded-xl bg-white border-2 border-cream-200 hover:border-gold-400 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <span className="text-xl font-bold text-gray-600 px-4">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="w-14 h-14 flex items-center justify-center rounded-xl bg-white border-2 border-cream-200 hover:border-gold-400 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
}
