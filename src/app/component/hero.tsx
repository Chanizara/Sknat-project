"use client";

import { useEffect, useState } from "react";


const images = [
  "/hero_1.jpg",
  "/hero_2.jpg",
  "/hero_3.jpg",
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate parallax effect - slower movement creates depth
  const parallaxOffset = scrollY * 0.5;

  return (
    <section className="relative h-[100vh] w-full overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="Hero"
            className={`
              absolute inset-0 h-full w-full object-cover
              transition-opacity duration-[2000ms] ease-in-out
              ${i === index ? "opacity-100" : "opacity-0"}
            `}
            style={{ animation: 'hero-zoom 9s ease-in-out alternate infinite' }}
          />
        ))}

        {/* Fluid glass ambient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
          <div style={{
            position: 'absolute', width: '75%', height: '75%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 68%)',
            filter: 'blur(90px)',
            top: '-18%', left: '-12%',
            animation: 'blob-drift-1 20s ease-in-out infinite',
            willChange: 'transform',
          }} />
          <div style={{
            position: 'absolute', width: '60%', height: '60%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.17) 0%, transparent 68%)',
            filter: 'blur(75px)',
            top: '22%', right: '-8%',
            animation: 'blob-drift-2 26s ease-in-out infinite',
            animationDelay: '-10s',
            willChange: 'transform',
          }} />
          <div style={{
            position: 'absolute', width: '55%', height: '55%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 68%)',
            filter: 'blur(65px)',
            bottom: '-12%', left: '22%',
            animation: 'blob-drift-3 22s ease-in-out infinite',
            animationDelay: '-6s',
            willChange: 'transform',
          }} />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" style={{ zIndex: 2 }} />
      </div>

      <div className="hero-scroll-cue hero-ui-reveal absolute bottom-9 left-1/2 z-40 -translate-x-1/2 text-white/80 md:bottom-11" style={{ animationDelay: '0.9s' }}>
        <span className="hero-scroll-cue__label">SCROLL DOWN</span>
        <span className="hero-scroll-cue__line">
          <span className="hero-scroll-cue__dot" />
        </span>
      </div>

      {/* Slide Indicator */}
        <div
        className="
            hero-ui-reveal
            absolute
            right-12
            bottom-16
            z-50
            flex flex-col items-center
            text-white/80
            text-xs
            tracking-widest
        "
        style={{ animationDelay: '1.1s' }}
        >
        {/* Current / Total */}
        <span>
            {(index + 1).toString().padStart(2, "0")}
        </span>

        {/* Line */}
        <div className="h-10 w-px bg-white/40 my-2" />

        <span>
            {images.length.toString().padStart(2, "0")}
        </span>
        </div>

    </section>
  );
}
