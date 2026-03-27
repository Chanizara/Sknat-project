'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type Segment = {
  from: [number, number];
  to: [number, number];
  delay: number;
  hidden?: boolean;
  weight?: 'light' | 'regular' | 'strong';
  parallax?: 'slow' | 'medium';
};

const FRAME_SEGMENTS: Segment[] = [
  { from: [6, 488], to: [794, 488], delay: 0.02, weight: 'light', parallax: 'medium' },
  { from: [396, 0], to: [396, 488], delay: 0.06, weight: 'light', parallax: 'slow' },

  { from: [560, 488], to: [560, 236], delay: 0.14, weight: 'regular' },
  { from: [560, 236], to: [792, 236], delay: 0.2, weight: 'regular' },
  { from: [792, 236], to: [792, 420], delay: 0.26, weight: 'regular' },

  { from: [560, 236], to: [678, 178], delay: 0.34, weight: 'light' },
  { from: [678, 178], to: [792, 120], delay: 0.4, weight: 'light' },
  { from: [560, 236], to: [678, 128], delay: 0.46, weight: 'light' },
  { from: [678, 128], to: [792, 20], delay: 0.52, weight: 'light' },

  { from: [560, 322], to: [680, 266], delay: 0.24, hidden: true, weight: 'light' },
  { from: [680, 266], to: [792, 266], delay: 0.3, hidden: true, weight: 'light' },
  { from: [560, 436], to: [676, 380], delay: 0.1, hidden: true, weight: 'light' },
  { from: [676, 380], to: [792, 380], delay: 0.16, hidden: true, weight: 'light' },
];

function segmentLength([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  return Math.hypot(x2 - x1, y2 - y1);
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [drawProgress, setDrawProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;
      const start = windowH * 0.88;
      const end = -rect.height * 0.45;
      const progress = clamp((start - rect.top) / (start - end));

      setDrawProgress(progress);
      if (rect.top < windowH * 0.9) setTextVisible(true);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const frameOffsetY = (1 - drawProgress) * 38;
  const glowOffsetX = (1 - drawProgress) * 18;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-30 overflow-hidden bg-white"
    >
      <div
        className="mx-auto grid min-h-[72vh] max-w-[1880px] overflow-hidden bg-white px-6 sm:px-8 md:px-12 xl:min-h-[78vh] xl:px-16 xl:grid-cols-[1.04fr_0.96fr]"
      >
        <div
          className="relative flex min-h-[42vh] flex-col justify-center overflow-hidden px-8 py-14 md:px-12 md:py-16 xl:px-14 xl:py-14"
          style={{
            opacity: textVisible ? 1 : 0,
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
          <div className="relative z-10 max-w-[46rem]">
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
                href="/about#contact"
                className="inline-flex items-center gap-3 px-0 py-3.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#171717] transition-opacity duration-200 hover:opacity-45"
              >
                <span style={{ fontFamily: 'monospace' }}>↳</span>
                ติดต่อเรา
              </Link>
            </div>
          </div>
        </div>

        <div className="relative min-h-[300px] overflow-hidden xl:min-h-[560px]">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 74% 20%, rgba(255,255,255,0.94), rgba(255,255,255,0.12) 36%, transparent 60%)',
            }}
          />

          <div
            className="absolute inset-0 opacity-[0.16]"
            style={{
              transform: `translate3d(${glowOffsetX}px, ${frameOffsetY * 0.42}px, 0)`,
              transition: 'transform 0.12s linear',
            }}
          >
            <LineStructure progress={clamp(drawProgress * 1.06)} offsetY={frameOffsetY * 0.3} ghost />
          </div>

          <div
            className="absolute inset-0"
            style={{
              transform: `translate3d(0, ${frameOffsetY}px, 0)`,
              transition: 'transform 0.12s linear',
            }}
          >
            <LineStructure progress={drawProgress} offsetY={frameOffsetY} />
          </div>
        </div>
      </div>
    </section>
  );
}

function LineStructure({
  progress,
  offsetY = 0,
  ghost = false,
}: {
  progress: number;
  offsetY?: number;
  ghost?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 800 488"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {FRAME_SEGMENTS.map((segment, index) => {
        const length = segmentLength(segment.from, segment.to);
        const localProgress = clamp((progress - segment.delay) / 0.4);
        const dash = segment.hidden ? '7 10' : `${length} ${length}`;

        let stroke = 'rgba(28, 28, 28, 0.16)';
        let strokeWidth = 1;

        if (segment.weight === 'regular') {
          stroke = 'rgba(28, 28, 28, 0.32)';
          strokeWidth = 1.05;
        }

        if (segment.weight === 'strong') {
          stroke = 'rgba(28, 28, 28, 0.46)';
          strokeWidth = 1.15;
        }

        if (ghost) {
          stroke = segment.hidden ? 'rgba(28, 28, 28, 0.04)' : 'rgba(28, 28, 28, 0.08)';
          strokeWidth *= 0.92;
        }

        return (
          <line
            key={`${segment.from.join(',')}-${segment.to.join(',')}-${index}`}
            x1={segment.from[0]}
            y1={
              segment.from[1] +
              (segment.parallax === 'slow' ? offsetY * 0.45 : segment.parallax === 'medium' ? offsetY * 0.7 : 0)
            }
            x2={segment.to[0]}
            y2={
              segment.to[1] +
              (segment.parallax === 'slow' ? offsetY * 0.45 : segment.parallax === 'medium' ? offsetY * 0.7 : 0)
            }
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={dash}
            strokeDashoffset={length * (1 - localProgress)}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
