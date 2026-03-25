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
  const visualRef = useRef<HTMLDivElement>(null);
  const primaryBoxRef = useRef<HTMLDivElement>(null);
  const secondaryBoxRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [drawProgress, setDrawProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const [stickyPhase, setStickyPhase] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      const inner = innerRef.current;
      const visual = visualRef.current;
      const primaryBox = primaryBoxRef.current;
      const secondaryBox = secondaryBoxRef.current;
      const glow = glowRef.current;
      if (!section || !inner || !visual || !primaryBox || !secondaryBox || !glow) return;

      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;
      const entered = Math.max(0, windowH - rect.top);
      const progress = Math.max(0, Math.min(1, entered / (windowH * 1.18)));
      const stickyProgress = Math.max(0, Math.min(1, (windowH - rect.bottom) / (windowH * 0.95) + 0.5));

      // Text fade-in
      if (rect.top < windowH * 0.88) setTextVisible(true);

      setDrawProgress(progress);
      setStickyPhase(stickyProgress);

      if (rect.bottom > 0 && rect.top < windowH) {
        const sectionShift = Math.min(stickyProgress * 84, 84);
        inner.style.transform = `translateY(${-sectionShift}px)`;
        visual.style.transform = `translate3d(0, ${-Math.min(stickyProgress * 48, 48)}px, 0)`;
        primaryBox.style.transform = `translate3d(${entered * -0.01}px, ${-Math.min(stickyProgress * 28, 28)}px, 0) scale(${1 + progress * 0.02})`;
        secondaryBox.style.transform = `translate3d(${entered * 0.012}px, ${-Math.min(stickyProgress * 18, 18)}px, 0) scale(${0.97 + progress * 0.025})`;
        glow.style.transform = `translate3d(${entered * 0.008}px, ${-Math.min(stickyProgress * 22, 22)}px, 0) scale(${1 + progress * 0.05})`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFooter = () => {
    const el = document.getElementById('site-footer');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-20 h-[155vh] bg-transparent px-4 md:px-6"
    >
      <div
        ref={innerRef}
        className="sticky top-0 mx-auto grid h-screen max-w-[1536px] overflow-hidden border border-black/10 bg-white xl:grid-cols-[1.02fr_0.98fr]"
        style={{
          minHeight: '100vh',
          transition: 'transform 180ms linear',
          boxShadow: `0 32px 90px -78px rgba(15,23,42,${0.18 + stickyPhase * 0.1})`,
        }}
      >
        <div
          className="relative flex flex-col justify-center overflow-hidden px-8 py-14 md:px-12 md:py-20 xl:px-16"
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'none' : 'translateY(20px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(255,255,255,0.92) 62%, rgba(255,255,255,0.88))',
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-px xl:block"
            style={{ background: 'linear-gradient(180deg, rgba(10,10,10,0.03), rgba(10,10,10,0.12), rgba(10,10,10,0.03))' }}
          />
          <div className="relative">
            <p
              className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.4em]"
              style={{ color: 'rgba(10,10,10,0.38)' }}
            >
              <span>◆</span> WHERE VISION MEETS EXECUTION
            </p>

            <h2
              className="mb-8 font-light leading-[0.96] text-[#0a0a0a] md:mb-10"
              style={{ fontSize: 'clamp(2.7rem, 5.3vw, 6rem)' }}
            >
              เริ่มต้นทุกการลงทุน<br />
              ด้วยความเข้าใจ<br />
              ที่ถูกต้อง
            </h2>

            <p className="mb-10 max-w-xl text-sm leading-7 text-[#5c5a56] md:text-base">
              ให้ส่วนติดต่ออยู่ด้านหน้าของฟุตเตอร์แบบชัดเจน พร้อมมิติที่ลอยช้ากว่าเนื้อหา
              เพื่อให้ภาพรวมดูนิ่ง ละเอียด และมีความเป็นสถาปัตยกรรมมากขึ้น
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <a
                href="#about"
                className="inline-flex items-center gap-3 bg-[#0a0a0a] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors duration-200 hover:bg-[#1a40b6]"
              >
                <span style={{ fontFamily: 'monospace' }}>↳</span> เกี่ยวกับเรา
              </a>
              <button
                onClick={scrollToFooter}
                className="inline-flex items-center gap-3 border-none bg-transparent px-0 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#0a0a0a] transition-opacity duration-200 hover:opacity-40"
              >
                <span style={{ fontFamily: 'monospace' }}>↳</span> ติดต่อเรา
              </button>
            </div>
          </div>
        </div>

        <div className="relative min-h-[380px] overflow-hidden border-t border-black/8 xl:min-h-[680px] xl:border-l xl:border-t-0">
          <div
            ref={visualRef}
            className="absolute inset-0"
            style={{ transition: 'transform 180ms linear' }}
          >
            <div
              ref={glowRef}
              className="absolute left-[16%] top-[22%] h-[30%] w-[34%] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(26,64,182,0.05) 0%, rgba(26,64,182,0.015) 42%, rgba(255,255,255,0) 74%)',
                filter: 'blur(18px)',
                transition: 'transform 180ms linear',
              }}
            />

            <div
              className="absolute inset-x-[7%] inset-y-[12%]"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.16))',
                border: '1px solid rgba(10,10,10,0.04)',
              }}
            />

            <div
              ref={secondaryBoxRef}
              className="absolute inset-y-[8%] right-[-3%] w-[88%] opacity-12"
              style={{ transition: 'transform 180ms linear' }}
            >
              <WireframeBox progress={Math.min(1, drawProgress * 1.08)} variant="echo" />
            </div>

            <div
              ref={primaryBoxRef}
              className="absolute inset-y-[5%] right-[0%] w-[86%]"
              style={{ transition: 'transform 180ms linear' }}
            >
              <WireframeBox progress={drawProgress} variant="primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WireframeBox({ progress, variant }: { progress: number; variant: 'primary' | 'echo' }) {
  const N = EDGES.length; // 12 edges total

  return (
    <svg
      viewBox="0 -20 580 470"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M110 405C160 330 244 286 360 290"
        stroke={variant === 'primary' ? 'rgba(10,10,10,0.18)' : 'rgba(10,10,10,0.1)'}
        strokeWidth="1"
        strokeDasharray="7 10"
      />
      <path
        d="M210 85H560"
        stroke={variant === 'primary' ? 'rgba(10,10,10,0.16)' : 'rgba(10,10,10,0.08)'}
        strokeWidth="0.9"
      />
      {EDGES.map(({ p1, p2, hidden }, i) => {
        const length = elen(p1, p2);

        const drawWindow = variant === 'primary' ? 0.6 : 0.48;
        const startP = (i / N) * (1 - drawWindow);
        const localP = Math.max(0, Math.min(1, (progress - startP) / drawWindow));
        const dashOffset = length * (1 - localP);

        if (hidden) {
          const dashLen = 5;
          const gapLen = 5;
          const totalPattern = dashLen + gapLen;
          const patternCount = Math.ceil(length / totalPattern);
          const fullDashedLength = patternCount * totalPattern;

          return (
            <line
              key={i}
              x1={p1[0]} y1={p1[1]}
              x2={p2[0]} y2={p2[1]}
              stroke={variant === 'primary' ? 'rgba(10,10,10,0.25)' : 'rgba(10,10,10,0.12)'}
              strokeWidth={variant === 'primary' ? '0.78' : '0.62'}
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
            stroke={variant === 'primary' ? 'rgba(10,10,10,0.72)' : 'rgba(10,10,10,0.18)'}
            strokeWidth={variant === 'primary' ? '0.95' : '0.72'}
            strokeDasharray={`${length} ${length}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
