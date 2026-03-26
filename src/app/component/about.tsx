"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, 1 - rect.top / vh));
      setSlideProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const translateY = (1 - slideProgress) * 160;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-white py-28 md:py-40"
      style={{
        transform: `translateY(${translateY}px)`,
        zIndex: 10,
        boxShadow: "none",
        willChange: "transform",
      }}
    >
      <div className="container relative mx-auto px-6 md:px-10">
        {/* Label */}
        <div
          className={`mb-10 flex items-center justify-center gap-2 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <span className="text-slate-400">✦</span>
          <span className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
            About SKNAT
          </span>
        </div>

        {/* Headline */}
        <div
          className={`mx-auto max-w-4xl text-center transition-all duration-1000 delay-100 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2
            className="font-light leading-[1.18] tracking-tight text-slate-950"
            style={{ fontSize: "clamp(2rem, 4.5vw, 4.2rem)" }}
          >
            We connect exceptional properties
            <br />
            with those who live with vision.
          </h2>
        </div>

        {/* CTA */}
        <div
          className={`mt-12 flex justify-center transition-all duration-1000 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-3 bg-slate-950 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-slate-800"
          >
            <span style={{ fontFamily: "monospace" }}>↳</span>
            Who We Are
          </Link>
        </div>
      </div>
    </section>
  );
}
