'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import BeforeFooter from "../component/before_footer";

// ============================================
// HERO TEXT SECTION - Initial text display
// ============================================
function HeroTextSection() {
  return (
    <section 
      className="relative pt-8 pb-16 px-8"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="text-center">
        {/* SKNAT Logo */}
        <div className="mb-16">
          <span 
            className="text-xl font-semibold tracking-tight"
            style={{ color: '#1a1a1a' }}
          >
            SKNAT
          </span>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-6">
          <span style={{ color: '#999' }}>◆</span>
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: '#666' }}>
            OUR APPROACH
          </span>
        </div>
        <h2 
          className="text-3xl md:text-4xl lg:text-5xl font-light"
          style={{ color: '#1a1a1a', lineHeight: '1.2' }}
        >
          สร้างสรรค์วิสัยทัศน์<br />
          สู่การปฏิบัติที่สมบูรณ์แบบ
        </h2>
      </div>
    </section>
  );
}

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
      const progress = Math.max(0, Math.min(1, -sectionTop / (sectionHeight * 0.2)));
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
        height: '300vh',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        
        {/* Image Container */}
        <div 
          className="relative"
          style={{
            width: '95vw',
            height: '95vh',
            maxWidth: '1400px',
            maxHeight: '900px'
          }}
        >
          {/* Wireframe Image (Background) */}
          <div className="absolute inset-0 z-10">
            <Image
              src="/house_about_drawings.jpg"
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
              boxShadow: '0 0 20px rgba(255,255,255,0.8)',
              transform: 'translateY(-50%)'
            }}
          />
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
// SERVICES SECTION (Light background, long) - With Parallax
// ============================================
function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // When section enters viewport, calculate parallax offset
      if (rect.top < windowHeight) {
        const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const offset = Math.max(-100, -scrollProgress * 150); // Move up faster
        setParallaxY(offset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-32 px-8 md:px-16 lg:px-24"
      style={{ 
        backgroundColor: '#ffffff',
        zIndex: 50,
        marginTop: '-30vh', // Overlap with hero
        transform: `translateY(${parallaxY}px)`,
        willChange: 'transform'
      }}
    >
      {/* Top Long Line */}
      <div className="w-full h-px bg-gray-200 mb-16" />
      
      {/* Header & Main Headline - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
        {/* Left: Header */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-2">
            <span style={{ color: '#999' }}>◆</span>
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: '#666' }}>
              SERVICES
            </span>
          </div>
        </div>
        
        {/* Right: Main Headline */}
        <div className="lg:col-span-8">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight"
            style={{ color: '#1a1a1a', lineHeight: '1.2' }}
          >
            เราดูแลทุกขั้นตอนด้วยความใส่ใจ
            เพื่อให้มั่นใจในคุณภาพและความเข้าใจ
            โครงการของคุณอย่างลึกซึ้ง
          </h2>
        </div>
      </div>

      {/* Divider Line - Right side only */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <div className="lg:col-span-4" />
        <div className="lg:col-span-8">
          <div className="w-full h-px bg-gray-200" />
        </div>
      </div>

      {/* Service Items */}
      <div className="space-y-0">
        {/* Service 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4" />
          <div className="lg:col-span-8">
            <div className="py-12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-5">
                  <h3 className="text-lg font-medium" style={{ color: '#1a1a1a' }}>
                    ที่ปรึกษาและกลยุทธ์
                  </h3>
                </div>
                <div className="md:col-span-7">
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
          </div>
        </div>

        {/* Service 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4" />
          <div className="lg:col-span-8">
            <div className="border-t border-gray-200 py-12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-5">
                  <h3 className="text-lg font-medium" style={{ color: '#1a1a1a' }}>
                    การออกแบบ
                  </h3>
                </div>
                <div className="md:col-span-7">
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
          </div>
        </div>

        {/* Service 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4" />
          <div className="lg:col-span-8">
            <div className="border-t border-gray-200 py-12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-5">
                  <h3 className="text-lg font-medium" style={{ color: '#1a1a1a' }}>
                    การก่อสร้าง
                  </h3>
                </div>
                <div className="md:col-span-7">
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
          </div>
        </div>

        {/* Service 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4" />
          <div className="lg:col-span-8">
            <div className="border-t border-gray-200 py-12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-5">
                  <h3 className="text-lg font-medium" style={{ color: '#1a1a1a' }}>
                    การดูแลหลังการขาย
                  </h3>
                </div>
                <div className="md:col-span-7">
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
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Section Divider */}
      <div className="w-full h-px bg-gray-200 mb-16" />
      {/* Header */}
      <div className="flex items-center gap-2 mb-16">
        <span style={{ color: '#999' }}>◆</span>
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: '#666' }}>
          FROM THE FOUNDER
        </span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Founder Image */}
        <div className="lg:col-span-3">
          <div 
            className="relative aspect-[3/4] w-full max-w-[280px] overflow-hidden"
            style={{ backgroundColor: '#e8e4e0' }}
          >
            <Image
              src="/fake_ownerr.jpg"
              alt="Founder"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Quote */}
        <div className="lg:col-span-9">
          <span className="text-6xl md:text-8xl font-serif leading-none" style={{ color: '#1a1a1a' }}>"</span>
          <blockquote 
            className="text-2xl md:text-3xl lg:text-4xl font-light leading-snug mb-12 -mt-4"
            style={{ color: '#1a1a1a', lineHeight: '1.3' }}
          >
            ทุกบ้านหลังใหญ่
            เริ่มต้นจากความฝันเล็กๆ
            ที่มุ่งมั่นสร้างด้วยใจ
            ผมเชื่อว่าความจริงใจและความตั้งใจ
            คือรากฐานของทุกความสำเร็จ
          </blockquote>

          {/* Founder Info */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xl font-medium mb-1" style={{ color: '#1a1a1a' }}>
                คำมี ศรีนวล
              </p>
              <p className="text-xs tracking-[0.2em] uppercase" style={{ color: '#666' }}>
                FOUNDER & CEO
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs tracking-[0.1em]" style={{ color: '#666' }}>
                SINCE 2014
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
        <div className="absolute top-6 left-8 right-8 z-50 h-px" style={{ backgroundColor: '#333' }}>
          <div 
            className="h-full transition-all duration-100"
            style={{ 
              backgroundColor: '#f5f2ee',
              width: `${progress * 100}%`
            }}
          />
        </div>

        {/* Section Label */}
        <div className="absolute top-8 left-8 z-50 flex items-center gap-2">
          <span style={{ color: '#666' }}>◆</span>
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: '#999' }}>
            OUR PROCESS
          </span>
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
// MAIN PAGE
// ============================================
export default function AboutPage() {
  return (
    <main style={{ fontFamily: '"Sarabun", "Noto Sans Thai", sans-serif' }}>
      {/* Section 0: Hero Text - Initial text display */}
      <HeroTextSection />
      
      {/* Section 1: Hero - Drawing to Real Image Reveal */}
      <HeroRevealSection />
      
      {/* Section 2: Services */}
      <ServicesSection />
      
      {/* Section 3: Client Stories / Quote */}
      <ClientStoriesSection />
      
      {/* Section 4: Our Process (Horizontal Scroll) */}
      <HorizontalProcessSection />
      
      {/* Section 5: Before Footer */}
      <BeforeFooter />
    </main>
  );
}
