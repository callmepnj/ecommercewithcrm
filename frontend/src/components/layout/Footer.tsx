import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function Footer() {
  const language = useAuthStore((s) => s.language);

  return (
    <footer className="bg-maroon-500 text-white mt-16">
      {/* Newsletter strip */}
      <div className="bg-maroon-600 py-8">
        <div className="container-app flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-heading font-semibold text-gold-400">
              {language === "EN" ? "Stay Updated" : "अपडेट रहें"}
            </h3>
            <p className="text-cream-200 text-sm mt-1">
              {language === "EN"
                ? "Get exclusive offers & new arrivals in your inbox"
                : "अपने इनबॉक्स में विशेष ऑफ़र और नए आइटम पाएं"}
            </p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder={language === "EN" ? "Your email address" : "आपका ईमेल"}
              className="px-4 py-3 rounded-l-xl text-gray-800 text-sm w-full md:w-64 focus:outline-none"
            />
            <button className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-r-xl font-semibold text-sm transition-colors whitespace-nowrap">
              {language === "EN" ? "Subscribe" : "सब्सक्राइब"}
            </button>
          </div>
        </div>
      </div>

      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-heading font-bold text-gold-400 mb-4">
              AAINA BOUTIQUE
            </h2>
            <p className="text-cream-200 text-base leading-relaxed mb-6">
              {language === "EN"
                ? "Your trusted destination for premium Indian ethnic wear. Handpicked collection of Kurtis and Sarees."
                : "प्रीमियम भारतीय एथनिक वियर के लिए आपका भरोसेमंद गंतव्य। कुर्ती और साड़ी का हस्तनिर्मित संग्रह।"}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-maroon-400 flex items-center justify-center hover:bg-gold-500 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-maroon-400 flex items-center justify-center hover:bg-gold-500 transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gold-400 mb-4">
              {language === "EN" ? "Shop" : "खरीदारी"}
            </h3>
            <ul className="space-y-3 text-base">
              <li>
                <Link href="/category/kurti" className="text-cream-200 hover:text-gold-400 transition-colors">
                  {language === "EN" ? "Kurtis" : "कुर्ती"}
                </Link>
              </li>
              <li>
                <Link href="/category/saree" className="text-cream-200 hover:text-gold-400 transition-colors">
                  {language === "EN" ? "Sarees" : "साड़ी"}
                </Link>
              </li>
              <li>
                <Link href="/" className="text-cream-200 hover:text-gold-400 transition-colors">
                  {language === "EN" ? "New Arrivals" : "नए आइटम"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-lg font-semibold text-gold-400 mb-4">
              {language === "EN" ? "My Account" : "मेरा खाता"}
            </h3>
            <ul className="space-y-3 text-base">
              <li>
                <Link href="/profile" className="text-cream-200 hover:text-gold-400 transition-colors">
                  {language === "EN" ? "Profile" : "प्रोफ़ाइल"}
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-cream-200 hover:text-gold-400 transition-colors">
                  {language === "EN" ? "Track Order" : "ऑर्डर ट्रैक करें"}
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-cream-200 hover:text-gold-400 transition-colors">
                  {language === "EN" ? "Wishlist" : "इच्छा सूची"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gold-400 mb-4">
              {language === "EN" ? "Contact Us" : "संपर्क करें"}
            </h3>
            <ul className="space-y-3 text-base">
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-gold-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-cream-200 hover:text-gold-400 transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-gold-400 flex-shrink-0" />
                <a href="mailto:info@aainaboutique.com" className="text-cream-200 hover:text-gold-400 transition-colors">
                  info@aainaboutique.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-gold-400 mt-1 flex-shrink-0" />
                <span className="text-cream-200">
                  {language === "EN"
                    ? "Dhanbad, Jharkhand, India"
                    : "धनबाद, झारखंड, भारत"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-maroon-400 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-cream-300 text-sm">
          <span>
            © {new Date().getFullYear()} AAINA BOUTIQUE.{" "}
            {language === "EN" ? "All rights reserved." : "सर्वाधिकार सुरक्षित।"}
          </span>
          <span className="text-cream-300 text-xs font-medium tracking-wide">
            Proudly built by{" "}
            <span className="text-gold-400 font-bold">MTRX AI</span>{" "}
            Consultancy
          </span>
        </div>
      </div>
    </footer>
  );
}
