'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AboutContactSection from "../component/AboutContactSection";
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

      // Sticky duration = section height - viewport height
      // Use 70% of sticky duration for reveal, leaving 30% buffer after reveal=100%
      const stickyDuration = sectionHeight - windowHeight;
      const progress = Math.max(0, Math.min(1, -sectionTop / (stickyDuration * 0.7)));
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

          {/* Real Image (Reveals from bottom with curtain effect + zoom) */}
          <div
            className="absolute inset-0 z-20 overflow-hidden"
            style={{
              clipPath: `inset(${100 - revealProgress * 100}% 0 0 0)`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${1 + revealProgress * 0.08})`,
                transformOrigin: 'center center',
                transition: 'transform 0.1s ease-out',
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
      className="relative pt-24 md:pt-32 pb-0 px-8 md:px-16 lg:px-24"
      style={{ 
        backgroundColor: '#ffffff',
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
      className="pt-0 pb-32 px-8 md:px-16 lg:px-24"
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
          <span className="text-6xl md:text-8xl font-serif leading-none" style={{ color: '#1a1a1a' }}>&quot;</span>
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
// OUR PROCESS SECTION - Horizontal scroll panels with image parallax
// Panel 0: intro (dark text left + hero image right)
// Panels 1-3: overlapping images left + step text right
// Images move at slower speed than panels → previous image lingers on left
// ============================================
function OurProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ─── Flat panel array — แต่ละ section แยกกันสมบูรณ์ แก้ width ได้อิสระ ───
  // type 'intro'  → intro panel (text left + image right, 100vw)
  // type 'text'   → เนื้อหา step (แก้ width ได้)
  // type 'image'  → รูป step (แก้ width ได้)
  const flatPanels = [
    {
      type: 'intro-text' as const,
      width: 50,
      headline: 'Built with vision\nFinished with care',
      description: 'At SKNAT, every project follows a clear and refined process. Ensuring precision, transparency, and peace of mind from start to finish.',
    },
    {
      type: 'image' as const,
      width: 95,
      src: '/our_process_1.jpg', isVideo: false,
    },
    // ── Step 1 ──
    {
      type: 'text' as const,
      width: 67,
      number: '1', title: 'DESIGN PHASE',
      headline: 'You imagine,\nwe make it real.',
      description: 'เมื่อได้รับการอนุมัติใบเสนอราคา เราจะเริ่มต้นด้วยการรับฟังวิสัยทัศน์ของคุณ ศึกษาแบบแปลนของคุณ และสำรวจโซลูชันที่ดีที่สุดเพื่อสร้างสรรค์วิสัยทัศน์นั้น',
      image: '/house1.jpg', image2: '/house2.jpg',
    },
    {
      type: 'image' as const,
      width: 95,
      src: '/our_process_2.jpg', isVideo: false,
    },
    // ── Step 2 ──
    {
      type: 'text' as const,
      width: 67,
      number: '2', title: 'PLANNING PHASE',
      headline: 'Precision in\nevery detail.',
      description: 'ทีมวิศวกรและสถาปนิกของเราจะวางแผนทุกขั้นตอนอย่างละเอียด คำนึงถึงโครงสร้าง วัสดุ และเวลาที่เหมาะสม เพื่อให้โครงการเสร็จสมบูรณ์ตามมาตรฐานสูงสุด',
      image: '/house3.jpg', image2: '/house4.jpg',
    },
    {
      type: 'image' as const,
      width: 95,
      src: '/our_process_3.mp4', isVideo: true,
    },
    // ── Step 3 ──
    {
      type: 'text' as const,
      width: 67,
      number: '3', title: 'EXECUTION PHASE',
      headline: 'Crafted with\nexcellence.',
      description: 'ทีมช่างฝีมือของเราดำเนินการก่อสร้างด้วยความประณีต ใส่ใจในทุกรายละเอียด ตรวจสอบคุณภาพในแต่ละขั้นตอน เพื่อให้ผลงานออกมาสมบูรณ์แบบ',
      image: '/house5.avif', image2: '/house1.jpg',
    },
    
  ];

  // รวม width ทั้งหมด และ scroll range
  const totalWidthVw = flatPanels.reduce((sum, p) => sum + p.width, 0);
  const scrollableVw = totalWidthVw - 100;

  // Cumulative start position (vw) ของแต่ละ panel
  const panelStarts = flatPanels.reduce<number[]>((acc, _, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + flatPanels[i - 1].width);
    return acc;
  }, []);

  // Parallax factor: รูปเลื่อนช้ากว่า panel → ดึงเปิดจากขวา
  const PARALLAX = 0.18;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const stickyDuration = rect.height - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / stickyDuration));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const translateX = scrollProgress * scrollableVw;

  // clip(i): คำนวณ clipPath ทั้งสองข้าง
  // ซ้าย: เปิดออกตอนเข้า (ดึงกรอบซ้ายออก)
  // ขวา: ปิดตอนออก (ดึงกรอบขวาปิด)
  const getClip = (i: number, panelWidth: number) => {
    const entered = translateX + 100 - panelStarts[i]; // 0 = right edge just entered
    const exited  = translateX - panelStarts[i];        // 0 = left edge at viewport left
    const travel  = panelWidth * 0.85;
    const left  = Math.max(0, PARALLAX * 100 * (1 - entered / travel));
    const right = Math.max(0, PARALLAX * 100 * (exited  / travel));
    return `inset(0 ${right.toFixed(2)}% 0 ${left.toFixed(2)}%)`;
  };

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{
        backgroundColor: '#1a1a1a',
        height: `${(totalWidthVw / 100 + 1) * 100}vh`,
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Progress bar + OUR PROCESS label */}
        <div className="absolute z-50" style={{ top: '2rem', left: '2rem', right: '2rem' }}>
          {/* Track line */}
          <div style={{ height: '1px', backgroundColor: '#2e2e2e', position: 'relative' }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, height: '100%',
              backgroundColor: '#f5f2ee',
              width: `${scrollProgress * 100}%`,
              transition: 'width 0.1s linear',
            }} />
          </div>
          {/* Label row */}
          <div className="flex items-center gap-2 pt-4">
            <span style={{ color: '#555' }}>◆</span>
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: '#666' }}>
              OUR PROCESS
            </span>
          </div>
        </div>

        {/* Horizontal slider */}
        <div
          style={{
            display: 'flex',
            width: `${totalWidthVw}vw`,
            height: '100%',
            transform: `translateX(-${translateX}vw)`,
            transition: 'transform 0.08s ease-out',
            willChange: 'transform',
          }}
        >
          {flatPanels.map((panel, i) => {
            // ── Intro Text ──
            if (panel.type === 'intro-text') {
              return (
                <div key={i} style={{ width: `${panel.width}vw`, height: '100%', display: 'flex', flexShrink: 0, flexDirection: 'column', justifyContent: 'center', padding: '5rem 4rem' }}>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 whitespace-pre-line" style={{ color: '#f5f2ee', lineHeight: '1.15' }}>
                    {panel.headline}
                  </h2>
                  <p className="text-base leading-relaxed max-w-sm" style={{ color: '#777', lineHeight: '1.85' }}>
                    {panel.description}
                  </p>
                </div>
              );
            }

            // ── Text panel ──
            if (panel.type === 'text') {
              const p = panel as typeof panel & { image?: string; image2?: string };
              const isVid = p.image?.endsWith('.mp4');
              return (
                <div
                  key={i}
                  style={{
                    width: `${panel.width}vw`,
                    height: '100%',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#1a1a1a',
                    padding: '4rem 4rem 4rem 5rem',
                    gap: '4rem',
                  }}
                >
                  {/* Overlapping portrait images (ซ้าย) */}
                  <div style={{ position: 'relative', width: '38vh', height: '54vh', flexShrink: 0 }}>
                    {/* Top-left */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '72%', height: '72%', overflow: 'hidden' }}>
                      {isVid ? (
                        <video src={p.image} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Image src={p.image!} alt="" fill className="object-cover" />
                      )}
                    </div>
                    {/* Bottom-right */}
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '62%', height: '62%', overflow: 'hidden', zIndex: 10 }}>
                      <Image src={p.image2 ?? p.image!} alt="" fill className="object-cover" />
                    </div>
                  </div>

                  {/* Text (ขวา) */}
                  <div style={{ flex: 1 }}>
                    <span className="text-[11px] tracking-[0.3em] uppercase" style={{ color: '#555', display: 'block', marginBottom: '1.5rem' }}>
                      {p.number}. {p.title}
                    </span>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 whitespace-pre-line" style={{ color: '#f5f2ee', lineHeight: '1.15' }}>
                      {p.headline}
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: '#777', lineHeight: '1.85', maxWidth: '36ch' }}>
                      {p.description}
                    </p>
                  </div>
                </div>
              );
            }

            // ── Image panel ──
            if (panel.type === 'image') {
              return (
                <div
                  key={i}
                  style={{
                    width: `${panel.width}vw`,
                    height: '100%',
                    flexShrink: 0,
                    padding: '0 2rem 1.5rem',
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    clipPath: getClip(i, panel.width),
                  }}>
                    {panel.isVideo ? (
                      <video src={panel.src} autoPlay muted loop playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Image src={panel.src} alt="" fill className="object-cover" />
                    )}
                  </div>
                </div>
              );
            }
          })}
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
      
      {/* Section 4: Our Process */}
      <OurProcessSection />

      {/* Section 5: Contact */}
      <AboutContactSection />
      
      {/* Section 6: Before Footer */}
      <BeforeFooter />
    </main>
  );
}
