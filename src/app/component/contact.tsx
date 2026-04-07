'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// ─── Contact section ─────────────────────────────────────────────────────────

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96) setTextVisible(true);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-30 overflow-hidden bg-white"
    >
      <div className="mx-auto min-h-[72vh] max-w-470 overflow-hidden bg-white px-6 sm:px-8 md:px-12 xl:min-h-[78vh] xl:px-16">

        {/* ── Left: text ─────────────────────────────────────────────────── */}
        <div
          className="relative flex min-h-[42vh] flex-col justify-center overflow-hidden px-8 py-14 md:px-12 md:py-16 xl:px-14 xl:py-14"
          style={{
            opacity:   textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 18% 24%, rgba(255,255,255,0.98), rgba(255,255,255,0.18) 34%, transparent 58%)',
            }}
          />
          <div className="relative z-10 max-w-184">
            <p
              className="mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.34em]"
              style={{ color: 'rgba(10,10,10,0.78)' }}
            >
              <span className="text-[12px]">◆</span>
              WHERE VISION MEETS EXECUTION
            </p>

            <h2
              className="mb-8 font-light leading-[0.95] text-[#171717] md:mb-10"
              style={{ fontSize: 'clamp(2.85rem, 5vw, 5.9rem)', letterSpacing: '-0.045em' }}
            >
              Start every investment
              <br />
              with the right
              <br />
              understanding
            </h2>

            <p className="mb-10 max-w-xl text-sm leading-7 text-[#5f5a54] md:text-base">
              เราปรับ section นี้ให้มีน้ำหนักแบบสถาปัตยกรรมมากขึ้น ด้วยเส้นโครงที่ค่อย ๆ ถูกวาดขึ้นตามจังหวะการ scroll
              เพื่อให้ภาพรวมรู้สึกนิ่ง โปร่ง และร่วมสมัยเหมือน reference ที่ต้องการ
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/about"
                className="inline-flex items-center gap-3 bg-[#111111] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f7f2ec] transition-colors duration-200 hover:bg-[#202020]"
              >
                <span style={{ fontFamily: 'monospace' }}>↳</span>
                เกี่ยวกับเรา
              </Link>
              <Link
                href="/about#about-contact"
                className="inline-flex items-center gap-3 px-0 py-3.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#171717] transition-opacity duration-200 hover:opacity-45"
              >
                <span style={{ fontFamily: 'monospace' }}>↳</span>
                ติดต่อเรา
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── SVG renderer ─────────────────────────────────────────────────────────────
