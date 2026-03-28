'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Point = [number, number];
type LineStroke = {
  from: Point;
  to: Point;
  stroke: string;
  width?: number;
  delay: number;
};

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
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

  const frameOffsetY = (1 - scrollProgress) * 40;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative"
      style={{
        backgroundColor: "#ffffff",
        color: "#1a1a1a",
        fontFamily: '"Sarabun", "Noto Sans Thai", sans-serif',
      }}
    >
      <div className="flex-1 px-8 pb-16 pt-12 md:px-12 lg:pt-16">
        <div className="max-w-4xl">
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
            Start every investment
            <br />
            with the right
            <br />
            understanding
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

      </div>
    </section>
  );
}
