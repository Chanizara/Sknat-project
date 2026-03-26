"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full" style={{ height: "155vh", zIndex: 1 }}>

      {/* Video — parallax: moves up slower than scroll */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <video
          src="/mainpage_hero_2.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/15 to-black/65" />
      </div>

      {/* Brand name — center top */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-8">
        <span className="text-white text-sm font-medium tracking-[0.2em] uppercase">sknat</span>
      </div>

      {/* Text block — parallax: moves up faster than video, slower than scroll */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-10 pb-16"
        style={{ transform: `translateY(${scrollY * -0.15}px)` }}
      >
        <div className="max-w-6xl mx-auto">

          {/* Headline */}
          <h1
            className="text-white font-light leading-tight mb-16"
            style={{ fontSize: "clamp(2.6rem, 5.8vw, 5.2rem)" }}
          >
            Exceptional properties for those<br />who live with vision.
          </h1>

          {/* Divider */}
          <div className="w-full h-px bg-white/30 mb-8" />

          {/* Label + description */}
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <span className="text-white/55 text-xs tracking-[0.25em] uppercase whitespace-nowrap pt-0.5">
              ✦ Property Specialists
            </span>
            <p className="text-white/65 text-sm leading-relaxed max-w-sm md:ml-auto md:text-right">
              We curate and present bespoke residential properties for discerning
              buyers and investors. Every listing reflects our commitment to
              quality, location, and lifestyle.
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}
