"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { addressApi } from "@/services/addressService";
import { orderApi } from "@/services/orderService";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import type { Address } from "@/types";
import { MapPin, Plus, CreditCard, Banknote, CheckCircle2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const language = useAuthStore((s) => s.language);
  const user = useAuthStore((s) => s.user);
  const { cart, fetchCart } = useCartStore();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [notes, setNotes] = useState("");

  // Address form
  const [addressForm, setAddressForm] = useState({
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
    setMounted(true);
    fetchCart();
    loadAddresses();
  }, [fetchCart]);

  const loadAddresses = async () => {
    try {
      const data = await addressApi.getAll();
      setAddresses(data);
      const defaultAddr = data.find((a) => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
      else if (data.length) setSelectedAddress(data[0].id);
    } catch {
      // silent
    }
  };

  const handleAddAddress = async () => {
    try {
      const newAddr = await addressApi.create(addressForm);
      setAddresses((prev) => [...prev, newAddr]);
      setSelectedAddress(newAddr.id);
      setShowAddressForm(false);
      setAddressForm({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
        isDefault: false,
      });
    } catch {
      // silent
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !cart) return;
    setLoading(true);

    try {
      const result = await orderApi.create({
        addressId: selectedAddress,
        paymentMethod,
        notes: notes || undefined,
      });

      if (paymentMethod === "ONLINE" && result.razorpayOrderId) {
        // Load Razorpay
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);

        script.onload = () => {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: Math.round(cart.total * 100),
            currency: "INR",
            name: "AAINA BOUTIQUE",
            description: `Order ${result.order.orderNumber}`,
            order_id: result.razorpayOrderId,
            handler: async (response: any) => {
              await orderApi.verifyPayment({
                orderId: result.order.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              router.push(`/orders/${result.order.id}?success=true`);
            },
            prefill: {
              name: user?.name,
              contact: user?.phone,
              email: user?.email || "",
            },
            theme: { color: "#800020" },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        };
      } else {
        router.push(`/orders/${result.order.id}?success=true`);
      }
    } catch {
      // silent
    }
    setLoading(false);
  };

  if (!mounted) return null;

  if (!cart || cart.items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="container-app py-8">
      <h1 className="section-title mb-8">
        {language === "EN" ? "Checkout" : "चेकआउट"}
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Delivery Address */}
          <div className="bg-white rounded-xl border border-cream-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin size={22} className="text-gold-600" />
              {language === "EN" ? "Delivery Address" : "डिलीवरी पता"}
            </h2>

            {addresses.length === 0 && !showAddressForm ? (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">
                  {language === "EN"
                    ? "No addresses saved. Add one to continue."
                    : "कोई पता सेव नहीं है। जारी रखने के लिए एक जोड़ें।"}
                </p>
                <Button variant="outline" onClick={() => setShowAddressForm(true)}>
                  <Plus size={18} className="mr-2" />
                  {language === "EN" ? "Add Address" : "पता जोड़ें"}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      selectedAddress === addr.id
                        ? "border-gold-500 bg-gold-50"
                        : "border-cream-200 hover:border-gold-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                        className="mt-1 accent-gold-500"
                      />
                      <div>
                        <p className="font-semibold text-base">{addr.fullName}</p>
                        <p className="text-gray-600 text-base">
                          {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        {addr.landmark && (
                          <p className="text-gray-500 text-sm">
                            Landmark: {addr.landmark}
                          </p>
                        )}
                        <p className="text-gray-500 text-sm mt-1">
                          {language === "EN" ? "Phone:" : "फ़ोन:"} {addr.phone}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}

                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium text-base mt-2"
                  >
                    <Plus size={18} />
                    {language === "EN" ? "Add New Address" : "नया पता जोड़ें"}
                  </button>
                )}
              </div>
            )}

            {/* Address Form */}
            {showAddressForm && (
              <div className="mt-6 bg-cream-50 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold mb-2">
                  {language === "EN" ? "Add New Address" : "नया पता जोड़ें"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={language === "EN" ? "Full Name" : "पूरा नाम"}
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="border border-cream-200 rounded-lg px-4 py-3 text-base w-full"
                  />
                  <input
                    type="tel"
                    placeholder={language === "EN" ? "Phone Number" : "फ़ोन नंबर"}
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="border border-cream-200 rounded-lg px-4 py-3 text-base w-full"
                  />
                </div>
                <input
                  type="text"
                  placeholder={language === "EN" ? "Address Line" : "पता"}
                  value={addressForm.addressLine}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                  className="border border-cream-200 rounded-lg px-4 py-3 text-base w-full"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder={language === "EN" ? "City" : "शहर"}
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="border border-cream-200 rounded-lg px-4 py-3 text-base w-full"
                  />
                  <input
                    type="text"
                    placeholder={language === "EN" ? "State" : "राज्य"}
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="border border-cream-200 rounded-lg px-4 py-3 text-base w-full"
                  />
                  <input
                    type="text"
                    placeholder={language === "EN" ? "Pincode" : "पिनकोड"}
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    className="border border-cream-200 rounded-lg px-4 py-3 text-base w-full"
                  />
                </div>
                <input
                  type="text"
                  placeholder={language === "EN" ? "Landmark (optional)" : "लैंडमार्क (वैकल्पिक)"}
                  value={addressForm.landmark}
                  onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                  className="border border-cream-200 rounded-lg px-4 py-3 text-base w-full"
                />
                <div className="flex gap-4">
                  <Button variant="primary" onClick={handleAddAddress}>
                    {language === "EN" ? "Save Address" : "पता सेव करें"}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowAddressForm(false)}>
                    {language === "EN" ? "Cancel" : "रद्द करें"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-cream-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard size={22} className="text-gold-600" />
              {language === "EN" ? "Payment Method" : "भुगतान विधि"}
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  paymentMethod === "COD"
                    ? "border-gold-500 bg-gold-50"
                    : "border-cream-200 hover:border-gold-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="accent-gold-500"
                />
                <Banknote size={24} className="text-green-600" />
                <div>
                  <p className="font-semibold text-base">
                    {language === "EN" ? "Cash on Delivery" : "कैश ऑन डिलीवरी"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {language === "EN"
                      ? "Pay when you receive your order"
                      : "ऑर्डर मिलने पर भुगतान करें"}
                  </p>
                </div>
              </label>

              <label
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  paymentMethod === "ONLINE"
                    ? "border-gold-500 bg-gold-50"
                    : "border-cream-200 hover:border-gold-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                  className="accent-gold-500"
                />
                <CreditCard size={24} className="text-blue-600" />
                <div>
                  <p className="font-semibold text-base">
                    {language === "EN" ? "Online Payment" : "ऑनलाइन भुगतान"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {language === "EN"
                      ? "UPI, Cards, Net Banking via Razorpay"
                      : "UPI, कार्ड, नेट बैंकिंग - Razorpay"}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-white rounded-xl border border-cream-200 p-6">
            <h2 className="text-lg font-semibold mb-3">
              {language === "EN" ? "Order Notes (Optional)" : "ऑर्डर नोट्स (वैकल्पिक)"}
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                language === "EN"
                  ? "Any special instructions..."
                  : "कोई विशेष निर्देश..."
              }
              rows={3}
              className="border border-cream-200 rounded-lg px-4 py-3 text-base w-full resize-none"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-cream-200 p-6 sticky top-28">
            <h3 className="text-xl font-semibold mb-4">
              {language === "EN" ? "Order Summary" : "ऑर्डर सारांश"}
            </h3>

            <div className="space-y-3 mb-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-base">
                  <span className="text-gray-600 truncate mr-2">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium flex-shrink-0">
                    {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-base border-t border-cream-200 pt-4">
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
                    ? language === "EN" ? "FREE" : "मुफ्त"
                    : formatPrice(cart.shippingCharge)}
                </span>
              </div>
              <div className="border-t border-cream-200 pt-3 flex justify-between">
                <span className="text-lg font-semibold">
                  {language === "EN" ? "Total" : "कुल"}
                </span>
                <span className="text-xl font-bold text-maroon-500">
                  {formatPrice(cart.total)}
                </span>
              </div>
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="w-full mt-6"
              onClick={handlePlaceOrder}
              loading={loading}
              disabled={!selectedAddress}
            >
              <CheckCircle2 size={20} className="mr-2" />
              {language === "EN" ? "Place Order" : "ऑर्डर करें"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
