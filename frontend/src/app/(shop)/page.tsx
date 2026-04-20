"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Truck,
  Shield,
  RefreshCcw,
  Sparkles,
  Star,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { productApi, categoryApi } from "@/services/productService";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";
import HeroCarousel from "@/components/home/HeroCarousel";
import CollectionGallery from "@/components/home/CollectionGallery";
import { useReveal } from "@/lib/useReveal";
import type { Product, Category } from "@/types";

// Generate image arrays for galleries (expanded with new photos)
const sareeImages = Array.from({ length: 24 }, (_, i) => {
  const num = i + 1;
  const ext = [23, 25].includes(num) ? "png" : "jpg";
  return `/images/sarees/saree-${num}.${ext}`;
});
const kurtiImages = Array.from({ length: 24 }, (_, i) => {
  const num = i + 1;
  const ext = [1, 5, 6, 19].includes(num) ? "png" : "jpg";
  return `/images/kurtis/kurti-${num}.${ext}`;
});

// Showcase images for the category spotlight
const sareeShowcase = [
  "/images/sarees/saree-5.jpg",
  "/images/sarees/saree-12.jpg",
  "/images/sarees/saree-18.jpg",
];
const kurtiShowcase = [
  "/images/kurtis/kurti-8.jpg",
  "/images/kurtis/kurti-15.jpg",
  "/images/kurtis/kurti-22.jpg",
];

export default function HomePage() {
  const language = useAuthStore((s) => s.language) as "EN" | "HI";
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [featuredData, catData] = await Promise.all([
          productApi.getFeatured(),
          categoryApi.getAll(),
        ]);
        setFeatured(featuredData);
        setCategories(catData);
      } catch {
        // silent
      }
      setLoading(false);
    };
    load();
  }, []);

  useReveal();

  return (
    <div>
      {/* ===== Full-Screen Hero Carousel ===== */}
      <HeroCarousel language={language} />

      {/* ===== Marquee Banner ===== */}
      <div className="bg-maroon-500 py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="mx-8 text-cream-200 text-sm font-medium tracking-wider uppercase flex items-center gap-6">
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-gold-400" />
                {language === "EN" ? "Premium Handpicked Collection" : "प्रीमियम हस्तनिर्मित संग्रह"}
              </span>
              <span className="text-gold-400">•</span>
              <span className="flex items-center gap-2">
                <Star size={14} className="text-gold-400" />
                {language === "EN" ? "Free Shipping Above ₹999" : "₹999 से ऊपर मुफ्त शिपिंग"}
              </span>
              <span className="text-gold-400">•</span>
              <span>{language === "EN" ? "COD Available" : "कैश ऑन डिलीवरी उपलब्ध"}</span>
              <span className="text-gold-400">•</span>
              <span>{language === "EN" ? "Easy Returns" : "आसान वापसी"}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ===== Category Spotlight ===== */}
      <section className="container-app py-16 md:py-20">
        <div className="text-center mb-14 reveal">
          <p className="text-gold-500 font-medium tracking-widest uppercase text-sm mb-3">
            {language === "EN" ? "Explore Our Range" : "हमारी रेंज देखें"}
          </p>
          <h2 className="section-title mb-4">
            {language === "EN" ? "Shop by Category" : "श्रेणी के अनुसार खरीदें"}
          </h2>
          <div className="ornamental-divider">
            <span className="text-gold-500 text-2xl">✦</span>
          </div>
        </div>

        {/* Saree Spotlight */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20 reveal">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={sareeShowcase[0]}
                  alt="Saree collection"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={sareeShowcase[1]}
                  alt="Saree collection"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
            <div className="mt-8">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={sareeShowcase[2]}
                  alt="Saree collection"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
          <div className="text-center md:text-left">
            <span className="inline-block px-4 py-1.5 rounded-full bg-maroon-50 text-maroon-500 text-sm font-semibold mb-4">
              {language === "EN" ? "Premium Collection" : "प्रीमियम संग्रह"}
            </span>
            <h3 className="text-4xl md:text-5xl font-heading font-bold text-maroon-500 mb-6">
              {language === "EN" ? "Saree Collection" : "साड़ी संग्रह"}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-md">
              {language === "EN"
                ? "From classic silk to contemporary prints — find your perfect drape in our handcrafted saree collection. Each piece tells a story of tradition and elegance."
                : "क्लासिक सिल्क से लेकर समकालीन प्रिंट तक — हमारे हस्तनिर्मित साड़ी संग्रह में अपना आदर्श ड्रेप खोजें। हर पीस परंपरा और सुंदरता की कहानी कहता है।"}
            </p>
            <Link href="/category/saree">
              <Button variant="primary" size="lg">
                {language === "EN" ? "Explore Sarees" : "साड़ी देखें"}
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Kurti Spotlight (reversed) */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center reveal">
          <div className="text-center md:text-left order-2 md:order-1">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold-50 text-gold-600 text-sm font-semibold mb-4">
              {language === "EN" ? "Trending Now" : "ट्रेंडिंग"}
            </span>
            <h3 className="text-4xl md:text-5xl font-heading font-bold text-maroon-500 mb-6">
              {language === "EN" ? "Kurti Collection" : "कुर्ती संग्रह"}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-md">
              {language === "EN"
                ? "Effortlessly stylish, supremely comfortable — our kurtis blend modern design with traditional craftsmanship for everyday elegance."
                : "सहज स्टाइलिश, अत्यंत आरामदायक — हमारी कुर्तियाँ रोज़मर्रा की सुंदरता के लिए आधुनिक डिज़ाइन को पारंपरिक शिल्पकला के साथ मिलाती हैं।"}
            </p>
            <Link href="/category/kurti">
              <Button variant="primary" size="lg">
                {language === "EN" ? "Explore Kurtis" : "कुर्ती देखें"}
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 order-1 md:order-2">
            <div className="mt-8">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={kurtiShowcase[0]}
                  alt="Kurti collection"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={kurtiShowcase[1]}
                  alt="Kurti collection"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={kurtiShowcase[2]}
                  alt="Kurti collection"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Featured Products ===== */}
      <section className="bg-gradient-to-b from-cream-100/50 to-cream-50 py-16 md:py-20">
        <div className="container-app">
          <div className="text-center mb-12 reveal">
            <p className="text-gold-500 font-medium tracking-widest uppercase text-sm mb-3">
              {language === "EN" ? "Handpicked For You" : "आपके लिए चुने हुए"}
            </p>
            <h2 className="section-title mb-4">
              {language === "EN" ? "Featured Collection" : "विशेष संग्रह"}
            </h2>
            <div className="ornamental-divider">
              <span className="text-gold-500 text-2xl">✦</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-cream-200 aspect-[3/4] rounded-xl mb-4" />
                  <div className="h-4 bg-cream-200 rounded w-3/4 mb-2" />
                  <div className="h-5 bg-cream-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 text-lg py-8">
              {language === "EN"
                ? "Coming soon — stay tuned!"
                : "जल्द आ रहा है — बने रहें!"}
            </p>
          )}

          <div className="text-center mt-10">
            <Link href="/products">
              <Button variant="outline" size="lg">
                {language === "EN" ? "View All Products" : "सभी उत्पाद देखें"}
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Saree Gallery ===== */}
      <div className="bg-white">
        <CollectionGallery
          title="Saree Gallery"
          titleHi="साड़ी गैलरी"
          subtitle="Drape the Tradition"
          subtitleHi="परंपरा ओढ़ें"
          images={sareeImages}
          language={language}
        />
      </div>

      {/* ===== Parallax CTA Banner ===== */}
      <section className="relative h-[400px] md:h-[450px] overflow-hidden">
        <Image
          src="/images/sarees/saree-15.jpg"
          alt="Shop now"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-maroon-500/70" />
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-2xl px-6">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              {language === "EN"
                ? "Every Outfit Tells a Story"
                : "हर पोशाक एक कहानी कहती है"}
            </h2>
            <p className="text-cream-200 text-lg md:text-xl mb-8">
              {language === "EN"
                ? "Discover the perfect blend of tradition and style at AAINA BOUTIQUE"
                : "AAINA BOUTIQUE में परंपरा और शैली का सही मिश्रण खोजें"}
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/category/saree">
                <Button variant="primary" size="lg">
                  {language === "EN" ? "Shop Sarees" : "साड़ी खरीदें"}
                </Button>
              </Link>
              <Link href="/category/kurti">
                <button className="px-8 py-3 border-2 border-white/50 text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors">
                  {language === "EN" ? "Shop Kurtis" : "कुर्ती खरीदें"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Kurti Gallery ===== */}
      <div className="bg-cream-50">
        <CollectionGallery
          title="Kurti Gallery"
          titleHi="कुर्ती गैलरी"
          subtitle="Elegance Redefined"
          subtitleHi="सुंदरता पुनर्परिभाषित"
          images={kurtiImages}
          language={language}
        />
      </div>

      {/* ===== Why Choose Us ===== */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-app">
          <div className="text-center mb-14 reveal">
            <p className="text-gold-500 font-medium tracking-widest uppercase text-sm mb-3">
              {language === "EN" ? "The AAINA Promise" : "AAINA का वादा"}
            </p>
            <h2 className="section-title mb-4">
              {language === "EN" ? "Why Choose Us" : "हमें क्यों चुनें"}
            </h2>
            <div className="ornamental-divider">
              <span className="text-gold-500 text-2xl">✦</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
            <div className="text-center p-8 rounded-2xl glass-card hover:shadow-lg transition-shadow group">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-50 to-gold-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Truck size={36} className="text-gold-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-maroon-500">
                {language === "EN" ? "Free Delivery" : "मुफ्त डिलीवरी"}
              </h3>
              <p className="text-gray-500 text-base leading-relaxed">
                {language === "EN"
                  ? "Free shipping on orders above ₹999 across India"
                  : "पूरे भारत में ₹999 से ऊपर के ऑर्डर पर मुफ्त शिपिंग"}
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl glass-card hover:shadow-lg transition-shadow group">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-50 to-gold-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield size={36} className="text-gold-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-maroon-500">
                {language === "EN" ? "Secure Payment" : "सुरक्षित भुगतान"}
              </h3>
              <p className="text-gray-500 text-base leading-relaxed">
                {language === "EN"
                  ? "100% secure online & COD payments available"
                  : "100% सुरक्षित ऑनलाइन और COD भुगतान उपलब्ध"}
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl glass-card hover:shadow-lg transition-shadow group">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-50 to-gold-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <RefreshCcw size={36} className="text-gold-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-maroon-500">
                {language === "EN" ? "Easy Returns" : "आसान वापसी"}
              </h3>
              <p className="text-gray-500 text-base leading-relaxed">
                {language === "EN"
                  ? "7-day hassle-free return & exchange policy"
                  : "7 दिन की आसान वापसी और विनिमय नीति"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Testimonials / Social Proof ===== */}
      <section className="bg-gradient-to-b from-cream-50 to-cream-100 py-16 md:py-20">
        <div className="container-app">
          <div className="text-center mb-14 reveal">
            <p className="text-gold-500 font-medium tracking-widest uppercase text-sm mb-3">
              {language === "EN" ? "What Our Customers Say" : "हमारे ग्राहक क्या कहते हैं"}
            </p>
            <h2 className="section-title mb-4">
              {language === "EN" ? "Loved by Thousands" : "हज़ारों लोगों का भरोसा"}
            </h2>
            <div className="ornamental-divider">
              <span className="text-gold-500 text-2xl">✦</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto stagger-children">
            {[
              {
                name: "Priya Sharma",
                nameHi: "प्रिया शर्मा",
                review: "The sarees are absolutely gorgeous! The quality exceeded my expectations. Will definitely order again.",
                reviewHi: "साड़ियाँ बिल्कुल शानदार हैं! गुणवत्ता मेरी उम्मीदों से अधिक थी। निश्चित रूप से फिर से ऑर्डर करूँगी।",
                rating: 5,
              },
              {
                name: "Anjali Verma",
                nameHi: "अंजली वर्मा",
                review: "Love the kurti collection! Perfect fit, beautiful fabric, and amazing color options. My go-to boutique now!",
                reviewHi: "कुर्ती संग्रह बहुत पसंद है! परफेक्ट फिट, सुंदर फ़ैब्रिक और कमाल के रंग विकल्प।",
                rating: 5,
              },
              {
                name: "Meena Patel",
                nameHi: "मीना पटेल",
                review: "Fast delivery and excellent packaging. The ethnic wear quality is premium. Highly recommended!",
                reviewHi: "तेज़ डिलीवरी और उत्कृष्ट पैकेजिंग। एथनिक वियर की गुणवत्ता प्रीमियम है। अत्यधिक अनुशंसित!",
                rating: 5,
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-sm border border-cream-200 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star
                      key={j}
                      size={18}
                      className="fill-gold-400 text-gold-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 italic">
                  &ldquo;{language === "EN" ? t.review : t.reviewHi}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-maroon-400 to-gold-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <span className="font-semibold text-gray-800">
                    {language === "EN" ? t.name : t.nameHi}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Instagram-style Photo Strip (auto-scrolling) ===== */}
      <section className="py-12 bg-white overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-heading font-bold text-maroon-500">
            {language === "EN" ? "#AainaBoutique" : "#आइनाबुटीक"}
          </h2>
          <p className="text-gray-500 mt-1">
            {language === "EN"
              ? "Follow our style inspiration"
              : "हमारी स्टाइल प्रेरणा फॉलो करें"}
          </p>
        </div>
        {/* Row 1 — scrolls left */}
        <div className="flex animate-scroll-strip mb-3 hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, dup) =>
            [...Array(8)].map((_, i) => {
              const num = i + 27;
              const src = `/images/sarees/saree-${num}.jpg`;
              return (
                <div
                  key={`r1-${dup}-${i}`}
                  className="relative flex-shrink-0 w-[200px] md:w-[280px] aspect-square rounded-xl overflow-hidden group mx-1.5"
                >
                  <Image
                    src={src}
                    alt={`Style ${i + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="280px"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-maroon-500/0 group-hover:bg-maroon-500/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      @aainaboutique
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* Row 2 — scrolls right (reverse) */}
        <div className="flex animate-scroll-strip-reverse hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, dup) =>
            [...Array(8)].map((_, i) => {
              const num = i + 35;
              const pngKurtis = [35, 36, 49];
              const ext = pngKurtis.includes(num) ? "png" : "jpg";
              const src = `/images/kurtis/kurti-${num}.${ext}`;
              return (
                <div
                  key={`r2-${dup}-${i}`}
                  className="relative flex-shrink-0 w-[200px] md:w-[280px] aspect-square rounded-xl overflow-hidden group mx-1.5"
                >
                  <Image
                    src={src}
                    alt={`Style ${i + 9}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="280px"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-maroon-500/0 group-hover:bg-maroon-500/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      @aainaboutique
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
