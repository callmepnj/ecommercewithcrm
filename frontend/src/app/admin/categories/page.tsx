"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/services/adminService";
import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/ui/Button";
import Image from "next/image";
import type { Category } from "@/types";
import { Plus, Pencil, Trash2, X, FolderOpen } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({
    name: "",
    nameHi: "",
    description: "",
    image: "",
  });

  const language = useAuthStore((s) => s.language);
  const isHi = language === "HI";

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getCategories();
      setCategories(data);
    } catch {
      // silent
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ name: "", nameHi: "", description: "", image: "" });
    setEditingCategory(null);
    setShowForm(false);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      nameHi: cat.nameHi || "",
      description: cat.description || "",
      image: cat.image || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name) {
      showToast(isHi ? "कृपया नाम डालें" : "Please enter a name", "error");
      return;
    }

    const payload: any = {
      name: form.name,
      nameHi: form.nameHi || undefined,
      description: form.description || undefined,
      image: form.image || undefined,
    };

    try {
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, payload);
        showToast(isHi ? "कैटेगरी अपडेट हो गई ✅" : "Category updated ✅");
      } else {
        await adminApi.createCategory(payload);
        showToast(isHi ? "कैटेगरी बन गई ✅" : "Category created ✅");
      }
      resetForm();
      loadCategories();
    } catch {
      showToast(isHi ? "कुछ गलत हो गया ❌" : "Something went wrong ❌", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isHi ? "क्या आप इसे हटाना चाहते हैं?" : "Are you sure you want to delete this category?"))
      return;
    try {
      await adminApi.deleteCategory(id);
      showToast(isHi ? "कैटेगरी हटा दी गई" : "Category deleted");
      loadCategories();
    } catch {
      showToast(isHi ? "हटाने में गलती" : "Failed to delete", "error");
    }
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-lg text-lg font-semibold ${
            toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-800">
          📂 {isHi ? "कैटेगरी" : "Categories"}
        </h1>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowForm(true)}
          className="text-lg px-8 py-4"
        >
          <Plus size={24} className="mr-2" />
          {isHi ? "नई कैटेगरी जोड़ें" : "Add New Category"}
        </Button>
      </div>

      {/* ───── FORM MODAL ───── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl my-8 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-heading font-bold text-gray-800">
                {editingCategory
                  ? isHi ? "✏️ कैटेगरी बदलें" : "✏️ Edit Category"
                  : isHi ? "➕ नई कैटेगरी" : "➕ New Category"}
              </h2>
              <button
                onClick={resetForm}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-cream-100 hover:bg-cream-200 transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {isHi ? "नाम *" : "Category Name *"}
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Sarees"
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
                  placeholder="साड़ियाँ"
                  className="w-full border-2 border-cream-200 rounded-xl px-5 py-4 text-lg font-hindi focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

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

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {isHi ? "फ़ोटो URL" : "Image URL"}
                </label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full border-2 border-cream-200 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
                {form.image && (
                  <div className="mt-3 w-32 h-32 relative rounded-xl overflow-hidden border-2 border-cream-200">
                    <Image src={form.image} alt="Preview" fill className="object-cover" sizes="128px" />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  className="text-xl px-10 py-5 flex-1"
                >
                  {editingCategory
                    ? isHi ? "✅ अपडेट करें" : "✅ Update"
                    : isHi ? "✅ कैटेगरी बनाएं" : "✅ Create Category"}
                </Button>
                <Button variant="ghost" size="lg" onClick={resetForm} className="text-xl px-8 py-5">
                  {isHi ? "रद्द करें" : "Cancel"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───── CATEGORY CARDS ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border-2 border-cream-200 p-6 animate-pulse">
                <div className="w-full h-32 bg-cream-200 rounded-xl mb-4" />
                <div className="h-6 bg-cream-200 rounded w-1/2 mb-2" />
                <div className="h-5 bg-cream-200 rounded w-1/3" />
              </div>
            ))
          : categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border-2 border-cream-200 p-5 hover:border-gold-300 hover:shadow-md transition-all"
              >
                {/* Category image */}
                {cat.image ? (
                  <div className="w-full h-36 relative rounded-xl overflow-hidden mb-4 border border-cream-200">
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="300px" />
                  </div>
                ) : (
                  <div className="w-full h-36 rounded-xl bg-cream-100 flex items-center justify-center mb-4 border border-cream-200">
                    <FolderOpen size={48} className="text-cream-300" />
                  </div>
                )}

                {/* Info */}
                <h3 className="text-xl font-bold text-gray-800">{cat.name}</h3>
                {cat.nameHi && (
                  <p className="text-base text-gray-500 font-hindi">{cat.nameHi}</p>
                )}
                <p className="text-lg text-gray-600 mt-2">
                  {cat._count?.products ?? 0} {isHi ? "प्रोडक्ट" : "products"}
                </p>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => openEdit(cat)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-base font-semibold border border-blue-200"
                  >
                    <Pencil size={18} />
                    {isHi ? "बदलें" : "Edit"}
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors text-base font-semibold border border-red-200"
                  >
                    <Trash2 size={18} />
                    {isHi ? "हटाएं" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
