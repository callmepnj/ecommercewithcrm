"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
  images: string[];
  language: "EN" | "HI";
}

export default function CollectionGallery({
  title,
  titleHi,
  subtitle,
  subtitleHi,
  images,
  language,
}: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goNext = () =>
    setLightboxIndex((prev) => (prev + 1) % images.length);
  const goPrev = () =>
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);

  // Varied aspect ratios for visual interest
  const getAspect = (i: number) => {
    const patterns = [
      "aspect-[3/4]",
      "aspect-[4/5]",
      "aspect-[2/3]",
      "aspect-[3/4]",
      "aspect-[4/5]",
      "aspect-square",
    ];
    return patterns[i % patterns.length];
  };

  return (
    <>
      <section className="py-16 md:py-20">
        <div className="container-app">
          {/* Section header */}
          <div className="text-center mb-12">
            <p className="text-gold-500 font-medium tracking-widest uppercase text-sm mb-3">
              {language === "EN" ? subtitle : subtitleHi}
            </p>
            <h2 className="section-title mb-4">
              {language === "EN" ? title : titleHi}
            </h2>
            <div className="ornamental-divider">
              <span className="text-gold-500 text-2xl">✦</span>
            </div>
          </div>

          {/* Masonry gallery */}
          <div className="gallery-masonry">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => openLightbox(i)}
                className="group relative w-full rounded-xl overflow-hidden cursor-pointer block"
              >
                <div className={`relative ${getAspect(i)}`}>
                  <Image
                    src={src}
                    alt={`${language === "EN" ? title : titleHi} ${i + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-500/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-medium text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                      {language === "EN" ? "View Full" : "पूरा देखें"}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            aria-label="Previous"
          >
            <ChevronLeft size={28} />
          </button>

          <div
            className="relative w-[90vw] h-[85vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`Gallery image ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            aria-label="Next"
          >
            <ChevronRight size={28} />
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
