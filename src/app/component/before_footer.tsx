'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function BeforeFooter() {
  const PARALLAX_FACTOR = 0.045;
  const WATERMARK_FACTOR = 0.02;

  const sectionRef = useRef<HTMLElement>(null);
  const [parallaxOffsetY, setParallaxOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;

      const section = sectionRef.current;
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const relativeScroll = scrollY - sectionTop;
        const clampedRelative = Math.max(-windowH, Math.min(relativeScroll, sectionHeight + windowH));
        setParallaxOffsetY(clampedRelative * PARALLAX_FACTOR);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="before-footer"
      className="relative overflow-hidden"
      style={{ height: '100vh', minHeight: '600px', zIndex: 10 }}
    >
      {/* Full-bleed background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -inset-y-10 inset-x-0"
          style={{
            transform: `translate3d(0, ${parallaxOffsetY}px, 0)`,
            transition: 'transform 0.14s linear',
          }}
        >
          <Image src="/footer.jpg" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.18)' }} />
        </div>
      </div>

      {/* Giant watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-end overflow-hidden select-none pb-16">
        <p
          className="w-full text-center font-black uppercase leading-none tracking-tight"
          style={{
            fontSize: 'clamp(6rem, 22vw, 26rem)',
            color: 'rgba(255,255,255,0.07)',
            letterSpacing: '-0.03em',
            transform: `translate3d(0, ${parallaxOffsetY * WATERMARK_FACTOR}px, 0)`,
            transition: 'transform 0.14s linear',
          }}
        >
          SKNAT
        </p>
      </div>

      {/* Bottom footer bar */}
      <div className="absolute bottom-0 left-0 right-0 z-50">
        <div
          className="flex items-center justify-between px-6 py-4 md:px-10"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
          }}
        >
          <div className="flex items-center gap-4 text-[12px]" style={{
            color: 'rgba(255,255,255,0.55)',
            textShadow: '0 1px 3px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
          }}>
            <span>&copy; {new Date().getFullYear()}, SKNAT Property</span>
            <Link href="/about" className="transition hover:text-white/80" style={{ color: 'inherit' }}>Line</Link>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="transition hover:text-white/80" style={{ color: 'inherit' }}>Instagram</a>
          </div>
          <div className="flex items-center gap-4 text-[12px]" style={{
            color: 'rgba(255,255,255,0.55)',
            textShadow: '0 1px 3px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
          }}>
            <span>นโยบายความเป็นส่วนตัว</span>
            <span>·</span>
            <span>ข้อตกลงการใช้งาน</span>
            <span>·</span>
            <Link href="/admin/properties" className="transition hover:text-white/80" style={{ color: 'inherit' }}>Admin</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
