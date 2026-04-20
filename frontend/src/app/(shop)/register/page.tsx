"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/ui/Button";
import { User, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuthStore();
  const language = useAuthStore((s) => s.language);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!form.name || !form.phone) {
      setError(language === "EN" ? "Name and phone are required" : "नाम और फ़ोन आवश्यक हैं");
      return;
    }
    if (form.phone.length !== 10) {
      setError(language === "EN" ? "Enter valid 10-digit phone number" : "मान्य 10-अंकों का फ़ोन नंबर दर्ज करें");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await registerUser({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        password: form.password || undefined,
      });
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || (language === "EN" ? "Registration failed" : "रजिस्ट्रेशन विफल"));
    }
    setLoading(false);
  };

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-[85vh] flex">
      {/* Left side - decorative image (hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/kurtis/kurti-12.jpg"
          alt="AAINA BOUTIQUE"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-500/70 to-maroon-500/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-12">
            <h2 className="text-5xl font-heading font-bold mb-4">
              AAINA
              <span className="text-gold-400 ml-2">BOUTIQUE</span>
            </h2>
            <div className="ornamental-divider mb-4">
              <span className="text-gold-400 text-xl">✦</span>
            </div>
            <p className="text-cream-200 text-lg leading-relaxed max-w-md mx-auto">
              {language === "EN"
                ? "Join us and explore our exclusive collection"
                : "हमसे जुड़ें और हमारे विशेष संग्रह का अन्वेषण करें"}
            </p>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-maroon-500 mb-2">
            {language === "EN" ? "Create Account" : "खाता बनाएं"}
          </h1>
          <p className="text-gray-500 text-lg">
            {language === "EN" ? "Join AAINA BOUTIQUE" : "AAINA BOUTIQUE से जुड़ें"}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-cream-200 p-8 shadow-sm">
          {error && (
            <div className="bg-red-50 text-red-600 rounded-lg p-3 mb-6 text-base">{error}</div>
          )}

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                {language === "EN" ? "Full Name" : "पूरा नाम"} *
              </label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder={language === "EN" ? "Your name" : "आपका नाम"}
                  className="w-full pl-12 pr-4 py-3.5 border border-cream-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                {language === "EN" ? "Phone Number" : "फ़ोन नंबर"} *
              </label>
              <div className="relative">
                <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value.replace(/\D/g, ""))}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-4 py-3.5 border border-cream-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                {language === "EN" ? "Email (optional)" : "ईमेल (वैकल्पिक)"}
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="email@example.com"
                  className="w-full pl-12 pr-4 py-3.5 border border-cream-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                {language === "EN" ? "Password (optional)" : "पासवर्ड (वैकल्पिक)"}
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateForm("password", e.target.value)}
                  placeholder="••••••"
                  className="w-full pl-12 pr-12 py-3.5 border border-cream-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <Button variant="primary" size="lg" className="w-full mt-6" onClick={handleRegister} loading={loading}>
            {language === "EN" ? "Create Account" : "खाता बनाएं"}
          </Button>

          <p className="text-center mt-6 text-base text-gray-500">
            {language === "EN" ? "Already have an account? " : "पहले से खाता है? "}
            <Link href="/login" className="text-gold-600 font-semibold hover:underline">
              {language === "EN" ? "Login" : "लॉगिन"}
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
