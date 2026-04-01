'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

type Segment = {
  type?: 'line' | 'circle';
  from?: [number, number];
  to?: [number, number];
  center?: [number, number];
  radius?: number;
  delay: number;
  weight?: 'hair' | 'light' | 'regular' | 'strong';
  /** Y-axis parallax multiplier applied to frameOffsetY */
  pxMult?: number;
  /** X-axis parallax multiplier applied to frameOffsetX */
  pxXMult?: number;
};

// ─── 3D Cube constants (SVG viewBox: 800 × 488) ──────────────────────────────
//
//  Concept: Minimal isometric cube — an architect's wireframe model drawn with
//  precise construction lines. Ground datum anchors the base; vertical edges
//  rise first; the top cap assembles last; ornament floats above the apex.
//
//           · (circle ornament)
//           |
//           ◆  ← TB top-back apex
//          / \
//        /     \
//   TL ◆─────────◆ TR   ← top face (diamond)
//       |\     /|
//       | \   / |
//       |   ◆   |  ← TF top-front
//       |   |   |
//   BL  ◆   |   ◆ BR   ← bottom knuckles
//        \  |  /
//          \|/
//           ◆  ← BF bottom-front (on ground)
//  ─────────────────────────────────────  ← ground datum

const GND_Y = 418;   // ground Y
const CX    = 460;   // cube horizontal center
const CDX   = 130;   // horizontal diamond reach (150·cos30°)
const CDY   = 75;    // iso vertical reach       (150·sin30°)
const CS    = 150;   // cube side length in screen pixels

// Visible vertices
const BF: [number, number] = [CX,       GND_Y];             // bottom-front  (460, 418)
const BR: [number, number] = [CX + CDX, GND_Y - CDY];       // bottom-right  (590, 343)
const BL: [number, number] = [CX - CDX, GND_Y - CDY];       // bottom-left   (330, 343)
const TF: [number, number] = [CX,       GND_Y - CS];        // top-front     (460, 268)
const TR: [number, number] = [CX + CDX, GND_Y - CS - CDY];  // top-right     (590, 193)
const TL: [number, number] = [CX - CDX, GND_Y - CS - CDY];  // top-left      (330, 193)
const TB: [number, number] = [CX,       GND_Y - CS - 150];  // top-back      (460, 118)

// ─── Segment list ─────────────────────────────────────────────────────────────
// Draw order mirrors construction: ground → base → verticals → top cap → detail.
// pxMult drives Y parallax: 0 = pinned to ground, 0.7 = floats high.

const FRAME_SEGMENTS: Segment[] = [

  // ── Ground datum — establishes the site ───────────────────────────────────
  { type: 'line', from: [100, GND_Y], to: [760, GND_Y],
    delay: 0.00, weight: 'hair', pxMult: 0.68 },

  // ── Bottom edges — cube base, arrives early ────────────────────────────────
  { type: 'line', from: BF, to: BR,
    delay: 0.04, weight: 'regular', pxMult: 0.04 },
  { type: 'line', from: BF, to: BL,
    delay: 0.08, weight: 'regular', pxMult: 0.04 },

  // ── Vertical edges — three pillars rising from the base ───────────────────
  { type: 'line', from: TF, to: BF,
    delay: 0.12, weight: 'strong', pxMult: 0.20 },
  { type: 'line', from: TR, to: BR,
    delay: 0.15, weight: 'strong', pxMult: 0.14 },
  { type: 'line', from: TL, to: BL,
    delay: 0.18, weight: 'strong', pxMult: 0.14 },

  // ── Top face — the cap floating above ─────────────────────────────────────
  { type: 'line', from: TB, to: TR,
    delay: 0.22, weight: 'strong', pxMult: 0.38 },
  { type: 'line', from: TB, to: TL,
    delay: 0.26, weight: 'strong', pxMult: 0.38 },
  { type: 'line', from: TR, to: TF,
    delay: 0.29, weight: 'light', pxMult: 0.28 },
  { type: 'line', from: TL, to: TF,
    delay: 0.31, weight: 'light', pxMult: 0.28 },

  // ── Top face centre datum — thin horizontal cross ─────────────────────────
  { type: 'line', from: TL, to: TR,
    delay: 0.33, weight: 'hair', pxMult: 0.34 },

  // ── Corner ticks at bottom knuckles ──────────────────────────────────────
  { type: 'line', from: [BR[0] - 8, BR[1]], to: [BR[0] + 8, BR[1]],
    delay: 0.36, weight: 'light', pxMult: 0.04 },
  { type: 'line', from: [BL[0] - 8, BL[1]], to: [BL[0] + 8, BL[1]],
    delay: 0.37, weight: 'light', pxMult: 0.04 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function segmentLength(segment: Segment): number {
  if (segment.type === 'circle' && segment.radius != null) {
    return 2 * Math.PI * segment.radius;
  }
  if (segment.from && segment.to) {
    const [x1, y1] = segment.from;
    const [x2, y2] = segment.to;
    return Math.hypot(x2 - x1, y2 - y1);
  }
  return 0;
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

// ─── Contact section ─────────────────────────────────────────────────────────

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [drawProgress, setDrawProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect    = section.getBoundingClientRect();
      const windowH = window.innerHeight;
      const start   = windowH * 0.95;  // begins the moment section peeks in
      const end     = windowH * 0.54;  // completes quickly — cube fully drawn early
      const progress = clamp((start - rect.top) / (start - end));

      setDrawProgress(progress);
      if (rect.top < windowH * 0.96) setTextVisible(true);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const frameOffsetY = (1 - drawProgress) * 42;
  const frameOffsetX = (1 - drawProgress) * 14;
  const glowOffsetX  = (1 - drawProgress) * 22;
  const glowOffsetY  = frameOffsetY * 0.34;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-30 overflow-hidden bg-white"
    >
      <div className="mx-auto grid min-h-[72vh] max-w-470 overflow-hidden bg-white px-6 sm:px-8 md:px-12 xl:min-h-[78vh] xl:px-16 xl:grid-cols-[1.04fr_0.96fr]">

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

        {/* ── Right: 3D cube ─────────────────────────────────────────────── */}
        <div className="relative min-h-75 overflow-hidden xl:min-h-140">
          {/* Ambient radial glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 58% 48%, rgba(255,255,255,0.86), rgba(255,255,255,0.08) 52%, transparent 72%)',
            }}
          />

          {/* Ghost / shadow layer — runs slightly ahead, offset diagonally */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              transform: `translate3d(${glowOffsetX}px, ${glowOffsetY}px, 0)`,
              transition: 'transform 0.12s linear',
            }}
          >
            <CubeFrame
              progress={clamp(drawProgress * 1.07)}
              offsetY={frameOffsetY * 0.24}
              offsetX={frameOffsetX * 0.40}
              ghost
            />
          </div>

          {/* Main layer */}
          <div
            className="absolute inset-0"
            style={{
              transform: `translate3d(0, ${frameOffsetY}px, 0)`,
              transition: 'transform 0.12s linear',
            }}
          >
            <CubeFrame
              progress={drawProgress}
              offsetY={frameOffsetY}
              offsetX={frameOffsetX}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SVG renderer ─────────────────────────────────────────────────────────────

function CubeFrame({
  progress,
  offsetY = 0,
  offsetX = 0,
  ghost = false,
}: {
  progress: number;
  offsetY?: number;
  offsetX?: number;
  ghost?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 800 488"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {FRAME_SEGMENTS.map((segment, index) => {
        const length        = segmentLength(segment);
        const localProgress = clamp((progress - segment.delay) / 0.18);

        // ── Stroke style by weight ─────────────────────────────────────────
        let stroke      = 'rgba(28,28,28,0.10)';  // hair
        let strokeWidth = 0.7;

        if (segment.weight === 'light') {
          stroke      = 'rgba(28,28,28,0.20)';
          strokeWidth = 0.9;
        } else if (segment.weight === 'regular') {
          stroke      = 'rgba(28,28,28,0.38)';
          strokeWidth = 1.1;
        } else if (segment.weight === 'strong') {
          stroke      = 'rgba(28,28,28,0.54)';
          strokeWidth = 1.4;
        }

        if (ghost) {
          const aMap: Record<NonNullable<Segment['weight']>, number> = {
            hair: 0.03, light: 0.05, regular: 0.07, strong: 0.09,
          };
          stroke      = `rgba(28,28,28,${aMap[segment.weight ?? 'hair']})`;
          strokeWidth *= 0.80;
        }

        // ── Per-segment parallax ───────────────────────────────────────────
        const dy = offsetY * (segment.pxMult  ?? 0);
        const dx = offsetX * (segment.pxXMult ?? 0);

        const key = `seg-${index}`;

        // ── Circle ────────────────────────────────────────────────────────
        if (segment.type === 'circle' && segment.center && segment.radius != null) {
          const circ = length;
          return (
            <circle
              key={key}
              cx={segment.center[0] + dx}
              cy={segment.center[1] + dy}
              r={segment.radius}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circ} ${circ}`}
              strokeDashoffset={circ * (1 - localProgress)}
              strokeLinecap="round"
            />
          );
        }

        // ── Line ──────────────────────────────────────────────────────────
        if (segment.from && segment.to) {
          return (
            <line
              key={key}
              x1={segment.from[0] + dx}
              y1={segment.from[1] + dy}
              x2={segment.to[0]   + dx}
              y2={segment.to[1]   + dy}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={`${length} ${length}`}
              strokeDashoffset={length * (1 - localProgress)}
              strokeLinecap="round"
            />
          );
        }

        return null;
      })}
    </svg>
  );
}
