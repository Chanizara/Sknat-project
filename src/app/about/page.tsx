'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ============================================
// HERO SECTION - Drawing to Real Image Reveal
// ============================================
function HeroRevealSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealProgress, setRevealProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Progress from 0 (wireframe only) to 1 (fully revealed)
      const progress = Math.max(0, Math.min(1, -sectionTop / (sectionHeight * 0.5)));
      setRevealProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative"
      style={{ 
        height: '180vh',
        backgroundColor: '#f5f2ee'
      }}
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        
        {/* Image Container - Square aspect ratio, centered */}
        <div 
          className="relative"
          style={{
            width: 'min(85vw, 85vh)',
            height: 'min(85vw, 85vh)',
            maxWidth: '900px',
            maxHeight: '900px'
          }}
        >
          {/* Wireframe Image (Background) */}
          <div className="absolute inset-0 z-10">
            <Image
              src="/house_about_drawing.jpg"
              alt="House Drawing"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Real Image (Reveals from bottom with curtain effect) */}
          <div 
            className="absolute inset-0 z-20 overflow-hidden"
            style={{
              clipPath: `inset(${100 - revealProgress * 100}% 0 0 0)`,
            }}
          >
            <Image
              src="/hero_about.jpg"
              alt="House Real"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Smooth transition line */}
          <div 
            className="absolute left-0 right-0 z-30 pointer-events-none"
            style={{
              top: `${100 - revealProgress * 100}%`,
              height: '2px',
              background: 'rgba(245,242,238,0.5)',
              boxShadow: '0 0 20px rgba(245,242,238,0.8)',
              transform: 'translateY(-50%)'
            }}
          />
        </div>

        {/* Title Overlay - positioned above the image */}
        <div 
          className="absolute top-8 left-1/2 z-40 -translate-x-1/2 text-center"
          style={{
            opacity: Math.max(0, 1 - revealProgress * 2),
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span style={{ color: '#999' }}>◆</span>
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: '#666' }}>
              OUR VISION
            </span>
          </div>
        </div>

        {/* Scroll Indicator - at bottom */}
        <div 
          className="absolute bottom-8 left-1/2 z-40 -translate-x-1/2"
          style={{
            opacity: Math.max(0, 1 - revealProgress * 3),
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: '#999' }}>
              Scroll to reveal
            </span>
            <div 
              className="w-px h-8"
              style={{ 
                backgroundColor: '#ccc',
                animation: 'pulse 2s infinite'
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.7); }
          50% { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </section>
  );
}

// ============================================
// SERVICES SECTION (Light background, long)
// ============================================
function ServicesSection() {
  return (
    <section 
      className="min-h-screen py-24 md:py-32 px-8 md:px-16 lg:px-24"
      style={{ backgroundColor: '#f5f2ee' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-16">
        <span style={{ color: '#999' }}>◆</span>
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: '#666' }}>
          SERVICES
        </span>
      </div>

      {/* Main Headline */}
      <div className="max-w-5xl mb-20">
        <h2 
          className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-12"
          style={{ color: '#1a1a1a', lineHeight: '1.2' }}
        >
          เราดูแลทุกขั้นตอนด้วยความใส่ใจ
          เพื่อให้มั่นใจในคุณภาพและความเข้าใจ
          โครงการของคุณอย่างลึกซึ้ง
        </h2>
      </div>

      {/* Service Items */}
      <div className="space-y-0">
        {/* Service 1 */}
        <div className="border-t border-gray-300 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <h3 className="text-lg font-medium" style={{ color: '#1a1a1a' }}>
                ที่ปรึกษาและกลยุทธ์
              </h3>
            </div>
            <div className="md:col-span-8">
              <p className="text-base leading-relaxed mb-6" style={{ color: '#555', lineHeight: '1.8' }}>
                เราช่วยคุณวางรากฐานสำหรับโครงการโดยการกำหนดแนวทางที่ถูกต้องตั้งแต่เริ่มต้น 
                เราสำรวจเป้าหมาย ความต้องการทางเทคนิค และศักยภาพในการสร้างสรรค์พื้นที่ที่ยอดเยี่ยม
              </p>
              <ul className="space-y-2">
                {['ให้คำปรึกษางบประมาณ', 'จัดเตรียมใบเสนอราคา', 'คำแนะนำการออกแบบเบื้องต้น', 'วางแผนโครงการ', 'คำแนะนำทางเทคนิค'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#555' }}>
                    <span style={{ color: '#999' }}>◇</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Service 2 */}
        <div className="border-t border-gray-300 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <h3 className="text-lg font-medium" style={{ color: '#1a1a1a' }}>
                การออกแบบ
              </h3>
            </div>
            <div className="md:col-span-8">
              <p className="text-base leading-relaxed mb-6" style={{ color: '#555', lineHeight: '1.8' }}>
                เรานำวิสัยทัศน์ของคุณสู่ความเป็นจริงด้วยการพัฒนาแบบแปลนที่แม่นยำและละเอียด 
                รวมถึงแบบร่าง ข้อกำหนด และโซลูชันทางเทคนิคที่เหมาะกับโครงการของคุณ
              </p>
              <ul className="space-y-2">
                {['แบบแปลงานออกแบบละเอียด', 'แก้ไขตามความจำเป็น', 'สำรวจหน้างาน'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#555' }}>
                    <span style={{ color: '#999' }}>◇</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Service 3 */}
        <div className="border-t border-gray-300 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <h3 className="text-lg font-medium" style={{ color: '#1a1a1a' }}>
                การก่อสร้าง
              </h3>
            </div>
            <div className="md:col-span-8">
              <p className="text-base leading-relaxed mb-6" style={{ color: '#555', lineHeight: '1.8' }}>
                ตั้งแต่แนวคิดจนถึงการเสร็จสมบูรณ์ เราจัดการกระบวนการทั้งหมดในการนำโครงการของคุณสู่ความเป็นจริง 
                ทีมงานที่มีประสบการณ์ส่งมอบโซลูชันแบบครบวงจร
              </p>
              <ul className="space-y-2">
                {['การผลิต', 'โลจิสติกส์', 'วางแผนการติดตั้ง', 'การติดตั้ง'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#555' }}>
                    <span style={{ color: '#999' }}>◇</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Service 4 */}
        <div className="border-t border-b border-gray-300 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <h3 className="text-lg font-medium" style={{ color: '#1a1a1a' }}>
                การดูแลหลังการขาย
              </h3>
            </div>
            <div className="md:col-span-8">
              <p className="text-base leading-relaxed mb-6" style={{ color: '#555', lineHeight: '1.8' }}>
                อสังหาฯ ของคุณเป็นการลงทุนที่ออกแบบมาให้คงทน เราให้การสนับสนุนต่อเนื่องเพื่อรักษาคุณภาพ 
                ความปลอดภัย และประสิทธิภาพในระยะยาว
              </p>
              <ul className="space-y-2">
                {['คำแนะนำทางเทคนิค', 'การตรวจสอบหน้างาน', 'การปรับแต่ง', 'การซ่อมแซม'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#555' }}>
                    <span style={{ color: '#999' }}>◇</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// CLIENT STORIES / QUOTE SECTION
// ============================================
function ClientStoriesSection() {
  return (
    <section 
      className="min-h-screen py-24 md:py-32 px-8 md:px-16 lg:px-24"
      style={{ backgroundColor: '#f5f2ee' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-16">
        <div className="flex items-center gap-2">
          <span style={{ color: '#999' }}>◆</span>
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: '#666' }}>
            CLIENT STORIES
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-medium tracking-[0.15em]" style={{ color: '#999' }}>
            01 / 05
          </span>
          <div className="flex gap-2">
            <button className="w-10 h-10 border border-gray-300 flex items-center justify-center transition-all hover:bg-black hover:text-white hover:border-black">
              ←
            </button>
            <button className="w-10 h-10 border border-gray-300 flex items-center justify-center transition-all hover:bg-black hover:text-white hover:border-black">
              →
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Client Image */}
        <div className="lg:col-span-3">
          <div 
            className="relative aspect-[3/4] w-full max-w-[280px] overflow-hidden"
            style={{ backgroundColor: '#e8e4e0' }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-6xl" style={{ color: '#c4c0b8' }}>
              👤
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="lg:col-span-9">
          <span className="text-6xl md:text-8xl font-serif leading-none" style={{ color: '#1a1a1a' }}>"</span>
          <blockquote 
            className="text-2xl md:text-3xl lg:text-4xl font-light leading-snug mb-12 -mt-4"
            style={{ color: '#1a1a1a', lineHeight: '1.3' }}
          >
            การบริการจาก SKNAT นั้นยอดเยี่ยมมาก
            ตั้งแต่เริ่มต้นจนถึงขั้นตอนสุดท้าย
            ทีมงานแสดงให้เห็นถึงความเป็นมืออาชีพ
            และมาตรฐานการทำงานที่สูง
            เราไม่ลังเลที่จะแนะนำ SKNAT เลย
          </blockquote>

          {/* Client Info */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xl font-medium mb-1" style={{ color: '#1a1a1a' }}>
                คุณสมชาย ใจดี
              </p>
              <p className="text-xs tracking-[0.2em] uppercase" style={{ color: '#666' }}>
                HOMEOWNER
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">⭐</span>
              <span className="text-xs tracking-[0.1em]" style={{ color: '#666' }}>
                GOOGLE REVIEW SCORE: 5.0 OF 5
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// HORIZONTAL PROCESS SECTION
// ============================================
function HorizontalProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const processes = [
    {
      number: '1',
      title: 'DESIGN PHASE',
      headline: 'You imagine,\nwe make it real.',
      description: 'เมื่อได้รับการอนุมัติใบเสนอราคา เราจะเริ่มต้นด้วยการรับฟังวิสัยทัศน์ของคุณและเข้าใจเรื่องราวที่คุณต้องการสร้างสรรค์ เราศึกษาแบบแปลนของคุณและสำรวจโซลูชันที่ดีที่สุดเพื่อสร้างสรรค์วิสัยทัศน์นั้น โดยสมดุลระหว่างความสวยงาม ประสิทธิภาพ และความแม่นยำ',
      image: 'design'
    },
    {
      number: '2',
      title: 'PLANNING PHASE',
      headline: 'Precision in\nevery detail.',
      description: 'ทีมวิศวกรและสถาปนิกของเราจะวางแผนทุกขั้นตอนอย่างละเอียด คำนึงถึงโครงสร้าง วัสดุ และเวลาที่เหมาะสม เพื่อให้โครงการเสร็จสมบูรณ์ตามมาตรฐานสูงสุด',
      image: 'planning'
    },
    {
      number: '3',
      title: 'EXECUTION PHASE',
      headline: 'Crafted with\nexcellence.',
      description: 'ทีมช่างฝีมือของเราดำเนินการก่อสร้างด้วยความประณีต ใส่ใจในทุกรายละเอียด ตรวจสอบคุณภาพในแต่ละขั้นตอน เพื่อให้ผลงานออกมาสมบูรณ์แบบ',
      image: 'execution'
    },
    {
      number: '4',
      title: 'DELIVERY PHASE',
      headline: 'Handing over\nperfection.',
      description: 'ก่อนส่งมอบ เราตรวจสอบคุณภาพครั้งสุดท้ายและให้คำแนะนำในการดูแลรักษา พร้อมการติดตามผลหลังการขายเพื่อความพึงพอใจสูงสุดของลูกค้า',
      image: 'delivery'
    }
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const scrollProgress = Math.max(0, Math.min(1, -sectionTop / (sectionHeight - windowHeight)));
      
      setProgress(scrollProgress);
      setActiveIndex(Math.min(Math.floor(scrollProgress * processes.length), processes.length - 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [processes.length]);

  return (
    <section 
      ref={containerRef}
      className="relative"
      style={{ 
        backgroundColor: '#1a1a1a',
        height: `${(processes.length + 1) * 100}vh`
      }}
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 h-px" style={{ backgroundColor: '#333' }}>
          <div 
            className="h-full transition-all duration-100"
            style={{ 
              backgroundColor: '#f5f2ee',
              width: `${progress * 100}%`
            }}
          />
        </div>

        {/* Progress Indicators */}
        <div className="absolute top-8 left-8 right-8 z-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span style={{ color: '#666' }}>◆</span>
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: '#999' }}>
              OUR PROCESS
            </span>
          </div>
          <div className="flex gap-2">
            {processes.map((_, idx) => (
              <div 
                key={idx}
                className="w-8 h-1 transition-all duration-300"
                style={{ 
                  backgroundColor: idx <= activeIndex ? '#f5f2ee' : '#333'
                }}
              />
            ))}
          </div>
        </div>

        {/* Horizontal Scroll Content */}
        <div 
          className="flex h-full transition-transform duration-100"
          style={{ 
            transform: `translateX(-${progress * (processes.length - 1) * 100}vw)`,
            width: `${processes.length * 100}vw`
          }}
        >
          {processes.map((process, idx) => (
            <div 
              key={idx}
              className="flex-shrink-0 flex h-full"
              style={{ width: '100vw' }}
            >
              {/* Left Images Area - Overlapping style */}
              <div className="w-[50%] relative p-8 flex items-center">
                <div className="relative w-full max-w-lg aspect-[4/3]">
                  {/* Main Image - Top Left */}
                  <div 
                    className="absolute top-0 left-0 w-[65%] h-[75%] overflow-hidden"
                    style={{ backgroundColor: '#2a2a2a' }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      {idx === 0 && <span className="text-6xl">🏡</span>}
                      {idx === 1 && <span className="text-6xl">📐</span>}
                      {idx === 2 && <span className="text-6xl">🔨</span>}
                      {idx === 3 && <span className="text-6xl">🏠</span>}
                    </div>
                  </div>
                  {/* Secondary Image - Bottom Right overlapping */}
                  <div 
                    className="absolute bottom-0 right-0 w-[55%] h-[65%] overflow-hidden z-10"
                    style={{ backgroundColor: '#333' }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      {idx === 0 && <span className="text-5xl">📋</span>}
                      {idx === 1 && <span className="text-5xl">📊</span>}
                      {idx === 2 && <span className="text-5xl">⚙️</span>}
                      {idx === 3 && <span className="text-5xl">🔑</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="flex-1 flex flex-col justify-center px-16 pr-24">
                <div className="mb-6">
                  <span 
                    className="text-xs tracking-[0.2em] uppercase"
                    style={{ color: '#666' }}
                  >
                    {process.number}. {process.title}
                  </span>
                </div>

                <h3 
                  className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 whitespace-pre-line"
                  style={{ color: '#f5f2ee', lineHeight: '1.15' }}
                >
                  {process.headline}
                </h3>

                <p 
                  className="text-base leading-relaxed max-w-lg"
                  style={{ color: '#999', lineHeight: '1.8' }}
                >
                  {process.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// STICKY NAVIGATION BAR
// ============================================
function StickyNavBar() {
  const [menuHover, setMenuHover] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/about' },
    { label: 'Properties', href: '/#properties' },
    { label: 'Approach', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <div 
      className="fixed bottom-6 left-1/2 z-[100]"
      style={{ transform: 'translateX(-50%)' }}
      onMouseEnter={() => setMenuHover(true)}
      onMouseLeave={() => setMenuHover(false)}
    >
      {/* Dropdown Menu */}
      <div 
        className="absolute left-1/2 w-56 overflow-hidden pointer-events-none"
        style={{
          bottom: '100%',
          transform: `translateX(-50%) translateY(${menuHover ? '0' : '10px'})`,
          opacity: menuHover ? 1 : 0,
          transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          marginBottom: '8px',
        }}
      >
        <div 
          className="pointer-events-auto"
          style={{
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 -20px 60px -20px rgba(0,0,0,0.5)',
          }}
        >
          <div className="px-3 py-3">
            <nav>
              {navItems.map((item, index) => (
              <div
                key={item.label}
                style={{
                  borderBottom: index < navItems.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                <Link
                  href={item.href}
                  className="group flex w-full items-center justify-between py-2.5 px-2 transition-all hover:pl-3"
                >
                  <span className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {item.label}
                  </span>
                  <svg className="h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-40 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.5)">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div 
        className="flex items-center gap-6 px-8 py-3"
        style={{ 
          backgroundColor: 'rgba(42,42,42,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '2px',
        }}
      >
        {/* Logo icon */}
        <Link href="/" className="transition-opacity hover:opacity-70">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ stroke: '#f5f2ee', strokeWidth: 1.5 }}>
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </Link>

        <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.15)' }} />

        <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: '#f5f2ee' }}>
          APPROACH
        </span>

        <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.15)' }} />

        <div className="flex items-center justify-center w-8 h-8 cursor-pointer" style={{ color: '#f5f2ee' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ stroke: 'currentColor', strokeWidth: 1.5 }}>
            <line x1="3" y1="8" x2="21" y2="8" />
            <line x1="3" y1="16" x2="21" y2="16" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ============================================
// FOOTER SECTION
// ============================================
function AboutFooter() {
  return (
    <footer 
      className="relative py-8 px-8 md:px-16"
      style={{ 
        backgroundColor: '#f5f2ee',
        borderTop: '1px solid #d4d0c8'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-[11px]" style={{ color: '#666' }}>
          <span>&copy; {new Date().getFullYear()}, SKNAT Property</span>
          <Link href="/about" className="transition hover:text-black">Line</Link>
          <Link href="/" className="transition hover:text-black">Instagram</Link>
        </div>
        <div className="flex items-center gap-6 text-[11px]" style={{ color: '#666' }}>
          <Link href="/" className="transition hover:text-black">นโยบายความเป็นส่วนตัว</Link>
          <span>·</span>
          <Link href="/" className="transition hover:text-black">ข้อตกลงการใช้งาน</Link>
          <span>·</span>
          <Link href="/admin/properties" className="transition hover:text-black">Admin</Link>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function AboutPage() {
  return (
    <main style={{ fontFamily: '"Sarabun", "Noto Sans Thai", sans-serif' }}>
      {/* Section 0: Hero - Drawing to Real Image Reveal */}
      <HeroRevealSection />
      
      {/* Section 1: Services */}
      <ServicesSection />
      
      {/* Section 2: Client Stories / Quote */}
      <ClientStoriesSection />
      
      {/* Section 3: Our Process (Horizontal Scroll) */}
      <HorizontalProcessSection />
      
      {/* Section 4: Footer */}
      <AboutFooter />
      
      {/* Sticky Navigation Bar */}
      <StickyNavBar />
    </main>
  );
}
