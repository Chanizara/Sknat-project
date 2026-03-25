'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      
      // Calculate how much of the footer is in view
      // 0 = just entering at bottom, 1 = fully in view
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH * 0.6)));
      setScrollProgress(progress);
      setIsInView(rect.top < windowH && rect.bottom > 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (!isHomePage) {
      window.location.assign(sectionId === 'home' ? '/' : `/#${sectionId}`);
      return;
    }
    if (sectionId === 'home') {
      const lenis = (window as unknown as { lenis?: { scrollTo: (target: number) => void } }).lenis;
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const lenis = (window as unknown as { lenis?: { scrollTo: (target: number) => void } }).lenis;
      const targetY = element.getBoundingClientRect().top + window.scrollY - 80;
      if (lenis) {
        lenis.scrollTo(targetY);
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    { label: 'About',      id: 'about' },
    { label: 'Services',   id: 'services' },
    { label: 'Properties', id: 'properties' },
    { label: 'Approach',   id: 'about' },
    { label: 'Contact',    id: 'contact' },
  ];

  // Animation values based on scroll progress
  // When progress is 0: small icon state
  // When progress is 1: full card state
  const cardScale = 0.15 + (scrollProgress * 0.85); // 0.15 -> 1
  const cardOpacity = 0.4 + (scrollProgress * 0.6);  // 0.4 -> 1
  const cardBlur = (1 - scrollProgress) * 20;        // 20px -> 0
  const cardY = (1 - scrollProgress) * 60;           // 60px -> 0
  const borderRadius = 2.7 - (scrollProgress * 0.7); // 2.7rem -> 2rem
  
  // Content fade in (appears later in the animation)
  const contentOpacity = Math.max(0, (scrollProgress - 0.3) / 0.7);
  const contentY = (1 - contentOpacity) * 20;

  return (
    <footer
      ref={sectionRef}
      id="site-footer"
      className="relative overflow-hidden"
      style={{ height: '100vh', minHeight: '600px', zIndex: 10 }}
    >
      {/* ── Full-bleed background ── */}
      <div className="absolute inset-0">
        <Image
          src="/footer.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* very light tint so card still reads */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.18)' }}
        />
      </div>

      {/* ── Giant watermark ── */}
      <div className="pointer-events-none absolute inset-0 flex items-end overflow-hidden select-none pb-16">
        <p
          className="w-full text-center font-black uppercase leading-none tracking-tight"
          style={{
            fontSize: 'clamp(6rem, 22vw, 26rem)',
            color: 'rgba(255,255,255,0.07)',
            letterSpacing: '-0.03em',
          }}
        >
          SKNAT
        </p>
      </div>

      {/* ── Popup card with scroll-based animation ── */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div
          className="w-full max-w-[520px]"
          style={{
            transform: `translateY(${cardY}px) scale(${cardScale})`,
            opacity: cardOpacity,
            filter: `blur(${cardBlur}px)`,
            transition: 'transform 0.1s linear, opacity 0.1s linear, filter 0.1s linear',
            willChange: 'transform, opacity, filter',
          }}
        >
          <div
            className="relative"
            style={{
              background: 'linear-gradient(180deg, rgba(28,28,30,0.78), rgba(18,18,20,0.9))',
              backdropFilter: 'blur(32px) saturate(135%)',
              WebkitBackdropFilter: 'blur(32px) saturate(135%)',
              borderRadius: `${borderRadius}rem`,
              border: '1px solid rgba(255,255,255,0.12)',
              overflow: 'hidden',
              boxShadow: scrollProgress > 0.5
                ? '0 42px 110px -58px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.15)'
                : '0 20px 40px -30px rgba(0,0,0,0.45)',
              transition: 'box-shadow 0.3s ease, border-radius 0.1s linear',
            }}
          >
            {/* Glossy highlight */}
            <div
              className="pointer-events-none absolute inset-x-[12%] top-0 h-20 rounded-full"
              style={{
                background: 'radial-gradient(circle at top, rgba(255,255,255,0.28), rgba(255,255,255,0) 72%)',
                filter: 'blur(14px)',
                opacity: 0.4 + (scrollProgress * 0.6),
                transform: `translateY(${(1 - scrollProgress) * 18 - 8}px) scaleX(${0.5 + scrollProgress * 0.5})`,
                transition: 'opacity 0.1s linear, transform 0.1s linear',
              }}
            />
            
            {/* Side glow */}
            <div
              className="pointer-events-none absolute -left-8 top-14 h-28 w-28 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.08), rgba(255,255,255,0) 70%)',
                filter: 'blur(8px)',
                opacity: scrollProgress,
                transition: 'opacity 0.1s linear',
              }}
            />

            {/* Card Content - fades in as card expands */}
            <div 
              className="px-8 pt-8 pb-6 md:px-10 md:pt-10 md:pb-7"
              style={{
                opacity: contentOpacity,
                transform: `translateY(${contentY}px)`,
                transition: 'opacity 0.15s ease, transform 0.15s ease',
              }}
            >
              {/* MENU label */}
              <p
                className="mb-5 text-[10px] font-light tracking-[0.5em] uppercase"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                MENU
              </p>

              {/* Nav items */}
              <nav className="mb-7">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.id)}
                    className="group flex w-full items-baseline justify-between bg-transparent border-none cursor-pointer py-[7px] text-left"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <span
                      className="text-[2.1rem] font-extralight leading-tight transition-all duration-200 group-hover:pl-1"
                      style={{ color: 'rgba(255,255,255,0.82)', fontFamily: 'inherit' }}
                    >
                      {item.label}
                    </span>
                    <svg
                      className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-60 group-hover:translate-x-0"
                      fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.7)"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                ))}
              </nav>

              {/* Two-column contact */}
              <div className="mb-7 grid grid-cols-2 gap-x-6 text-sm">
                <div className="space-y-1.5">
                  <a
                    href="https://line.me/R/ti/p/@sknat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-colors duration-150"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                  >
                    Line: @sknat
                  </a>
                  <a
                    href="mailto:hello@sknat.co.th"
                    className="block transition-colors duration-150"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                  >
                    hello@sknat.co.th
                  </a>
                </div>
                <div className="space-y-1.5">
                  <p style={{ color: 'rgba(255,255,255,0.5)' }}>089-999-9999</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)' }}>02-123-4567</p>
                </div>
              </div>

              {/* CTA button */}
              <a
                href="https://line.me/R/ti/p/@sknat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 py-[14px] transition-all duration-200"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))',
                  border: '1px solid rgba(255,255,255,0.16)',
                  borderRadius: '1rem',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)';
                  (e.currentTarget as HTMLElement).style.color = '#fff';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)';
                }}
              >
                <span style={{ fontFamily: 'monospace', fontSize: '1rem' }}>↳</span>
                GET IN TOUCH
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom pill bar ── */}
      <div
        className="absolute bottom-6 left-1/2 z-20 flex items-center gap-4 px-5 py-3"
        style={{
          transform: isInView
            ? 'translateX(-50%) translateY(0)'
            : 'translateX(-50%) translateY(24px)',
          opacity: isInView ? 1 : 0,
          transition: 'transform 0.75s 0.2s cubic-bezier(0.22,1,0.36,1), opacity 0.75s 0.2s ease',
          background: 'rgba(14,14,14,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '9999px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* House logo icon */}
        <button
          onClick={() => scrollToSection('home')}
          className="cursor-pointer bg-transparent border-none p-0 opacity-70 hover:opacity-100 transition"
        >
          <Image
            src="/house_logo.png"
            alt="SKNAT"
            width={22}
            height={22}
            className="h-[22px] w-auto brightness-[10]"
          />
        </button>

        {/* Brand */}
        <span
          className="text-[11px] font-semibold tracking-[0.3em] uppercase"
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          SKNAT
        </span>

        {/* Back to top */}
        <button
          onClick={() => {
            const lenis = (window as unknown as { lenis?: { scrollTo: (target: number) => void } }).lenis;
            if (lenis) lenis.scrollTo(0);
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cursor-pointer bg-transparent border-none p-0 opacity-50 hover:opacity-100 transition"
          aria-label="กลับด้านบน"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.9)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* ── Bottom corner bars ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-3.5 md:px-10"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-4 text-[11px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
          <span>&copy; {new Date().getFullYear()}, SKNAT Property</span>
          <a
            href="https://line.me/R/ti/p/@sknat"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white/60"
            style={{ color: 'inherit' }}
          >
            Line
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white/60"
            style={{ color: 'inherit' }}
          >
            Instagram
          </a>
        </div>
        <div className="flex items-center gap-4 text-[11px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
          <span>นโยบายความเป็นส่วนตัว</span>
          <span>·</span>
          <span>ข้อตกลงการใช้งาน</span>
          <span>·</span>
          <Link
            href="/admin/properties"
            className="transition hover:text-white/60"
            style={{ color: 'inherit' }}
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
