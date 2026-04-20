"use client";

import { useEffect } from "react";

/**
 * IntersectionObserver-based scroll reveal.
 * Call once in a page component to activate all `.reveal`,
 * `.reveal-left`, `.reveal-right`, `.reveal-scale`, and
 * `.stagger-children` elements.
 */
export function useReveal() {
  useEffect(() => {
    const selectors =
      ".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children";
    const elements = document.querySelectorAll(selectors);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
