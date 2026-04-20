"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, fetchProfile } = useAuthStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
      fetchCart();
    }
  }, [isAuthenticated, fetchProfile, fetchCart]);

  return (
    <>
      {/* Under Construction Banner */}
      <div className="bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-white text-center py-2.5 px-4 text-sm md:text-base font-medium tracking-wide">
        <span className="inline-flex items-center gap-2">
          <span className="text-lg">🚧</span>
          <span>
            We&apos;re weaving something beautiful &mdash; our store is under
            construction. Stay tuned!
          </span>
          <span className="text-lg">✨</span>
        </span>
      </div>
      <Navbar />
      <main className="min-h-[calc(100vh-160px)]">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
