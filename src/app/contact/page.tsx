'use client';

import Link from "next/link";
import { useState } from "react";

// Animated Button Component with text slide up effect
function AnimatedButton({ 
  href, 
  children, 
  variant = 'primary',
  external = false 
}: { 
  href: string; 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'outline';
  external?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyles = "relative overflow-hidden inline-flex items-center justify-center px-8 py-3.5 text-xs font-medium tracking-widest uppercase transition-all";
  
  const variantStyles: Record<string, { bg: string; color: string; border?: string }> = {
    primary: { bg: '#1a1a1a', color: '#f5f2ee' },
    secondary: { bg: 'transparent', color: '#1a1a1a' },
    outline: { bg: 'transparent', color: '#1a1a1a', border: '1px solid #1a1a1a' }
  };

  const content = (
    <>
      {/* Original text - slides up on hover */}
      <span 
        className="block transition-transform duration-300"
        style={{
          transform: isHovered ? 'translateY(-100%)' : 'translateY(0)',
        }}
      >
        {children}
      </span>
      {/* Duplicate text - slides up from below */}
      <span 
        className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
        style={{
          transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {children}
      </span>
    </>
  );

  const style = variantStyles[variant];

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseStyles}
        style={{ 
          backgroundColor: style.bg,
          color: style.color,
          border: style.border,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={baseStyles}
      style={{ 
        backgroundColor: style.bg,
        color: style.color,
        border: style.border,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {content}
    </Link>
  );
}

// Animated Link with arrow
function AnimatedLink({ 
  href, 
  children,
  external = false
}: { 
  href: string; 
  children: React.ReactNode;
  external?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <>
      <span className="relative overflow-hidden inline-block">
        <span 
          className="block transition-transform duration-300"
          style={{ transform: isHovered ? 'translateY(-100%)' : 'translateY(0)' }}
        >
          {children}
        </span>
        <span 
          className="absolute inset-0 flex items-center transition-transform duration-300"
          style={{ transform: isHovered ? 'translateY(0)' : 'translateY(100%)' }}
        >
          {children}
        </span>
      </span>
      <span 
        className="transition-transform duration-300"
        style={{ transform: isHovered ? 'translateX(4px)' : 'translateX(0)' }}
      >
        ↳
      </span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase"
        style={{ color: '#1a1a1a' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase"
      style={{ color: '#1a1a1a' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {content}
    </Link>
  );
}

export default function ContactPage() {
  return (
    <main 
      className="min-h-screen flex flex-col"
      style={{ 
        backgroundColor: '#f5f2ee',
        color: '#1a1a1a',
        fontFamily: '"Sarabun", "Noto Sans Thai", sans-serif'
      }}
    >
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-8 py-6 md:px-12">
        <Link href="/" className="text-xl font-medium tracking-tight" style={{ color: '#1a1a1a' }}>
          SKNAT
        </Link>
        <a
          href="https://line.me/R/ti/p/@sknat"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-70"
          style={{ color: '#1a1a1a' }}
        >
          <span>→</span>
          GET A QUOTE
        </a>
      </header>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Column - Text Content */}
        <div className="flex-1 px-8 py-12 md:px-12 lg:py-16 lg:pr-16">
          {/* Section Label */}
          <div className="flex items-center gap-2 mb-6">
            <span style={{ color: '#999' }}>◆</span>
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: '#666' }}>
              CONTACT
            </span>
          </div>

          {/* Main Headline */}
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6"
            style={{ 
              color: '#1a1a1a',
              lineHeight: '1.15',
              letterSpacing: '-0.02em'
            }}
          >
            เริ่มต้นทุกการลงทุน<br />
            ด้วยความเข้าใจ<br />
            ที่ถูกต้อง
          </h1>

          {/* Subtext */}
          <p 
            className="text-sm md:text-base max-w-md mb-10 leading-relaxed"
            style={{ color: '#666', lineHeight: '1.7' }}
          >
            ให้ส่วนติดต่ออยู่ด้านหน้าของฟุตเตอร์แบบชัดเจน พร้อมมิติที่ลอยช้ากว่าเนื้อหา 
            เพื่อให้ภาพรวมดูนิ่ง ละเอียด และมีความเป็นสถาปัตยกรรมมากขึ้น
          </p>

          {/* CTA Buttons with Animation */}
          <div className="flex items-center gap-4 mb-16">
            <AnimatedButton href="/" variant="primary">
              ดูโครงการ
            </AnimatedButton>
            <AnimatedLink href="https://line.me/R/ti/p/@sknat" external>
              ติดต่อเรา
            </AnimatedLink>
          </div>

          {/* Divider */}
          <div className="w-full h-px mb-12" style={{ backgroundColor: '#d4d0c8' }} />

          {/* GET IN TOUCH Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-8">
              <span style={{ color: '#999' }}>◆</span>
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: '#666' }}>
                GET IN TOUCH
              </span>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Talk to us */}
              <div>
                <p className="text-sm mb-2" style={{ color: '#333' }}>Talk to us</p>
                <a 
                  href="tel:0899999999" 
                  className="text-sm font-normal tracking-wide underline underline-offset-4 transition-opacity hover:opacity-60"
                  style={{ color: '#1a1a1a' }}
                >
                  089 999 9999
                </a>
              </div>

              {/* Write us */}
              <div>
                <p className="text-sm mb-2" style={{ color: '#333' }}>Write us</p>
                <a 
                  href="mailto:hello@sknat.co.th" 
                  className="text-sm font-normal tracking-wide underline underline-offset-4 transition-opacity hover:opacity-60"
                  style={{ color: '#1a1a1a' }}
                >
                  HELLO@SKNAT.CO.TH
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px mb-12" style={{ backgroundColor: '#d4d0c8' }} />

          {/* ADDRESS Section */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <span style={{ color: '#999' }}>◆</span>
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: '#666' }}>
                ADDRESS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Address */}
              <div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: '#333', lineHeight: '1.8' }}>
                  123 อาคารสกนัท ทาวเวอร์<br />
                  ถนนสุขุมวิท แขวงคลองเตย<br />
                  กรุงเทพมหานคร 10110
                </p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-medium tracking-[0.15em] uppercase underline underline-offset-4 transition-opacity hover:opacity-60"
                  style={{ color: '#1a1a1a' }}
                >
                  GOOGLE MAPS
                </a>
              </div>

              {/* Visit us */}
              <div>
                <p className="text-sm mb-2" style={{ color: '#333' }}>Visit us</p>
                <a 
                  href="#" 
                  className="text-[11px] font-medium tracking-[0.15em] uppercase underline underline-offset-4 transition-opacity hover:opacity-60"
                  style={{ color: '#1a1a1a' }}
                >
                  BOOK A VISIT
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Visual/Graphic */}
        <div className="hidden lg:flex lg:w-[45%] items-center justify-center p-12">
          <div className="relative w-full max-w-lg">
            {/* Wireframe cube/structure illustration */}
            <svg 
              viewBox="0 0 400 400" 
              className="w-full h-auto"
              style={{ 
                stroke: '#c4c0b8',
                strokeWidth: '1',
                fill: 'none'
              }}
            >
              {/* Cube outline */}
              <path d="M50 150 L200 50 L350 150 L350 300 L200 400 L50 300 Z" />
              {/* Front face */}
              <path d="M50 150 L200 250 L200 400 L50 300 Z" />
              {/* Top face */}
              <path d="M50 150 L200 250 L350 150 L200 50 Z" />
              {/* Side face */}
              <path d="M200 250 L350 150 L350 300 L200 400 Z" />
              {/* Inner lines for depth */}
              <path d="M125 200 L200 150 L275 200" strokeDasharray="4 4" style={{ stroke: '#d4d0c8' }} />
              <path d="M200 250 L200 400" strokeDasharray="4 4" style={{ stroke: '#d4d0c8' }} />
              {/* Additional architectural lines */}
              <line x1="100" y1="175" x2="100" y2="325" style={{ stroke: '#e0dcd4' }} />
              <line x1="300" y1="175" x2="300" y2="325" style={{ stroke: '#e0dcd4' }} />
              <line x1="150" y1="125" x2="150" y2="225" style={{ stroke: '#e0dcd4' }} />
              <line x1="250" y1="125" x2="250" y2="225" style={{ stroke: '#e0dcd4' }} />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Bottom Contact Bar ── */}
      <div 
        className="flex items-center justify-center px-8 py-5"
        style={{ 
          borderTop: '1px solid #d4d0c8',
          backgroundColor: '#f5f2ee'
        }}
      >
        <Link
          href="/contact"
          className="flex items-center gap-6 px-10 py-3 transition-all"
          style={{ 
            backgroundColor: '#2a2a2a',
            color: '#f5f2ee',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#3a3a3a';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#2a2a2a';
          }}
        >
          {/* Logo icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ stroke: '#f5f2ee', strokeWidth: 1.5 }}>
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="text-xs font-medium tracking-[0.2em] uppercase">CONTACT</span>
          {/* Menu icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ stroke: '#f5f2ee', strokeWidth: 1.5 }}>
            <line x1="3" y1="8" x2="21" y2="8" />
            <line x1="3" y1="16" x2="21" y2="16" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
