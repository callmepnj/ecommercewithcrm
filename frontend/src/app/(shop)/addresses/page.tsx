"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { addressApi } from "@/services/addressService";
import Button from "@/components/ui/Button";
import type { Address } from "@/types";
import { MapPin, Plus, Pencil, Trash2, X, Star } from "lucide-react";

export default function AddressesPage() {
  const router = useRouter();
  const language = useAuthStore((s) => s.language);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    isDefault: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadAddresses();
  }, [isAuthenticated, router]);

  const loadAddresses = async () => {
    try {
      const data = await addressApi.getAll();
      setAddresses(data);
    } catch {
      // silent
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ fullName: "", phone: "", addressLine: "", city: "", state: "", pincode: "", landmark: "", isDefault: false });
    setEditingAddress(null);
    setShowForm(false);
  };

  const openEdit = (addr: Address) => {
    setEditingAddress(addr);
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine: addr.addressLine,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      landmark: addr.landmark || "",
      isDefault: addr.isDefault,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingAddress) {
        await addressApi.update(editingAddress.id, form);
      } else {
        await addressApi.create(form);
      }
      resetForm();
      loadAddresses();
    } catch {
      // silent
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await addressApi.delete(id);
      loadAddresses();
    } catch {
      // silent
    }
  };

  return (
    <div className="container-app py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">
          {language === "EN" ? "My Addresses" : "मेरे पते"}
        </h1>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <Plus size={18} className="mr-2" />
          {language === "EN" ? "Add Address" : "पता जोड़ें"}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-cream-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {editingAddress
                ? language === "EN" ? "Edit Address" : "पता संपादित करें"
                : language === "EN" ? "Add New Address" : "नया पता जोड़ें"}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={language === "EN" ? "Full Name" : "पूरा नाम"}
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="border border-cream-200 rounded-xl px-4 py-3 text-base w-full"
              />
              <input
                type="tel"
                placeholder={language === "EN" ? "Phone Number" : "फ़ोन नंबर"}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="border border-cream-200 rounded-xl px-4 py-3 text-base w-full"
              />
            </div>
            <input
              type="text"
              placeholder={language === "EN" ? "Address Line" : "पता"}
              value={form.addressLine}
              onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
              className="border border-cream-200 rounded-xl px-4 py-3 text-base w-full"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder={language === "EN" ? "City" : "शहर"}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="border border-cream-200 rounded-xl px-4 py-3 text-base w-full"
              />
              <input
                type="text"
                placeholder={language === "EN" ? "State" : "राज्य"}
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="border border-cream-200 rounded-xl px-4 py-3 text-base w-full"
              />
              <input
                type="text"
                placeholder={language === "EN" ? "Pincode" : "पिनकोड"}
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="border border-cream-200 rounded-xl px-4 py-3 text-base w-full"
              />
            </div>
            <input
              type="text"
              placeholder={language === "EN" ? "Landmark (optional)" : "लैंडमार्क (वैकल्पिक)"}
              value={form.landmark}
              onChange={(e) => setForm({ ...form, landmark: e.target.value })}
              className="border border-cream-200 rounded-xl px-4 py-3 text-base w-full"
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                className="accent-gold-500 w-4 h-4"
              />
              <span className="text-base text-gray-700">
                {language === "EN" ? "Set as default address" : "डिफ़ॉल्ट पता बनाएं"}
              </span>
            </label>
            <div className="flex gap-3">
              <Button variant="primary" onClick={handleSubmit}>
                {editingAddress
                  ? language === "EN" ? "Update" : "अपडेट करें"
                  : language === "EN" ? "Save" : "सेव करें"}
              </Button>
              <Button variant="ghost" onClick={resetForm}>
                {language === "EN" ? "Cancel" : "रद्द करें"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Address list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-cream-200 p-6 animate-pulse">
              <div className="h-5 bg-cream-200 rounded w-1/3 mb-3" />
              <div className="h-4 bg-cream-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : addresses.length === 0 && !showForm ? (
        <div className="text-center py-16">
          <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">
            {language === "EN" ? "No addresses saved yet" : "अभी तक कोई पता सेव नहीं है"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white rounded-xl border border-cream-200 p-5 relative"
            >
              {addr.isDefault && (
                <span className="absolute top-4 right-4 flex items-center gap-1 text-sm text-gold-600 bg-gold-50 px-2 py-1 rounded-full">
                  <Star size={14} />
                  {language === "EN" ? "Default" : "डिफ़ॉल्ट"}
                </span>
              )}
              <h3 className="text-base font-semibold text-gray-800">{addr.fullName}</h3>
              <p className="text-gray-600 text-base mt-1">
                {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
              {addr.landmark && (
                <p className="text-gray-500 text-sm">Landmark: {addr.landmark}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                {language === "EN" ? "Phone:" : "फ़ोन:"} {addr.phone}
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => openEdit(addr)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Pencil size={14} />
                  {language === "EN" ? "Edit" : "संपादित करें"}
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  {language === "EN" ? "Delete" : "हटाएं"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
