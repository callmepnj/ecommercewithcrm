"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/ui/Button";
import { Truck, Store, Save, Phone, MapPin, IndianRupee } from "lucide-react";

export default function AdminSettingsPage() {
  const language = useAuthStore((s) => s.language);
  const isHi = language === "HI";

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Delivery settings — stored in localStorage for now (can be moved to backend later)
  const [deliveryCharge, setDeliveryCharge] = useState("60");
  const [freeShippingAbove, setFreeShippingAbove] = useState("999");
  const [estimatedDays, setEstimatedDays] = useState("5-7");

  // Store info
  const [storeName, setStoreName] = useState("Aaina Boutique");
  const [storeNameHi, setStoreNameHi] = useState("आइना बुटीक");
  const [storePhone, setStorePhone] = useState("");
  const [storeWhatsApp, setStoreWhatsApp] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem("admin_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDeliveryCharge(parsed.deliveryCharge || "60");
        setFreeShippingAbove(parsed.freeShippingAbove || "999");
        setEstimatedDays(parsed.estimatedDays || "5-7");
        setStoreName(parsed.storeName || "Aaina Boutique");
        setStoreNameHi(parsed.storeNameHi || "आइना बुटीक");
        setStorePhone(parsed.storePhone || "");
        setStoreWhatsApp(parsed.storeWhatsApp || "");
        setStoreAddress(parsed.storeAddress || "");
      } catch {
        // ignore
      }
    }
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

  const handleSave = () => {
    const settings = {
      deliveryCharge,
      freeShippingAbove,
      estimatedDays,
      storeName,
      storeNameHi,
      storePhone,
      storeWhatsApp,
      storeAddress,
    };
    localStorage.setItem("admin_settings", JSON.stringify(settings));
    showToast(isHi ? "सेटिंग्स सेव हो गईं ✅" : "Settings saved ✅");
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

      <h1 className="text-3xl font-heading font-bold text-gray-800 mb-8">
        ⚙️ {isHi ? "सेटिंग्स" : "Settings"}
      </h1>

      <div className="space-y-8">
        {/* ───── DELIVERY SETTINGS ───── */}
        <div className="bg-white rounded-2xl border-2 border-cream-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
              <Truck size={24} className="text-purple-500" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-gray-800">
              {isHi ? "🚚 डिलीवरी सेटिंग्स" : "🚚 Delivery Settings"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                {isHi ? "डिलीवरी चार्ज (₹)" : "Delivery Charge (₹)"}
              </label>
              <div className="relative">
                <IndianRupee size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 text-2xl font-bold border-2 border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 text-maroon-500"
                />
              </div>
              <p className="text-base text-gray-500 mt-1">
                {isHi ? "हर ऑर्डर पर डिलीवरी चार्ज" : "Charge per order"}
              </p>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                {isHi ? "फ्री डिलीवरी (₹ से ऊपर)" : "Free Delivery Above (₹)"}
              </label>
              <div className="relative">
                <IndianRupee size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={freeShippingAbove}
                  onChange={(e) => setFreeShippingAbove(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 text-2xl font-bold border-2 border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 text-green-600"
                />
              </div>
              <p className="text-base text-gray-500 mt-1">
                {isHi ? "इतने से ऊपर ऑर्डर पर फ्री डिलीवरी" : "Free shipping for orders above this"}
              </p>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                {isHi ? "डिलीवरी का समय" : "Estimated Delivery"}
              </label>
              <input
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(e.target.value)}
                placeholder="5-7 days"
                className="w-full px-5 py-4 text-2xl font-bold border-2 border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
              <p className="text-base text-gray-500 mt-1">
                {isHi ? "दिनों में (जैसे 5-7)" : "In days (e.g. 5-7)"}
              </p>
            </div>
          </div>
        </div>

        {/* ───── STORE INFO ───── */}
        <div className="bg-white rounded-2xl border-2 border-cream-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gold-50 flex items-center justify-center">
              <Store size={24} className="text-gold-500" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-gray-800">
              {isHi ? "🏪 दुकान की जानकारी" : "🏪 Store Information"}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {isHi ? "दुकान का नाम" : "Store Name"}
                </label>
                <input
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full border-2 border-cream-200 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {isHi ? "हिंदी नाम" : "Hindi Name"}
                </label>
                <input
                  value={storeNameHi}
                  onChange={(e) => setStoreNameHi(e.target.value)}
                  className="w-full border-2 border-cream-200 rounded-xl px-5 py-4 text-lg font-hindi focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  <Phone size={18} className="inline mr-2" />
                  {isHi ? "फ़ोन नंबर" : "Phone Number"}
                </label>
                <input
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full border-2 border-cream-200 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  📱 {isHi ? "WhatsApp नंबर" : "WhatsApp Number"}
                </label>
                <input
                  value={storeWhatsApp}
                  onChange={(e) => setStoreWhatsApp(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full border-2 border-cream-200 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                <MapPin size={18} className="inline mr-2" />
                {isHi ? "दुकान का पता" : "Store Address"}
              </label>
              <textarea
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                rows={3}
                className="w-full border-2 border-cream-200 rounded-xl px-5 py-4 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>
        </div>

        {/* Save button — very large */}
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-3 bg-maroon-500 hover:bg-maroon-600 text-white text-2xl font-bold py-6 rounded-2xl transition-colors shadow-lg hover:shadow-xl"
        >
          <Save size={28} />
          {isHi ? "💾 सेटिंग्स सेव करें" : "💾 Save All Settings"}
        </button>
      </div>
    </div>
  );
}
