"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/services/authService";
import Button from "@/components/ui/Button";
import { Phone, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const language = useAuthStore((s) => s.language);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [useOtp, setUseOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) {
      setError(language === "EN" ? "Enter valid 10-digit phone number" : "मान्य 10-अंकों का फ़ोन नंबर दर्ज करें");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authApi.requestOtp(phone, "LOGIN");
      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      if (useOtp) {
        await login(phone, undefined, otp);
      } else {
        await login(phone, password);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || (language === "EN" ? "Login failed" : "लॉगिन विफल"));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex">
      {/* Left side - decorative image (hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/sarees/saree-10.jpg"
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
                ? "Discover timeless elegance with our premium collection of ethnic wear"
                : "हमारे प्रीमियम एथनिक वियर संग्रह के साथ शाश्वत सुंदरता की खोज करें"}
            </p>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-maroon-500 mb-2">
            {language === "EN" ? "Welcome Back" : "वापसी पर स्वागत"}
          </h1>
          <p className="text-gray-500 text-lg">
            {language === "EN" ? "Login to your account" : "अपने खाते में लॉगिन करें"}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-cream-200 p-8 shadow-sm">
          {error && (
            <div className="bg-red-50 text-red-600 rounded-lg p-3 mb-6 text-base">
              {error}
            </div>
          )}

          {/* Phone */}
          <div className="mb-5">
            <label className="block text-base font-medium text-gray-700 mb-2">
              {language === "EN" ? "Phone Number" : "फ़ोन नंबर"}
            </label>
            <div className="relative">
              <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="9876543210"
                className="w-full pl-12 pr-4 py-3.5 border border-cream-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>

          {/* Toggle OTP / Password */}
          <div className="flex gap-4 mb-5">
            <button
              onClick={() => { setUseOtp(false); setOtpSent(false); }}
              className={`flex-1 py-2 text-base font-medium rounded-lg transition-colors ${
                !useOtp ? "bg-gold-50 text-gold-600 border-2 border-gold-500" : "bg-cream-50 text-gray-500 border-2 border-transparent"
              }`}
            >
              {language === "EN" ? "Password" : "पासवर्ड"}
            </button>
            <button
              onClick={() => setUseOtp(true)}
              className={`flex-1 py-2 text-base font-medium rounded-lg transition-colors ${
                useOtp ? "bg-gold-50 text-gold-600 border-2 border-gold-500" : "bg-cream-50 text-gray-500 border-2 border-transparent"
              }`}
            >
              OTP
            </button>
          </div>

          {useOtp ? (
            <>
              {!otpSent ? (
                <Button variant="primary" size="lg" className="w-full" onClick={handleSendOtp} loading={loading}>
                  {language === "EN" ? "Send OTP" : "OTP भेजें"}
                </Button>
              ) : (
                <div className="mb-5">
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    {language === "EN" ? "Enter OTP" : "OTP दर्ज करें"}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full px-4 py-3.5 border border-cream-200 rounded-xl text-lg text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="mb-5">
              <label className="block text-base font-medium text-gray-700 mb-2">
                {language === "EN" ? "Password" : "पासवर्ड"}
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
          )}

          {(useOtp ? otpSent : true) && (
            <Button variant="primary" size="lg" className="w-full mt-2" onClick={handleLogin} loading={loading}>
              {language === "EN" ? "Login" : "लॉगिन"}
            </Button>
          )}

          <p className="text-center mt-6 text-base text-gray-500">
            {language === "EN" ? "Don't have an account? " : "खाता नहीं है? "}
            <Link href="/register" className="text-gold-600 font-semibold hover:underline">
              {language === "EN" ? "Register" : "रजिस्टर"}
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
