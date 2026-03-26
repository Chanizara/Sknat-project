'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Point = [number, number];
type BoxSegment = {
  from: Point;
  to: Point;
  stroke: string;
  width?: number;
  dash?: string;
  delay: number;
  parallax?: "slow" | "medium" | "fast";
};

const BOX_SEGMENTS: BoxSegment[] = [
  { from: [124, 132], to: [232, 74], stroke: "#c1bbb2", width: 1.05, delay: 0.02, parallax: "slow" },
  { from: [232, 74], to: [336, 138], stroke: "#c1bbb2", width: 1.05, delay: 0.1, parallax: "slow" },
  { from: [124, 132], to: [124, 286], stroke: "#cdc7bf", delay: 0.18, parallax: "medium" },
  { from: [336, 138], to: [336, 292], stroke: "#cdc7bf", delay: 0.26, parallax: "medium" },
  { from: [124, 286], to: [228, 348], stroke: "#b7b0a7", width: 1.1, delay: 0.34, parallax: "fast" },
  { from: [228, 348], to: [336, 292], stroke: "#b7b0a7", width: 1.1, delay: 0.42, parallax: "fast" },
  { from: [124, 132], to: [228, 202], stroke: "#d7d2ca", delay: 0.16, parallax: "medium" },
  { from: [336, 138], to: [228, 202], stroke: "#d7d2ca", delay: 0.24, parallax: "medium" },
  { from: [228, 202], to: [228, 348], stroke: "#d7d2ca", dash: "5 7", delay: 0.5, parallax: "fast" },
  { from: [174, 108], to: [174, 234], stroke: "#e5e0d9", delay: 0.12, parallax: "slow" },
  { from: [282, 104], to: [282, 236], stroke: "#e5e0d9", delay: 0.2, parallax: "slow" },
  { from: [150, 160], to: [306, 160], stroke: "#e1ddd6", dash: "4 8", delay: 0.58, parallax: "medium" },
];

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function segmentLength(from: Point, to: Point) {
  return Math.hypot(to[0] - from[0], to[1] - from[1]);
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function AnimatedButton({
  href,
  children,
  variant = "primary",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  external?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyles =
    "relative overflow-hidden inline-flex items-center justify-center px-8 py-3.5 text-xs font-medium tracking-widest uppercase transition-all";

  const variantStyles: Record<string, { bg: string; color: string; border?: string }> = {
    primary: { bg: "#1a1a1a", color: "#f5f2ee" },
    secondary: { bg: "transparent", color: "#1a1a1a" },
    outline: { bg: "transparent", color: "#1a1a1a", border: "1px solid #1a1a1a" },
  };

  const content = (
    <>
      <span
        className="block transition-transform duration-300"
        style={{ transform: isHovered ? "translateY(-100%)" : "translateY(0)" }}
      >
        {children}
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
        style={{ transform: isHovered ? "translateY(0)" : "translateY(100%)" }}
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
        style={{ backgroundColor: style.bg, color: style.color, border: style.border }}
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
      style={{ backgroundColor: style.bg, color: style.color, border: style.border }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {content}
    </Link>
  );
}

function AnimatedLink({
  href,
  children,
  external = false,
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
          style={{ transform: isHovered ? "translateY(-100%)" : "translateY(0)" }}
        >
          {children}
        </span>
        <span
          className="absolute inset-0 flex items-center transition-transform duration-300"
          style={{ transform: isHovered ? "translateY(0)" : "translateY(100%)" }}
        >
          {children}
        </span>
      </span>
      <span
        className="transition-transform duration-300"
        style={{ transform: isHovered ? "translateX(4px)" : "translateX(0)" }}
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
        style={{ color: "#1a1a1a" }}
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
      style={{ color: "#1a1a1a" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {content}
    </Link>
  );
}

export default function AboutContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * 0.92;
      const end = -rect.height * 0.18;
      const nextProgress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      setScrollProgress(nextProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const boxTransform = {
    x: lerp(18, 0, scrollProgress),
    y: lerp(-138, 18, scrollProgress),
    rotate: lerp(-7, 0, scrollProgress),
    scale: lerp(0.88, 1, scrollProgress),
    opacity: lerp(0.42, 1, scrollProgress),
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative"
      style={{
        backgroundColor: "#f5f2ee",
        color: "#1a1a1a",
        fontFamily: '"Sarabun", "Noto Sans Thai", sans-serif',
      }}
    >
      <div className="flex-1 flex flex-col lg:flex-row px-8 pb-16 pt-12 md:px-12 lg:pt-16">
        <div className="flex-1 lg:pr-16">
          <div className="mb-6 flex items-center gap-2">
            <span style={{ color: "#999" }}>◆</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: "#666" }}>
              CONTACT
            </span>
          </div>

          <h2
            className="mb-6 text-4xl font-light leading-tight md:text-5xl lg:text-6xl"
            style={{ color: "#1a1a1a", lineHeight: "1.15", letterSpacing: "-0.02em" }}
          >
            เริ่มต้นทุกการลงทุน
            <br />
            ด้วยความเข้าใจ
            <br />
            ที่ถูกต้อง
          </h2>

          <p className="mb-10 max-w-md text-sm leading-relaxed md:text-base" style={{ color: "#666", lineHeight: "1.7" }}>
            ให้ส่วนติดต่ออยู่ด้านหน้าของฟุตเตอร์แบบชัดเจน พร้อมมิติที่ลอยช้ากว่าเนื้อหา
            เพื่อให้ภาพรวมดูนิ่ง ละเอียด และมีความเป็นสถาปัตยกรรมมากขึ้น
          </p>

          <div className="mb-16 flex items-center gap-4">
            <AnimatedButton href="/" variant="primary">
              ดูโครงการ
            </AnimatedButton>
            <AnimatedLink href="https://line.me/R/ti/p/@sknat" external>
              ติดต่อเรา
            </AnimatedLink>
          </div>

          <div className="mb-12 h-px w-full" style={{ backgroundColor: "#d4d0c8" }} />

          <div className="mb-12">
            <div className="mb-8 flex items-center gap-2">
              <span style={{ color: "#999" }}>◆</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: "#666" }}>
                GET IN TOUCH
              </span>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="mb-2 text-sm" style={{ color: "#333" }}>Talk to us</p>
                <a
                  href="tel:0899999999"
                  className="text-sm font-normal tracking-wide underline underline-offset-4 transition-opacity hover:opacity-60"
                  style={{ color: "#1a1a1a" }}
                >
                  089 999 9999
                </a>
              </div>

              <div>
                <p className="mb-2 text-sm" style={{ color: "#333" }}>Write us</p>
                <a
                  href="mailto:hello@sknat.co.th"
                  className="text-sm font-normal tracking-wide underline underline-offset-4 transition-opacity hover:opacity-60"
                  style={{ color: "#1a1a1a" }}
                >
                  HELLO@SKNAT.CO.TH
                </a>
              </div>
            </div>
          </div>

          <div className="mb-12 h-px w-full" style={{ backgroundColor: "#d4d0c8" }} />

          <div>
            <div className="mb-8 flex items-center gap-2">
              <span style={{ color: "#999" }}>◆</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: "#666" }}>
                ADDRESS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="mb-3 text-sm leading-relaxed" style={{ color: "#333", lineHeight: "1.8" }}>
                  123 อาคารสกนัท ทาวเวอร์
                  <br />
                  ถนนสุขุมวิท แขวงคลองเตย
                  <br />
                  กรุงเทพมหานคร 10110
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-medium uppercase tracking-[0.15em] underline underline-offset-4 transition-opacity hover:opacity-60"
                  style={{ color: "#1a1a1a" }}
                >
                  GOOGLE MAPS
                </a>
              </div>

              <div>
                <p className="mb-2 text-sm" style={{ color: "#333" }}>Visit us</p>
                <a
                  href="#"
                  className="text-[11px] font-medium uppercase tracking-[0.15em] underline underline-offset-4 transition-opacity hover:opacity-60"
                  style={{ color: "#1a1a1a" }}
                >
                  BOOK A VISIT
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden items-center justify-center p-12 lg:flex lg:w-[45%]">
          <div
            className="relative w-full max-w-lg"
            style={{
              transform: `translate3d(${boxTransform.x}px, ${boxTransform.y}px, 0) rotate(${boxTransform.rotate}deg) scale(${boxTransform.scale})`,
              opacity: boxTransform.opacity,
              transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease",
            }}
          >
            <div
              className="absolute inset-[10%] rounded-[2rem] blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 45%, rgba(30,30,30,0.08), rgba(212,208,200,0.05) 48%, transparent 74%)",
                transform: `translate3d(${lerp(20, -8, scrollProgress)}px, ${lerp(-24, 12, scrollProgress)}px, 0) scale(${1.02 + scrollProgress * 0.08})`,
                transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />

            <MorphLineArtwork progress={scrollProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}

function MorphLineArtwork({ progress }: { progress: number }) {
  return (
    <div className="relative z-10">
      <svg viewBox="0 0 400 400" className="h-auto w-full" fill="none">
        <g
          style={{
            transform: `translate(${lerp(18, 0, progress)}px, ${lerp(-52, 20, progress)}px)`,
            transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {BOX_SEGMENTS.map((segment, index) => {
            const length = segmentLength(segment.from, segment.to);
            const localProgress = clamp((progress - segment.delay) / 0.28);
            const driftY =
              segment.parallax === "fast"
                ? progress * 20
                : segment.parallax === "medium"
                  ? progress * 13
                  : progress * 8;
            const driftX =
              segment.parallax === "fast"
                ? progress * -4
                : segment.parallax === "medium"
                  ? progress * -2.5
                  : progress * -1.5;

            return (
              <line
                key={`${index}-${segment.stroke}`}
                x1={segment.from[0] + driftX}
                y1={segment.from[1] + driftY}
                x2={segment.to[0] + driftX}
                y2={segment.to[1] + driftY}
                stroke={segment.stroke}
                strokeWidth={segment.width ?? 1}
                strokeDasharray={segment.dash ?? `${length} ${length}`}
                strokeDashoffset={length * (1 - localProgress)}
                strokeLinecap="round"
                opacity={0.18 + localProgress * 0.82}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
