'use client';

import { useEffect, useRef, useState } from 'react';

// 3D box vertices — oblique projection
// Front face
const A = [40, 410] as [number, number];   // bottom-left
const B = [320, 410] as [number, number];  // bottom-right
const C = [320, 110] as [number, number];  // top-right
const D = [40, 110] as [number, number];   // top-left
// Depth vector: (+185, -110)
const E = [225, 300] as [number, number];  // back bottom-left  (hidden)
const F = [505, 300] as [number, number];  // back bottom-right
const G = [505, 0] as [number, number];    // back top-right
const H = [225, 0] as [number, number];    // back top-left

function elen(p1: [number, number], p2: [number, number]) {
  return Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
}

// Draw order: front face first, then depth lines, then back edges, hidden last
const EDGES: { p1: [number, number]; p2: [number, number]; hidden: boolean }[] = [
  { p1: D, p2: A, hidden: false },  // front left
  { p1: A, p2: B, hidden: false },  // front bottom
  { p1: B, p2: C, hidden: false },  // front right
  { p1: C, p2: D, hidden: false },  // front top
  { p1: D, p2: H, hidden: false },  // depth top-left
  { p1: H, p2: G, hidden: false },  // back top
  { p1: G, p2: C, hidden: false },  // depth top-right
  { p1: B, p2: F, hidden: false },  // depth bottom-right
  { p1: F, p2: G, hidden: false },  // back right
  { p1: A, p2: E, hidden: true },   // hidden depth bottom-left
  { p1: E, p2: F, hidden: true },   // hidden back bottom
  { p1: E, p2: H, hidden: true },   // hidden back left
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [drawProgress, setDrawProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      const inner = innerRef.current;
      if (!section || !inner) return;

      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Text fade-in
      if (rect.top < windowH * 0.88) setTextVisible(true);

      // Draw progress: 0 when section enters viewport bottom, 1 when section top reaches viewport top
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / windowH));
      setDrawProgress(progress);

      // Parallax: section content scrolls at ~82% of normal speed
      // As section scrolls up (rect.top decreases), we push content DOWN by 18% of scroll amount
      // Net effect: content moves up at 82% speed — feels slower / floating in front
      if (rect.bottom > 0 && rect.top < windowH) {
        const entered = Math.max(0, windowH - rect.top);
        inner.style.transform = `translateY(${entered * 0.18}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFooter = () => {
    const el = document.getElementById('contact');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{ position: 'relative', zIndex: 2 }}
    >
      {/* Inner bordered container — matches the framed layout in reference image */}
      <div
        ref={innerRef}
        className="mx-5 md:mx-8"
        style={{
          border: '1px solid rgba(0,0,0,0.1)',
          minHeight: '72vh',
          display: 'grid',
          gridTemplateColumns: '55% 45%',
          overflow: 'hidden',
          marginTop: '2.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Left: text content */}
        <div
          className="flex flex-col justify-center px-10 py-16 md:px-14 md:py-20"
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'none' : 'translateY(20px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <p
            className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.4em]"
            style={{ color: 'rgba(10,10,10,0.38)' }}
          >
            <span>◆</span> WHERE VISION MEETS EXECUTION
          </p>

          <h2
            className="font-light leading-[1.15] text-[#0a0a0a] mb-10"
            style={{ fontSize: 'clamp(2rem, 3.8vw, 3.6rem)' }}
          >
            เริ่มต้นทุกการลงทุน<br />
            ด้วยความเข้าใจ<br />
            ที่ถูกต้อง
          </h2>

          <div className="flex flex-wrap items-center gap-5">
            <a
              href="#about"
              className="inline-flex items-center gap-3 bg-[#0a0a0a] text-white px-7 py-3.25 text-[11px] font-semibold uppercase tracking-[0.25em] transition-colors duration-200 hover:bg-[#1a40b6]"
            >
              <span style={{ fontFamily: 'monospace' }}>↳</span> เกี่ยวกับเรา
            </a>
            <button
              onClick={scrollToFooter}
              className="inline-flex items-center gap-3 bg-transparent border-none text-[#0a0a0a] text-[11px] font-semibold uppercase tracking-[0.25em] transition-opacity duration-200 hover:opacity-40 cursor-pointer"
            >
              <span style={{ fontFamily: 'monospace' }}>↳</span> ติดต่อเรา
            </button>
          </div>
        </div>

        {/* Right: scroll-drawn 3D wireframe box */}
        <div className="relative overflow-hidden">
          <WireframeBox progress={drawProgress} />
        </div>
      </div>
    </section>
  );
}

function WireframeBox({ progress }: { progress: number }) {
  const N = EDGES.length; // 12 edges total

  return (
    <svg
      viewBox="0 -10 520 430"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {EDGES.map(({ p1, p2, hidden }, i) => {
        const length = elen(p1, p2);

        // Each line has a staggered draw window:
        // Solid edges (0–8) draw first, hidden edges (9–11) draw last
        // drawWindow = 0.55 means each line uses 55% of the total progress range
        const drawWindow = 0.55;
        const startP = (i / N) * (1 - drawWindow);
        const localP = Math.max(0, Math.min(1, (progress - startP) / drawWindow));
        const dashOffset = length * (1 - localP);

        if (hidden) {
          // Hidden edges: dashed appearance + lighter color
          // Use a trick: dasharray alternates small dash/gap, offset animates the draw
          // We overlay a "reveal clip" by animating the overall dash length
          const dashLen = 5;
          const gapLen = 5;
          const totalPattern = dashLen + gapLen;
          // Full dashed pattern total length (number of complete repeats)
          const patternCount = Math.ceil(length / totalPattern);
          const fullDashedLength = patternCount * totalPattern;

          return (
            <line
              key={i}
              x1={p1[0]} y1={p1[1]}
              x2={p2[0]} y2={p2[1]}
              stroke="rgba(10,10,10,0.28)"
              strokeWidth="0.7"
              strokeDasharray={`${dashLen} ${gapLen}`}
              strokeDashoffset={fullDashedLength * (1 - localP)}
              strokeLinecap="round"
            />
          );
        }

        return (
          <line
            key={i}
            x1={p1[0]} y1={p1[1]}
            x2={p2[0]} y2={p2[1]}
            stroke="rgba(10,10,10,0.72)"
            strokeWidth="0.85"
            strokeDasharray={`${length} ${length}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
