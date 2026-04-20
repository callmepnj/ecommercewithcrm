"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

interface Slide {
  image: string;
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
  cta: string;
  ctaHi: string;
  href: string;
}

const slides: Slide[] = [
  {
    image: "/images/hero/hero-1.jpg",
    title: "Elegant Sarees",
    titleHi: "सुंदर साड़ियाँ",
    subtitle: "Drape yourself in timeless grace with our exquisite saree collection",
    subtitleHi: "हमारी उत्कृष्ट साड़ी संग्रह के साथ शाश्वत सुंदरता में खुद को सजाएं",
    cta: "Shop Sarees",
    ctaHi: "साड़ी खरीदें",
    href: "/category/saree",
  },
  {
    image: "/images/hero/hero-2.jpg",
    title: "Designer Kurtis",
    titleHi: "डिज़ाइनर कुर्ती",
    subtitle: "Discover comfort meets elegance in our curated kurti collection",
    subtitleHi: "हमारी चुनी हुई कुर्ती संग्रह में आराम और सुंदरता का संगम पाएं",
    cta: "Shop Kurtis",
    ctaHi: "कुर्ती खरीदें",
    href: "/category/kurti",
  },
  {
    image: "/images/hero/hero-3.jpg",
    title: "New Arrivals",
    titleHi: "नए आगमन",
    subtitle: "Be the first to explore our latest ethnic wear designs",
    subtitleHi: "हमारे नवीनतम एथनिक वियर डिज़ाइन को सबसे पहले देखें",
    cta: "Explore Now",
    ctaHi: "अभी देखें",
    href: "/",
  },
  {
    image: "/images/hero/hero-4.webp",
    title: "Festive Collection",
    titleHi: "त्योहारी संग्रह",
    subtitle: "Celebrate every occasion with our stunning festive range",
    subtitleHi: "हमारी शानदार त्योहारी रेंज के साथ हर अवसर मनाएं",
    cta: "Shop Now",
    ctaHi: "अभी खरीदें",
    href: "/",
  },
];

interface Props {
  language: "EN" | "HI";
}

export default function HeroCarousel({ language }: Props) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  const next = useCallback(
    () => goTo((current + 1) % slides.length),
    [current, goTo]
  );

  const prev = useCallback(
    () => goTo((current - 1 + slides.length) % slides.length),
    [current, goTo]
  );

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] max-h-[800px] overflow-hidden">
      {/* Background images */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            priority={i === 0}
            className="object-cover animate-ken-burns"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23DAA520' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container-app">
          <div className="max-w-2xl">
            {/* Gold accent line */}
            <div className="w-16 h-1 bg-gold-500 rounded-full mb-6 animate-fade-in-left" />

            <h1
              key={`title-${current}`}
              className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight mb-6 animate-fade-in-up"
            >
              {language === "EN" ? slide.title : slide.titleHi}
            </h1>

            <p
              key={`sub-${current}`}
              className="text-lg md:text-xl text-cream-200 mb-10 leading-relaxed max-w-lg animate-fade-in-up delay-200"
              style={{ animationFillMode: "backwards" }}
            >
              {language === "EN" ? slide.subtitle : slide.subtitleHi}
            </p>

            <div
              key={`cta-${current}`}
              className="flex gap-4 animate-fade-in-up delay-400"
              style={{ animationFillMode: "backwards" }}
            >
              <Link href={slide.href}>
                <Button variant="primary" size="lg">
                  {language === "EN" ? slide.cta : slide.ctaHi}
                </Button>
              </Link>
              <Link href="/">
                <button className="px-8 py-3 border-2 border-white/40 text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors">
                  {language === "EN" ? "View All" : "सभी देखें"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-10 h-3 bg-gold-500"
                : "w-3 h-3 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
